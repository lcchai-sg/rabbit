import axios from "axios";
import { Subject } from "rxjs";
import { map, mergeMap } from "rxjs/operators";
import { Logger } from '@cosmos/logger';
import { MessageStation } from "@cosmos/utils";

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
        return axios.create(config);
    }
    const stream = new Subject<any>();
    stream.pipe(
        map(msg => {
            const { agent, strategy, command, base, type, proxy } = msg.payload;
            return {
                client: createClient(type, agent, base, proxy),
                ...msg.payload.context,
                base,
                strategy,
                command,
                replyTo: msg.replyTo,
                correlationId: msg.correlationId,
            };
        }),
        mergeMap(ctx => {
            const logic = require('./unit/' + ctx.strategy);
            const exec = logic[ctx.command];
            return exec.call(null, ctx);
        })
    ).subscribe((data: any) => {
        if (data) {
            client.publish('scraper', data.replyTo, JSON.stringify(data.payload), { correlationId: data.correlationId });
        }
    });
    const client = await station.createClient({
        exchange: 'scraperB',
        exType: 'topic',
        route: 'crawlerB',
        queue: 'scraperB-crawler',
        timeout: 300000,
        handler: async message => {
            const { correlationId, replyTo } = message.properties;
            const { dryRun, payload } = JSON.parse(message.content);
            logger.debug('Operation for', correlationId, 'reply to', replyTo);
            logger.debug('payload >>>>>', payload)
            stream.next({ payload, dryRun, correlationId, replyTo });
            return;
        }
    }, (channel) => {
        channel.prefetch = 1
    });
})();
