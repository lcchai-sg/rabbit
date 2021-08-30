const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const cUrl = "https://kechiq.com/brands";
const urls = [
    "https://kechiq.com/man",
    "https://kechiq.com/woman",
    "https://kechiq.com/luxury",
];

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
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        for (const u of urls) {
            await page.goto(u, { waitUntil: ['load', 'domcontentloaded', 'networkidle0', 'networkidle2'] });
            const data = await page.evaluate(() => document.body.innerHTML);
            const $ = cheerio.load(data);
            $(".item_content").each((idx, el) => {
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