const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
// const e = "https://www.cartier.com/fr-fr/montres";
const e = "https://www.cartier.com/de-de/uhren/uhrenkollektion/tank";
const results = [];
const cats = [];

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(e, { waitUntil: ['load', 'domcontentloaded', 'networkidle0', 'networkidle2'] });
    await autoScroll(page);
    const data = await page.evaluate(() => document.body.innerHTML);
    const $ = cheerio.load(data);
    let moredata = true;
    do {
        $(".product-slot.slot-element").each((idx, el) => {
            const d = $(el).attr("data-ytos-track-product-data");
            if (d) {
                const j = JSON.parse(d);
                const reference = j.product_mfPartNumber ? j.product_mfPartNumber : null;
                const price = j.product_discountedPrice ? j.product_discountedPrice : null;
                const name = j.title ? j.title : null;
                console.log({ name, reference, price });
            }
        })
        const btn = ".loadMoreProductsButton";
        if (await page.$(btn) !== null) {
            const np = $(btn).find("a").attr("href");
            console.log(`next : ${np}`);
            await page.click(btn);
        } else moredata = false;
    } while (moredata)

    console.log('total : ', results.length);
    results.forEach(r => { console.log(r) })
})()

const autoScroll = async (page) => {
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 100;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;
                if (totalHeight >= scrollHeight) {
                    window.scrollBy(0, -2 * distance);
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}