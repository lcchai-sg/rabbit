const fetch = require('cross-fetch');
const target = "https://festina.com/sitemaps/sitemap-watches-it-IT.xml";
const sleep = async t => {
    await new Promise(r => setTimeout(r, t));
}

(async () => {
    try {
        const res = await fetch(target);
        const data = await res.text();
        const d = data.match(/https:\/\/[\w/\-?=%.]+\.[\w/\-&?=%.]+/ig);
        console.debug('total : ', d.length);
        for (let i = 0; i < d.length; i++) {
            if (i > 0 && i % 100 === 0) logger.debug(`processing ${i} / ${d.length}`);
            await sleep(2000);
            const res = await fetch(d[i]);
            const data = await res.text();
            const sku = data.match(/"sku": ".*"/ig);
            const reference = sku ? sku[0].split(":")[1].replace(/"/g, "").trim() : null;
            const price = data.match(/"price": \d{0,5}/ig);
            const amount = price ? parseFloat(price[0].split(":")[1]) : null;
            // results.push({ reference, amount });
            console.log({ reference, amount });
        }
    } catch (error) {
        console.error('Failed MSRP scraping for Festina with error : ', error);
    }
})()