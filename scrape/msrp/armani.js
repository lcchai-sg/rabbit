const axios = require('axios');
const cheerio = require('cheerio');
const results = [];
const target =
    // "https://www.armani.com/Search/RenderProductsAsync?department=wtchs&productsPerPage=32&siteCode=ARMANICOM_US&page=";
    // "https://www.armani.com/Search/RenderProductsAsync?department=wtchs&productsPerPage=32&siteCode=ARMANICOM_HK&page=";
    // "https://www.armani.com/Search/RenderProductsAsync?department=wtchs&productsPerPage=32&siteCode=ARMANICOM_DK&page=";
    // "https://www.armani.com/Search/RenderProductsAsync?department=wtchs&productsPerPage=32&siteCode=ARMANICOM_CA&page=";
    // "https://www.armani.com/Search/RenderProductsAsync?department=wtchs&productsPerPage=32&siteCode=ARMANICOM_JP&page=";
    // "https://www.armani.com/Search/RenderProductsAsync?department=wtchs&productsPerPage=32&siteCode=ARMANICOM_DE&page=";
    // "https://www.armani.com/Search/RenderProductsAsync?department=wtchs&productsPerPage=32&siteCode=ARMANICOM_FR&page=";
    // "https://www.armani.com/Search/RenderProductsAsync?department=wtchs&productsPerPage=32&siteCode=ARMANICOM_IT&page=";
    // "https://www.armani.com/Search/RenderProductsAsync?department=wtchs&productsPerPage=32&siteCode=ARMANICOM_GR&page=";
    "https://www.armani.com/Search/RenderProductsAsync?department=wtchs&productsPerPage=32&siteCode=ARMANICOM_GB&page=";
// const target = "https://www.armani.com/Search/RenderProductsAsync?department=wtchs&productsPerPage=32&site=armanicom&siteCode=ARMANICOM_US&page=";

(async () => {
    let pg = 1; let cnt = 0;
    try {
        do {
            cnt = 0;
            const e = target + pg;
            await new Promise(r => setTimeout(r, 3000))
            console.log('target : ', e);
            const { data } = await axios.get(e);
            const $ = cheerio.load(data);
            $(".item").each((idx, el) => {
                const data = JSON.parse($(el).attr('data-ytos-track-product-data'));
                const innerPath = $(el).find('a').attr('href');
                if (data && data.product_cod10) {
                    const productCode10 = data.product_cod10;
                    const amount = parseFloat(data.product_price ? data.product_price : '0')
                    results.push({ productCode10, amount, innerPath })
                }
                cnt++;
            })
            pg++;
        } while (cnt >= 32);
        // console.log('total : ', pathArr.length);
        // for (const x of pathArr) {
        //     await sleep(1000);
        //     const { data } = await axios.get(encodeURI(x.innerPath));
        //     const $ = await cheerio.load(data);
        //     const reference = $('.modelFabricColor span.value').text();
        //     results.push({ reference, amount: x.amount });
        // }
    } catch (error) {
        console.error('Failed MSRP scraping for Armani with error : ', error);
    }
    results && results.forEach(w => { console.log(w); });
    console.log(`total : ${results.length}`);
    console.log('done...');
})()

