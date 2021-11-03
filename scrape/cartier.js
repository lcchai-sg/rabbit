const axios = require('axios');
const cheerio = require('cheerio');
// const e = "https://www.cartier.com/on/demandware.store/Sites-CartierUS-Site/en_US/Search-UpdateGrid?cgid=Watches_AllWatches&start=0&sz=1000";
const e1 = "https://www.cartier.com/en-us/watches/all-collections/";
const e = "https://www.cartier.com/en-us/watches/all-collections/ronde-de-cartier/?page=2";
const baseUrl = "https://www.cartier.com";

const extraction = async (context) => {
    const { client, entry, base, ...rest } = context;
    const result = { ...rest, url: entry, spec: [], related: [], };
    result.source = "official";
    result.lang = "en";
    result.brand = "Cartier";
    result.brandID = 28;
    const baseURL = base ? base : "https://www.cartier.com";
    try {
        const res = await client.get(entry);
        const cUrl = res.request.res.responseUrl;
        if (cUrl != entry) {
            result.code = 404;
            return;
        }
        const { data } = res;
        const $ = cheerio.load(data);

        result.description = $('pdp-main__description-full').text();
        $('script[type="application/ld+json"]').each((idx, el) => {
            const d = $(el).contents().toString();
            const j = JSON.parse(d);
            if (j["@type"] === "Product") {
                result.reference = j.mpn.replace(/^cr/i, '');
                result.sku = j.sku;
            }
        })
        result.name = $(".pdp__name").text().replace(/\s+/g, " ").trim() + " | " + $(".pdp-main__short-description").text().replace(/\s+/g, " ").trim();
        result.thumbnail = $(".product-gallery__img").first().attr("src").split("?")[0];
        result.description = $(".pdp-main__description-full").text().replace(/\s+/g, " ").replace(/read less/i, '').trim();
        result.retail = $(".price").text().replace(/\s+/g, " ").trim();

        // result.thumbnail = baseURL + $('.c-image-adaptive').attr('data-original-url');
        // result.collection = $('.c-breadcrumb__list li:nth-child(4)').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
        // result.name = $('.top-heading').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
        // result.reference = $('.small-text.js-pdp__cta-section--product-ref-id').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").split(":")[1].trim();
        // result.gender = Mappers.getGender.map(entry);
        // $('.tabbed-content__content-column').each((idx, el) => {
        //     const key = $(el).find('h3').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
        //     const value = $(el).find('p').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
        //     if (key) result.spec.push({ key, value });
        // });
    } catch (error) {
        console.error('Failed extraction for Cartier with error : ' + error);
        console.error('entry : ', entry);
        if (error.response) result.code = error.response.status;
        else result.code = 'UNKNOWN ERROR';
    }
    return result;
};

(async () => {
    // const { data: d1 } = await axios.get(encodeURI(e1));
    // const $1 = cheerio.load(d1);
    // const cats = [];
    // $1(".header-flyout__anchor--thumb").each((idx, el) => {
    //     const ty = $1(el).attr('aria-label');
    //     const href = $1(el).attr('href');
    //     if (ty.match(/watches/i) && href.match(/all-collections/i)) {
    //         const name = $1(el).text().replace(/\s+/g, ' ').trim();
    //         const url = baseUrl + href;
    //         cats.push({ name, url });
    //     }
    // })
    // console.log('cats : ', cats);
    // console.log('.................................');

    // let ttl = 0; const cat_ttl = [];
    // for (const c of cats) {
    //     let cnt = 0;
    //     const { data: d1 } = await axios.get(encodeURI(c.url));
    //     const $1 = cheerio.load(d1);
    //     const ft = $1(".search-results__footer-count").text();
    //     const f = ft.split(" ");
    //     const pg = Math.ceil(parseInt(f[f.length - 2]) / 24);
    //     const link = c.url + "?page=" + pg;
    //     console.log(link);
    //     await new Promise(r => setTimeout(r, 3000));
    //     const { data } = await axios.get(encodeURI(link));
    //     const $ = cheerio.load(data);
    //     $(".product-grid__item").each((idx, el) => {
    //         const href = $(el).find("a").attr("href");
    //         if (href) {
    //             const url = href.match(/https/i) ? href : baseUrl + href;
    //             const name = $(el).find(".product-tile__name").text().replace(/\s+/g, ' ').trim();
    //             const desc = $(el).find(".product-tile__material").text().replace(/\s+/g, ' ').trim();
    //             const retail = $(el).find(".price").text().replace(/\s+/g, ' ').trim();
    //             const img = $(el).find("img").attr("src")
    //             const thumbnail = img.split("?")[0];
    //             const collection = c.name;
    //             const fullname = name + " | " + desc;
    //             const reference = $(el).find(".product-tile").attr("data-tracking-id");
    //             if (reference) {
    //                 console.log({ url, collection, fullname, reference, thumbnail, retail });
    //                 cnt++;
    //             }
    //         }
    //     })
    //     console.log();
    //     console.log(`cnt : ${cnt}`);
    //     ttl += cnt;
    //     cat_ttl.push({ collection: c.name, total: cnt, })
    // }
    // console.log();
    // console.log(cat_ttl);
    // console.log(`total : ${ttl}`);

    // const r = [
    //     "https://www.cartier.com/en-us/art-of-living/be-inspired/gifts/the-most-iconic-cartier-gifts/tank-must-watch-CRWSTA0042.html",
    //     "https://www.cartier.com/en-us/tank-must-watch-CRWSTA0051.html",
    //     "https://www.cartier.com/en-us/tank-must-watch-CRWSTA0052.html",
    // ];

    // for (const rr of r) {
    //     const ex = await extraction({
    //         client: axios,
    //         entry: rr,
    //     })
    //     console.log(ex);
    //     await new Promise(r => setTimeout(r, 3000));
    // }

    const us = "https://www.cartier.com/en-us/watches/all-collections/?page=15";
    const deu = "https://www.cartier.com/Search/RenderProductsAsync?department=EU_Tank&itemsToLoadOnNextPage=24&lazyLoadStart=2&siteCode=CARTIER_DE"
    const { data } = await axios.get(deu);
    console.log(data);
    const $ = cheerio.load(data);
    let cnt = 0;
    // us
    // $(".product-grid__item").each((idx, el) => {
    //     const reference = $(el).find(".product-tile").attr("data-tracking-id").replace(/^CR/, "");
    //     const amount = parseFloat($(el).find(".price").find(".value").attr("content"));
    //     console.log({ reference, amount });
    //     cnt++;
    // })
    // deu
    $("product-slot").each((idx, el) => {
        const d = $(el).attr("data-ytos-track-product-data");
        const j = JSON.parse(d);
        const reference = j.product_mfPartNumber.replace(/^CR/i, '');
        const amount = j.product_discountedPrice
        console.log({ reference, amount });
        cnt++;
    })
    console.log(`cnt : ${cnt}`);
    console.log();
    console.log('done.............................');
})()