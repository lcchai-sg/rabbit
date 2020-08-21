const { MessageStation } = require("@cosmos/utils");
const axios = require('axios');

(async function () {
    console.debug('Scraper');
    const mqHost = process.env.MESSAGE_HOST || 'vulture.rmq.cloudamqp.com';
    const mqUser = process.env.MESSAGE_USER || 'kswsdxln';
    const mqPass = process.env.MESSAGE_PASS || 'ZsZJndMGqhVPo-hxbJ-Tg9Y-Mn18TGCP';
    const mqVhost = process.env.MESSAGE_VHOST || 'kswsdxln';
    const station = await MessageStation
        .connect({
            host: mqHost,
            user: mqUser,
            pass: mqPass,
            vhost: mqVhost
        });
    function createClient(type, agent, base, proxy) {
        const config = {};
        if (base) {
            config.baseURL = base;
        }
        if (agent) {
            config.headers = { 'User-Agent': agent }
        }
        if (proxy) {
            config.proxy = proxy
        }
        return axios.create(config);
    }
    const scrape = async (payload, dryRun, correlationId, replyTo) => {
        console.debug('Start Scrape');
        const { agent, strategy, command, base, type, proxy } = payload;

        const context = {
            client: createClient(type, agent, base, proxy),
            ...payload.context,
            base
        };
        const logic = require('./unit/' + strategy);
        const exec = logic[command];
        const result = await exec.call(null, context);
        if (dryRun) {
            console.debug(JSON.stringify(result));
        } else {
            if (Array.isArray(result)) {
                for (const r of result) {
                    const payload = r.payload;
                    if (Array.isArray(payload)) {
                        for (const p of payload) {
                            await client.publish('scraper', r.target || replyTo, JSON.stringify(p), { correlationId });
                        }
                    } else {
                        await client.publish('scraper', r.target || replyTo, JSON.stringify(r.payload), { correlationId });
                    }
                }
            } else {
                console.log('publishing...',replyTo,result)
                await client.publish('scraper', replyTo, JSON.stringify(result), { correlationId });
            }
        }
    };
    const client = await station.createClient({
        exchange: 'scraper',
        exType: 'topic',
        route: 'crawler',
        queue: 'scraper-crawler',
        timeout: 900000,
        handler: async message => {
            const { correlationId, replyTo } = message.properties;
            const { dryRun, payload } = JSON.parse(message.content);
            console.debug('Operation for', correlationId, 'reply to', replyTo);
            return await scrape(payload, dryRun, correlationId, replyTo);
        }
    }, (channel) => {
        channel.prefetch = 2
    });
})();
