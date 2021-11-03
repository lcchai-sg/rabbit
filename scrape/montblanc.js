const axios = require('axios');
const cheerio = require('cheerio');
const xml2js = require('xml2js');
const urls = [
    "https://www.montblanc.com/sitemap_us_montblanc_us2_watches.xml",
];
const cats = [];

const category = async context => {
    const { client } = context;
    const c = "https://www.montblanc.com/en-us/collection/watches/";
    const { data: cdata } = await client.get(c);
    const $ = cheerio.load(cdata);
    $(".yt2_h_title").each((idx, el) => {
        let coll = $(el).text();
        if (coll === "Bohème") coll = "Boheme";
        cats.push(coll);
    })
    cats.push("Summit");            // smartwatch, only 1 collection so just hardcoded
}

const getCollection = input => {
    let cat = "other";
    cats.forEach(c => {
        const cc = new RegExp(c, 'i');
        if (input.match(cc)) cat = c;
    })
    return cat;
}

const indexing = async context => {
    const { client, entry, base, interval } = context;
    const { data } = await client.get(entry);
    const parser = new xml2js.Parser();
    const result = { collections: [], watches: {} }
    parser.parseString(data, (err, res) => {
        const urls = res.urlset.url;
        urls.forEach(u => {
            const url = u['loc'] ? u['loc'][0] : null;
            const img = u['image:image'] ? u['image:image'] : null;
            if (img) {
                const name = img[0]['image:title'] ? img[0]['image:title'][0].replace(/%20/g, ' ').trim() : null;
                const i = name ? name.replace("Boh%c3%a8me", "Boheme") : null;
                const collection = i ? getCollection(i) : "notfound";
                if (result.collections.indexOf(collection) < 0) {
                    result.collections.push(collection);
                    result.watches[collection] = []
                }
                const caption = img[0]['image:caption'] ? img[0]['image:caption'][0].replace(/%20/g, ' ').trim() : null;
                const thumbnail = img[0]['image:loc'] ? img[0]['image:loc'][0] : null;
                result.watches[collection].push({
                    collection, name, caption, url, thumbnail
                })
            }
        })
    })
    return result;
}

const extraction = async context => {
    const { client, entry, ...rest } = context;
    const { data } = await client.get(entry);
    const $ = cheerio.load(data);
    const result = { spec: [] };
    // const name = $('meta[property="og:title"]').attr('content');
    result.thumbnail = $('meta[property="og:image"]').attr('content');
    $('script[type="application/ld+json"]').each((idx, el) => {
        const d = $(el).contents();
        const j = d ? JSON.parse(d) : null;
        // console.log('j : ', j);
        if (j && j.length > 0 && j[0]["@type"] == "Product") {
            result.description = j[0].description;
            result.name = j[0].name;
            result.retail = j[0].offers ? j[0].offers[0].priceCurrency + ' ' + j[0].offers[0].price : null;
            result.sku = j[0].offers && j[0].offers[0].sku ? j[0].offers[0].sku : null;
        }
    })
    result.description = $(".mb-product__details__overview").text().replace(/\s+/g, " ").trim();
    const reference = result.description.match(/Ident No. \w+/ig)
    result.reference = reference ? reference[0].replace(/Ident No. /i, "") : "";
    $(".mb-product__details__features").find(".accordion__content").each((idx, el) => {
        $(el).find("span").each((idx, el) => {
            const c = $(el).attr("class");
            if (!c.match(/key|unit/i)) {
                let key = c;
                if (key) key = key.replace(/_/g, ' ').trim();
                const re = new RegExp(key, 'i');
                let value = $(el).text().replace(re, '').replace(/\s+/g, ' ').trim();
                result.spec.push({ key, value });
            }
        })
    })
    return result;
}

(async () => {
    await category({ client: axios });
    // const { data } = await axios.get(urls[0]);
    // const d = data.replace(/%20/ig, ' ');
    // const dd = d.match(/<image:title>.*<\/image:title>/ig);
    // console.log(dd.sort());
    for (const u of urls) {
        const r = await indexing({
            client: axios,
            entry: u,
        })
        r && r.collections.forEach(c => {
            r.watches[c].forEach(w => {
                console.log(w);
            })
        })
    }
    // const r = [
    //     'https://www.montblanc.com/en-us/wrist-watches_cod19971654706570201.html',
    //     'https://www.montblanc.com/en-us/smartwatches_cod19971654707116190.html',
    // ];
    // for (const u of r) {
    //     const ex = await extraction({
    //         client: axios,
    //         entry: u,
    //         base: ''
    //     })
    //     console.log(ex);
    // }
    // console.log();
    // console.log(cats);
    console.log('done..........................');
})()
