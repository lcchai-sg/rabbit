import { MongoClient } from 'mongodb';
import { Logger } from '@cosmos/logger';
import { MessageStation, timeout } from "@cosmos/utils";

const logger = Logger.getLogger('cs:syno:orig', 'debug');

(async function () {
    const mqHost = process.env.MESSAGE_HOST;
    const mqUser = process.env.MESSAGE_USER;
    const mqPass = process.env.MESSAGE_PASS;
    const mqVhost = process.env.MESSAGE_VHOST;
    const db_host = process.env.DB_HOST;
    const db_port = process.env.DB_PORT || 27017;
    const db_user = process.env.DB_USER;
    const db_pass = process.env.DB_PASS;
    const db_name = process.env.DB_NAME;
    const station = await MessageStation
        .connect({
            host: mqHost,
            user: mqUser,
            pass: mqPass,
            vhost: mqVhost
        });
    const db_url = `mongodb://${db_user}:${db_pass}@${db_host}:${db_port}`;
    logger.trace('Connect DB', db_url);
    const conn = await MongoClient.connect(`mongodb://${db_user}:${db_pass}@${db_host}:${db_port}/${db_name}`, { useNewUrlParser: true });
    const proc = async (payload, dryRun, replyTo) => {
        logger.debug('Start Process', payload);
        const { interval, agent, source, lang, proxy } = payload;
        const targets = await conn.db(db_name)
            .collection('ref_urls_jomashop_1')
            .find({
                source,
                extracted: {
                    $exists: false
                }
            })
            .toArray();
        const ps = [];
        for (const target of targets) {
            const p = messenger
                .request("crawler", {
                    dryRun,
                    payload: {
                        strategy: source.toLowerCase(),
                        command: "extraction",
                        proxy,
                        agent,
                        context: {
                            entry: target.url,
                            productID: target.productID,
                            lang: target.lang
                        }
                    }
                }, { replyTo: "scrape.data.raw-1" })
                .then((result: any) => {
                    // update data
                    const { url, reference, brand, lang } = result;
                    logger.debug('Result for Scrape', brand, reference);
                    const sets: any = { reference };
                    return conn.db(db_name)
                        .collection('ref_urls_jomashop_1')
                        .updateOne(
                            { url, brand, lang },
                            {
                                $set: {
                                    sets,
                                    extracted: true
                                }
                            });
                });
            ps.push(p);
            await timeout(interval);
        }
        await Promise.all(ps);
    };
    const messenger = await station.createMessenger({
        exchange: 'scraper-1',
        exType: 'topic',
        route: 'scrape.data.raw-1',
        queue: 'scraper-data-1'
    });
    const client = await station.createClient({
        exchange: 'scraper-1',
        exType: 'topic',
        route: 'origin-1',
        queue: 'scraper-origin-1',
        timeout: 15000,
        handler: message => {
            const { correlationId, replyTo } = message.properties;
            const { dryRun, payload } = JSON.parse(message.content);
            logger.debug('Operation for', correlationId, 'reply to', replyTo);
            proc(payload, dryRun, replyTo);
            return {};
        }
    });
})();

// const pattern = {
//     "dryRun": "false",
//     "payload": {
//         "source": "jomashop",
//         "interval": 2000,
//     }
// };
