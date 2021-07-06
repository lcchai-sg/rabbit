const axios = require('axios');
const cheerio = require('cheerio');

(async () => {
    const baseUrl = "https://www.armani.com";
    const e = "https://www.armani.com/sg/armanicom/emporio-armani/all-watches";
    let next = e;
    do {
        console.log(next);
        await new Promise(r => setTimeout(r, 5000));
        const { data } = await axios.get(next);
        const $ = cheerio.load(data);
        let cnt = 0;
        $(".item").each((idx, el) => {
            const d = $(el).attr("data-ytos-track-product-data").replace(/&quot;/g, '"');
            const j = d ? JSON.parse(d) : null;
            const reference = j ? j.product_cod10 : null;
            const amount = j ? j.product_price : null;
            if (reference && amount) {
                console.log({ reference, amount });
                cnt++;
            }
        })
        next = $('link[rel="next"]').attr("href")
        if (next) next = baseUrl + next;
    } while (next);
    console.log(`watches : ${cnt}`);
    console.log('done.')
})();