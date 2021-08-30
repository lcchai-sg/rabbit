const axios = require('axios');
const cheerio = require('cheerio');
const sitemapper = require('sitemapper');
const { Mappers } = require('./utils');

const extraction = async (context) => {
    const { client, entry, ...other } = context;
    const result = { url: entry, ...other, spec: [], related: [], };
    result.source = "official";
    result.lang = "en";
    result.brand = "Hugo Boss";
    result.brandID = 192;
    try {
        const { data } = await client.get(entry);
        const $ = cheerio.load(data);
        $('script[type="application/ld+json"]').each((idx, el) => {
            const d = $(el).contents();
            const dd = d ? d.toString() : null;
            if (dd.match(/"@type":"Product"/i)) {
                const j = JSON.parse(dd);
                if (j.name) {
                    result.name = j.name ? j.name : null;
                    result.thumbnail = j.image && j.image.length > 0 ? j.image[0] + "?wid=600" : null;
                    result.description = j.description ? j.description : null;
                    result.retail = j.offers && j.offers.price ? j.offers.price : null;
                    if (j.sku) result.sku = j.sku;
                    if (j.mpn) result.mpn = j.mpn;
                    if (j.color) result.color = j.color;
                }
            }
        })
        if (!result.name) result.name = $('.pdp-stage__header-title').text().trim();
        const ref = $('.pdp-stage__accordion-style-number').text().trim();
        result.reference = ref.match(/-/) ? ref.split('-')[1].trim() : ref;
        if (!result.description) result.description = $('.pdp-stage__accordion-description').text().replace(/\s+/g, ' ').trim();
        if (!result.thumbnail) result.thumbnail = $('.pdp-images__image').first().attr('data-src');
        if (result.thumbnail.match(/\?/)) result.thumbnail = result.thumbnail.split('&')[0];
        const d = $(".product-tile-default").attr("data-as-product");
        if (d) {
            const j = JSON.parse(d);
            if (!result.retail) result.retail = j.price ? j.price : null;
            if (j.gender) result.gender = j.gender;
            if (j.sku) result.sku = j.sku;
        }
        const techData = $('#product-container-details-panel').contents();
        result.spec = [];
        if (techData) {
            Object.keys(techData).forEach(k => {
                if (!(isNaN(parseInt(k)))) {
                    if (techData[k]['type'] === 'text') {
                        const d = techData[k]['data'].replace(/(\t|\r|\n)/g, '');
                        if (d) result.spec.push(d);
                    }
                }
            })
        }
    } catch (error) {
        // console.log(error);
        // console.error('Failed extraction for Hugo Boss with error : ' + error);
        // console.error('entry : ', entry);
        if (error.response) result.code = error.response.status;
        // else result.code = 'UNKNOWN ERROR';
        else console.log(error);
    }
    return result;
};

const distill = async (context) => {
    try {
        const { payload } = context;
        const { spec, ...rest } = payload;
        const result = {
            ...rest, additional: [], functions: [], features: [],
            case: {}, band: {}, dial: {}, caliber: {}, bezel: {},
        };
        for (const s of spec) {
            let assigned = false;
            const v = s.split(':');
            const key = v[0];
            const value = v[1].trim();
            if (key.match(/Watch mechanism/i)) result.features.push(value);
            if (key.match(/date mechanism/i)) result.features.push(value + ' date');
            if (key.match(/dial color/i)) {
                assigned = true;
                const r = Mappers.getColor.map(value);
                result.dial.color = r ? r : value;
                result.dialColor = Mappers.getDialColor.map(result.dial.color);
            }
            if (key.match(/strap material/i)) {
                assigned = true;
                if (!result.band.materials) result.band.materials = [];
                const { bm, bms, bt, } = Mappers.getMaterial.map(value);
                if (bt) result.band.type = bt;
                result.band.material = bm ? bm : value;
                result.band.materials = bm ? bms : [value];
            }
            if (key.match(/closure/i)) {
                assigned = true;
                const r = Mappers.getBuckle.map(value);
                result.band.buckle = r ? r : value;
            }
            if (key.match(/case size/i)) {
                assigned = true;
                const cs = value.match(/\d\d ?mm/gi);
                if (cs) result.case.size = cs[0];
            }
            if (key.match(/water/i)) {
                assigned = true;
                result.case.waterResistance = value;
                result.waterResistance = Mappers.getWaterResistance.map(value);
            }
            if (!assigned) result.additional.push({ [key]: value });
        }
        return result;
    } catch (error) {
        console.log('Failed distillation for Hugo Boss with error : ' + error)
        return {};
    }
};


const indexing = async (context) => {
    const { client, base, interval, } = context;
    const source = "official";
    const lang = "en";
    const brand = "Hugo Boss";
    const brandID = 192;
    const result = { source, lang, brand, brandID, collections: ['all'], items: { 'all': [] } };
    const urls = [
        // "https://www.hugoboss.com/men-watches/",
        // "https://www.hugoboss.com/women-watches/",
        "https://www.hugoboss.com/us/men-watches/",
        "https://www.hugoboss.com/us/women-watches/",
        "https://www.hugoboss.com/uk/men-watches/",
        "https://www.hugoboss.com/uk/women-watches/",
    ];
    const baseUrl = "https://www.hugoboss.com";
    try {
        for (const u of urls) {
            let cnt = 0;
            console.log(u);
            const { data } = await client.get(u);
            const $ = cheerio.load(data);
            let name, retail, thumbnail, mpn, reference, url;
            $(".search-result-items__grid-tile").each((idx, el) => {
                const dd = $(el).find('script[type="application/ld+json"]').contents();
                const d = dd ? dd.toString() : "";
                if (d.match(/"@type":"Product"/i)) {
                    const j = JSON.parse(d);
                    if (j.name) {
                        url = j.url ? j.url : null;
                        name = j.name ? j.name : null;
                        thumbnail = j.image && j.image.length > 0 ? j.image[0] + "?wid=600" : null;
                        retail = j.offers && j.offers.price ? j.offers.price : null;
                        mpn = j.mpn ? j.mpn : null;
                        reference = mpn ? mpn.replace(/hbna|_999/g, '') : null;
                    }
                } else {
                    const dd = $(el).find(".product-tile-default").attr("data-as-product");
                    if (dd) {
                        const j = JSON.parse(dd);
                        reference = j.id ? j.id.replace(/hbna/i, '') : null;
                        thumbnail = $(el).attr("data-originalimage");
                        name = j.name ? j.name : null;
                        retail = j.price ? j.price : null;
                        url = baseUrl + $(el).find(".product-tile-default").find("a").attr("href");
                    }
                }
                if (url) {
                    result.items['all'].push({
                        source, lang, brand, brandID, url, name, reference,
                        thumbnail, retail,
                    });
                    cnt++;
                }
            })
            // const w = parseInt($('.search-result-options__brand-badge').first().text());
            // const np = Math.ceil(w / 60);
            // for (let i = 0; i < np; i++) {
            //     const link = url + "?start=" + i * 60 + "&sz=60";
            //     console.debug(link)
            //     const { data } = await client.get(link);
            //     const $ = cheerio.load(data);
            //     $('script[type="application/json"]').each((idx, el) => {
            //         const d = $(el).contents();
            //         const j = JSON.parse(d['0']['data']);
            //         if (j.category === 'Watches') {
            //             result.items['all'].push({
            //                 source, lang, brand, brandID, url: j['@id'], name: j.name,
            //                 reference: j.mpn.replace('hbeu', '').replace('_999', ''),
            //                 thumbnail: j.image[0], description: j.description, retail: null,
            //             });
            //         }
            //     })
            //     await new Promise(r => setTimeout(r, interval));
            // }
            console.log('total : ', cnt);
        }
        return result;
    } catch (error) {
        console.log('Failed indexing for Hugo Boss with error : ' + error)
        return {};
    }
};

(async () => {
    // const r = await indexing({
    //     client: axios,
    //     interval: 3000,
    // });
    // r && r.collections.forEach(c => {
    //     r.items[c].forEach(w => {
    //         console.log(w);
    //     })
    // })
    // console.log('total : ', r.items['all'].length);
    const r = [
        'https://www.hugoboss.com/us/mesh-bracelet-watch-with-silver-finish-and-swarovski%C2%AE-crystals/hbna58093828_999.html',
        'https://www.hugoboss.com/uk/silicone-strap-chronograph-watch-with-honeycomb-dial/hbeu58098404_999.html',
        //     'https://www.hugoboss.com/us/stainless-steel-watch-with-chain-link-bracelet/hbna58098425_999.html?cgid=14800',
        //     // "https://www.hugoboss.com/link-bracelet-watch-with-trimmed-bezel/hbeu58093803_999.html?cgid=14800",
        //     // "https://www.hugoboss.com/mesh-bracelet-watch-with-silver-finish-and-swarovski%C2%AE-crystals/hbeu58093828_999.html?cgid=14800",
        //     // "https://www.hugoboss.com/mirror-dial-two-hand-watch-with-silver-finish/hbeu58093830_999.html?cgid=14800",
        //     // "https://www.hugoboss.com/purple-plated-stainless-steel-watch-with-mesh-bracelet/hbeu58079065_999.html?cgid=14800",
        //     // "https://www.hugoboss.com/silicone-strap-chronograph-watch-with-honeycomb-dial/hbeu58098404_999.html?cgid=14800",
        //     // "https://www.hugoboss.com/silver-effect-three-hand-watch-with-swarovski%C2%AE-crystals/hbeu58093804_999.html?cgid=14800",
        //     // "https://www.hugoboss.com/square-frame-sunglasses-with-black-and-gold-rim/hbeu58089294_999.html?cgid=14800",
        //     // "https://www.hugoboss.com/stainless-steel-chronograph-watch-with-blue-leather-strap/hbeu58083004_999.html?cgid=14800",
        //     // "https://www.hugoboss.com/swarovski%C2%AE-crystal-studded-watch-with-carnation-gold-finish/hbeu58093829_999.html?cgid=14800",
        //     // "https://www.hugoboss.com/swarovski%C2%AE-crystal-studded-watch-with-pressed-mesh-bracelet/hbeu58098446_999.html?cgid=14800",
        //     // "https://www.hugoboss.com/two-tone-chronograph-watch-with-link-bracelet/hbeu58098422_999.html?cgid=14800",
        //     // "https://www.hugoboss.com/two-tone-three-hand-watch-with-markers/hbeu58093798_999.html?cgid=14800",
        //     // "https://www.hugoboss.com/two-tone-watch-with-trimmed-bezel/hbeu58093802_999.html?cgid=14800",
        //     // "https://www.hugoboss.com/yellow-gold-effect-chronograph-watch-with-link-bracelet/hbeu58098423_999.html?cgid=14800",
        //     // 'https://www.hugoboss.com/stainless-steel-watch-with-blue-dial-and-link-bracelet/hbeu58082953_999.html?cgid=14800',
        //     // 'https://www.hugoboss.com/blue-plated-watch-with-swarovski%C2%AE-crystals-and-mesh-bracelet/hbeu58082881_999.html?cgid=14800',
        //     // 'https://www.hugoboss.com/swarovski%C2%AE-crystal-trimmed-watch-with-polished-silver-finish/hbeu58089023_999.html?cgid=14800',
        //     // 'https://www.hugoboss.com/stainless-steel-watch-with-patterned-blue-dial/hbeu58089075_999.html?cgid=14800',
        //     // 'https://www.hugoboss.com/stainless-steel-chronograph-watch-with-blue-dial-and-rotating-bezel/hbeu58079087_999.html?cgid=14800',
        //     // 'https://www.hugoboss.com/contrast-dial-chronograph-watch-with-black-leather-strap/hbeu58089029_999.html?cgid=14800',
        //     // 'https://www.hugoboss.com/stainless-steel-watch-with-blue-dial-and-link-bracelet/hbeu58082953_qqq.html?cgid=14800',
    ];
    for (let i = 0; i < r.length; i++) {
        await new Promise(r => setTimeout(r, 3000));
        const ex = await extraction({
            entry: r[i],
            client: axios,
        });
        console.log(ex);
        const d = await distill({
            payload: ex,
        })
        console.log(d);
        console.log();
        console.log();
    }

})();