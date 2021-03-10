import { MongoClient } from 'mongodb';
import { Logger } from '@cosmos/logger';
import { MessageStation, timeout } from "@cosmos/utils";

const logger = Logger.getLogger('cs:syno:extraction', 'debug');

(async () => {
    const mqHost = process.env.MESSAGE_HOST || '127.0.01';
    const mqUser = process.env.MESSAGE_USER || 'synopsis';
    const mqPass = process.env.MESSAGE_PASS || 'synopsis';
    const mqVhost = process.env.MESSAGE_VHOST || '/lc';
    const db_host = process.env.DB_HOST || '127.0.01';
    const db_port = process.env.DB_PORT || 27017;
    const db_user = process.env.DB_USER || 'synopsis';
    const db_pass = process.env.DB_PASS || 'synopsis';
    const db_name = process.env.DB_NAME || 'synopsis';
    const station = await MessageStation
        .connect({
            host: mqHost,
            user: mqUser,
            pass: mqPass,
            vhost: mqVhost
        });
    const db_url = `mongodb://${db_user}:${db_pass}@${db_host}:${db_port}/${db_name}`;
    logger.trace('Connect DB', db_url);
    const conn = await MongoClient.connect(db_url, { useNewUrlParser: true, useUnifiedTopology: true, });
    const proc = async (payload, dryRun, replyTo) => {
        logger.debug('Start Process', payload);
        const { interval, agent, brandID, brand, lang, proxy, source, strategy, base, date, } = payload;
        let flt: any = { source, lang, code: { $nin: [404, 'not product'] } };
        if (brandID) flt.brandID = brandID;
        const fltDate = date? new Date(date): new Date();
        const targets = await conn.db(db_name)
            .collection('reference_product')
            .aggregate(
                { $match: flt },
                { $group: { _id: "$url", lastCheck: { $max: "$lastCheckAt" } } },
                { $match: { lastCheck: {$lt: fltDate } } }
            )
            .toArray();
        const ps = [];
        const lim = targets.length > 2000 ? 2000 : targets.length;
        for (let i = 0; i<lim; i++) {
            const prod = await conn.db(db_name).collection('reference_urls').find({ url: targets[i]._id }).toArray();
            if (prod && prod.length > 0) {
                const target = prod[0];
                const p = messenger.request("crawler", {
                    dryRun,
                    payload: {
                        strategy,
                        command: "extraction",
                        base,
                        proxy,
                        agent,
                        context: {
                            source: target.source,
                            lang: target.lang,
                            brand: target.brand,
                            brandID: target.brandID,
                            entry: target.url,
                            collection: target.collection,
                            subCollection: target.subCollection,
                            name: target.name,
                            reference: target.reference,
                            gender: target.gender,
                            price: target.price,
                            retail: target.retail,
                            thumbnail: target.thumbnail,
                            productID: target.productID,
                        }
                    }
                }, { replyTo: "scrape.data.raw" })
                .then((result: any) => {
                    const { url, reference, brand, lang, ...rest } = result;
                    logger.debug('Result for Scrape', brand, reference);

                    return conn.db(db_name)
                        .collection('reference_urls')
                        .updateOne(
                            { url, lang, source, },
                            { $set: {
                                brand,
                                reference,
                                ...rest,
                                lastExtractedAt: new Date(),
                            } }
                        );
                });
                ps.push(p);
                await timeout(interval);
            }
        }
        await Promise.all(ps);
    };

    const messenger = await station.createMessenger({
        exchange: 'scraper',
        exType: 'topic',
        route: 'scrape.data.raw',
        queue: 'scraper-data'
    });

    const client = await station.createClient({
        exchange: 'scraper',
        exType: 'topic',
        route: 'origin1',
        queue: 'scraper-origin1',
        timeout: 900000,
        handler: message => {
            const { correlationId, replyTo } = message.properties;
            const { dryRun, payload } = JSON.parse(message.content);
            logger.debug('Operation for', correlationId, 'reply to', replyTo);
            proc(payload, dryRun, replyTo);
            return {};
        }
    });
})();