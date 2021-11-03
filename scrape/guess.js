const puppeteer = require('puppeteer');
const xml2js = require('xml2js');
const e = "https://www.guess.com/us/sitemap_0-product.xml";
const axios = require('axios');
const cheerio = require('cheerio');
const cloudflareScraper = require('cloudflare-scraper');
const sleep = async t => {
    await new Promise(r => setTimeout(r, t));
}
// const uu = [
//     'https://www.guess.com/us/en/silver-tone-petite-crystal-watch-silver/U0135L1-NC.html',
//     'https://www.guess.com/us/en/rose-gold-tone-petite-crystal-watch-pink/U0135L3-NC.html',
//     'https://www.guess.com/us/en/gold-tone-slim-mesh-diamond-watch-gold/U0280G3-NC.html',
//     'https://www.guess.com/us/en/men/accessories/watches/view-all/black-mesh-diamond-analog-watch-black/U0298G1-NC.html',
//     'https://www.guess.com/us/en/men/accessories/watches/view-all/blue-and-rose-gold-tone-sport-watch-blue/U0366G4-NC.html',
//     'https://www.guess.com/us/en/men/accessories/watches/view-all/gold-tone-classic-dress-watch-gold/U0668G4-NC.html',
//     'https://www.guess.com/us/en/men/accessories/watches/view-all/black-classic-style-watch-black/U0668G5-NC.html',
//     'https://www.guess.com/us/en/men/accessories/watches/view-all/silver-tone-classic-watch-silver/U0668G7-NC.html',
// ];
const ua = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/601.3.9 (KHTML, like Gecko) Version/9.0.2 Safari/601.3.9';
const result = { collections: [], items: {} };

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
    const browser = await puppeteer.launch({
        headless: false,
        // executablePath: "/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome",
        args: ['--no-sandbox',],
    });
    const page = await browser.newPage();
    await page.setExtraHTTPHeaders({
        'user-agent': ua,
    })
    await page.goto(e, { waitUntil: ['load', 'domcontentloaded', 'networkidle0', 'networkidle2'], timeout: 0 });
    const data = await page.evaluate(() => document.body.innerHTML);
    const $ = cheerio.load(data);
    console.log('cheerio loaded');
    const d = $("urlset").first().toString();
    // console.log(d);
    const parser = new xml2js.Parser();
    const urls = [];
    parser.parseString(d, async (err, res) => {
        // console.log('res : ', res);
        let c = 0;
        for (let i = 1; i < res.urlset.url.length; i++) {
            const d = res.urlset.url[i];
            const url = d['loc'][0];
            if (url.match(/watch/i)) {
                c++;
                console.log('watch : ', d);
                const name = d['image:image'][0]['image:title'][0];
                const thumbnail = d['image:image'][0]['image:loc'][0];
                const ref = thumbnail.split('/');
                const refr = ref[ref.length - 1].split('?')[0];
                const reference = (refr.match(/al-\d{3}[A-z]/i)) ? refr.substr(0, 12) : null;
                const collection = name.match(/comtesse/i) ? 'COMTESSE' : name.split(' ')[0].toUpperCase();
                if (result.collections.indexOf(collection) < 0) {
                    result.collections.push(collection);
                    result.items[collection] = [];
                }
                result.items[collection].push({
                    source, lang, brand, brandID, collection, url, name,
                    reference, thumbnail, retail: null,
                })
            }
        }
        console.log(`watches : ${c}`);
    });
    let cnt = 0;
    result && result.collections.forEach(c => {
        result.items[c].forEach(w => {
            console.log(w);
            cnt++;
        })
    })
    console.log(`cnt : ${cnt}`);

    // for (const u of uu) {
    //     try {
    //         console.log(u);
    //         await sleep(3000);
    //         const browser = await puppeteer.launch({ headless: false });
    //         const page = await browser.newPage();
    //         await page.goto(u, { waitUntil: ['load', 'domcontentloaded', 'networkidle0', 'networkidle2'], timeout: 0 });
    //         const data = await page.evaluate(() => document.body.innerHTML);
    //         const $ = cheerio.load(data);
    //         const d = $(".js-product-data").attr("value");
    //         const j = JSON.parse(d);
    //         const name = j.productName;
    //         const reference = j.varGroupID ? j.varGroupID.split("-")[0] : null;
    //         const description = j.shortDescription;
    //         const desc = j.longDescription;
    //         const retail = j.price && j.price.sales ? j.price.sales.value : null;
    //         const thumbnail = j.images && j.images.large ? j.images.large[0].url : j.images.small ? j.images.small[0].url : null;
    //         const spec = [];
    //         description.split("\n").forEach(s => {
    //             const sp = s.trim();
    //             if (sp) spec.push(sp);
    //         })
    //         desc.split("|").forEach(s => {
    //             const sp = s.trim();
    //             if (sp) spec.push(sp);
    //         })
    //         console.log();
    //         console.log({ name, reference, description, desc, spec, thumbnail, retail });
    //         await browser.close();
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }

    console.log();
    console.log('done................................');
    process.exit(0);
})()