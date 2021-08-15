const cheerio = require("cheerio");
const fetch = require('cross-fetch');
const urls = [
    // "https://www.breitling.com/jp-en/watches/all/?search%5Bsorting%5D=default",
    // "https://www.breitling.com/hk-zht/watches/all/?search%5Bsorting%5D=default",
    // "https://www.breitling.com/sg-en/watches/all/?search%5Bsorting%5D=default",
    // "https://www.breitling.com/us-en/watches/all/?search%5Bsorting%5D=default",
    // "https://www.breitling.com/dk-en/watches/all/?search%5Bsorting%5D=default",
    // "https://www.breitling.com/ca-en/watches/all/?search%5Bsorting%5D=default",
    // "https://www.breitling.com/tw-en/watches/all/?search%5Bsorting%5D=default",
    // "https://www.breitling.com/de-en/watches/all/?search%5Bsorting%5D=default",
    // "https://www.breitling.com/fr-en/watches/all/?search%5Bsorting%5D=default",
    // "https://www.breitling.com/it-en/watches/all/?search%5Bsorting%5D=default",
    // "https://www.breitling.com/gr-en/watches/all/?search%5Bsorting%5D=default",
    // "https://www.breitling.com/gb-en/watches/all/?search%5Bsorting%5D=default",
    // "https://www.breitling.com/gb-en/watches/all/?filter=1",
    // "https://www.breitling.com/gr-en/watches/all/?filter=1",
    // "https://www.breitling.com/it-en/watches/all/?filter=1",
    // "https://www.breitling.com/fr-en/watches/all/?filter=1",
    // "https://www.breitling.com/de-en/watches/all/?filter=1",
    // "https://www.breitling.com/tw-en/watches/all/?filter=1",
    // "https://www.breitling.com/ca-en/watches/all/?filter=1",
    // "https://www.breitling.com/dk-en/watches/all/?filter=1",
    // "https://www.breitling.com/us-en/watches/all/?filter=1",
    // "https://www.breitling.com/sg-en/watches/all/?filter=1",
    // "https://www.breitling.com/hk-zht/watches/all/?filter=1",
    "https://www.breitling.com/jp-en/watches/all/?filter=1",
];
let results = [];

(async () => {
    let cnt = 0; let pg = 1;
    do {
        cnt = 0;
        const u = urls[0] + "&page=" + pg;
        console.log(u);
        const res = await fetch(u);
        const data = await res.text();
        const $ = cheerio.load(data);
        $(".content-blocks-watch-in-list").each((idx, el) => {
            const reference = $(el).find(".price").first().text().trim();
            const price = $(el).find(".price").last().text();
            const amount = parseFloat(price.replace(/¥|£|€|HKD|SGD|USD|DKK|CAD|TWD|\$| |,|\./g, '').trim());
            // console.log({ reference, amount, price });
            results.push({ reference, amount, price });
            cnt++;
        })
        pg++;
    } while (cnt >= 21)
    results && results.forEach(r => { console.log(r) });
    console.log('total : ', results.length);
})();
