const axios = require('axios');
const cheerio = require("cheerio");
const urls = [
    "https://shop.diesel.com/en/mens/watches",
    "https://shop.diesel.com/en/womens/watches",
    "https://shop.diesel.com/en/smartwatches",
    "https://shop.diesel.com/en/women/watches/smartwatches",
];

(async () => {
    const cfg = {
        proxy: {
            host: 'usvpn.tell.com',
            port: 3128,
            auth: {
                username: 'proxyclient',
                password: '4uFra6iTrAw1Pr',
            }
        }
    }
    for (const u of urls) {
        let next = u;
        let $; let d;
        do {
            const { data } = await axios.get(next);
            d = data;
            // const { data } = await axios.get(next, cfg);
            $ = cheerio.load(data);
            next = $(".pagination__holder").find("form").attr("action");
            console.log(`next : ${next}`);
            await new Promise(r => setTimeout(r, 3000));
        } while (next);
        console.log(d);
        console.log();
        console.log();
        $(".product").each((idx, el) => {
            const reference = $(el).attr("data-pid");
            const p = $(el).find(".price").text();
            const price = $(el).find(".product-tile-body__price").first().text().replace(/\$|€|£|DKK|C\$|,|\./ig, '').trim();
            const amount = parseFloat(price) / 100;
            console.log(`reference : ${reference}     amount : ${amount}`);
        })
    }
})()

