const axios = require('axios');
const cheerio = require('cheerio');

const sleep = async t => {
    await new Promise(r => setTimeout(r, t));
}

const indexing = async (context) => {
    const { client, entry, interval, } = context;
    const source = "official";
    const lang = "en";
    const brand = "Ulysse Nardin";
    const brandID = 162;
    const result = { source, lang, brand, brandID, collections: [], items: {} };
    try {
        let next = entry;
        do {
            console.log(next);
            await sleep(interval);
            const { data } = await axios.get(next);
            const $ = cheerio.load(data);
            let collection = "";
            $(".products.container").find(".inner").each((idx, el) => {
                $(el).children().each((idx, el) => {
                    const c = $(el).attr("class");
                    if (c === "item full") collection = $(el).text().replace(/\s+/g, " ").replace(/collection/i, "").trim();
                    if (c === "item") {
                        if (!collection) collection = "OTHERS";
                        const url = $(el).find(".un-c-product__item").find("a").attr("href");
                        if (url) {
                            const u = url ? url.split("/") : null;
                            const reference = u[u.length - 1].replace(".html", "").toUpperCase();
                            const name = $(el).find(".un-c-product__item").find("a").attr("title");
                            const thumbnail = $(el).find(".un-c-product__item").find("img").attr("src");
                            const retail = $(el).find(".un-c-product__description").find(".price-box").first().text().replace(/\s+/g, " ").trim();
                            if (result.collections.indexOf(collection) < 0) {
                                result.collections.push(collection);
                                result.items[collection] = [];
                            }
                            result.items[collection].push({
                                source, lang, brand, brandID, url, collection, name, reference, thumbnail, retail,
                            });
                        }
                    }
                })
            })
            next = $(".un--block--product--list").attr("data-next-page-url");
            if (next) next = entry + "?p=" + next.split("&p=")[1];
        } while (next);
        return result;
    } catch (error) {
        console.error('Failed indexing for Ulysse Nardin with error : ' + error);
        return {};
    }
};

const extraction = async (context) => {
    const { client, entry, ...rest } = context;
    const result = { ...rest, url: entry, spec: [], related: [], };
    result.source = "official";
    result.lang = "en";
    result.brand = "Ulysse Nardin";
    result.brandID = 162;
    try {
        const res = await client.get(entry);
        const cUrl = res.request.res.responseUrl;
        if (cUrl != entry) {
            result.code = 404;
            return;
        }
        const { data } = res;
        const $ = cheerio.load(data);
        result.retail = $('.price-box.price-final_price').first().text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
        result.thumbnail = $(".col-md-6.bg-light.text-center").find('img').attr('src');
        $('script[type="text/x-magento-init"]').each((idx, el) => {
            const d = $(el).contents().toString();
            if (d.match(/product-detail/i)) {
                const j = JSON.parse(d);
                const pd = j['*']['Magento_GoogleTagManager/js/actions/product-detail'];
                result.reference = pd.reference;
                result.name = pd.name;
                result.collection = pd.collection;
                result.gender = pd.watch_gender;
                result.color = pd.color;
            }
        });
        $('.d-flex.flex-wrap.small.no-gutters .mt-4 ').each((idx, el) => {
            const key = $(el).find('span').text();
            const value = $(el).text().replace(key, '').replace(/\s+/g, ' ').trim();
            if (value) result.spec.push({ key, value });
        });
    } catch (error) {
        console.error('Failed extraction for Ulysse Nardin with error : ' + error);
        console.error('entry : ', entry);
        if (error.response) result.code = error.response.status;
        else result.code = 'UNKNOWN ERROR';
    }
    return result;
};

const urls = [
    'https://www.ulysse-nardin.com/row_en/1183-310le-3ae-175-1a.html',
    'https://www.ulysse-nardin.com/row_en/1183-310le-3ae-175-1b.html',
    'https://www.ulysse-nardin.com/row_en/1183-310le-0a-175-1a.html',
    'https://www.ulysse-nardin.com/row_en/1183-310le-0a-175-1b.html',
    'https://www.ulysse-nardin.com/row_en/1282-310le-2ae-175-1a.html',
    'https://www.ulysse-nardin.com/row_en/1193-310le-3a-175-1a.html',
    'https://www.ulysse-nardin.com/row_en/1193-310le-0a-175-1b.html',
    'https://www.ulysse-nardin.com/row_en/1193-310le-3a-175-1b.html',
    'https://www.ulysse-nardin.com/row_en/1193-310le-0a-175-1a.html',
    'https://www.ulysse-nardin.com/row_en/1533-320le-3a-175-1a.html',
    'https://www.ulysse-nardin.com/row_en/1533-320le-0a-175-1b.html',
    'https://www.ulysse-nardin.com/row_en/1533-320le-0a-175-1a.html',
    'https://www.ulysse-nardin.com/row_en/1533-320le-3a-175-1b.html',
];

(async () => {
    // const r = await indexing({
    //     client: axios,
    //     entry: "https://www.ulysse-nardin.com/row_en/watches",
    //     base: "https://www.ulysse-nardin.com/row_en",
    //     interval: 5000,
    // });
    // let cnt = 0;
    // console.log('collections : ', r.collections);
    // r.collections && r.collections.forEach(c => {
    //     r.items[c].forEach(w => {
    //         console.log(w);
    //         cnt++;
    //     })
    // })
    for (const u of urls) {
        const ex = await extraction({
            client: axios,
            entry: u,
            base: "https://www.ulysse-nardin.com/row_en",
        })
        console.log(ex);
        await sleep(5000);
    }
    console.log();
    console.log(`cnt : ${cnt}`);
    console.log(`done............................`);
})()