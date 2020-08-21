const axios = require("axios");
require('dotenv').config();
const { Subject } = require("rxjs");
const { map, mergeMap } = require("rxjs/operators");
const { Logger } = require('@cosmos/logger');
const { MessageStation } = require("@cosmos/utils");

const logger = Logger.getLogger('cs:syno:urls', 'debug');

(async function () {
    logger.info('Scraper Official Price');
    const mqHost = process.env.MESSAGE_HOST;
    const mqUser = process.env.MESSAGE_USER;
    const mqPass = process.env.MESSAGE_PASS;
    const mqVhost = process.env.MESSAGE_VHOST;
    const station = await MessageStation
        .connect({
            host: mqHost,
            user: mqUser,
            pass: mqPass,
            vhost: mqVhost
        });
    function createClient(type, agent, base, proxy) {
        const config = {
            baseURL: null,
            headers: null,
            proxy: null,
        };
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
    const client = await station.createClient({
        exchange: 'scraper-official-price',
        exType: 'topic',
        route: 'crawlerLC',
        queue: 'official-price',
        timeout: 30000,
        handler: async message => {
            const { correlationId, replyTo } = message.properties;
            const { payload } = JSON.parse(message.content);
            logger.debug('Operation for', correlationId, 'reply to', replyTo);
            stream.next({ payload, correlationId, replyTo });
            return;
        }
    }, (channel) => {
        channel.prefetch = 1
    });

    const stream = new Subject();
    stream.pipe(
        map(msg => {
            const { agent, base, type, proxy } = msg.payload;
            return {
                client: createClient(type, agent, base, proxy),
                ...msg.payload,
            };
        }),
        mergeMap(ctx => {
            const { market, scraper } = ctx;
            const scrape = require('./process-price');
            return scrape(market, scraper);
        })
    ).subscribe((data) => {
        console.log(data);
        // client.publish(
        //     'scraper-official-price', 
        //     'crawlerLC', 
        //     JSON.stringify(data) );
    });
})();
