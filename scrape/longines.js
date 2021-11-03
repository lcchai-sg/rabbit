const axios = require('axios');
const cheerio = require('cheerio');
const e = "https://www.longines.com/en-us/watches";

const indexing = async (context) => {
    const { client, entry, interval, } = context;
    const source = "official";
    const lang = "en";
    const brand = "Longines";
    const brandID = 120;
    const result = { source, lang, brand, brandID, collections: [], items: {} };
    const cats = [];
    try {
        const { data } = await client.get(entry);
        const $ = cheerio.load(data);
        $(".lg-oc__slider-item-link").each((idx, el) => {
            const url = $(el).attr("href");
            const name = $(el).text().replace(/\s+/g, " ").trim();
            cats.push({ name, url });
        })
        console.log(cats);
        // $('#watches-menu-tabs').find('.level2').each((idx, el) => {
        //     const collection = $(el).find('.title').text();
        //     $(el).find('.level3').each((idx, el) => {
        //         const subCollection = $(el).text();
        //         const url = $(el).find('a').attr('href');
        //         if (collection && url)
        //             cats.push({ collection, subCollection, url });
        //     })
        // })
        let count = 0;
        for (let i = 0; i < cats.length; i++) {
            let cp = 0; let cnt = 0; let prev = '';
            const collection = cats[i].name;
            if (result.collections.indexOf(collection) < 0) {
                result.collections.push(collection);
                result.items[collection] = [];
            }
            do {
                cp++;
                cnt = 0;
                const link = cats[i].url + "?p=" + cp;
                console.debug(link);
                const { data } = await client.get(link);
                const $ = cheerio.load(data);
                $('.lg-prod--watch').each((idx, el) => {
                    const thumbnail = $(el).find('picture').find('source').first().attr('data-srcset');
                    const url = $(el).find(".seo-link-target").attr('href');
                    const name = $(el).find('.lg-prod__collection').first().text().replace(/\s+/g, ' ').trim();
                    const reference = $(el).find('.lg-prod__collection').first().next().text().replace(/\s+/g, ' ').trim();
                    const retail = $(el).find('.price-final_price').first().text().replace(/\s+/g, ' ').trim();
                    if (idx === 0) {
                        if (name + reference === prev) prev = 'STOP';
                        else prev = name + reference;
                    }
                    result.items[collection].push({
                        source, lang, brand, brandID, url, collection,
                        name, reference, retail, thumbnail,
                    })
                    cnt++;
                    count++;
                })
                await new Promise(r => setTimeout(r, interval));
            } while (cnt >= 18 && prev !== 'STOP');
        }
        console.debug('total : ', count);
        return result;
    } catch (error) {
        console.error('Failed indexing for Longines with error : ' + error);
        return {};
    }
};

(async () => {
    const r = await indexing({
        client: axios,
        entry: e,
    })
    let cnt = 0;
    r.collections && r.collections.forEach(c => {
        r.items[c].forEach(w => {
            console.log(w);
            cnt++;
        })
    })
    console.log();
    console.log(`total : ${cnt}`);
})()