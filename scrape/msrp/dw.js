const fetch = require('cross-fetch');
const cheerio = require('cheerio');

(async () => {
    // const e = "https://www.danielwellington.com/tw/watches/";
    // const e = "https://www.danielwellington.com/sg/watches";
    // const e = "https://www.danielwellington.com/us/watches";
    // const e = "https://www.danielwellington.com/ca/watches";
    // const e = "https://www.danielwellington.com/dk/watches";
    // const e = "https://www.danielwellington.com/fr/watches";
    // const e = "https://www.danielwellington.com/de/watches";
    // const e = "https://www.danielwellington.com/it/watches";
    const e = "https://www.danielwellington.com/jp/watches";
    // const e = "https://www.danielwellington.com/uk/watches";
    // const e = "https://www.danielwellington.com/hk_en/watches";
    let cnt = 0;
    const res = await fetch(e);
    const data = await res.text();
    const $ = cheerio.load(data);
    $("#maincontent").find("li").each((idx, el) => {
        const reference = $(el).find("a").first().attr("data-id");
        let price = "";
        $(el).find("span").each((idx, el) => {
            if ($(el).attr("data-test-id") === "price") {
                price = $(el).text();
            }
        })
        const amount = price ? parseFloat(price.replace(/CAD|(税込)|￥|HKD|NT|SGD|£|\$|\.|,/ig, "").trim()) : null;
        if (reference) {
            console.log({ reference, amount, price });
            cnt++;
        }
    })
    console.log('total : ', cnt);
})();