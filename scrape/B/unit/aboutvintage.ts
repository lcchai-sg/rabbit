import cheerio from 'cheerio';
import { EMPTY, Observable, observable } from "rxjs";
import { delay, expand, map } from "rxjs/operators";
import { Logger } from '@cosmos/logger';
const logger = Logger.getLogger('cs:syno:About Vintage', 'debug');
import { Mappers } from "../utils";

const _indexing = (context) => {
    return new Observable(ob => {
        const { client, entry, base, cats, } = context;
        let { next, catIdx, } = context;
        const source = "official";
        const lang = "en";
        const brand = "About Vintage";
        const brandID = 152;
        const baseURL = base ? base : "https://aboutvintage.com";
        if (!next) {
            const payload = { source, lang, brand, brandID, collections: [], items: {}, }
            const cats = [];
            logger.debug('entry.......', entry);
            client.get(entry).then(res => {
                const $ = cheerio.load(res.data);
                $(".WatchFace__Item").each((idx, el) => {
                    const name = $(el).find(".WatchFace__ItemTitle").text().replace(/\s+/g, ' ').trim();
                    const url = baseURL + $(el).attr("href");
                    payload.collections.push(name);
                    payload.items[name] = [];
                    cats.push({ name, url });
                });
                // const result = {
                //     replyTo: context.replyTo,
                //     correlationId: context.correlationId,
                //     payload,
                // };
                console.log('next...', cats[0].url)
                ob.next({ ...context, cats, next: cats[0].url, catIdx: 0 })
                ob.complete();
            })
        } else {
            logger.debug('next....', next);
            // const { payload } = context.result.payload;
            const payload = { source, lang, brand, brandID, collections: [], items: {}, }
            const collection = cats[catIdx].name;
            payload.collections.push(collection);
            payload.items[collection] = [];
            client.get(next).then(res => {
                const $ = cheerio.load(res.data);
                $(".ProductItem__Wrapper").each((idx, el) => {
                    const nam = $(el).find(".ProductItem__Info").text().replace(/\s+/g, ' ').replace('Swiss Made', '').trim();
                    if (!nam.match(/gift set/i)) {
                        const n = nam.split(' ');
                        const name = n.slice(0, n.length - 2).join(' ');
                        const url = baseURL + $(el).find(".ProductItem__ImageWrapper").attr('href');
                        const retail = $(el).find(".ProductItem__PriceList").text();
                        const thumbnail = "https:" + $(el).find(".ProductItem__Image").attr("data-src").replace("{width}", "600")
                        payload.items[cats[catIdx].name].push({
                            source, lang, brand, brandID, url, collection,
                            name, thumbnail, retail,
                        });
                    }
                })
                next = $(".AjaxinatePagination").find("a").attr("href");
                const result = {
                    replyTo: context.replyTo,
                    correlationId: context.correlationId,
                    payload,
                };
                if (!next) {
                    catIdx++;
                    if (catIdx < cats.length) next = cats[catIdx].url;
                }
                ob.next({ ...context, result, cats, next, catIdx, })
                ob.complete();
            })
        }
    })
};

export const newIndexing = (context) => {
    return _indexing(context)
        .pipe(
            expand<any>((context, idx): any => {
                return !context.next ? EMPTY :
                    _indexing({ ...context })
                        .pipe(delay(1000));
            }),
            map(r => r.result)
        );
};

export const indexing = async (context) => {
    const { client, entry, base, } = context;
    const source = "official";
    const lang = "en";
    const brand = "About Vintage";
    const brandID = 152;
    const baseURL = base ? base : "https://aboutvintage.com";
    const result = { source, lang, brand, brandID, collections: [], items: {}, }
    const cats = [];
    try {
        const $ = cheerio.load((await client.get(entry)).data);
        $(".WatchFace__Item").each((idx, el) => {
            const name = $(el).find(".WatchFace__ItemTitle").text().replace(/\s+/g, ' ').trim();
            const url = baseURL + $(el).attr("href");
            result.collections.push(name);
            result.items[name] = [];
            cats.push({ name, url });
        })
        for (const cat of cats) {
            let next = cat.url;
            do {
                logger.debug(next);
                const { data } = await client.get(cat.url);
                const $ = cheerio.load(data);
                $(".ProductItem__Wrapper").each((idx, el) => {
                    const nam = $(el).find(".ProductItem__Info").text().replace(/\s+/g, ' ').replace('Swiss Made', '').trim();
                    if (!nam.match(/gift set/i)) {
                        const n = nam.split(' ');
                        const name = n.slice(0, n.length - 2).join(' ');
                        const url = baseURL + $(el).find(".ProductItem__ImageWrapper").attr('href');
                        const retail = $(el).find(".ProductItem__PriceList").text();
                        const thumbnail = "https:" + $(el).find(".ProductItem__Image").attr("data-src").replace("{width}", "600")
                        result.items[cat.name].push({
                            source, lang, brand, brandID, url, collection: cat.name,
                            name, thumbnail, retail,
                        });
                    }
                })
                next = $(".AjaxinatePagination").find("a").attr("href");
            } while (next);
        }
        return result;
    } catch (error) {
        logger.error('Failed indexing for About Vintage with error : ' + error);
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
        result.name = $('meta[property="og:title"]').attr('content');
        result.reference = result.name.split(',')[0].trim();
        result.thumbnail = $('meta[property="og:image"]').attr('content');
        const retail = $('meta[property="product:price:amount"]').attr('content');
        const curr = $('meta[property="product:price:currency"]').attr('content');
        result.retail = curr + retail;
        result.description = $('meta[property="og:description"]').attr('content');
        const ref = data.match(/"sku": "\w+"/ig);
        const refr = ref ? ref[0].split(":")[1].replace(/"/g, "").trim() : null;
        if (refr) {
            result.reference = refr;
            result.sku = refr;
        }
        $(".TechSpecs__Item").each((idx, el) => {
            const key = $(el).find('dt').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
            const value = $(el).find('dd').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
            result.spec.push({ key, value })
        });
    } catch (error) {
        logger.error('Failed extraction for About Vintage with error : ', error);
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

            if (key === 'case') {
                pp = true;
                const v = value.split(' or ')[0];
                const { bm, bms, } = Mappers.getMaterial.map(v);
                result.case.material = bm ? bm : v;
                result.case.materials = bm ? bms : [v];
                if (value.match(/crown/i)) {
                    const r = Mappers.getCaseCrown.map(value);
                    if (r) result.case.crown = r;
                }
                if (value.match(/limited edition/i)) {
                    const lim = value.match(/\d{3,4} pieces/ig);
                    const limv = lim ? lim[0].match(/\d{3,4}/g) : null;
                    if (limv) result.limited = limv;
                }
            }
            if (key === 'dial') {
                pp = true;
                const v = value.split(' with ')[0] || value.split(' or ')[0] || value.split(' dial ')[0];
                const r = Mappers.getColor.map(v);
                if (r) {
                    result.dial.color = r;
                    result.dialColor = Mappers.getDialColor.map(result.dial.color);
                }
                if (value.match(/index/i)) {
                    const r = Mappers.getIndexType.map(value);
                    if (r) result.dial.indexType = r;
                }
                if (value.match(/hand/i)) {
                    const r = Mappers.getHandStyle.map(value);
                    if (r) result.dial.handStyle = r;
                }
            }
            if (key === 'glass') {
                pp = true;
                const r = Mappers.getCrystal.map(value);
                const cc = Mappers.getCrystalCoating.map(value);
                result.case.crystal = r ? r : value;
                if (cc) result.case.crystalCoating = cc;
            }
            if (key === 'movement') {
                pp = true;
                const r = Mappers.getCaliberType.map(value);
                if (r) {
                    result.caliber.type = r;
                    result.movementType = r;
                }
                if (value.match(/power reserve/i)) {
                    const pr = value.match(/\d{2,3} hours of power reserve/ig);
                    const prv = pr ? pr[0].match(/\d{2,3} hours/ig) : null;
                    if (prv) result.caliber.reserve = prv[0];
                }
                const c = value.match(/Miyota \w+|NH35A|Ronda 763|STP-11|TMI VH31/ig);
                if (c) {
                    result.caliber.reference = c[0];
                    if (value.match(/swiss/i)) result.caliber.label = 'SWISS MADE';
                    else result.caliber.label = 'Made in Japan';
                }
            }
            if (key === 'size') {
                pp = true;
                const words = value.split(',');
                for (const word of words) {
                    if (word.match(/wide/i)) {
                        result.case.width = word.replace('wide', '').trim();
                    }
                    if (word.match(/thick/i)) {
                        result.case.height = word.replace('thick', '').trim();
                    }
                }
            }
            if (key === 'strap') {
                pp = true;
                const { bm, bms, bt, } = Mappers.getMaterial.map(value);
                if (bm) {
                    result.band.type = bt;
                    result.band.material = bm;
                    result.band.materials = bms;
                }
                const c = Mappers.getColor.map(value);
                if (c) result.band.color = c;
                const b = Mappers.getBuckle.map(value);
                if (b) result.band.buckle = b;
            }
            if (key === 'warranty') {
                pp = true;
                const w = value.match(/\d/g);
                if (w) result.warranty = w[0];
            }
            if (key === 'water resistance') {
                pp = true;
                result.case.waterResistance = value;
                result.waterResistance = Mappers.getWaterResistance.map(value);
            }
            if (!pp) result.additional.push({ [key]: value });
        }
        return result;
    } catch (error) {
        logger.error('Failed distillation for About Vintage with error : ' + error);
        return {};
    }
};
