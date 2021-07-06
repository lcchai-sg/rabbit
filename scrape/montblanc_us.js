const axios = require('axios');
const cheerio = require('cheerio');
const fetch = require('cross-fetch');

(async () => {
    const e = "https://www.montblanc.com/en-us/collection/watches/?page=1&productsPerPage=1000";
    const j = "https://www.montblanc.com/ja-jp/collection/%E3%82%A6%E3%82%A9%E3%83%83%E3%83%81/%E3%83%A0%E3%83%BC%E3%83%96%E3%83%A1%E3%83%B3%E3%83%88/?page=1&productsPerPage=1000";

    const { data } = await axios.get(j);
    const $ = cheerio.load(data);
    let cnt = 0;
    $(".item").each((idx, el) => {
        const d = $(el).attr("data-ytos-track-product-data").replace(/&quot;/g, '');
        const j = d ? JSON.parse(d) : null;
        const name = j ? j.product_title : null;
        const reference = j ? j.product_mfPartNumber : null;
        const retail = j ? j.product_price : null;
        const amount = j ? j.product_discountedPrice : null;
        console.log({ name, reference, retail, amount });
        cnt++;
    })
    console.log();
    console.log('watches : ', cnt);
    console.log('done.');
})();
