const axios = require('axios');
const cheerio = require('cheerio');

(async () => {
    const e = "https://www.bremont.com/collections/ladies-watches/products/solo-34-lady-k-white/?currency=eur";
    // console.log(e); console.log();
    const { data } = await axios.get(e);
    console.log(data);
    // const $ = cheerio.load(data);
    // $('script[type="application/json"]').each((idx, el) => {
    //     const d = $(el).contents().toString();
    //     console.log(idx, d)
    //     if (d.match(/Product/i)) {
    //         const j = JSON.parse(d);
    //         console.log(j)
    //         if (j['@type'] === "Product") {
    //             const reference = j.sku ? j.sku : null;
    //             console.log('reference : ', reference)
    //         }
    //     }
    // })
    const sku = data.match(/"sku": ".*"/ig);
    console.log('sku : ', sku)
    const s = sku ? sku[0].split(":")[1].replace(/"/g, "").trim() : null;
    console.log('reference: ', s);
})()