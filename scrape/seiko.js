const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const entry = "https://www.casio-intl.com/hk/zh/wat/search/watch/";

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(entry, { timeout: 0, waitUntil: ['load', 'domcontentloaded', 'networkidle0', 'networkidle2'] });
    let data = await page.evaluate(() => document.body.innerHTML);
    let $ = cheerio.load(data);
    let next = true; let cnt = 0; let pg = 1;
    while (next) {
        console.log(`page : ${pg}`);
        $(".model-list").find(".column").each((idx, el) => {
            const reference = $(el).find("h3").text();
            const price = $(el).find("p").text();
            const amount = parseFloat(price ? price.replace(/HK|\$|,/g, "") : null);
            cnt++;
            console.log({ reference, price, amount });
        })
        const lnk = $(".control.js-next").attr("class");
        if (!lnk.match(/disable/i)) {
            await page.click(".control.js-next");
            pg++;
            data = await page.evaluate(() => document.body.innerHTML);
            $ = cheerio.load(data);
        } else next = false;
    }
    console.log();
    console.log(`total : ${cnt}`);
    await browser.close();
    console.log('done..........');
})();