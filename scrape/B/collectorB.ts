import { MongoClient } from 'mongodb';
import { EMPTY, of, Subject } from "rxjs";
import { expand, filter, map, mergeAll } from "rxjs/operators";
import { Logger, } from '@cosmos/logger';
import { MessageStation } from "@cosmos/utils";

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
    const db_url = `mongodb://${db_user}:${db_pass}@${db_host}:${db_port}`;
    logger.trace('Connect DB', db_url);
    const conn = await MongoClient.connect(`mongodb://${db_user}:${db_pass}@${db_host}:${db_port}/${db_name}`, { useNewUrlParser: true });
    const source = new Subject();
    source.pipe(
        map<any, any>(p => {
            if (!p.lang) p.lang = 'en';
            return p;
        })
    );
    const offSrc = source.pipe(filter<any>(p => (!!p.collections)));
    const comSrc = source.pipe(filter<any>(p => (!p.collections)));
    const colSrc = offSrc
        .pipe<any, any>(
            map(p => {
                const { brand, brandID, lang } = p;
                return p.collections.map(name => ({
                    brand, brandID, lang, name
                }))
            }),
            mergeAll())
        .subscribe(async c => {
            const { name, brand, brandID, lang } = c;
            await conn.db(db_name)
                .collection('reference_collections')
                .findOneAndUpdate(
                    {
                        name,
                        brand,
                        brandID,
                        lang
                    },
                    {
                        $setOnInsert: {
                            brand,
                            brandID,
                            name,
                            lang,
                            recordedAt: new Date()
                        },
                        $currentDate: {
                            lastSeenAt: { $type: 'date' }
                        }
                    },
                    {
                        upsert: true
                    }
                )
        });
    const offUrls = offSrc
        .pipe(
            expand((d, i) => {
                if (i < d.collections.length) {
                    d.collection = d.collections[i];
                    return of(d);
                } else {
                    return EMPTY;
                }
            }),
            map(d => {
                const { brand, brandID, lang } = d;
                return d.items[d.collection].map(item => ({
                    ...item,
                    brand, brandID, lang
                }));
            }),
            mergeAll())
        .subscribe(async item => {
            const { url, lang, brand, brandID, ...other } = item as any;
            console.log('>>> ', url)
            await conn.db(db_name)
                .collection('reference_urls')
                .findOneAndUpdate(
                    { brandID, url, lang },
                    {
                        $setOnInsert: {
                            brand,
                            brandID,
                            url,
                            lang,
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
        });
    const comUrls = comSrc
        .pipe(
            map(d => {
                const { brand, brandID, lang } = d;
                return d.items.map(item => ({
                    ...item,
                    brand, brandID, lang
                }))
            }),
            mergeAll())
        .subscribe(async item => {
            const { url, lang, brand, brandID, ...other } = item as any;
            await conn.db(db_name)
                .collection('reference_urls')
                .findOneAndUpdate(
                    { brandID, url, lang },
                    {
                        $setOnInsert: {
                            brand,
                            brandID,
                            url,
                            lang,
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
        });
    const client = await station.createClient({
        exchange: 'scraper',
        exType: 'topic',
        route: 'collector',
        queue: 'scraper-collector',
        timeout: 15000,
        handler: async message => {
            const payload = JSON.parse(message.content);
            source.next(payload);
            return;
        }
    });
})();
