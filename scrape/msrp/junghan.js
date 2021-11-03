const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const { skipPartiallyEmittedExpressions } = require('typescript');
const u = [
];
const uniq = []; const results = [];
const sleep = async i => {
    await new Promise(r => setTimeout(r, i));
}
const index = async url => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    for (let i = 2; i < 5; i++) {
        const link = url + "?p=" + i;
        console.log(link);
        await page.goto(link, { waitUntil: ['load', 'domcontentloaded', 'networkidle0', 'networkidle2'] });
        if (await page.$(".btn.is--primary.is--icon-right.js--load-previous") !== null) {
            await page.click(".btn.is--primary.is--icon-right.js--load-previous");
            console.log('button clicked!');
            await sleep(5000);
            const np = i - 1;
            const link = url + "?p=" + np;
            console.log(link);
            await page.goto(link, { waitUntil: ['load', 'domcontentloaded', 'networkidle0', 'networkidle2'] });
            const data = await page.evaluate(() => document.body.innerHTML);
            const $ = cheerio.load(data);
            $(".product--info").each((idx, el) => {
                const name = $(el).find("a").attr("title");
                const url = $(el).find("a").attr("href");
                const reference = $(el).find(".order-number").find(".entry--content").text().replace(/\s+/g, " ").trim();
                const retail = $(el).find(".product--price").text().replace(/\s+/g, " ").trim();
                console.log({ name, reference, retail, url });
                results.push({ name, reference, retail, url });
            })
        }
    }
    await browser.close();
}

(async () => {
    const e = "https://www.junghans.de/en/find-your-junghans/"
    await index(e);
    results.forEach(r => {
        console.log(r);
    })
    console.log();
    console.log('done................................');
})()