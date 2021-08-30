const axios = require('axios');
const cheerio = require('cheerio');
const e = "https://www.cartier.com/fr-fr/montres";
const results = [];
const cats = [];

(async () => {
    const { data } = await axios.get(e);
    const $ = cheerio.load(data);
    $(".shelf-element__btn").each((idx, el) => {
        const href = $(el).find("a").attr("href");
        cats.push(href);
    })
    console.log('cats : ', cats.length);
    for (const cat of cats) {
        await new Promise(r => setTimeout(r, 2000));
        const c = cat.split('/');
        const col = c[c.length - 1];
        let pg = 1; let cnt = 0;
        do {
            cnt = 0;
            const link = cat + "?page=" + pg;
            console.log(link);
            const { data } = await axios.get(link);
            const $ = cheerio.load(data);
            $(".product-slot.slot-element").each((idx, el) => {
                const d = $(el).attr("data-ytos-track-product-data");
                const j = JSON.parse(d);
                const name = j.product_title;
                const reference = j.product_cod10 ? j.product_cod10 : j.product_cod8 ? j.product_cod8 : null;
                const amount = j.product_discountedPrice ? parseFloat(j.product_discountedPrice) : j.price ? parseFloat(j.price) : null;
                results.push({ col, name, reference, amount });
                cnt++;
            })
            pg++;
        } while (cnt >= 24);
    }
    console.log('total : ', results.length);
    results.forEach(r => { console.log(r) })
})()