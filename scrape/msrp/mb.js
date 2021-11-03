const axios = require('axios');
const cheerio = require('cheerio');
const e = [
    // USA
    // "https://www.montblanc.com/en-us/collection/watches/him/?department=US2_His-Watches&productsPerPage=1000",
    // "https://www.montblanc.com/en-us/collection/watches/her/?department=US2_Her-Watches&productsPerPage=1000",
    // "https://www.montblanc.com/Search/RenderBaseProductsAsync?department=US2_Summit-2plus&siteCode=MONTBLANC_US&productsPerPage=1000"
    // "https://www.montblanc.com/Search/RenderBaseProductsAsync?department=US2_Summit-2&siteCode=MONTBLANC_US&productsPerPage=1000"
    // "https://www.montblanc.com/Search/RenderBaseProductsAsync?department=US2_Summit-Lite&siteCode=MONTBLANC_US&productsPerPage=1000"
    // CANADA - CAD
    "https://www.montblanc.com/en-ca/collection/watches/him/?department=US2_His-Watches&productsPerPage=1000",
    "https://www.montblanc.com/en-ca/collection/watches/her/?department=US2_Her-Watches&productsPerPage=1000",
    "https://www.montblanc.com/Search/RenderBaseProductsAsync?department=US2_Summit-2plus&productsPerPage=1000&siteCode=MONTBLANC_CA",
    "https://www.montblanc.com/Search/RenderBaseProductsAsync?department=US2_Summit-2&productsPerPage=1000&siteCode=MONTBLANC_CA",
    "https://www.montblanc.com/Search/RenderBaseProductsAsync?department=US2_Summit-Lite&productsPerPage=1000&siteCode=MONTBLANC_CA",
    // DENMARK - DKK
    // "https://www.montblanc.com/Search/RenderBaseProductsAsync?productsPerPage=1000&department=INTL2_Summit-2plus&siteCode=MONTBLANC_DK",
    // "https://www.montblanc.com/Search/RenderBaseProductsAsync?productsPerPage=1000&department=INTL2_Summit-2&siteCode=MONTBLANC_DK",
    // "https://www.montblanc.com/Search/RenderBaseProductsAsync?productsPerPage=1000&department=INTL2_Summit-Lite&siteCode=MONTBLANC_DK",
    // "https://www.montblanc.com/en-dk/collection/watches/him/?department=INTL2_His-Watches&productsPerPage=1000",
    // "https://www.montblanc.com/en-dk/collection/watches/her/?department=INTL2_Her-Watches&productsPerPage=1000",
    // FRANCE
    // "https://www.montblanc.com/Search/RenderBaseProductsAsync?productsPerPage=1000&department=INTL2_Summit-2plus&siteCode=MONTBLANC_FR",
    // "https://www.montblanc.com/Search/RenderBaseProductsAsync?productsPerPage=1000&department=INTL2_Summit-2&siteCode=MONTBLANC_FR",
    // "https://www.montblanc.com/Search/RenderBaseProductsAsync?productsPerPage=1000&department=INTL2_Summit-Lite&siteCode=MONTBLANC_FR",
    // "https://www.montblanc.com/fr-fr/collection/montres/homme/?department=INTL2_His-Watches&productsPerPage=1000",
    // "https://www.montblanc.com/fr-fr/collection/montres/femme/?department=INTL2_Her-Watches&productsPerPage=1000",
    // GERMANY
    // "https://www.montblanc.com/Search/RenderBaseProductsAsync?productsPerPage=1000&department=INTL2_Summit-2plus&siteCode=MONTBLANC_DE",
    // "https://www.montblanc.com/Search/RenderBaseProductsAsync?productsPerPage=1000&department=INTL2_Summit-2&siteCode=MONTBLANC_DE",
    // "https://www.montblanc.com/Search/RenderBaseProductsAsync?productsPerPage=1000&department=INTL2_Summit-Lite&siteCode=MONTBLANC_DE",
    // "https://www.montblanc.com/de-de/collection/uhren/herren/?department=INTL2_His-Watches&productsPerPage=1000",
    // "https://www.montblanc.com/de-de/collection/uhren/damen/?department=INTL2_Her-Watches&productsPerPage=1000",
    // UK
    // "https://www.montblanc.com/Search/RenderBaseProductsAsync?productsPerPage=1000&department=INTL2_Summit-2plus&siteCode=MONTBLANC_GB",
    // "https://www.montblanc.com/Search/RenderBaseProductsAsync?productsPerPage=1000&department=INTL2_Summit-2&siteCode=MONTBLANC_GB",
    // "https://www.montblanc.com/Search/RenderBaseProductsAsync?productsPerPage=1000&department=INTL2_Summit-Lite&siteCode=MONTBLANC_GB",
    // "https://www.montblanc.com/en-gb/collection/watches/him/?department=INTL2_His-Watches&productsPerPage=1000",
    // "https://www.montblanc.com/en-gb/collection/watches/her/?department=INTL2_Her-Watches&productsPerPage=1000",
    // ITALY
    // "https://www.montblanc.com/Search/RenderBaseProductsAsync?productsPerPage=1000&department=INTL2_Summit-2plus&siteCode=MONTBLANC_IT",
    // "https://www.montblanc.com/Search/RenderBaseProductsAsync?productsPerPage=1000&department=INTL2_Summit-2&siteCode=MONTBLANC_IT",
    // "https://www.montblanc.com/Search/RenderBaseProductsAsync?productsPerPage=1000&department=INTL2_Summit-Lite&siteCode=MONTBLANC_IT",
    // "https://www.montblanc.com/it-it/collection/orologi/lui/?department=INTL2_His-Watches&productsPerPage=1000",
    // "https://www.montblanc.com/it-it/collection/orologi/lei/?department=INTL2_Her-Watches&productsPerPage=1000",
    // GREECE
    // "https://www.montblanc.com/Search/RenderBaseProductsAsync?productsPerPage=1000&department=INTL2_Summit-2plus&siteCode=MONTBLANC_GR",
    // "https://www.montblanc.com/Search/RenderBaseProductsAsync?productsPerPage=1000&department=INTL2_Summit-2&siteCode=MONTBLANC_GR",
    // "https://www.montblanc.com/Search/RenderBaseProductsAsync?productsPerPage=1000&department=INTL2_Summit-Lite&siteCode=MONTBLANC_GR",
    // "https://www.montblanc.com/en-gr/collection/watches/him/?department=INTL2_His-Watches&productsPerPage=1000",
    // "https://www.montblanc.com/en-gr/collection/watches/her/?department=INTL2_Her-Watches&productsPerPage=1000",
    // TAIWAN
    // "https://www.montblanc.com/Search/RenderBaseProductsAsync?productsPerPage=1000&department=INTL2_Summit-2plus&siteCode=MONTBLANC_TW",
    // "https://www.montblanc.com/Search/RenderBaseProductsAsync?productsPerPage=1000&department=INTL2_Summit-2&siteCode=MONTBLANC_TW",
    // "https://www.montblanc.com/Search/RenderBaseProductsAsync?productsPerPage=1000&department=INTL2_Summit-Lite&siteCode=MONTBLANC_TW",
    // "https://www.montblanc.com/en-tw/collection/watches/him/?department=INTL2_His-Watches&productsPerPage=1000",
    // "https://www.montblanc.com/en-tw/collection/watches/her/?department=INTL2_Her-Watches&productsPerPage=1000",
    // SINGAPORE
    // "https://www.montblanc.com/Search/RenderBaseProductsAsync?productsPerPage=1000&department=INTL2_Summit-2plus&siteCode=MONTBLANC_SG",
    // "https://www.montblanc.com/Search/RenderBaseProductsAsync?productsPerPage=1000&department=INTL2_Summit-2&siteCode=MONTBLANC_SG",
    // "https://www.montblanc.com/Search/RenderBaseProductsAsync?productsPerPage=1000&department=INTL2_Summit-Lite&siteCode=MONTBLANC_SG",
    // "https://www.montblanc.com/en-sg/collection/watches/him/?department=INTL2_His-Watches&productsPerPage=1000",
    // "https://www.montblanc.com/en-sg/collection/watches/her/?department=INTL2_Her-Watches&productsPerPage=1000",
    // JAPAN
    // "https://www.montblanc.com/Search/RenderBaseProductsAsync?productsPerPage=1000&department=JP2_Summit-2plus&siteCode=MONTBLANC_JP",
    // "https://www.montblanc.com/Search/RenderBaseProductsAsync?productsPerPage=1000&department=JP2_Summit-2&siteCode=MONTBLANC_JP",
    // "https://www.montblanc.com/Search/RenderBaseProductsAsync?productsPerPage=1000&department=JP2_Summit-Lite&siteCode=MONTBLANC_JP",
    // "https://www.montblanc.com/ja-jp/collection/ウォッチ/メンズ/?department=INTL2_His-Watches&productsPerPage=1000",
    // "https://www.montblanc.com/ja-jp/collection/ウォッチ/ウィメンズ/?department=INTL2_Her-Watches&productsPerPage=1000",
    // HONG KONG
    // "https://www.montblanc.com/Search/RenderBaseProductsAsync?productsPerPage=1000&department=HK2_Summit-2plus&siteCode=MONTBLANC_HK",
    // "https://www.montblanc.com/Search/RenderBaseProductsAsync?productsPerPage=1000&department=HK2_Summit-2&siteCode=MONTBLANC_HK",
    // "https://www.montblanc.com/Search/RenderBaseProductsAsync?productsPerPage=1000&department=HK2_Summit-Lite&siteCode=MONTBLANC_HK",
    // "https://www.montblanc.com/en-hk/collection/watches/him/?department=INTL2_His-Watches&productsPerPage=1000",
    // "https://www.montblanc.com/en-hk/collection/watches/her/?department=INTL2_Her-Watches&productsPerPage=1000",

];

(async () => {
    for (const u of e) {
        let cnt = 0;
        const { data } = await axios.get(encodeURI(u));
        // console.log(data);
        const $ = cheerio.load(data);
        $(".search__products").find(".item").each((idx, el) => {
            const d = $(el).attr("data-ytos-track-product-data");
            if (d) {
                const j = JSON.parse(d);
                const reference = j.product_mfPartNumber;
                const amount = j.product_discountedPrice;
                console.log({ reference, amount });
                cnt++;
            }
        })
        console.log();
        console.log(u);
        console.log(`cnt : ${cnt}`);
        console.log();
    }
})()