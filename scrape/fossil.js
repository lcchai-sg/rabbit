const sitemapper = require('sitemapper');
const axios = require('axios');
const cheerio = require('cheerio');

const indexing = async context => {
    const { entry, } = context;
    const source = "official";
    const lang = "en";
    const brand = "Fossil";
    const brandID = 350;
    const result = { source, lang, brand, brandID, collections: ['all'], items: { 'all': [] } };
    try {
        const sitemap = new sitemapper({
            url: entry,
            timeout: 300000,
        });
        const d = await sitemap.fetch();
        d.sites.sort().forEach(url => {
            if (url.match(/product/i) && url.match(/-watch\b/i) && !(url.match(/watch-strap|bands-for/i))) {
                const u = url.split('/');
                const reference = u[u.length - 1].replace(".html", "").trim();
                const name = u[u.length - 2].split("-").join(" ").toUpperCase();
                result.items['all'].push({
                    source, lang, brand, brandID, url, name, reference, retail: null,
                })
            }
        })
        return result;
    } catch (error) {
        console.error('Failed indexing for Fossil with error : ', error);
        return {};
    }
}

const extraction = async context => {
    const { client, entry, base, ...rest } = context;
    if (!rest.source) rest.source = "official";
    if (!rest.lang) rest.lang = "en";
    if (!rest.brand) rest.brand = "Fossil";
    if (!rest.brandID) rest.brandID = 350;
    const result = { ...rest, url: entry, spec: [], related: [], };
    try {
        const { data } = await client.get(entry);
        const $ = cheerio.load(data);
        $('script[type="application/ld+json"]').each((idx, el) => {
            const d = $(el).contents().toString().replace(/&lt;br&gt;/ig, "");
            if (d.match(/"@type": "Product"/)) {
                const n = d.match(/"name": ".*"/g)[0];
                result.name = JSON.parse(n.split(":")[1]);
                const dd = d.match(/"description": ".*"/g);
                const desc = dd ? dd[0] : d.match(/"description": ".*(\n)?.*"/g)[0];
                result.description = JSON.parse(desc.split(":")[1].replace(/\n/g, ''));
                const ref = d.match(/"sku": ".*"/g)[0];
                result.reference = JSON.parse(ref.split(":")[1]);
                const image = d.match(/"image": \[".*"\]/g);
                const img = image ? image[0].split(":") : null;
                if (img) result.thumbnail = JSON.parse(img.slice(1, img.length).join(":"))[0];
                const curr = d.match(/"priceCurrency": ".*"/g);
                const currency = curr ? JSON.parse(curr[0].split(":")[1]) : null;
                const lprice = d.match(/"lowPrice": ? ?\d{0,6}.?\d{2}/g);
                const lowPrice = lprice ? lprice[0].split(":")[1] : null;
                if (lowPrice) result.price = currency + ' ' + lowPrice;
                const hprice = d.match(/"highPrice": ? ?\d{0,6}.?\d{2}/g);
                const highPrice = hprice ? hprice[0].split(":")[1] : null;
                if (highPrice) result.retail = currency + ' ' + highPrice;
                const prc = d.match(/"price": ? ?\d{0,6}.?\d{2}/g);
                const price = prc ? prc[0].split(":")[1] : null;
                if (price) result.price = result.retail = currency + ' ' + price;
            }
        })
        $(".description-and-detail").find(".attribute").each((idx, el) => {
            const key = $(el).find(".label").text().trim();
            const value = $(el).find(".value").text().trim();
            result.spec.push({ key, value });
        })
    } catch (error) {
        console.error('Failed extraction for Fossil with error : ', error);
        console.error('entry : ', entry);
        if (error.response) result.code = error.response.status;
        else result.code = 'UNKNOWN ERROR';
    }
    return result;
}

(async () => {
    const r = await indexing({
        entry: "https://www.fossil.com/en-us/sitemap_index.xml",
        base: "https://www.fossil.com/en-us",
    });

    // const rr = [
    //     'https://www.fossil.com/en-us/products/classic-minute-three-hand-stainless-steel-watch/BQ3455.html',
    //     'https://www.fossil.com/en-us/products/fenmore-midsize-multifunction-black-leather-watch/BQ2364.html',
    //     'https://www.fossil.com/en-us/products/fenmore-midsize-multifunction-brown-leather-watch/BQ2404.html',
    //     'https://www.fossil.com/en-us/products/fenmore-midsize-multifunction-navy-stainless-steel-watch/BQ2403.html',
    //     'https://www.fossil.com/en-us/products/kerrigan-mini-three-hand-rose-gold-tone-stainless-steel-watch/BQ3443.html',
    //     'https://www.fossil.com/en-us/products/kerrigan-mini-three-hand-stainless-steel-watch/BQ3445.html',
    // ];

    // for (let i = 0; i < rr.length; i++) {
    //     const ex = await extraction({
    //         client: axios,
    //         entry: rr[i],
    //         base: "https://www.fossil.com/en-us",
    //     });
    //     console.log(ex);
    // }

    for (let i = 0; i < r.items['all'].length; i++) {
        const ex = await extraction({
            ...r.items['all'][i],
            entry: r.items['all'][i].url,
            client: axios,
            base: "https://www.fossil.com/en-us",
        })
        ex.spec.forEach(s => {
            console.log(s.key, ' | ', s.value);
        })
    }
})();