// const axios = require('axios');
const cheerio = require('cheerio');
const fetch = require('cross-fetch');

(async () => {
    const e =
        // "https://www.luminox.com.sg/sitemap.xml";
        // "https://www.luminox.com/sitemap.xml";
        // "https://ca.luminox.com/sitemap.xml";
        // "https://de.luminox.com/sitemap.xml";
        // "https://uk.luminox.com/sitemap.xml";
        "https://luminox.jp/watch-sitemap.xml";
    // "https://www.luminox.it/sitemap.xml";
    const market = "JPN";
    // const { data } = await axios.get(e);
    const res = await fetch(e);
    const data = await res.text();
    let d = data;
    let cnt = 0;
    if (d.match(/com(.sg)?\/sitemap_products/i)) {
        // need to drill-down
        const dd = data.match(/<loc>.*<\/loc>/ig);
        if (dd) {
            const url = dd[0].replace(/<loc>|<\/loc>/ig, '');
            const { data } = await axios.get(url);
            d = data;
        }
    }
    const results = [];
    const dd = d.replace(/></g, '>\n<').match(/<loc>.*<\/loc>/ig);
    if (dd) {
        for (const u of dd) {
            const url = u.replace(/<loc>|<\/loc>/ig, '');
            if (url.match(/product|watch-collection/i) && url.match(/\d{4}/) && !url.match(/f[pmen]x-|fe-|fp-|strap/i)) {
                // const { data } = await axios.get(url);
                const res = await fetch(url);
                const data = await res.text();
                const $ = cheerio.load(data);
                if (["SGP"].includes(market)) {
                    const name = $(".product-single__title").text();
                    const reference = name && name.match(/ - /) ? name.split(' - ')[1] : name;
                    const rPrice = $("#ComparePrice-product-template").text().replace(/\s+/g, '').trim();
                    const sPrice = $("#ProductPrice-product-template").text().replace(/\s+/g, '').trim();
                    const price = rPrice ? rPrice : sPrice;
                    const amount = price ? parseFloat(price.replace(/￥|（税込）|£|€|CAD|\$|,|\./g, '').trim()) / 100 : null;
                    console.log({ url, reference, rPrice, sPrice, amount });
                } else if (["USA"].includes(market)) {
                    const name = $("#productInfo-product").find(".h2").text()
                    const reference = name && name.match(/ - /) ? name.split(' - ')[1] : name;
                    const price = $("#ProductPrice-product").text();
                    const amount = price ? parseFloat(price.replace(/￥|（税込）|£|€|CAD|\$|,|\./g, '').trim()) / 100 : null;
                    console.log({ url, reference, price, amount, });
                } else if (["CAN"].includes(market)) {
                    const name = $(".product-title").text();
                    const reference = name && name.match(/ - /) ? name.split(' - ')[1] : name;
                    const sPrice = $(".product-sale-price").first().text();
                    const rPrice = $(".product-normal-price").first().text();
                    const price = rPrice ? rPrice : sPrice;
                    const amount = price ? parseFloat(price.replace(/￥|（税込）|£|€|CAD|\$|,|\./g, '').trim()) / 100 : null;
                    console.log({ url, reference, rPrice, sPrice, amount });
                } else if (['DEU', 'GBR'].includes(market)) {
                    const name = $(".product_title_main").text();
                    const ref = $(".product_subtitle").text();
                    const reference = ref && ref.match(/ - /) ? ref.split(' - ')[1] : name;
                    const sPrice = $("#ComparePrice-product").text();
                    const rPrice = $("#ProductPrice-product").text();
                    const price = rPrice ? rPrice : sPrice;
                    const amount = price ? parseFloat(price.replace(/￥|（税込）|£|€|CAD|\$|,|\./g, '').trim()) / 100 : null;
                    console.log({ url, reference, rPrice, sPrice, amount });
                } else if (["ITA"].includes(market)) {
                    const reference = $("#sku").text().replace(/\s+/g, '').trim();
                    const price = $('meta[itemprop="price"]').attr('content');
                    const amount = price ? parseFloat(price.replace(/￥|（税込）|£|€|CAD|\$|,|\./g, '').trim()) / 100 : null;
                    console.log({ url, reference, amount });
                } else if (["JPN"].includes(market)) {
                    const ref = $("#intro").find(".text").find("h1").first().text().replace(/\s+/g, ' ').trim();
                    const reference = ref && ref.match(/Ref./i) ? ref.split('Ref.')[1] : ref;
                    const price = $("#intro").find(".price").text();
                    const amount = price ? parseFloat(price.replace(/￥|（税込）|£|€|CAD|\$|,|\./g, '').trim()) : null;
                    console.log({ url, reference, price, amount });
                } else {
                    console.log(url);
                }
            }
        }
    }
    console.log();
    console.log(`watches : ${cnt}`);
})();

// 