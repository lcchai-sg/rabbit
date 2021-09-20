const cheerio = require("cheerio");
const axios = require('axios');
const urls = [
    "https://www.garmin.com.hk/products/wearables/?cat=music",
    "https://www.garmin.com.hk/products/wearables/?cat=activity_tracking",
    "https://www.garmin.com.hk/products/wearables/?cat=kids",
    "https://www.garmin.com.hk/products/wearables/?cat=running",
    "https://www.garmin.com.hk/products/wearables/?cat=golf",
    "https://www.garmin.com.hk/products/wearables/?cat=outdoor_watches",
    "https://www.garmin.com.hk/products/wearables/?cat=multisports",
    "https://www.garmin.com.hk/products/wearables/?cat=swimming",
    "https://www.garmin.com.hk/products/wearables/?cat=diving",
    "https://www.garmin.com.hk/products/wearables/?cat=aviation",
    "https://www.garmin.com.hk/products/wearables/?cat=marq",
];
const results = [];
const apiPathStart = "https://www.garmin.com.hk/_js/api_products-accessories/?locale=en_HK&sn=";
const sleep = async interval => {
    await new Promise(r => setTimeout(r, interval));
}

(async () => {
    for (const u of urls) {
        console.log(u);
        const { data } = await axios.get(u);
        const $ = cheerio.load(data);
        const refArr = [];
        $('.app__products__container').find("a").each((idx, el) => {
            const ref = $(el).attr('data-product-id');
            if (ref) refArr.push(ref);
        })
        console.log('refArr : ', refArr, refArr.length);
        for (const reference of refArr) {
            try {
                await sleep(3000);
                let url = apiPathStart + reference;
                const { data } = await axios.get(encodeURI(url));
                let amount = 0;
                if (data && data.price) {
                    let price = data.price;
                    amount = price && parseFloat(price) ? parseFloat(price) : 0;
                }
                console.log({ reference, amount });
                // results.push({ reference, amount })
            } catch (error) {
                console.error('Failed MSRP scraping for Garmin with error : ', error);
            }
        }
        console.log();
        console.log();
    }
    // console.log('results : ', results.length);
    // results.forEach(r => { console.log(r); })
    // console.log();
    // console.log();
    console.log('done.....');
})()

