import Axios from 'axios';
import { Logger } from '@cosmos/logger';
import { MessageStation } from "@cosmos/utils";
import nodemailer from 'nodemailer';

const notify = async payload => {
    const { strategy, command, } = payload
    const { brand, brandID, entry, } = payload.context;
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: 'f2fnoodle01@gmail.com',
            pass: 'P@ssw0rd1428',
        },
    });
    const errmsg = "Brand : " + brand + "\n" +
        "BrandID : " + brandID + "\n" +
        "Entry : " + entry + "\n" +
        "strategy : " + strategy + "\n" +
        "command : " + command + "\n";
    const errmsgHtml = "<b>" + "Brand : " + brand + "<br>" +
        "BrandID : " + brandID + "<br>" +
        "Entry : " + entry + "<br>" +
        "strategy : " + strategy + "<br>" +
        "command : " + command + "<br>";
    let info = await transporter.sendMail({
        from: '"f2f 👻" <f2fnoodle01@gmail.com>', // sender address
        to: "lc.chai.sg@gmail.com, leongchoi@ieplsg.com", // list of receivers
        subject: "Scraping failed", // Subject line
        text: errmsg, // plain text body
        html: errmsgHtml, // html body
    });
}

const logger = Logger.getLogger('cs:syno:urls', 'debug');
(async function () {
    logger.info('Scraper');
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
        const config: any = {};
        if (base) config.baseURL = base;
        if (agent) config.headers = { 'User-Agent': agent }
        if (proxy) config.proxy = proxy
        return Axios.create(config);
    }
    const scrape = async (payload, dryRun, correlationId, replyTo) => {
        logger.debug('Start Scrape');
        const { agent, strategy, command, base, type, proxy } = payload;
        const context = {
            client: createClient(type, agent, base, proxy),
            ...payload.context,
            base,
        };
        const logic = require('./unit/' + strategy);
        const exec = logic[command];
        const result = await exec.call(null, context);
        if (dryRun) {
            logger.debug(JSON.stringify(result));
        } else {
            if (Array.isArray(result)) {
                if (result.length === 0) {
                    notify(payload)
                } else {
                    for (let i = 0; i < result.length; i++) {
                        const cid = correlationId + '--' + i;
                        const payload = result[i].payload;
                        const r = result[i];
                        if (Array.isArray(payload)) {
                            for (const p of payload) {
                                p.strategy = strategy;
                                await client.publish('scraper', r.target || replyTo, JSON.stringify(p), { correlationId: cid });
                            }
                        } else {
                            payload.strategy = strategy;
                            await client.publish('scraper', r.target || replyTo, JSON.stringify(r.payload), { correlationId: cid });
                        }
                    }
                    // let i = 0;
                    // for (const r of result) {
                    //     const cid = correlationId + '--' + i;
                    //     const payload = r.payload;
                    //     if (Array.isArray(payload)) {
                    //         for (const p of payload) {
                    //             p.strategy = strategy;
                    //             await client.publish('scraper', r.target || replyTo, JSON.stringify(p), { correlationId: cid });
                    //         }
                    //     } else {
                    //         payload.strategy = strategy;
                    //         await client.publish('scraper', r.target || replyTo, JSON.stringify(r.payload), { correlationId: cid });
                    //     }
                    //     i++;
                    //     await new Promise(r => setTimeout(r, 5000));
                    // }
                }
            } else {
                if ((result.collections && result.collections.length === 0) ||
                    (result.spec && result.spec.length === 0 && result.code !== 'not product')) {
                    notify(payload);
                }
                result.strategy = strategy;
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
            logger.debug('Operation for', correlationId, 'reply to', replyTo);
            return await scrape(payload, dryRun, correlationId, replyTo);
        }
    }, (channel) => {
        channel.prefetch = 1
    });
})();
