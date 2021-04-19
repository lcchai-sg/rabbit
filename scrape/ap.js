const axios = require('axios');
const cheerio = require('cheerio');
const sitemapper = require('sitemapper');

const indexing = async context => {
    const { client, entry, base, r_uniq, } = context;
    const baseURL = base ? base : "https://www.audemarspiguet.com";
    const source = 'official';
    const lang = 'en';
    const brand = 'Audemars Piguet';
    const brandID = 18;
    const result = { source, lang, brand, brandID, collections: [], items: {} };
    try {
        const { data } = await client.get(entry);
        const $ = cheerio.load(data);
        $('.js-product-grid').each((idx, el) => {
            const href = $(el).find('a').attr('href');
            if (href) {
                const url = href ? baseURL + href : null;
                const img = $(el).find('img').attr('data-src');
                const thumbnail = img ? baseURL + img : null;
                const collection = $(el).find('.ap-productpush__title').find('b').text().trim();
                const name = $(el).text().replace(/\s+/g, ' ').trim();
                if (result.collections.indexOf(collection) < 0) {
                    result.collections.push(collection);
                    result.items[collection] = [];
                }
                if (r_uniq.indexOf(url) < 0) r_uniq.push(url);
                result.items[collection].push({
                    source, lang, brand, brandID, url, collection, name,
                    reference: null, thumbnail, retail: null,
                })
            }
        })
        return result;
    } catch (error) {
        console.error('Failed indexing for Audemars Piguet with error : ', error);
        return {};
    }
}

const xmlIndexing = async context => {
    const { client, entry, base, rr_uniq, } = context;
    const baseURL = base ? base : "https://www.audemarspiguet.com";
    const source = 'official';
    const lang = 'en';
    const brand = 'Audemars Piguet';
    const brandID = 18;
    const result = { source, lang, brand, brandID, collections: [], items: {} };
    try {
        const sitemap = new sitemapper({
            url: entry,
            timeout: 300000,
        });
        const sm = await sitemap.fetch();
        sm.sites.forEach(url => {
            if (url.match(/watch-collection/i)) {
                const u = url.split('/');
                if (u.length === 8) {
                    const collection = u[6];
                    const name = (u[6] + ' ' + u[7].replace('.html', '').trim()).toUpperCase();
                    const reference = u[7].replace('.html', '').trim().toUpperCase();
                    if (result.collections.indexOf(collection) < 0) {
                        result.collections.push(collection);
                        result.items[collection] = [];
                    }
                    if (rr_uniq.indexOf(url) < 0) rr_uniq.push(url);
                    result.items[collection].push({
                        source, lang, brand, brandID, url, collection, name,
                        reference, thumbnail: null, retail: null,
                    })
                }
            }
        })
        return result;
    } catch (error) {
        console.error('Failed indexing for Audemars Piguet with error : ', error);
        return {};
    }
}

(async () => {
    const r_uniq = []; const rr_uniq = [];
    const r = await indexing({
        client: axios,
        entry: "https://www.audemarspiguet.com/com/en/watch-collection.html",
        base: "https://www.audemarspiguet.com",
        r_uniq,
    })
    // console.log(r);
    let cnt = 0;
    r.collections.forEach(c => {
        r.items[c].forEach(w => {
            cnt++;
            console.log(w);
        })
    })
    console.log();
    console.log('watches : ', cnt, r_uniq.length);
    console.log();
    const rr = await xmlIndexing({
        entry: "https://www.audemarspiguet.com/com/en/sitemap.xml",
        base: "https://www.audemarspiguet.com",
        rr_uniq,
    });
    cnt = 0;
    rr.collections.forEach(c => {
        rr.items[c].forEach(w => {
            cnt++;
            console.log(w);
        })
    })
    console.log();
    console.log('watches : ', cnt, rr_uniq.length);
    console.log();
    console.log('done.');
    process.exit(0);
})()
