const cheerio = require("cheerio");
const fetch = require('cross-fetch');
const axios = require('axios');
const u = [
    "https://www.guess.com/us/en/men/accessories/watches/view-all?start=0&sz=1000",
    "https://www.guess.com/us/en/women/accessories/watches/view-all?start=0&sz=1000",
];
const results = [];
const cfg = { headers: { 'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/91.0.4472.80 Mobile/15E148 Safari/604.1' } };
const puppeteer = require('puppeteer');

(async () => {
    for (let i = 0; i < u.length; i++) {
        console.log(u[i]);
        try {
            // const res = await fetch(u[i]);
            // const html = await res.text();
            // const $ = cheerio.load(html);
            // const { data } = await axios.get(u[i], cfg);
            // console.log(data);
            const browser = await puppeteer.launch({ headless: false });
            const page = await browser.newPage();
            await page.goto(u[i], { waitUntil: ['load', 'domcontentloaded', 'networkidle0', 'networkidle2'] });
            const data = await page.evaluate(() => document.body.innerHTML);
            console.log(data);
            const $ = cheerio.load(data);
            $('.product-grid__column').each((idx, el) => {
                let productData = $(el).find('.pdp-link.product-tile__pdp-link a').attr('data-gtm');
                if (productData) {
                    productData = JSON.parse(productData);
                    let productArr = productData && productData["ecommerce"] && productData["ecommerce"]["click"] && productData["ecommerce"]["click"]["products"] ? productData["ecommerce"]["click"]["products"] : [];
                    if (productArr.length > 0) {
                        let product = productArr[0];
                        if (product) {
                            const reference = product.id && product.id.split("-")[0] ? product.id.split("-")[0] : '';
                            const price = product.price ? product.price : '0';
                            const amount = parseFloat(price);
                            results.push({ reference, amount });
                        }
                    }
                }
            })
        } catch (error) {
            console.log(error);
        }
    }
    console.log('results : ', results.length);
    results.forEach(r => { console.log(r); });
    console.log();
    console.log('done.....');
    process.exit(0);
})();
