import { Logger } from '@cosmos/logger';
import { MessageStation } from "@cosmos/utils";
import { MongoClient } from 'mongodb';

const logger = Logger.getLogger('cs:syno:urls', 'debug');

(async function () {
    const mqHost = process.env.MESSAGE_HOST;
    const mqUser = process.env.MESSAGE_USER;
    const mqPass = process.env.MESSAGE_PASS;
    const mqVhost = process.env.MESSAGE_VHOST;
    const db_host = process.env.DB_HOST;
    const db_port = process.env.DB_PORT;
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

    const db_url = `mongodb://${db_user}:${db_pass}@${db_host}:${db_port}/${db_name}`;
    logger.trace('Connect DB', db_url);

    const conn = await MongoClient.connect(db_url, { useNewUrlParser: true, useUnifiedTopology: true, });

    const client = await station.createClient({
        exchange: 'scraper',
        exType: 'topic',
        route: 'collector',
        queue: 'scraper-collector',
        timeout: 900000,
        handler: async message => {
            const { correlationId } = message.properties;
            const payload = JSON.parse(message.content);
            if (Object.keys(payload).length > 0) {
                const { brand, brandID, collections, items, source, } = payload;
                console.log('CID:', correlationId, 'Start > S:', source, 'B:', brand);
                let { lang } = payload;
                if (!lang) lang = 'en';
                for (const collection of collections) {
                    if (collection.subCollection) {
                        await conn.db(db_name)
                            .collection('reference_collections')
                            .findOneAndUpdate(
                                {
                                    collection: collection.collection,
                                    brand,
                                    brandID,
                                    lang,
                                    source,
                                },
                                {
                                    $setOnInsert: {
                                        brand,
                                        brandID,
                                        collection: collection.collection,
                                        name: collection.subCollection,
                                        lang,
                                        source,
                                        recordedAt: new Date()
                                    },
                                    $currentDate: {
                                        lastSeenAt: { $type: 'date' }
                                    }
                                },
                                {
                                    upsert: true
                                }
                            );
                    } else {
                        await conn.db(db_name)
                            .collection('reference_collections')
                            .findOneAndUpdate(
                                {
                                    name: collection,
                                    brand,
                                    brandID,
                                    lang,
                                    source,
                                },
                                {
                                    $setOnInsert: {
                                        brand,
                                        brandID,
                                        name: collection,
                                        lang,
                                        source,
                                        recordedAt: new Date()
                                    },
                                    $currentDate: {
                                        lastSeenAt: { $type: 'date' }
                                    }
                                },
                                {
                                    upsert: true
                                }
                            );
                    }
                    let key = '';
                    if (collection.subCollection) {
                        key = collection.collection + ' ' + collection.subCollection
                    } else {
                        key = collection;
                    }
                    for (const item of items[key]) {
                        const { url, brand, brandID, source, lang, ...other } = item;
                        if (!url) continue;
                        await conn.db(db_name)
                            .collection('reference_urls')
                            .findOneAndUpdate(
                                { url, lang, source, },
                                {
                                    $setOnInsert: {
                                        brand,
                                        brandID,
                                        url,
                                        lang,
                                        source,
                                        recordedAt: new Date()
                                    },
                                    $set: {
                                        ...other,
                                    },
                                    $currentDate: {
                                        lastSeenAt: { $type: 'date' }
                                    }
                                },
                                {
                                    upsert: true
                                }
                            )
                    }
                }
                console.log('CID:', correlationId, 'End > S:', source, 'B:', brand);
            }
            return;
        }
    }, (channel) => {
        channel.prefetch = 1
    });
})();
