const axios = require('axios');
const cheerio = require('cheerio');
const fetch = require('cross-fetch');
const { Mappers } = require("./utils");

const indexing = async (context) => {
    const { client, entry, base } = context;
    try {
        const source = "official";
        const lang = "en";
        const brand = "Oris";
        const brandID = 164;
        const result = { source, lang, brand, brandID, collections: [], items: {} };
        const cats = [];
        const json = (await client.get(entry)).data;

        for (const i in json) {
            const collections = json[i]['collectionInfoItems'];
            for (const x of collections) {
                const url = x.id;
                const name = x.name;
                result.items[name] = [];
                result.collections.push(name)
                cats.push({ name, url });
            }
        }

        for (const cat of cats) {
            const urlBase = 'https://www.oris.ch/api/en/collection/getcollection/';
            const collectionUrl = urlBase + cat.url;
            const json = (await client.get(collectionUrl)).data;
            for (const i of json['watches']) {
                const watchId = i.id;
                for (const x of i['models']) {
                    const thumbnailBase = 'https://www.oris.ch/data/';
                    const reference = x.image.split('_')[1];
                    const modelId = x.modelId;
                    const url = base + watchId + '/' + modelId;
                    const thumbnail = thumbnailBase + x.image;
                    result.items[cat.name].push({
                        source, lang, brand, brandID, url, collection: cat.name,
                        reference, thumbnail,
                    });
                }
            }
        }
        return result;
    } catch (error) {
        console.error('Failed indexing for Oris with error : ' + error);
        console.error('entry : ', entry);
        return {};
    }
};

const extraction = async (context) => {
    const { entry, client, ...rest } = context;
    const result = { ...rest, url: entry, spec: [], related: [], };
    try {
        const pageId = entry.split('/watch/')[1];
        const pageUrl = 'https://www.oris.ch/api/en/Watch/GetWatch/' + pageId;
        const json = (await client.get(pageUrl)).data;
        const selectedId = json['selectedModelId'].toString();
        let modelId = '';

        result.name = json.name;
        result.description = json.description;
        result.gender = 'M';
        result.reference = json.reference;

        for (const x of json.models) {
            modelId = x.id;
            if (modelId.toString() === selectedId) {
                result.retail = x['priceWithCurrency'];
                let index;
                for (index = 0; index < 4; index++) {
                    if (x.features[index] && x.features[index].features)
                        for (const specs of x.features[index].features) {
                            const key = specs['featureType'];
                            const value = specs['value'];
                            result.spec.push({ key, value });
                        }
                }
            }
        }
    } catch (error) {
        console.error('Failed extraction for Oris with error : ' + error);
        console.error('entry : ', entry);
        if (error.response) result.code = error.response.status;
        else result.code = 'UNKNOWN ERROR';
    }
    return result;
};

const distill = async (context) => {
    try {
        const { payload } = context;
        const { description, spec, ...rest } = payload;
        const result = {
            ...rest, description, functions: [], features: [],
            case: {}, caliber: {}, bezel: {},
            dial: {}, band: {}, additional: [],
        };

        for (const s of spec) {
            let pp = false;
            const key = s.key.replace(":", "").toLowerCase();
            const value = s.value.trim();
            if (value.match(/dial/i)) {
                pp = true;
                const c = Mappers.getColor.map(value);
                if (c) {
                    result.dial.color = c;
                    result.dialColor =
                        result.dial.color.match(/mother of pearl/i) ? 'Mother of Pearl' :
                            result.dial.color.match(/diamond/i) ? 'Diamond' : result.dial.color;
                }
                const { bm, bms, } = Mappers.getMaterial.map(value);
                if (bm) {
                    result.case.material = bm;
                    result.case.materials = bms;
                }
            }
            if (key === 'material') {
                if (value.match(/case/i)) {
                    pp = true;
                    const { bm, bms, } = Mappers.getMaterial.map(value);
                    result.case.material = bm ? bm : value;
                    result.case.materials = bm ? bms : [value];
                }
                if (value.match(/dial/i)) {
                    pp = true;
                    const c = Mappers.getColor.map(value);
                    if (c) {
                        result.dial.color = c;
                        result.dialColor =
                            result.dial.color.match(/mother of pearl/i) ? 'Mother of Pearl' :
                                result.dial.color.match(/diamond/i) ? 'Diamond' : result.dial.color;
                    }
                }
                if (value.match(/strap|bracelet/i)) {
                    const v = value.split(',');
                    v.forEach((value, i) => {
                        if (i === 0) {
                            const { bm, bms, bt, } = Mappers.getMaterial.map(value);
                            if (bt) result.band.type = bt;
                            result.band.material = bm ? bm : value;
                            result.band.materials = bm ? bms : [value];
                        } else {
                            const b = Mappers.getBuckle.map(value);
                            if (b) result.band.buckle = b;
                        }
                    })
                }
            }
            if (key === 'size') {
                pp = true;
                result.case.diameter = value.split('mm')[0] ? value.split('mm')[0].trim() + ' mm' : '';
            }
            if (key === 'top glass') {
                pp = true;
                const c = Mappers.getCrystal.map(value);
                const cc = Mappers.getCrystalCoating.map(value);
                result.case.crystal = c ? c : value;
                if (cc) result.case.crystalCoating = cc;
            }
            if (key === 'case back') {
                pp = true;
                const r = Mappers.getCaseBack.map(value);
                result.case.back = r ? r : value;
            }
            if (key === 'operating devices') {
                const r = Mappers.getCaseCrown.map(value);
                if (r) result.case.crown = r;
            }
            if (key === 'water resistance') {
                pp = true;
                result.case.waterResistance = value;
                result.waterResistance = Mappers.getWaterResistance.map(value);
            }
            if (key === "interhorn width") {
                pp = true;
                result.case.lugWidth = value;
            }
            if (key === 'number') {
                pp = true;
                result.caliber.reference = value;
                result.caliber.brand = 'Oris';
                result.caliber.label = 'Swiss';
            }
            if (key === 'functions') {
                pp = true;
                // result.features = value;
                result.features = value.split(',').map(x => x.trim()) ? value.split(',').map(x => x.trim()) : '';
            }
            if (key === 'winding') {
                pp = true;
                const r = Mappers.getCaliberType.map(value);
                result.caliber.type = r ? r : value;
                result.movementType = r ? r : value;
            }
            if (key === 'power-reserve') {
                pp = true;
                result.caliber.reserve = value;
            }
            if (key === 'vibrations') {
                pp = true;
                result.caliber.frequency = value;
            }
            if (key === 'jewels') {
                pp = true;
                result.caliber.jewels = value;
            }
            if (key === 'luminous material') {
                const r = Mappers.getLuminescence.map(value);
                if (r) {
                    pp = true;
                    result.dial.luminescence = r;
                }
            }
            if (!pp) result.additional.push({ [key]: value });
        }
        return result;
    } catch (error) {
        console.error('Failed distillation for Oris with error : ' + error);
        return {};
    }
};

const index = async (context) => {
    const { client, entry, base, interval, } = context;
    const baseURL = base ? base : "https://www.oris.ch/watch/";
    const source = "official";
    const lang = "en";
    const brand = "Oris";
    const brandID = 164;
    const result = { source, lang, brand, brandID, collections: [], items: {} };
    const cats = [];
    try {
        const json = (await client.get(entry)).data;
        json.forEach(x => {
            const url = x.id;
            const name = x.name;
            result.items[name] = [];
            result.collections.push(name)
            cats.push({ name, url });
        })
        const urlBase = 'https://www.oris.ch/api/en/collection/getcollection/';
        for (const cat of cats) {
            const collectionUrl = urlBase + cat.url;
            const json = (await client.get(collectionUrl)).data;
            for (const i of json['watches']) {
                const watchId = i.id;
                for (const x of i['models']) {
                    const thumbnailBase = 'https://www.oris.ch/data/';
                    const reference = x.image.split('_')[1];
                    const modelId = x.modelId;
                    const url = baseURL + watchId + '/' + modelId;
                    const thumbnail = thumbnailBase + x.image;
                    result.items[cat.name].push({
                        source, lang, brand, brandID, url, collection: cat.name,
                        reference, thumbnail,
                    });
                }
            }
            await new Promise(r => setTimeout(r, interval));
        }
        return result;
    } catch (error) {
        logger.error('Failed indexing for Oris with error : ' + error);
        logger.error('entry : ', entry);
        return {};
    }
};

const newIndex = async context => {
    const res = await fetch(encodeURI(context));
    const data = await res.json();
    const wUrl = 'https://oris.ch/en/watch/';
    const watchesList = data.models ? data.models : [];
    const pathArr = []; const uniq = [];
    watchesList.map(x => {
        const url = wUrl + x.watchId + '/' + x.id;
        pathArr.push(url);
    })
    console.log('pathArr : ', pathArr.length);
    let cnt = 1;
    for (const w of pathArr) {
        try {
            await new Promise(r => setTimeout(r, 1000));
            cnt++;
            process.stdout.write(`processing .... ${cnt} / ${pathArr.length}\r`);
            const res = await fetch(encodeURI(w));
            const data = await res.text();
            const $ = cheerio.load(data);
            const url = $('meta[property="og:url"]').attr('content');
            if (url && uniq.indexOf(url) < 0) uniq.push(url);
            // const u = url ? url.split('/') : null;
            // if (u) {
            //     const aUrl = watchBaseUrl + u[u.length - 2] + "/" + u[u.length - 1];
            //     const res = await fetch(encodeURI(aUrl), config);
            //     const data = await res.json();
            //     if (data && data.models) {
            //         const watchDetail = data.models.filter(x => x.isoCurrencySymbol == countryCode);
            //         for (const w of watchDetail) {
            //             const reference = w.reference;
            //             const amount = parseFloat(w.price);
            //             results.push({ reference, amount });
            //         }
            //     }
            // }
        } catch (error) {
            logger.error('Failed MSRP scraping for Oris with error : ', error);
        }
    }
    console.log('uniq : ', uniq.length);
}

(async () => {
    const e = "https://oris.ch/api/en/watchfinder/getdata/";
    await newIndex(e);
    console.log("done");
    // const r = await index({
    //     client: axios,
    //     entry: "https://www.oris.ch/api/en/home/getcollections",
    //     brandID: 164,
    //     brand: "Oris",
    //     base: "https://www.oris.ch/watch/",
    // });
    // let cnt = 0;
    // r.collections.forEach(c => {
    //     r.items[c].forEach(w => {
    //         console.log(w);
    //         cnt++;
    //     })
    // })
    // console.log('total : ', cnt);
    // console.log(r);

    //   const rr = [
    //     "https://www.oris.ch/watch/245/1515",
    //     "https://www.oris.ch/watch/195/1451",
    //   ];

    //   for (let i = 0; i < rr.length; i++) {
    //     const ex = await extraction({
    //       entry: rr[i],
    //       client: axios,
    //       brand: "Oris",
    //       brandID: 164,
    //     })
    //     console.log(ex);
    //   }

    // for (let i = 0; i < r.collections.length; i++) {
    //   const c = r.collections[i];
    //   for (let j = 0; j < r.items[c].length; j++) {
    //     const w = r.items[c][j];
    //     const ex = await extraction({
    //       ...w, client: axios, entry: w.url,
    //     });
    //     ex.spec.forEach(s => console.log(s.key + " | " + s.value));
    //   }
    // }
})();