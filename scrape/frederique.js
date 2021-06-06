const axios = require('axios');
const cheerio = require('cheerio');
const xml2js = require('xml2js');
const { Mappers } = require('./utils');

const indexing = async (context) => {
    const source = "official";
    const lang = "en";
    const brand = "Frédérique Constant";
    const brandID = 154;
    const { client, entry, base, } = context;
    const result = { source, lang, brand, brandID, collections: [], items: {} };
    try {
        const { data } = await client.get(entry);
        const parser = new xml2js.Parser();
        parser.parseString(data, (err, res) => {
            for (let i = 1; i < res.urlset.url.length; i++) {
                const url = res.urlset.url[i]['loc'][0];
                const thumbnail = res.urlset.url[i]['image:image'][0]['image:loc'][0];
                const reference = url.match(/fc-\w+/i) ? url.match(/fc-\w+/ig)[0].toUpperCase() :
                    thumbnail.match(/fc-\w+/i) ? thumbnail.match(/fc-\w+/ig)[0].toUpperCase() : null;
                const name = (res.urlset.url[i]['image:image'][0]['image:title']) ? res.urlset.url[i]['image:image'][0]['image:title'][0] : 'noname';
                const collection = name;
                if (result.collections.indexOf(collection) < 0) {
                    result.collections.push(collection);
                    result.items[collection] = [];
                }
                result.items[collection].push({
                    source, lang, brand, brandID, collection, url, name,
                    reference, thumbnail, price: null,
                })
            }
        });
        return result;
    } catch (error) {
        console.log('Failed indexing for Frédérique Constant with error : ' + error);
        return {};
    }
};


const extraction = async (context) => {
    const { client, entry, ...rest } = context;
    const result = { ...rest, url: entry, spec: [], related: [], };
    result.source = "official";
    result.lang = "en";
    result.brand = "Frederique Constant";
    result.brandID = 154;
    try {
        if (entry.match(/\d{2}x\d{2}/i)) {
            // strap
            result.code = 'not product';
            return result;
        }
        const $ = cheerio.load((await client.get(entry)).data);
        result.thumbnail = $('.product-page--root').find('meta[property="og:image"]').first().attr('content');
        result.name = $('.product-page--root').find('.product-page--title').text().replace(/\s+/g, " ").trim();
        result.reference = $('.product-page--root').find('h2').text();
        result.retail = $('.product-page--root').find('.price--container').text().replace(/\s+/g, " ").trim();
        $('.product-page--description .rte-content .pdp > div').each((idx, el) => {
            // $('.product-page--description').find('.rte-content').find('.pdp').find('div').each((idx, el) => {
            const s = $(el).text().replace(/\s+/g, " ").trim();
            const sp = s.split(':');
            if (sp.length === 2)
                result.spec.push({ key: sp[0].trim(), value: sp[1].trim() });
            else if (sp.length === 1) {
                // result.spec.push({ key: 'techdata', value: sp[0].trim() });
                // if (idx > 0) {
                const ss = s.split(' ');
                const key = ss[0];
                const value = ss.slice(1, ss.length).join(' ').trim();
                result.spec.push({ key, value })
                // }
            }
        });
        if (result.spec.length === 0) {
            console.log('no spec found.....')
            // different structure
            if (result.name.match(/analytic/i)) result.code = 'not product';
            else {
                const keys = []; const values = [];
                $('.product-page--description .rte-content .pdp').find('h3').each((idx, el) => {
                    const k = $(el).text().trim();
                    if (k) keys.push(k)
                })
                console.log('keys : ', keys)
                if (keys.length === 0) {
                    console.log('no keys.............')
                    let key = '';
                    $('.product-page--description .rte-content .pdp').find('p').each((idx, el) => {
                        const k = $(el).find('strong').text().trim();
                        if (k) key = k;
                        else {
                            let value = $(el).contents().toString();
                            const val = $(el).text().trim();
                            if (!val) value = '';
                            // const value = $(el).text().trim();
                            if (value) result.spec.push({ key, value });
                        }
                    })
                } else {
                    console.log('with keys.........find values')
                    $('.product-page--description .rte-content .pdp').find('p').each((idx, el) => {
                        let v = $(el).contents().toString();
                        const vv = $(el).text().trim();
                        if (!vv) v = ''
                        if (v) values.push(v);
                    })
                    if (keys.length !== values.length) {
                        console.log('mismatched key value pair');
                        console.log('keys : ', keys);
                        console.log('values : ', values);
                    } else {
                        values.forEach((value, i) => {
                            if (value) result.spec.push({ key: keys[i], value });
                        })
                    }
                }
            }
        }
    } catch (error) {
        console.error('Failed extraction for Frederique Constant with error : ' + error);
        console.error('entry : ', entry)
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
            ...rest, additional: [], functions: [], features: [],
            case: {}, band: {}, dial: {}, caliber: {}, bezel: {},
        };
        for (const s of spec) {
            const key = s.key.toLowerCase().replace(/:/g, "").split('.').join('').trim();
            const value = s.value.trim();
            const gender = Mappers.getGender.map(result.name);
            result.gender = gender ? gender : 'M';
            if (key === 'movement' || key === 'see movement' || key === 'm ovement' || key === 'mouvement') {
                const v = value.split('.');
                v.forEach(value => {
                    const v = value.split(',');
                    v.forEach(value => {
                        if (value.match(/FC-\d{3}|C-\d{3}/i)) {
                            result.caliber.reference = 'FC-' + value.match(/\d{3}/g)[0];
                            result.caliber.brand = 'Frederique Constant';
                            result.caliber.label = 'Swiss';
                        }
                        if (value.match(/quartz|movement|caliber|automatic|chronograph/i)) {
                            const r = Mappers.getCaliberType.map(value);
                            if (r) {
                                result.caliber.type = r;
                                result.movementType = r;
                            }
                        }
                        if (value.match(/\d{1,3} jewels/i)) {
                            const j = value.match(/\d{1,3} jewels/ig);
                            const jv = j ? j[0].match(/\d{1,3}/g) : null;
                            if (jv) result.caliber.jewels = jv[0];
                        }
                        if (value.match(/power reserve/i)) {
                            const pr = value.match(/\d{1,3}[ -]?(h ?|hours? ?)?(power reserve)/ig);
                            const prv = pr ? pr[0].match(/\d{1,3}/g) : null;
                            if (prv) result.caliber.reserve = prv[0] + ' hours';
                        }
                        if (value.match(/battery life/i)) {
                            const b = value.match(/\w+ \w+ battery life/ig);
                            const bv = b ? b[0].match(/\w+ \w+/g) : null;
                            if (bv) result.caliber.batteryLife = bv[0];
                        }
                        if (value.match(/\d{1,3}\'\d{3} ?alt\/h/i)) {
                            const f = value.match(/\d{1,3}\'\d{3} ?alt\/h/ig);
                            const fv = f ? f[0].match(/\d{1,3}\'\d{3}/g) : null;
                            if (fv) result.caliber.frequency = fv[0];
                        }
                    })
                })
            }
            if (key === 'case') {
                if (!value.match(/dial/i)) {
                    if (value.match(/diameter/i)) {
                        const s = value.match(/\d{2}\.?\d{0,2} ?(mm ?)?(x ?\d{2}\.?\d{0,2} ?mm)?/ig);
                        const sz = s ? s[0].match(/\d{2}\.?\d{0,2}/g) : null;
                        if (sz && sz.length === 2) result.case.size = sz[0] + ' x ' + sz[1] + ' mm';
                        else if (sz && sz.length === 1) result.case.diameter = sz[0] + ' mm';
                        else {
                            const d = value.match(/diameter (of )?\d{2}\[.,]?\d{0,2} ?mm|\d{2}\[.,]?\d{0,2} ?mm ?diameter/gi);
                            const dv = d ? d[0].match(/\d{2}\[.,]?\d{0,2}/g) : null;
                            if (dv) result.case.diameter = dv[0].replace(/,/, '.') + ' mm';
                        }
                    } else if (value.match(/height/i)) {
                        const h = value.match(/height (of)? ?\d{1,2}[.,]?\d{0,2} ?mm/gi);
                        const hv = h ? h[0].match(/\d{1,2}[.,]?\d{0,2}/g) : null;
                        if (hv) result.case.thickness = hv[0].replace(/,/, '.') + ' mm';
                    } else if (value.match(/\. /)) {    //has sentences
                        let firstpass = true;
                        const v = value.split('.');
                        v.forEach(value => {
                            const v = value.split(',');
                            v.forEach(value => {
                                if (firstpass) {
                                    firstpass = false;
                                    const cm = value.split('case')[0];
                                    const { bm, bms, } = Mappers.getMaterial.map(cm);
                                    result.case.material = bm ? bm : cm;
                                    result.case.materials = bm ? bms : [cm];
                                } else {
                                    if (value.match(/crystal|glass/i)) {
                                        const c = Mappers.getCrystal.map(value);
                                        const cc = Mappers.getCrystalCoating.map(value);
                                        if (c) result.case.crystal = c;
                                        if (cc) result.case.crystalCoating = cc;
                                    }
                                    if (value.match(/case[- ]?back/i)) {
                                        const r = Mappers.getCaseBack.map(value);
                                        if (r) result.case.back = r;
                                    }
                                    if (value.match(/water/i)) {
                                        result.case.waterResistance = value.toLowerCase().replace('water-resistant up to ', '');
                                        result.waterResistance = Mappers.getWaterResistance.map(value);
                                    }
                                }
                            })
                        })
                    } else if (value.match(/crystal/i)) {
                        const c = Mappers.getCrystal.map(value);
                        const cc = Mappers.getCrystalCoating.map(value);
                        if (c) result.case.crystal = c;
                        if (cc) result.case.crystalCoating = cc;
                    } else if (value.match(/water/i)) {
                        result.case.waterResistance = value.replace(/water[- ]?resistant ?(up)? ?(to)?/i, '').trim();
                        result.waterResistance = Mappers.getWaterResistance.map(value);
                    } else {
                        // no sentence, chop by key words
                        // format assume ...case...crystal...case-back...water-resistant
                        const cm = value.toLowerCase().split('case');
                        const { bm, bms, } = Mappers.getMaterial.map(cm[0]);
                        if (bm) {
                            result.case.material = bm;
                            result.case.materials = bms;
                        }
                        const crystal = cm[1] ? cm[1].split('crystal') : null;
                        const c = crystal ? Mappers.getCrystal.map(crystal[0]) : null;
                        const cc = crystal ? Mappers.getCrystalCoating.map(crystal[0]) : null;
                        if (c) result.case.crystal = c;
                        if (cc) result.case.crystalCoating = cc;
                        const cback = crystal && crystal[1] ? crystal[1].split('case-back') : null;
                        const cb = cback ? Mappers.getCaseBack.map(cback[0]) : null;
                        if (cb) result.case.back = cb;
                        const wr = cback && cback[1] ? cback[1] : null;
                        if (wr) {
                            result.case.waterResistance = wr.replace(/water[- ]?resistant ?(up)? ?(to)?/i, '').trim();
                            result.waterResistance = Mappers.getWaterResistance.map(wr);
                        }
                    }
                }
            }
            if (key === 'dial') {
                let firstpass = (!result.dial.color);
                const v = value.split('.');
                v.forEach(value => {
                    const v = value.split(',');
                    v.forEach(value => {
                        if (firstpass) {
                            firstpass = false;
                            const r = Mappers.getColor.map(value);
                            result.dial.color = r ? r : value;
                            result.dialColor = Mappers.getDialColor.map(result.dial.color);
                        }
                        if (value.match(/index|numeral|marker/i)) {
                            const r = Mappers.getIndexType.map(value);
                            if (r) result.dial.indexType = r;
                        }
                        if (value.match(/hands/i)) {
                            const r = Mappers.getHandStyle.map(value);
                            if (r) result.dial.handStyle = r;
                        }
                        if (value.match(/date/i)) {
                            const r = Mappers.getCalendar.map(value);
                            result.dial.calendar = r ? r : value;
                        }
                    })
                })
            }
            if (key === 'functions') {
                let v = value;
                if (value.match(/hours?[ ,]*minutes?[ ,]*seconds?/i)) {
                    v = value.replace(/hours?[ ,]*minutes?[ ,]*seconds?/ig, '');
                    if (result.functions.indexOf('Hour, Minute, Second') < 0)
                        result.functions.push('Hour, Minute, Second');
                } else if (value.match(/hours?[ ,]*minutes?/i)) {
                    v = value.replace(/hours?[ ,]*minutes?/ig, '');
                    if (result.functions.indexOf('Hour, Minute') < 0)
                        result.functions.push('Hour, Minute');
                }
                v.split(',').forEach(vv => {
                    if (vv.trim() && result.functions.indexOf(vv.trim()) < 0)
                        result.functions.push(vv.trim());
                });
            }
            if (key === 'limited edition') {
                result.limited = value;
            }
            if (key === 'strap' || key === 'bracelet') {
                let b = value;
                if (value.match(/hour/i)) {
                    // bad data, function data in band
                    result.functions.push(value);
                } else {
                    if (value.match(/one extra/i)) {
                        const ba = value.toLowerCase().split('one extra');
                        b = ba[0].replace(new RegExp('including', 'i'), '').replace(',', '').trim();
                        result.features.push('One extra' + ba[1]);
                    }
                    if (value.match(/strap changing system/i)) {
                        const ba = value.split('.');
                        b = ba[0];
                        result.features.push(ba[1].trim());
                    }
                    const v = value.split(' with ')[0];
                    const { bm, bms, bt } = Mappers.getMaterial.map(v);
                    const c = Mappers.getColor.map(v);
                    if (bt) result.band.type = bt;
                    result.band.material = bm ? bm : v;
                    result.band.materials = bm ? bms : [v];
                    if (c) result.band.color = c;
                    const r = Mappers.getBuckle.map(value);
                    if (r) result.band.buckle = r;
                }
            }
            if (key && value)
                result.additional.push({ [key]: value });
        }
        return result;
    } catch (error) {
        console.error('Failed distillation for Frederiqu Constant with error : ' + error);
        return {};
    }
};



(async () => {
    const client = axios.create({
        headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/601.3.9 (KHTML, like Gecko) Version/9.0.2 Safari/601.3.9' }
    });
    //https://frederiqueconstant.com/sitemap.xml
    // const r = await indexing({
    //   client,
    //   entry: "https://frederiqueconstant.com/sitemap_products_1.xml?from=4620948930607&to=4757665021999",
    //   //"https://frederiqueconstant.com/sitemap_products_1.xml?from=4620948930607&to=4757665021999",
    //   brandID: 154,
    //   brand: "Frédérique Constant",
    //   base: "https://frederiqueconstant.com",
    // });


    // const r = [
    //     "https://frederiqueconstant.com/products/classics-quartz-chronograph-ladies-2",
    // ];
    // for (let i = 0; i < r.length; i++) {
    //     const ex = await extraction({
    //         client,
    //         entry: r[i],
    //     })
    //     console.log(ex)
    //     console.log();
    //     console.log();
    //     const d = await distill({ payload: ex });
    //     console.log(d);
    // }

    const ex = {
        url: 'https://frederiqueconstant.com/products/classics-quartz-chronograph-ladies-2',
        spec: [
            {
                key: 'Functions',
                value: 'Hours, minutes, seconds, date, chronograph'
            },
            { key: 'Movement', value: 'FC-291 caliber, quartz' },
            { key: 'Movement', value: '4 Jewels, 54 months battery life' },
            { key: 'Case', value: 'Stainless steel 3-part case' },
            { key: 'Case', value: 'Diameter of 34 mm' },
            { key: 'Case', value: 'Height of 10.08 mm' },
            { key: 'Case', value: 'Convex sapphire crystal' },
            { key: 'Case', value: 'Water-resistant up to 3 ATM' },
            { key: 'Dial', value: 'Navy blue mother-of-pearl dial' },
            {
                key: 'Dial',
                value: 'White printed seconds graduation, applied silver color indexes at 3, 6, 9, 12 o’clock and 8 silver color and diamonds indexes (0.05 carat)'
            },
            {
                key: 'Dial',
                value: 'Hand-polished silver color hour and minute hands'
            },
            {
                key: 'Dial',
                value: 'Silver second, chronograph second and chronograph minute hands'
            },
            { key: 'Dial', value: 'Silver color date window at 3 o’clock' },
            {
                key: 'Strap',
                value: 'Navy blue calf leather strap with alligator skin style embossing and blue stitching.'
            }
        ],
        related: [],
        source: 'official',
        lang: 'en',
        brand: 'Frederique Constant',
        brandID: 154,
        thumbnail: 'http://cdn.shopify.com/s/files/1/0264/6605/8287/products/Front_FC-291MPND2R6_Web_1200x.jpg?v=1617276447',
        name: 'Classics Quartz Chronograph Ladies',
        reference: 'FC-291MPND2R6',
        retail: '1,150.00 CHF'
    };

    console.log(ex.spec);
    console.log();
    console.log();
    const d = await distill({ payload: ex });
    console.log(d);

    // console.log(r)
    // for (let i = 0; i < r.collections.length; i++) {
    //   const c = r.collections[i];
    //   for (let j = 0; j < r.items[c].length; j++) {
    //     const ex = await extraction({
    //       ...r.items[c][j],
    //       client: axios,
    //       entry: r.items[c][j]['url'],
    //     });
    //     // console.log(ex);
    //     console.log(ex.url)
    //     ex.spec.forEach(s => {
    //       console.log(s.key + ' | ' + s.value);
    //     });
    //     console.log()
    //   }
    // }
})();