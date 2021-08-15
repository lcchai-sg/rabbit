const fetch = require('cross-fetch');
const cheerio = require('cheerio');
//no msrp
//https://www.nixon.com/sg/en/mens-watches
//https://www.nixon.com/sg/en/womens-watches
//https://www.nixon.com/hk/en/mens-watches
//https://www.nixon.com/hk/en/womens-watches



const urls = [
    // "https://www.nixon.com/us/en/mens-watches",
    // "https://www.nixon.com/us/en/womens-watches",
    // "https://www.nixon.com/uk/en/womens-watches",
    // "https://www.nixon.com/uk/en/mens-watches",
    // "https://www.nixon.com/ca/en/mens-watches",
    // "https://www.nixon.com/ca/en/womens-watches",
    // "https://www.nixon.com/dk/en/mens-watches",
    // "https://www.nixon.com/dk/en/womens-watches",
    // "https://www.nixon.com/it/en/mens-watches",
    // "https://www.nixon.com/it/en/womens-watches",
    // "https://www.nixon.com/gr/en/mens-watches",
    // "https://www.nixon.com/gr/en/womens-watches",
    // "https://www.nixon.com/de/de/herrenuhrender", // men
    // "https://www.nixon.com/de/de/damenuhren", // women
    "https://www.nixon.com/jp/ja/womens-watches",
    "https://www.nixon.com/jp/ja/mens-watches",

];
const results = [];

(async() => {
    const config = { headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_0_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.66 Safari/537.36' } };
    for (const u of urls) {
        let next = u;
        do {
            console.log(next);
            const res = await fetch(next, config);
            const data = await res.text();
            console.log(data);
            const $ = cheerio.load(data);
            $(".product-tile-swatch_link").each((idx, el) => {
                const href = $(el).attr("href");
                const h = href.split("/");
                const reference = h[h.length - 1].replace(/\.html/i, "");
                const price = $(el).find("img").attr("data-pricing");
                const prc = price ? price.match(/\d{0,3}[.,]?\d{2,3}[.,]?\d{0,2}/ig) : null; //(£|\$)
                let amount = prc ? parseFloat(prc[0].replace(/£|\$|\.|,/g, '')) : null;
                if (amount && !isNaN(amount)) amount = amount / 100;
                console.log({ reference, amount, price });
                results.push({ reference, amount });
            })
            next = $("#search-result-items").attr("data-grid-url");
        } while (next);
    }
    console.log();
    console.log(`total : ${results.length}`);
})();