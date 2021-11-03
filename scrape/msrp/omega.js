const cheerio = require("cheerio");
const fetch = require("node-fetch");
const urls = [
    "https://www.omegawatches.com/watchfinder",                     // sgp, dnk
    "https://www.omegawatches.com/en-us/watchfinder",
    "https://www.omegawatches.com/en-gb/watchfinder",
    "https://www.omegawatches.com/de-de/watchfinder",
    "https://www.omegawatches.com/fr-fr/watchfinder",
    "https://www.omegawatches.com/it-it/watchfinder",
    "https://www.omegawatches.jp/watchfinder",
];

(async () => {
    try {
        const u = urls[6];
        const res = await fetch(u);
        const html = await res.text();
        const $ = cheerio.load(html);
        const w = $(".ow-filters__counter").first().find("span").text();
        const np = Math.ceil(parseInt(w) / 24);
        console.log(`w : ${w}      np : ${np}`);
        console.log();
        const link = u + "?p=" + np;
        console.log(link);
        const res1 = await fetch(link);
        const html1 = await res1.text();
        const $$ = cheerio.load(html1);
        let cnt = 0;
        $$('script[type="application/ld+json"]').each((idx, el) => {
            const content = $$(el).contents();
            const data = JSON.parse(content[0].data);
            if (data['@type'] === 'Product') {
                const amount = parseFloat(data.offers && data.offers.price ? data.offers.price : '0');
                console.log({ reference: data.sku, amount });
                cnt++;
            }
        });
        console.log();
        console.log(`cnt : ${cnt}`);
    } catch (error) {
        console.log('Failed MSRP scraping for Omega with error : ', error);
    }
})()

