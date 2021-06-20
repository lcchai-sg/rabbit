const axios = require('axios');
const puppeteer = require('puppeteer');

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

(async () => {
    const u = [
        "https://www.hermes.com/sg/en/category/watches/men/#||Category",
        "https://www.hermes.com/us/en/product/arceau-78-watch-40mm-W047360WW00/",
        "https://www.hermes.com/us/en/product/arceau-cavales-watch-28mm-W045231WW00/",
        "https://www.hermes.com/us/en/product/arceau-cavales-watch-28mm-W045726WW00/",
        "https://www.hermes.com/us/en/product/arceau-chronographe-watch-41mm-W045779WW00/",
        "https://www.hermes.com/us/en/product/arceau-chronographe-watch-41mm-W045780WW00/",
    ];

    const cfg = { headers: { 'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148' } };

    // const { data } = await axios.get(u[2], cfg);
    // console.log(data);

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(u[3]);
    await autoScroll(page);
    const data = await page.evaluate(() => document.body.innerHTML);
    console.log(data);
    await browser.close()
    process.exit(0);
})();