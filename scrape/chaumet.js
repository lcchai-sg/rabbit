const sitemapper = require('sitemapper');
const axios = require('axios');
const cheerio = require('cheerio');

const xmlIndexing = async context => {
    const { entry, base, } = context;
    const baseURL = base ? base : "https://www.chaumet.com/en";
    const source = "official";
    const lang = "en";
    const brand = "Chaumet";
    const brandID = 408;
    const result = { source, lang, brand, brandID, collections: [], items: {} };
    try {
        const sitemap = new sitemapper({
            url: entry,
            timeout: 300000,
        });
        const d = await sitemap.fetch();
        d.sites.forEach(url => {
            if (url.match(/watches\/collections/i)) {
                // collections
                // https://www.chaumet.com/en/watches/collections/liens
                const uu = url.split('/');
                if (uu.length >= 7)
                    if (result.collections.indexOf(uu[6]) < 0) {
                        result.collections.push(uu[6].toUpperCase());
                        result.items[uu[6].toUpperCase()] = [];
                    }
            } else if (url.match(/-watches-/i)) {
                // product
                // https://www.chaumet.com/en/hortensia-eden-watches-w20611-20mm
                // first word is collection?
                const w = url.split('/');
                const ww = w[w.length - 1].split('-');
                const reference = ww[ww.length - 2];
                const collection = ww[0].toUpperCase();
                const name = ww.join(' ').toUpperCase();
                if (result.collections.indexOf(collection) < 0) {
                    result.collections.push(collection);
                    result.items[collection] = [];
                }
                result.items[collection].push({
                    source, lang, brand, brandID, url, collection, name, reference,
                    retail: null, thumbnail: null,
                })
            }
        })
        return result;
    } catch (error) {
        console.error("Error indexing for Chaumet with error : ", error);
        console.error("entry : ", entry);
        return {}
    }
}

const indexing = async context => {
    const { client, entry, base, interval, } = context;
    const baseURL = base ? base : "https://www.chaumet.com";
    const source = "official";
    const lang = "en";
    const brand = "Chaumet";
    const brandID = 408;
    const result = { source, lang, brand, brandID, collections: [], items: {} };
    const cats = [];
    try {
        const { data } = await client.get(entry);
        const $ = cheerio.load(data);
        $(".items__collections").find("li").each((idx, el) => {
            const url = $(el).find("a").attr("href");
            const u = url.split('/');
            if (u.length === 7) {
                const name = $(el).find("a").first().text();
                cats.push({ name, url });
            }
        })
        // console.log(cats);
        for (const cat of cats) {
            console.log(cat.url);
            const { data } = await client.get(cat.url);
            const $ = cheerio.load(data);
            $(".c-product-card").each((idx, el) => {
                const thumbnail = $(el).find(".product__img").attr("data-src").split("?")[0];
                const url = $(el).find(".product__name").attr("href");
                const name = $(el).find(".product__name").text().replace(/\s+/g, ' ').trim();
                const u = url.split('/');
                const uu = u[u.length - 1].split('-');
                const reference = (uu[uu.length - 2] + "-" + uu[uu.length - 1]).toUpperCase();
                if (result.collections.indexOf(cat.name) < 0) {
                    result.collections.push(cat.name);
                    result.items[cat.name] = [];
                }
                result.items[cat.name].push({
                    source, lang, brand, brandID, url, collection: cat.name,
                    name, reference, thumbnail, retail: null,
                })
            })
            await new Promise(r => setTimeout(r, interval));
        }
        return result;
    } catch (error) {
        console.error("Error indexing for Chaumet with error : ", error);
        console.error("entry : ", entry);
        return {}
    }
}

const extraction = async context => {
    const { client, entry, base, ...rest } = context;
    const result = { ...rest, url: entry, spec: [], variations: [], };
    result.source = "official";
    result.lang = "en";
    result.brand = "Chaumet";
    result.brandID = 408;
    try {
        const { data } = await client.get(entry);
        const $ = cheerio.load(data);
        result.name = $('meta[property="og:title"]').attr('content');
        result.description = $('meta[property="og:description"]').attr('content');
        result.thumbnail = $('meta[property="og:image"]').attr('content').split("?")[0];
        result.reference = $(".product__reference").text().replace(/reference ?:/i, '').trim();
        result.description = $(".information__content").text().replace(/\s+/g, ' ').trim();
        $(".informations-block").each((idx, el) => {
            const clazz = $(el).find("span").text().replace(/\s+/g, ' ').trim();
            $(el).find("tbody").each((idx, el) => {
                const key = $(el).find("th").text().replace(/\s+/g, ' ').trim();
                const value = $(el).find("td").text().replace(/\s+/g, ' ').trim();
                if (value) result.spec.push({ clazz, key, value });
            })
        })
        $(".declinaisons-product").first().find(".c-product-card__info").each((idx, el) => {
            const u = $(el).find("a").attr("href").split("/");
            const uu = u[u.length - 1].split("-");
            const ref = (uu[uu.length - 2] + "-" + uu[uu.length - 1]).toUpperCase();
            result.variations.push(ref);
        })
    } catch (error) {
        console.error("Error in extraction for Chaumet with error : ", error);
        console.error("entry : ", entry);
        if (error.response) result.code = error.response.status;
        else result.code = "UNKNOWN ERROR";
    }
    return result;
}

(async () => {
    const r = await indexing({
        // entry: "https://www.chaumet.com/sitemaps/sitemap_en.xml",
        base: "https://www.chaumet.com",
        entry: "https://www.chaumet.com/en/watches/collections",
        client: axios,
    });
    // console.log(r);
    // let cnt = 0; const uniq = [];
    // r.collections.forEach(c => {
    //     r.items[c].forEach(w => {
    //         if (uniq.indexOf(w.url) < 0) uniq.push(w.url);
    //         console.log(w);
    //         cnt++;
    //     });
    // });
    // console.log();
    // console.log('total : ', cnt);
    // console.log('uniq : ', uniq.length);

    for (let i = 0; i < r.collections.length; i++) {
        const c = r.collections[i];
        for (let j = 0; j < r.items[c].length; j++) {
            const ex = await extraction({
                client: axios,
                entry: r.items[c][0].url,
                ...r.items[c][0],
            });
            // console.log(ex);
            ex.spec.forEach(s => console.log(s.clazz + ' | ' + s.key + ' | ' + s.value));
            // console.log();
            console.log();
        }
    }

    console.log();
    console.log('done.');
    process.exit(0);
})();