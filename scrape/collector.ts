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
    const client = await station.createClient({
        exchange: 'scraper-1',
        exType: 'topic',
        route: 'collector-1',
        queue: 'scraper-collector-1',
        timeout: 15000,
        handler: async message => {
            const items = JSON.parse(message.content);
            for (const item of items) {
                const { url, brand, source, lang, ...other } = item;
                if (!url) continue;
                await conn.db(db_name)
                    .collection('ref_urls_jomashop_1')
                    .findOneAndUpdate(
                        { url, lang },
                        {
                            $setOnInsert: {
                                brand,
                                url,
                                lang,
                                source,
                                recordedAt: new Date()
                            },
                            $set: {
                                ...other
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
    });
})();