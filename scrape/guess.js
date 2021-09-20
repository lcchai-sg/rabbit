const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

(async () => {
    const urls = [
        "https://www.guess.com/us/en/women/accessories/watches/view-all?start=0&sz=1000",
        "https://www.guess.com/us/en/men/accessories/watches/view-all?start=0&sz=1000",
    ];
    try {
        const result = [];
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        for (let i = 0; i < urls.length; i++) {
            const gender = urls[i].match(/women/i) ? 'F' : 'M';
            await page.goto(urls[i], { waitUntil: ['load', 'domcontentloaded', 'networkidle0', 'networkidle2'] });
            const data = await page.evaluate(() => document.body.innerHTML);
            const $ = cheerio.load(data);
            $('.product-grid__column').each((idx, el) => {
                $('.product').each((idx, el) => {
                    const reference = $(el).attr('data-variant-id');
                    const thumbnail = $(el).find('img').first().attr('data-src');
                    const url = $(el).find('a').attr('href');
                    const name = $(el).find('img').first().attr('alt');
                    const p = $(el).find('.price').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
                    let price;
                    let retail;
                    if (p.match(/sale/i)) {
                        let pp = p.split('Sale');
                        price = pp[0].trim();
                        retail = pp[1].trim();
                    } else {
                        price = p;
                        retail = p;
                    }
                    result.push({
                        url, name, reference,
                        gender, price, retail, thumbnail,
                    });
                });
                // let productData = $(el).find('.pdp-link.product-tile__pdp-link a').attr('data-gtm');
                // console.log('productData : ', productData);
                // if (productData) {
                //     productData = JSON.parse(productData);
                //     let productArr = productData && productData["ecommerce"] && productData["ecommerce"]["click"] && productData["ecommerce"]["click"]["products"] ? productData["ecommerce"]["click"]["products"] : [];
                //     if (productArr.length > 0) {
                //         let product = productArr[0];
                //         if (product) {
                //             const reference = product.id && product.id.split("-")[0] ? product.id.split("-")[0] : '';
                //             const price = product.price ? product.price : '0';
                //             const amount = parseFloat(price);
                //             results.push({ reference, amount });
                //         }
                //     }
                // }
            })
        }
        browser.close();
        result.forEach(r => { console.log(r); })
    } catch (error) {
        console.error(error);
    }
    console.log();
    console.log('done.....');
})()