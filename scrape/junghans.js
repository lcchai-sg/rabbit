const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer')

const indexing = async (context) => {
    const { client, entry, base, interval, } = context;
    const baseURL = base ? base : "https://www.junghans.de/en/";
    const source = 'official';
    const lang = 'en';
    const brand = 'Junghans';
    const brandID = 440;
    const cfg = {};
    // const cfg = { headers: { 'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/91.0.4472.80 Mobile/15E148 Safari/604.1' } };
    const result = { source, lang, brand, brandID, collections: [], items: {}, }
    const cats = [];
    const collection = "temp";
    result.collections.push(collection);
    result.items[collection] = [];
    try {
        let p = 1; let cnt = 0; let noData = true;
        do {
            const link = p === 1 ? entry : entry + "?p=" + p;
            console.log(link);
            const { data } = await client.get(link);
            const $ = cheerio.load(data);
            cnt = 0; let jdata = null;
            $('script').each((idx, el) => {
                const c = $(el).contents();
                if (c && c.toString().match(/ecommerce/i)) {
                    console.log('with ecommerce.................');
                    const cc = c.toString().match(/\[{"name"(.*)"\d{1,2}"}\]/ig);
                    if (cc) console.log('with json data..................')
                    jdata = cc ? JSON.parse(cc[0]) : null;
                }
            })
            $(".product--info").each((idx, el) => {
                const url = $(el).find("a").attr("href");
                const name = $(el).find("a").attr("title");
                const thumbnail = $(el).find("img").attr("srcset").split(',')[0].trim();
                const reference = $(el).find(".order-number").find(".entry--content").text().replace(/\s+/g, ' ').trim();
                const retail = jdata.length >= idx ? jdata[idx].price : null;
                result.items[collection].push({
                    source, lang, brand, brandID, url, collection, name, reference,
                    thumbnail, retail,
                })
                cnt++;
                noData = false;
            })
            if (noData) {
                console.log(data);
                process.exit(0);
            }
            // if (cnt === 0) {
            //     console.log(data)
            //     process.exit(0)
            // }
            console.log('cnt : ', cnt);
            p++;
            await new Promise(r => setTimeout(r, interval));
        } while (cnt >= 12);
        // get categories
        // $(".footer--column").each((idx, el) => {
        //     const type = $(el).find(".column--headline").text();
        //     if (type === 'Collection') {
        //         $(el).find("a").each((idx, el) => {
        //             const url = $(el).attr("href");
        //             const name = $(el).text().replace(/\s+/g, ' ').trim();
        //             result.collections.push(name);
        //             result.items[name] = [];
        //             cats.push({ name, url });
        //         })
        //     }
        // })
        // for (const cat of cats) {
        //     let p = 1;
        //     let cnt = 0;
        //     do {
        //         const link = p === 1 ? cat.url : cat.url + "?p=" + p;
        //         console.log(cat.name + "     " + link);
        //         const { data } = await client.get(link, cfg);
        //         const $ = cheerio.load(data);
        //         cnt = 0; let jdata = null;
        //         $('script').each((idx, el) => {
        //             const c = $(el).contents();
        //             if (c && c.toString().match(/ecommerce/i)) {
        //                 console.log('with ecommerce.................');
        //                 const cc = c.toString().match(/\[{"name"(.*)"\d{1,2}"}\]/ig);
        //                 if (cc) console.log('with json data..................')
        //                 jdata = cc ? JSON.parse(cc[0]) : null;
        //             }
        //         })
        //         $(".product--info").each((idx, el) => {
        //             const url = $(el).find("a").attr("href");
        //             const name = $(el).find("a").attr("title");
        //             const thumbnail = $(el).find("img").attr("srcset").split(',')[0].trim();
        //             const reference = $(el).find(".order-number").find(".entry--content").text().replace(/\s+/g, ' ').trim();
        //             const retail = jdata.length >= idx ? jdata[idx].price : null;
        //             const collection = cat.name;
        //             result.items[collection].push({
        //                 source, lang, brand, brandID, url, collection, name, reference,
        //                 thumbnail, retail,
        //             })
        //             cnt++;
        //         })
        //         // if (cnt === 0) {
        //         //     console.log(data)
        //         //     process.exit(0)
        //         // }
        //         console.log('cnt : ', cnt);
        //         p++;
        //         await new Promise(r => setTimeout(r, interval));
        //     } while (cnt >= 12);
        // }
        return result;
    } catch (error) {
        console.error('Failed indexing for Daniel Wellington with error : ', error);
        console.error('entry : ', entry);
        return {};
    }
}

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

const index = async context => {
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

    const sleep = async i => {
        await new Promise(r => setTimeout(r, i));
    }

    const { client, entry, base, interval, } = context;
    const baseURL = base ? base : "https://www.junghans.de/en/";
    const source = 'official';
    const lang = 'en';
    const brand = 'Junghans';
    const brandID = 440;
    const result = [];
    try {
        const entry = "https://www.junghans.de/en/find-your-junghans/";
        // const entry = "https://www.junghans.de/en/find-your-junghans/?p=";
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();

        // await page.goto(entry, { timeout: 0, waitUntil: ['load', 'domcontentloaded', 'networkidle0', 'networkidle2'] })
        // let loadmore = true;
        // while (loadmore) {
        //     const btn = '.btn.is--primary.is--icon-right.js--load-more';
        //     // const btn = 'btn is--primary is--icon-right js--load-more'
        //     await autoScroll(page);
        //     if (await page.$(btn) !== null) await page.click(btn);
        //     else loadmore = false;
        // }
        // if (!loadmore) {
        //     const data = await page.evaluate(() => document.body.innerHTML);
        //     const $ = cheerio.load(data);
        //     $(".product--info").each((idx, el) => {
        //         const url = $(el).find("a").first().attr("href");
        //         const name = $(el).find("a").first().attr("title");
        //         const reference = $(el).find(".order-number").find(".entry--content").text().replace(/\s+/g, ' ').trim();
        //         const price = $(el).find(".price--default").text();
        //         const amount = price ? parseInt(price.replace(/\$|€|,|\.|\*|\s+/g, '')) / 100 : null;
        //         console.log({ idx, url, name, reference, price, amount });
        //         result.push({ reference, amount });
        //     })
        // }

        const entry1 = "https://www.junghans.de/en/find-your-junghans/?p=1";
        await page.goto(entry1, { waitUntil: ['load', 'domcontentloaded', 'networkidle0', 'networkidle2'] });
        const btn1 = '.btn.is--primary.is--icon-right.js--load-previous';
        if (page.$(btn1) !== null) await page.click(btn1);
        else console.log('previous button not found !!!');
        // await autoScroll(page);
        const data = await page.evaluate(() => document.body.innerHTML);
        const $ = cheerio.load(data);
        $(".product--info").each((idx, el) => {
            const url = $(el).find("a").first().attr("href");
            const name = $(el).find("a").first().attr("title");
            const reference = $(el).find(".order-number").find(".entry--content").text().replace(/\s+/g, ' ').trim();
            const price = $(el).find(".price--default").text();
            const amount = price ? parseInt(price.replace(/\$|€|,|\.|\*|\s+/g, '')) / 100 : null;
            console.log({ idx, url, name, reference, price, amount });
            result.push({ reference, amount });
        })
        browser.close();
        return result;
    } catch (error) {
        console.error('Failed indexing for Junghans with error : ', error);
        console.error('entry : ', entry);
        return {};
    }
}

(async () => {
    // const r = await indexing({
    //     client: axios,
    //     entry:
    //         // "https://www.junghans.de/en/",
    //         "https://www.junghans.de/en/collection/watches/junghans-meister/",
    //     base: "https://www.junghans.de/en/",
    //     interval: 10000,
    // });
    // const r = await index({
    //     client: axios,
    //     entry: "https://www.junghans.de/en/",
    //     base: "https://www.junghans.de/en/",
    //     interval: 10000,
    // });
    // let cnt = 0;
    // r.collections && r.collections.forEach(c => {
    //     console.log(`collection : ${c}`)
    //     r.items[c].forEach(w => {
    //         console.log(w);
    //         cnt++;
    //     })
    // });
    // console.log();
    // console.log(`watches : ${cnt}`);
    // process.exit(0);

    const r = await index({
        client: axios,
        entry: "https://www.junghans.de/en/find-your-junghans/",
    });
    r && r.forEach(p => { console.log(p); });
    console.log();
    process.exit(0);
})();