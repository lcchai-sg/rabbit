import { Logger } from '@cosmos/logger';
import { MessageStation } from "@cosmos/utils";
import { MongoClient } from 'mongodb';

const logger = Logger.getLogger('cs:syno:orig', 'debug');
const Redis = require('ioredis');

(async function () {
    const redisHost = process.env.REDIS_HOST;
    const redis = new Redis(redisHost, { keyPrefix: 'cosmos:' });
    const station = await MessageStation
        .connect(await redis.hgetall('message:synopsis'));
    const mdb = await redis.hgetall('mongodb:synopsis');
    const db_url = `mongodb://${mdb.user}:${mdb.pass}@${mdb.host}:${mdb.port}/${mdb.name}`;
    const conn = await MongoClient.connect(db_url);
    const client = await station.createClient({
        exchange: "scraper-1",
        exType: 'topic',
        route: 'scrape.data.raw-1',
        queue: 'scraper-distiller-1',
        timeout: 15000,
        handler: async message => {
            const { correlationId } = message.properties;
            const payload = JSON.parse(message.content);
            logger.debug('Process for', correlationId);
            const { source } = payload;
            try {
                const logic = require('./unit/' + source);
                const exec = logic['distill'];
                if (exec) {
                    const { reference, productID, lang, source, ...rest } =
                        await exec.call(null, { payload });
                    await conn.db(mdb.name)
                        .collection('ref_prod_jomashop')
                        .findOneAndUpdate(
                            { source, reference, lang },
                            {
                                $setOnInsert: {
                                    reference,
                                    source,
                                    lang,
                                    recordedAt: new Date()
                                },
                                $set: {
                                    productID,
                                    ...rest
                                },
                                $currentDate: {
                                    lastCheckAt: { $type: 'date' }
                                }
                            },
                            {
                                upsert: true
                            }
                        );
                } else {
                    logger.debug("Distill Function not found");
                }
            } catch (e) {
                logger.debug('Distill Unit not found');
            }
        }
    })
})();
