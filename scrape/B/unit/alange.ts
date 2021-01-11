import cheerio from 'cheerio';
import sitemapper from 'sitemapper';
import { EMPTY, Observable } from "rxjs";
import { delay, expand, map } from "rxjs/operators";
import { Logger } from '@cosmos/logger';
const logger = Logger.getLogger('cs:syno:A. Lange & Söhne', 'debug');
import { Mappers } from "../utils";

const getCollection = (url, collections) => {
    let col = 'unknown';
    Object.keys(collections).forEach(collection => {
        const m = new RegExp(collection, 'i');
        if (url.match(m)) col = collections[collection];
    });
    return col;
}

const _indexing = (context) => {
    return new Observable(observer => {
        const { client, entry, base, } = context;
        const source = 'official';
        const lang = 'en';
        const brand = 'A. Lange & Söhne';
        const brandID = 293;
        const payload = { source, lang, brand, brandID, collections: [], items: {}, };
        const collections = {};
        const c_entry = "https://www.alange-soehne.com/en/timepieces";
        client.get(c_entry).then(res => {
            const $ = cheerio.load(res.data);
            $(".list__item.families__item").each((idx, el) => {
                const url = $(el).attr("href");
                const u = url.split('/');
                const uname = u[u.length - 1].replace('family-', '');
                const name = $(el).find(".families__item__title").text().trim();
                collections[uname] = name;
            })
            const sitemap = new sitemapper({
                url: entry,
                timeout: 300000,
            });
            sitemap.fetch().then(d => {
                d.sites.forEach(u => {
                    const url = u.replace("http://default", "https://www.alange-soehne.com");
                    if (url.match(/\/en\/timepieces\//i)) {
                        const ul = url.split("/");
                        if (ul.length >= 6) {
                            const collection = getCollection(url, collections);
                            const name = ul[ul.length - 1].split('-').join(' ').toUpperCase();
                            if (payload.collections.indexOf(collection) < 0) {
                                payload.collections.push(collection);
                                payload.items[collection] = [];
                            }
                            payload.items[collection].push({
                                source, lang, brand, brandID, url, collection, name, retail: null,
                            })
                        }
                    }
                })
                const result = {
                    replyTo: context.replyTo,
                    correlationId: context.correlationId,
                    payload,
                }
                observer.next({ ...context, result });
                observer.complete();
            })
        })
    })
};

export const newIndexing = (context) => {
    return _indexing(context)
        .pipe(
            expand<any>((context, idx): any => {
                return context.result ? EMPTY :
                    _indexing(context)
                        .pipe(delay(1000));
            }),
            map(r => r.result)
        );
};

export const indexing = async (context) => {
    const { client, entry, base, } = context;
    const source = 'official';
    const lang = 'en';
    const brand = 'A. Lange & Söhne';
    const brandID = 293;
    const result = { source, lang, brand, brandID, collections: [], items: {}, };
    const collections = {};
    try {
        const c_entry = "https://www.alange-soehne.com/en/timepieces";
        const { data } = await client.get(c_entry);
        const $ = cheerio.load(data);
        $(".list__item.families__item").each((idx, el) => {
            const url = $(el).attr("href");
            const u = url.split('/');
            const uname = u[u.length - 1].replace('family-', '');
            const name = $(el).find(".families__item__title").text().trim();
            collections[uname] = name;
        })
        const sitemap = new sitemapper({
            url: entry,
            timeout: 300000,
        })
        const d = await sitemap.fetch();
        d.sites.forEach(u => {
            const url = u.replace("http://default", "https://www.alange-soehne.com");
            if (url.match(/\/en\/timepieces\//i)) {
                const ul = url.split("/");
                if (ul.length >= 6) {
                    const collection = getCollection(url, collections);
                    const name = ul[ul.length - 1].split('-').join(' ').toUpperCase();
                    if (result.collections.indexOf(collection) < 0) {
                        result.collections.push(collection);
                        result.items[collection] = [];
                    }
                    result.items[collection].push({
                        source, lang, brand, brandID, url, collection, name, retail: null,
                    })
                }
            }
        })
        return result;
    } catch (error) {
        logger.error('Error indexing for A. Lange & Söhne with error ', error);
        logger.error('entry : ', entry);
        return {};
    }
};

export const extraction = async (context) => {
    const { client, entry, base, ...rest } = context;
    const result = { ...rest, url: entry, spec: [], related: [], };
    try {
        const { data } = await client.get(entry);
        const $ = cheerio.load(data);
        result.description = $('meta[property="og:description"]').attr('content');
        result.thumbnail = $('meta[property="og:image"]').attr('content');
        result.collection = $(".article__overtitle").text().replace(/\s+/g, ' ').trim();
        result.name = $(".article__title").text().replace(/\s+/g, ' ').trim();
        result.reference = $(".article__reference").text().replace("Reference: ", "").trim();
        result.retail = $(".article__price").find("span").text();
        $(".product-specs__table__row").each((idx, el) => {
            const key = $(el).find("dt").text().replace(/\s+/g, ' ').trim();
            const value = $(el).find("dd").text().replace(/\s+/g, ' ').trim();
            result.spec.push({ key, value });
        })
        if (result.spec.length === 0 && !result.reference && !result.thumbnail)
            result.code = 'not product';
    } catch (error) {
        logger.error('Failed extraction for A. Lange & Söhne with error ', error);
        logger.error('entry : ', entry);
        if (error.response) result.code = error.response.status;
        else result.code = 'UNKNOWN ERROR';
    }
    return result;
};

export const distill = async (context) => {
    try {
        const { payload } = context;
        const { spec, ...rest } = payload;
        const result: any = {
            ...rest, functions: [], features: [],
            case: <any>{}, caliber: <any>{}, bezel: <any>{},
            dial: <any>{}, band: <any>{}, additional: [],
        };
        for (const s of spec) {
            let pp = false;
            const key = s.key.toLowerCase();
            const value = s.value.trim();

            if (key === 'calibre') {
                pp = true;
                result.caliber.reference = value;
                result.caliber.brand = "A. Lange & Söhne";
                result.caliber.label = "Germany";
            }
            if (key === 'case measurements') {
                pp = true;
                //diameter: xx mm; height: yy mm
                const v = value.split(';');
                result.case.diameter = v[0].split(':')[1].trim();
                result.case.thickness = v[1].split(':')[1].trim();
            }
            if (key === 'case') {
                pp = true;
                const { bm, bms, } = Mappers.getMaterial.map(value);
                result.case.material = bm ? bm : value;
                result.case.materials = bm ? bms : [value];
            }
            if (key === 'dial') {
                const r = Mappers.getColor.map(value);
                if (r) {
                    pp = true;
                    result.dial.color = r;
                    result.dialColor = Mappers.getDialColor.map(result.dial.color);
                }
            }
            if (key === 'edition') {
                pp = true;
                result.limited = true;
            }
            if (key === 'family') {
                pp = true;
                result.collection = value;
            }
            if (key === 'hands') {
                const r = Mappers.getHandStyle.map(value);
                if (r) {
                    pp = true;
                    result.dial.handStyle = r;
                }
            }
            if (key === 'reference') {
                pp = true;
                result.reference = value;
            }
            if (key === 'timepiece') {
                pp = true;
                result.name = value;
            }
            if (!pp) result.additional.push({ [key]: value });
        }
        return result;
    } catch (error) {
        logger.error('Failed distillation for A. Lange & Söhne with error : ' + error);
        return {};
    }
};
