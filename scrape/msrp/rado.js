const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const u = [
    "https://www.rado.com/en_hk/men-watches/discover/all-watches.html",
    "https://www.rado.com/en_hk/women-watches/discover/all-watches.html",
    "https://www.rado.com/en_hk/ceramic-watches/discover/all-watches.html",
];
// const e =
// "https://www.rado.com/en_us/collections.html";
// "https://www.rado.com/en_dk/collections.html";
// "https://www.rado.com/de_de/collections.html";
// "https://www.rado.com/fr_fr/collections.html";
// "https://www.rado.com/it_it/collections.html";
// "https://www.rado.com/en_gb/collections.html";
// "https://www.rado.com/de_de/collections.html";
// "https://www.rado.com/ja_jp/collections.html";
// "https://www.rado.com/en_hk/collections.html";
// "https://www.rado.com/en_ca/collections.html";
// "https://www.rado.com/zh_tw/collections.html";
// "https://www.rado.com/en_sg/collections.html";
const uniq = []; const results = [];
let cnt = 0;

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    for (const x of u) {
        await page.goto(x, { waitUntil: ['load', 'domcontentloaded', 'networkidle0', 'networkidle2'] });
        const data = await page.evaluate(() => document.body.innerHTML);
        const $ = cheerio.load(data);
        const w = parseInt($(".toolbar-number").last().text());
        const np = Math.ceil(w / 12);
        for (let i = 1; i <= np; i++) {
            const link = x + (i > 1 ? "?page=" + i : "");
            console.log(link);
            await new Promise(r => setTimeout(r, 3000));
            await page.goto(link, { waitUntil: ['load', 'domcontentloaded', 'networkidle0', 'networkidle2'] });
            const data = await page.evaluate(() => document.body.innerHTML);
            // const { data } = await axios.get(link);
            const $ = cheerio.load(data);
            $(".product-item").each((idx, el) => {
                const name = $(el).find("h3").first().text().replace(/\s+/g, " ").trim();
                const reference = $(el).find("p").first().text().split("\n")[0].replace(/\s+/g, " ").trim();
                const price = $(el).find(".price-final_price").first().text().replace(/\s+/g, " ").trim();
                console.log(`name : ${name}     reference : ${reference}     price : ${price}`);
                results.push({ reference, price });
                if (uniq.indexOf(reference) < 0) uniq.push(reference);
            })
        }
    }
    await browser.close();
    console.log(`cnt : ${cnt}`);
    results.sort((a, b) => a.reference > b.reference ? 1 : -1).forEach(r => { console.log(r) });
    console.log(`uniq : ${uniq.length}`);
    // let cnt = 0;
    // for (const x of u) {
    //     const { data } = await axios.get(x);
    //     const $ = cheerio.load(data);
    //     const w = parseInt($(".toolbar-number").last().text());
    //     const np = Math.ceil(w / 12);
    //     console.log(`total pages : ${np}`);
    //     for (let i = 1; i <= np; i++) {
    //         const link = x + (i > 1 ? "?page=" + i : "");
    //         console.log(link);
    //         await new Promise(r => setTimeout(r, 3000));
    //         const { data } = await axios.get(link);
    //         const $ = cheerio.load(data);
    //         $(".product-item-info").each((idx, el) => {
    //             const d = $(el).find("input").last().attr("data-product-data");
    //             if (d) {
    //                 const j = JSON.parse(d);
    //                 const reference = j.sku;
    //                 const amount = parseFloat(j.final_price);
    //                 // console.log({ reference, amount });
    //                 results.push({ reference, amount });
    //                 cnt++;
    //                 if (uniq.indexOf(reference) < 0) uniq.push(reference);
    //             }
    //         })
    //     }
    // }
    // results.sort((a, b) => a.reference > b.reference ? 1 : -1).forEach(r => { console.log(r) });
    // console.log(`uniq : ${uniq.length}`);
    // const cats = [];
    // const { data } = await axios.get(e);
    // const $ = cheerio.load(data);
    // $(".category-featured").find("featured").each((idx, el) => {
    //     const name = $(el).find(".featured-text").find("h2").text().replace(/\s+/g, " ").trim();
    //     const url = $(el).find("a").attr("href");
    //     cats.push({ name, url });
    // })
    // $(".category-other").find(".item-text").each((idx, el) => {
    //     const name = $(el).find("h2").text().replace(/\s+/g, " ").trim();
    //     const url = $(el).find("a").attr("href");
    //     cats.push({ name, url });
    // })
    // let cnt = 0;
    // for (const c of cats) {
    //     let link = c.url;
    //     do {
    //         console.log(link);
    //         await new Promise(r => setTimeout(r, 3000));
    //         const { data } = await axios.get(link);
    //         const $ = cheerio.load(data);
    //         $(".product-item").each((idx, el) => {
    //             $(el).find("input").each((idx1, el1) => {
    //                 const d = $(el1).attr("data-product-data");
    //                 if (d) {
    //                     const dd = JSON.parse(d);
    //                     const reference = dd.sku;
    //                     const amount = parseFloat(dd.price);
    //                     console.log({ reference, amount });
    //                     cnt++;
    //                 }
    //             })
    //         })
    //         link = $(".pages-item-next").first().find("a").attr("href");
    //     } while (link);
    // }

    console.log();
    console.log('done................................');
})()