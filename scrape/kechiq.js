const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const cUrl = "https://kechiq.com/brands";
const urls = [
    "https://kechiq.com/man",
    "https://kechiq.com/woman",
    "https://kechiq.com/luxury",
];

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

const sleep = async (interval) => {
    await new Promise(r => setTimeout(r, interval));
}

const cIndexing = async context => {
    const { client, entry, base } = context;
    // {
    //     const { data } = await client.get(entry);
    //     const $ = cheerio.load(data);
    //     console.log('axios : ', data);
    //     console.log();
    //     console.log();
    // }
    {
        let cnt = 0;
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        for (const u of urls) {
            await page.goto(u, { waitUntil: ['load', 'domcontentloaded', 'networkidle0', 'networkidle2'] });
            await autoScroll(page);
            let loadMore = true;
            while (loadMore) {
                const btn = '.btn_landing.line.primary.loading';
                if (await page.$(btn) !== null) {
                    await page.click(btn);
                    await sleep(3000);
                } else {
                    loadMore = false;
                }
                await autoScroll(page);
                // const selector = '.load-more-element nav.loadMoreProductsButton';
                // if (await page.$(selector) !== null) {
                //     const hiddenSelector = '.load-more-element nav.loadMoreProductsButton.hidden';
                //     if (await page.$(hiddenSelector) !== null) {
                //         loadMore = false;
                //     } else {
                //         await page.click(selector);
                //     }  
                // }else{
                //     loadMore = false;
                // };
                // const agreeSelector = '#footer_tc_privacy_container_button button.tc-reset-css.tc-privacy-button';
                // if((await page.$(agreeSelector)) !== null) {
                //     await page.click(agreeSelector);
                // }
                // await sleep(4000);
            }

            const data = await page.evaluate(() => document.body.innerHTML);
            // console.log(data);
            const $ = cheerio.load(data);
            $(".main_global_grid").find(".item_content").each((idx, el) => {
                const href = $(el).find("a").attr("href");
                if (href) {
                    const img = $(el).find(".product_image").attr("style");
                    const imgu = img ? img.split("url")[1].replace(/\(|\)|"|,|;/g, "") : img;
                    const name = $(el).find(".product_name").text();
                    const price = $(el).find(".price").text();
                    const retail = $(el).find(".discount").text();
                    console.log({ href, imgu, name, price, retail });
                    cnt++
                }
            })
        }
        browser.close();
        console.log();
        console.log();
        console.log('total : ', cnt);
    }
}

(async () => {
    const r = await cIndexing({})
    console.log();
    console.log();
    console.log('done.....');
})()