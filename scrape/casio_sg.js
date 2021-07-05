const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

(async () => {
    async function autoScroll(page) {
        await page.evaluate(async () => {
            await new Promise((resolve, reject) => {
                var totalHeight = 0;
                var distance = 100;
                var timer = setInterval(() => {
                    var scrollHeight = document.body.scrollHeight;
                    window.scrollBy(0, distance);
                    totalHeight += distance;

                    if (totalHeight >= scrollHeight) {
                        clearInterval(timer);
                        resolve();
                    }
                }, 100);
            });
        });
    }

    const e = "https://www.casio.com/sg/watches/";
    const browser = await puppeteer.launch();
    const page = browser.newPage();
    await page.goto(e);
    await autoScroll(page);

    $(".cmp-product_panel_list__item").each((idx, el) => {
        const reference = $(el).find(".cmp-product_panel__code").text().trim();
        const price = $(el).find(".cmp-product_panel__price-txt").text();
        const amount = price ? parseFloat(price.split('$')[1]) : null;
        console.log({ reference, amount });
    })

    browser.close();
    console.log('done.');
})();