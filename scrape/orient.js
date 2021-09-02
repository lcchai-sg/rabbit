const axios = require('axios');
const cheerio = require('cheerio');
// const data = require('./orient_w');

const indexing = async (context) => {
    const { client, entry, base, interval, } = context;
    const baseURL = base ? base : "https://www.orientwatchusa.com";
    const source = "official";
    const lang = "en";
    const brand = "Orient";
    const brandID = 100;
    const result = { source, lang, brand, brandID, collections: [], items: {} };
    const cats = [];
    try {
        const { data } = await client.get(entry);
        const $ = cheerio.load(data);
        $('.collections').find("a").each((idx, el) => {
            const href = $(el).attr("href");
            const name = $(el).text();
            const url = href ? baseURL + href : null;
            if (name && !name.match(/straps/i) && !name.match(/buy now/i)) {
                result.collections.push(name);
                result.items[name] = [];
                if (url) cats.push({ name, url });
            }
        })
        for (const cat of cats) {
            console.log(cat.url);
            const { data } = await client.get(cat.url);
            const $ = cheerio.load(data);
            $('.products').each((idx, el) => {
                const col = $(el).find('.collection-info').find('div').first().text();
                $(el).find('.product').each((idx, el) => {
                    const url = baseURL + $(el).find("a").attr("href");
                    const thumbnail = $(el).find("img").last().attr("data-src");
                    const nr = $(el).find("img").last().attr("alt");
                    const nref = nr ? nr.split('|') : null;
                    const name = nref ? nref[0].trim() : null;
                    const reference = nref && nref.length >= 2 ? nref[1].trim() : null;
                    const collection = cat.name;
                    let prc = $(el).find(".price").find("strike").text();
                    if (!prc) prc = $(el).find(".price").text();
                    const retail = prc ? prc.split(" ")[0] : null;
                    result.items[collection].push({
                        source, lang, brand, brandID, url, collection, name, reference,
                        thumbnail, retail,
                    })
                })
            })
            await new Promise(r => setTimeout(r, interval));
        }
        return result;
    } catch (error) {
        console.error('Failed indexing for Orient with error : ' + error);
        console.error('entry : ', entry);
        return {};
    }
};

const extraction = async (context) => {
    const { client, entry, ...rest } = context;
    const result = { ...rest, url: entry, spec: [], related: [], };
    result.source = "official";
    result.lang = "en";
    result.brand = "Orient";
    result.brandID = 100;
    try {
        const { data } = await client.get(entry);
        const $ = cheerio.load(data);
        result.description = $('meta[property="og:description"]').attr('content');
        const nr = $('meta[property="og:title"]').attr('content');
        const nref = nr ? nr.split('|') : null;
        result.name = nref ? nref[0].trim() : null;
        result.reference = nref && nref.length > 1 ? nref[1].trim() : null;
        result.collection = $('.breadcrumbs').find('div:nth-child(3)').text().toUpperCase();
        result.reference = $('.breadcrumbs').find('div:nth-child(4)').text().toUpperCase();
        result.thumbnail = $('.product-images').find('img:nth-child(3)').attr('data-src');
        result.retail = $('.pricing').find('strike').text();
        if (!result.retail) result.retail = $('.pricing').text();
        $('.specifications .field').each((idx, el) => {
            const key = $(el).find('.name').text().replace(/:/g, '');
            const value = $(el).find('.value').text();
            result.spec.push({ key, value });
        })
        $('.cs-product').find('a').each((idx, el) => {
            const href = $(el).attr('href');
            const ref = href.split('/');
            const r = ref ? ref[ref.length - 2] : null;
            if (r) result.related.push(r.toUpperCase());
        })
    } catch (error) {
        console.error('Failed extraction for Orient with error : ' + error);
        console.error('entry : ', entry);
        if (error.response) result.code = error.response.status;
        else result.code = 'UNKNOWN ERROR';
    }
    return result;
};

(async () => {
    // const r = await indexing({
    //     client: axios,
    //     entry: "https://www.orientwatchusa.com",
    //     base: "https://www.orientwatchusa.com",
    //     interval: 3000,
    // });
    // r.collections.forEach(c => {
    //     r.items[c].forEach(w => {
    //         console.log(w);
    //     })
    // })
    // console.log(r);

    const rr = [
        'https://www.orientwatchusa.com/collections/orient-star/re-au0404n00b',
        // 'https://www.orientwatchusa.com/collections/orient-star/re-ay0001b00b',
    ];

    for (let i = 0; i < rr.length; i++) {
        const ex = await extraction({
            entry: rr[i],
            client: axios,
            brand: "Orient",
            brandID: 100,
        })
        console.log(ex);
    }
})();