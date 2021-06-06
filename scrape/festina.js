const axios = require('axios');
const cheerio = require('cheerio');
const { Mappers } = require("./utils");

const indexing = async (context) => {
    const { client, entry, base, } = context;
    const baseURL = base ? base : "https://festina.com";
    const source = "official";
    const lang = "en";
    const brand = "Festina";
    const brandID = 364;
    const result = { source, lang, brand, brandID, collections: [], items: {} };
    const cats = [];
    try {
        const { data } = await client.get(entry);
        const $ = cheerio.load(data);
        $(".panel-container").each((idx, el) => {
            const t = $(el).text();
            if (t.match(/collections/i)) {
                $(el).find("a").each((idx, el) => {
                    const n = $(el).text().trim();
                    const nm = n.split(" ");
                    const name = nm.slice(0, nm.length - 1).join(" ");
                    const url = baseURL + $(el).attr('href');
                    cats.push({ name, url });
                    result.collections.push(name);
                    result.items[name] = [];
                })
            }
        })
        for (const cat of cats) {
            let next = cat.url;
            do {
                console.debug(next);
                const { data } = await client.get(next);
                const $ = cheerio.load(data);
                $('script[type="application/ld+json"]').each((idx, el) => {
                    const j = JSON.parse($(el).contents().toString());
                    if (j['@type'] === 'ItemList') {
                        const il = j['itemListElement'];
                        for (let i = 0; i < il.length; i++) {
                            // const url = il[i].item.url.replace('https://festina.com', 'https://festina.com/en-GB');
                            const name = il[i].item.name;
                            const reference = il[i].item.sku;
                            const thumbnail = il[i].item.image;
                            const retail = il[i].item.offers && il[i].item.offers.price ? il[i].item.offers.priceCurrency + ' ' + il[i].item.offers.price : null;
                            const collection = cat.name;
                            result.items[collection].push({
                                source, lang, brand, brandID, url, collection, name,
                                reference, thumbnail, retail,
                            })
                        }
                    }
                });
                next = $('link[rel="next"]').attr('href');
                await new Promise(r => setTimeout(r, 3000));
            } while (next);
        }
        return result;
    } catch (error) {
        console.error('Failed indexing for Festina with error : ', error);
        return {};
    }
};

const extraction = async (context) => {
    const { client, entry, ...rest } = context;
    const result = { ...rest, url: entry, spec: [], related: [], variations: [], };
    try {
        const { data } = await client.get(entry)
        const $ = cheerio.load(data);
        result.name = $('meta[property="og:title"]').attr('content');
        result.description = $('meta[property="og:description"]').attr('content').trim();
        result.thumbnail = $('meta[property="og:image"]').attr('content');
        $('script[type="application/ld+json"]').each((idx, el) => {
            const j = JSON.parse($(el).contents().toString());
            if (j['@type'] === 'Product') {
                result.reference = j.sku;
                result.gtin = j.gtin;
                result.retail = j.offers && j.offers.price ? j.offers.priceCurrency + ' ' + j.offers.price : null;
            }
        })
        $('#especificaciones').find(".row.ng-star-inserted").each((idx, el) => {
            const key = $(el).find(".col-6.subtitle-4").text().trim();
            const value = $(el).find(".col-6.header-6.spec").text().trim();
            result.spec.push({ key, value });
        })
        $(".img-fluid.miniatura").each((idx, el) => {
            const m = $(el).attr('alt');
            if (m !== result.reference) result.variations.push(m);
        })
        $(".card-image.ng-star-inserted").each((idx, el) => {
            const ref = $(el).find("img").attr("alt");
            if (ref) result.related.push(ref);
        })
    } catch (error) {
        console.error('Failed extraction for Festina with error : ' + error);
        if (error.response) result.code = error.response.status;
        else result.code = 'UNKNOWN ERROR';
    }
    return result;
};

const distill = async (context) => {
    try {
        const { payload } = context;
        const { spec, ...rest } = payload;
        const result = {
            ...rest, functions: [], features: [],
            case: {}, caliber: {}, bezel: {},
            dial: {}, band: {}, additional: [],
        };
        for (const s of spec) {
            let pp = false;
            const key = s.key.replace(":", "").trim().toLowerCase();
            const value = s.value.trim();

            if (key === 'band color') {
                pp = true;
                const r = Mappers.getColor.map(value);
                result.band.color = r ? r : value;
            }
            if (key === 'band material') {
                pp = true;
                const { bm, bms, bt, } = Mappers.getMaterial.map(value);
                if (bt) result.band.type = bt;
                result.band.material = bm ? bm : value;
                result.band.materials = bm ? bms : [value];
            }
            if (key === 'bezel function') {
                pp = true;
                const r = Mappers.getBezel.map(value);
                result.bezel.type = r ? r : value;
            }
            if (key === 'bezel material') {
                pp = true;
                const { bm, bms, } = Mappers.getMaterial.map(value);
                result.bezel.material = bm ? bm : value;
                result.bezel.material = bm ? bms : [value];
            }
            if (key === 'calendar type') {
                pp = true;
                const r = Mappers.getCalendar.map(value);
                result.caliber.calendar = r ? r : value;
            }
            if (key === 'case material') {
                pp = true;
                const { bm, bms, } = Mappers.getMaterial.map(value);
                result.case.material = bm ? bm : value;
                result.case.materials = bm ? bms : [value];
            }
            if (key === 'case diameter') {
                pp = true;
                if (value.match(/ x /i)) result.case.size = value;
                else result.case.diameter = value;
            }
            if (key === 'case shape') {
                pp = true;
                const r = Mappers.getCaseShape.map(value);
                result.case.shape = r ? r : value;
            }
            if (key === 'case thickness') {
                pp = true;
                result.case.thickness = value;
            }
            if (key === 'clasp type') {
                pp = true;
                const bt = Mappers.getBuckle.map(value);
                result.band.buckle = bt ? bt : value;
            }
            if (key === 'compatibility' || key === 'connectivity') {
                pp = true;
                result.features.push(key + " - " + value);
            }
            if (key === 'crystal' || key === 'glass' || key === 'type of glass') {
                pp = true;
                const c = Mappers.getCrystal.map(value);
                const cc = Mappers.getCrystalCoating.map(value);
                result.case.crystal = c ? c : value;
                if (cc) result.case.crystalCoating = cc;
            }
            if (key === 'dial color') {
                pp = true;
                const r = Mappers.getColor.map(value);
                result.dial.color = r ? r : value;
            }
            if (key === 'display type') {
                pp = true;
                const r = Mappers.getDialType.map(value);
                result.dial.type = r ? r : value;
            }
            if (key === 'ean') {
                pp = true;
                result.ean = value;
            }
            if (key === 'functions') {
                pp = true;
                value.split(',').forEach(v => result.functions.push(v.trim()));
            }
            if (key === 'gender') {
                pp = true;
                const r = Mappers.getGender.map(value);
                result.gender = r ? r : value;
            }
            if (key === 'index type') {
                pp = true;
                const r = Mappers.getIndexType.map(value);
                result.dial.indexType = r ? r : value;
            }
            if (key === 'model') {
                pp = true;
                result.collection = value;
            }
            if (key === 'movement' || key === 'type of movement') {
                const r = Mappers.getCaliberType.map(value);
                if (r) {
                    pp = true;
                    result.caliber.type = r;
                    result.movementType = r;
                }
            }
            if (key === 'movement function') {
                if (!result.movementType) {
                    const r = Mappers.getCaliberType.map(value);
                    if (r) {
                        pp = true;
                        result.caliber.type = r;
                        result.movementType = r;
                    }
                }
            }
            if (key === 'movement motor') {
                pp = true;
                result.caliber.reference = value;
            }
            if (key === 'movement manufacturer') {
                pp = true;
                result.caliber.label = value;
            }
            if (key === 'strap material') {
                pp = true;
                const { bm, bms, bt, } = Mappers.getMaterial.map(value);
                if (bt) result.band.type = bt;
                result.band.material = bm ? bm : value;
                result.band.materials = bm ? bms : [value];
                const c = Mappers.getColor.map(value);
                if (c) result.band.color = c;
            }
            if (key === 'style') {
                const r = Mappers.getStyle.map(value);
                if (r) {
                    pp = true;
                    result.style = r;
                }
            }
            if (key === 'warranty period') {
                pp = true;
                result.warranty = value.replace(/year|years/i, '').trim();
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
        console.error('Failed distillation for Festina with error : ' + error);
        return {};
    }
};

(async () => {
    const r = await indexing({
        client: axios,
        entry: "https://festina.com/en-GB/watch",
        base: "https://festina.com",
    })
    r.collections.forEach(c => {
        console.log(`collection : ${c}   watches: ${r.items[c].length}`);
        r.items[c].forEach(w => console.log(w))
    })

    // const r = [
    //     'https://festina.com/en-GB/watch/man/festina/festina-automatic-watch-f20480_1-blue-steel-bracelet-man.html',
    //     'https://festina.com/en-GB/watch/woman/festina/festina-automatic-watch-f20485_1-silver-colour-steel-bracelet-woman.html',
    //     'https://festina.com/en-GB/watch/man/festina/festina-automatic-watch-f20537_1.html',
    //     'https://festina.com/en-GB/watch/woman/festina/festina-automatic-watch-f20538_1.html',
    //     'https://festina.com/en-GB/watch/woman/festina/festina-boyfriend-collection-watch-f20503_1-nacar-steel-bracelet-woman.html',
    //     'https://festina.com/en-GB/watch/man/festina/festina-ceramic-watch-f20516_2-black-rubber-strap-man.html',
    //     'https://festina.com/en-GB/watch/woman/festina/festina-ceramic-watch-f20497_1-white-steel-bracelet-woman.html',
    // ];

    // for (let i = 0; i < r.length; i++) {
    //     const ex = await extraction({
    //         client: axios,
    //         entry: r[i],
    //         base: "https://festina.com",
    //     });
    //     console.log(ex);
    // }
})();