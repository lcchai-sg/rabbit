const axios = require('axios');
const cheerio = require('cheerio');

(async () => {
    const aUrl = "https://oris.ch/api/en/watchfinder/getdata/";             // all?
    const wUrl = "https://www.oris.ch/data/";
    const { data } = await axios.get(aUrl);
    const cUrls = [];
    const aUrls = [];
    data.models.forEach(w => {
        const u = wUrl + w.watchId + "/" + w.id;
        if (aUrls.indexOf(u) < 0) aUrls.push(u);
        else console.log('1 dup : ', u);
    })
    console.log('aUrls : ', aUrls.length);
    {
        const coll = [26, 9, 11, 32, 35, 15, 16];
        // const cUrl = "https://www.oris.ch/api/en/home/getcollections";      // all collections?
        const urlBase = 'https://www.oris.ch/api/en/collection/getcollection/';
        // const {data} = await axios.get(cUrl);
        for (const c of coll) {
            const cUrl = urlBase + c;
            const { data } = await axios.get(cUrl);
            data.watches.forEach(w => {
                w.models.forEach(m => {
                    const u = wUrl + w.id + "/" + m.modelId;
                    if (cUrls.indexOf(u) < 0) cUrls.push(u);
                    else console.log('2 dup : ', u);
                })
            })
        }
        console.log('cUrls : ', cUrls.length);
    }
    aUrls.forEach(u => console.log(u))
    console.log();
    console.log();
    cUrls.forEach(u => console.log(u))
})();
/*
const indexing = async (context) => {
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
        console.error('Failed indexing for Oris with error : ' + error);
        console.error('entry : ', entry);
        return {};
    }
};

const extraction = async (context) => {
    const { entry, client, ...rest } = context;
    const result = { ...rest, url: entry, spec: [], related: [], };
    result.source = "official";
    result.lang = "en";
    result.brand = "Oris";
    result.brandID = 164;
    try {
        const { data } = await client.get(entry);
        const $ = cheerio.load(data);
        const url = $('meta[property="og:url"]').attr('content');
        const u = url ? url.split('/') : null;
        const wUrl = 'https://www.oris.ch/api/en/Watch/GetWatch/';
        if (u) {
            const pageUrl = wUrl + u[u.length - 2] + "/" + u[u.length - 1];
            const imageBase = "https://www.oris.ch/data/";
            const json = (await client.get(pageUrl)).data;
            const selectedId = json['selectedModelId'].toString();
            const baseURL = 'https://www.oris.ch/en/watch/';
            let modelId = '';
            for (const x of json.models) {
                modelId = x.id;
                if (modelId.toString() === selectedId) {
                    result.name = x.title;
                    result.description = x.description;
                    result.collection = x.collectionName;
                    result.gender = 'M';
                    result.reference = x.reference;
                    result.retail = x['priceWithCurrency'];
                    result.thumbnail = imageBase + x.picture;
                    result.link = baseURL + x.watchSlug + '/' + x.slug
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
        }
    } catch (error) {
        console.error('Failed extraction for Oris with error : ' + error);
        console.error('entry : ', entry);
        if (error.response) result.code = error.response.status;
        else result.code = 'UNKNOWN ERROR';
    }
    return result;
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
        console.error('Failed indexing for Oris with error : ' + error);
        console.error('entry : ', entry);
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
        } catch (error) {
            console.error('Failed MSRP scraping for Oris with error : ', error);
        }
    }
    console.log('uniq : ', uniq.length);
}

(async () => {
    // const e = "https://oris.ch/api/en/watchfinder/getdata/";
    // await newIndex(e);
    // console.log("done");
    const r = await index({
        client: axios,
        entry: "https://www.oris.ch/api/en/home/getcollections",
        brandID: 164,
        brand: "Oris",
        base: "https://www.oris.ch/watch/",
    });
    let cnt = 0;
    r.collections.forEach(c => {
        r.items[c].forEach(w => {
            console.log(w);
            cnt++;
        })
    })
    console.log('total : ', cnt);
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
*/