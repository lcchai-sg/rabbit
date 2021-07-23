const axios = require('axios');
const cheerio = require('cheerio');

(async () => {
    // const e = "https://us.alpinawatches.com/collections/alpiner";
    const e = "https://alpinawatches.com/collections/alpiner";
    let next = e;
    do {
        console.log(next);
        const { data } = await axios.get(next);
        const $ = cheerio.load(data);
        // $(".ProductItem__Info").each((idx, el) => {
        //     const href = $(el).find("a").attr("href").split("/");
        //     const reference = href[href.length - 1].toUpperCase();
        //     const price = $(el).find(".ProductItem__Price").text();
        //     console.log('price : ', price)
        //     const amount = parseFloat(price.replace(/\$|chf|,|'/g, '').trim());
        //     console.log({ reference, amount });
        // })
        try {
            $(".bold-product-json").each((idx, el) => {
                const d = $(el).contents();
                const j = JSON.parse(d);
                const v = j && j.variants ? j.variants : null;
                if (v) {
                    const vv = v.filter(x => x.title === 'ch');
                    if (vv) console.log({ reference: vv[0].sku, amount: vv[0].price / 100 });
                }
            })
        } catch (error) {
            console.log(error);
        }
        next = $('link[rel="next"]').attr("href");
        if (next) next = "https://alpinawatches.com" + next;
    } while (next);

    console.log();
    console.log('done.')
})();

