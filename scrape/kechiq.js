const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const cUrl = "https://kechiq.com/brands";
const urls = [
    "https://www.kechiq.com/search",
    // "https://kechiq.com/man",
    // "https://kechiq.com/woman",
    // "https://kechiq.com/luxury",
];
const sitemapper = require('sitemapper');
const smurl = "https://www.kechiq.com/sitemapUS.xml";

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
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        for (const u of urls) {
            await page.goto(u, { waitUntil: ['load', 'domcontentloaded', 'networkidle0', 'networkidle2'] });
            await autoScroll(page);
            let loadMore = true; let cnt = 1;
            while (loadMore && cnt < 2) {
                cnt++;
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

const sIndex = async () => {
    const sm = new sitemapper({
        url: smurl,
        timeout: 600000,
    })
    const prod = []; const notProd = [];
    const d = await sm.fetch();
    d.sites.sort().forEach(u => {
        if (u.match(/brand/i) || !u.match(/\d\d/)) notProd.push(u);
        else prod.push(u);
    });
    console.log();
    console.log('not product : ');
    notProd.sort().forEach(u => { console.log(u); });
    console.log();
    console.log('products : ');
    prod.sort().forEach(u => { console.log(u); });
    console.log();
    console.log(`not product : ${notProd.length}`);
    console.log(`product : ${prod.length}`);
}

const extraction = async (context) => {
    const { client, entry, ...rest } = context;
    const result = { ...rest, url: entry, spec: [], related: [], };
    result.source = "kechiq";
    result.lang = "en";
    try {
        const { data } = await client.get(entry);
        const $ = cheerio.load(data);
        result.name = $('meta[property="og:title"]').attr("content").split("|")[0].trim();
        result.description = $('meta[property="og:description"]').attr("content");
        result.thumbnail = $('meta[property="og:image"]').attr("content");
        result.reference = $(".main_prod_name").find(".desc").text();
        result.brand = $(".main_prod_name").find(".brand").text();
        result.price = $(".main_product_price").first().find(".price").text();
        result.retail = $(".main_product_price").first().find(".discount").text()
        $(".item_sheet_detail").each((idx, el) => {
            const key = $(el).find(".label").text();
            const value = $(el).find(".value").text();
            result.spec.push({ key, value });
        })
        // let { id, name: bname } = Mappers.generateBrandID.map(result.brand);
        // result.brandID = id;
        // result.brand = bname;
    } catch (error) {
        console.error('Failed extraction for Kechiq with error : ' + error);
        console.error('entry : ', entry);
        if (error.response) result.code = error.response.status;
        else result.code = 'UNKNOWN ERROR';
    }
    return result;
};


(async () => {
    // const r = await cIndexing({})
    // const r = await sIndex();
    const urls = [
        "https://www.kechiq.com/emporio-armani-watch-ax5802-136811",
        "https://www.kechiq.com/versace-watch-ve8101219-87956",
        "https://www.kechiq.com/armani-exchange-watch-ax1835-117312",
        "https://www.kechiq.com/swatch-watch-suob166-67163",
    ];
    for (const u of urls) {
        const ex = await extraction({
            client: axios,
            entry: u,
        });
        console.log(ex);
    }

    console.log();
    console.log();
    console.log('done.....');
})()