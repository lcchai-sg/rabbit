const cheerio = require("cheerio");
const fetch = require('cross-fetch');
const urls = [
    "https://www.longines.com/en-us/watches/selector",
    "https://www.longines.com/jp/watches/selector",
    "https://www.longines.com/hk/watches/selector",
    "https://www.longines.com/en-gb/watches/selector",
    "https://www.longines.com/de/uhren/uhrenauswahl",
    "https://www.longines.com/fr/montres/selecteur",
    "https://www.longines.com/it/orologi/selettore",
];


(async () => {
    const res = await fetch(urls[0]);
    const html = await res.text();
    const $ = cheerio.load(html);
    const count = parseInt($(".lg-cat__top-count").text().split(" ")[0]);
    const tc = Math.ceil(count / 18) + 1;
    console.log(`tc : ${tc}`);
    for (let i = 1; i <= tc; i++) {
        const link = urls[0] + "?p=" + i;
        console.log(link);
        await new Promise(r => setTimeout(r, 3000));
        const res = await fetch(link);
        const html = await res.text();
        const $ = cheerio.load(html);
        $(".product-list-grid").find("li").each((idx, el) => {
            const reference = $(el).find('.lg-prod__collection').last().text().replace(/\s+/g, ' ').trim();
            const amt = $(el).find('.price-container').find('span').first().attr('data-price-amount');
            console.log({ reference, amt });
            // if (amt) {
            //     const amount = parseFloat(amt);
            //     console.log({ reference, amount });
            // }
        });
    }
})()
