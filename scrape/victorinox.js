const axios = require('axios');
const cheerio = require('cheerio');
const sitemapper = require('sitemapper');

const indexing = async context => {
    // collections : https://www.swissarmy.com/us/en/Products/Watches/c/TP#collectionCarpet
    const { client, entry, base, } = context;
    const baseURL = base ? base : "https://www.swissarmy.com";
    const source = "official";
    const lang = "en";
    const brand = "Victorinox";
    const brandID = 396;
    const result = { source, lang, brand, brandID, collections: [], items: {} };
    const cats = [];
    try {
        const { data } = await client.get(entry);
        const $ = cheerio.load(data);
        $(".mod-nav-carpet").find("a").each((idx, el) => {
            const url = baseURL + $(el).attr("href");
            const name = $(el).text();
            if (url.match(/collection/i)) {
                if (result.collections.indexOf(name) < 0) {
                    cats.push({ name, url });
                    if (!url.match(/overview/i)) {
                        result.collections.push(name);
                        result.items[name] = [];
                    }
                }
            }
        })
        const newCats = [];
        for (const cat of cats) {
            if (!cat.url.match(/overview/i)) {
                newCats.push(cat);
            } else {
                const { data } = await client.get(cat.url);
                const $ = cheerio.load(data);
                $(".skin-content-title-image-button").each((idx, el) => {
                    const url = baseURL + $(el).find("a").attr("href");
                    const name = $(el).find(".subtitle_ellipsis").text().replace(/\s+/g, ' ').trim();
                    if (!name.match(/accessories|strap/i)) {
                        if (result.collections.indexOf(name) < 0) {
                            cats.push({ name, url });
                            result.collections.push(name);
                            result.items[name] = [];
                        }
                    }
                })
            }
        }
        for (const cat of newCats) {
            console.log(cat.url)
            const { data } = await client.get(cat.url);
            const $ = cheerio.load(data);
            // $(".product-details").each((idx, el) => {
            //     const name = $(el).find(".title-variant-wrapper").text().replace(/\s+/g, ' ');
            //     const j = $(el).find(".product__btn-add").attr("data-gtm-product");
            //     const j1 = $(el).find(".product__btn-add").attr("data-klaviyo-product");
            //     const js = JSON.parse(j);
            //     const js1 = JSON.parse(j1);
            //     const reference = js.id;
            //     const retail = js.price;
            //     const thumbnail = js.imageUrl;
            //     const url = js1.AddedItemURL;
            //     result.items[cat.name].push({
            //         source, lang, brand, brandID, url, collection: cat.name,
            //         name, reference, retail, thumbnail,
            //     })
            // })
            $(".js-product-link").each((idx, el) => {
                const url = baseURL + $(el).attr("href");
                const j = $(el).attr("data-gtm-product");
                const js = JSON.parse(j);
                const name = js.name + " " + js.variant;
                const reference = js.id;
                const retail = js.price;
                const thumbnail = js.imageUrl;
                result.items[cat.name].push({
                    source, lang, brand, brandID, url, collection: cat.name,
                    name, reference, retail, thumbnail,
                })
            })
        }
        return result;
    } catch (error) {
        console.error('Failed indexing for Victorinox with error : ', error);
        console.error('entry : ', entry);
        return {};
    }
}

const xmlIndexing = async context => {
    const { client, entry, base, } = context;
    const source = "official";
    const lang = "en";
    const brand = "Victorinox";
    const brandID = 396;
    const result = { source, lang, brand, brandID, collections: ['all'], items: { 'all': [] } };
    try {
        const sitemap = new client({
            url: entry,
            timeout: 300000,
        });
        const sm = await sitemap.fetch();
        sm.sites.sort();
        let cnt = 0;
        for (let i = 0; i < sm.sites.length; i++) {
            if (sm.sites[i].match(/\/watches\//i) && !sm.sites[i].match(/accessories/i)) {
                console.log(sm.sites[i]);
                cnt++;
            }
        }
        console.log();
        console.log(`number of men watches : ${cnt}`);
        return result;
    } catch (error) {
        console.error('Failed indexing for Victorinox with error : ', error);
        console.error('entry : ', entry);
        return {};
    }
}

(async () => {
    // const xr = await xmlIndexing({
    //     entry: "https://www.swissarmy.com/staticmedias/8799960203765-Product-en-USD.xml",
    //     client: sitemapper,
    //     base: "https://www.swissarmy.com/us/en",
    // });
    // console.log(xr)
    const r = await indexing({
        entry: "https://www.swissarmy.com/us/en/Products/Watches/c/TP#collectionCarpet",
        client: axios,
        base: "https://www.swissarmy.com",
    });

    let cnt = 0; const watches = [];
    r.collections && r.collections.forEach(c => {
        r.items && r.items[c].forEach(w => {
            if (watches.indexOf(w.url) < 0) watches.push(w.url);
            cnt++;
            console.log(w);
        })
    })
    console.log();
    console.log('watches : ', cnt);
    console.log('distinct : ', watches.length);
    process.exit(0);
})();