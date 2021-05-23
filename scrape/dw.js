const axios = require('axios');
const cheerio = require('cheerio');
const sitemapper = require('sitemapper');

const indexing = async context => {
    const { client, entry, base, } = context;
    const baseURL = base ? base : 'https://www.danielwellington.com/us';
    const source = 'official';
    const lang = 'en';
    const brand = 'Daniel Wellington';
    const brandID = 438;
    const result = { source, lang, brand, brandID, collections: [], items: {} };
    try {
        const sitemap = new sitemapper({
            entry,
            timeout: 300000,
        })
        const sm = await sitemap.fetch();
        sm.sites.sort().forEach(url => {
            if (url.match(/dw-watch/i) && !url.match(/dw-watch-band/i)) {
                const u = url.split('/');
                const uu = u[u.length - 2].split('-');
                let idx = 0;
                if (uu[2] === 'men' || uu[2] === 'women') {
                    idx = 3;
                } else {
                    idx = 2;
                }
                const collection = idx > 0 ? uu[idx].toUpperCase() : 'OTHERS';
                const name = uu.slice(idx, uu.length).join(' ').toUpperCase();
                if (result.collections.indexOf(collection) < 0) {
                    result.collections.push(collection);
                    result.items[collection] = [];
                }
                result.items[collection].push({
                    source, lang, brand, brandID, url, collection, name,
                    reference: null, thumbnail: null, retail: null,
                })
            }
        })
        return result;
    } catch (error) {
        console.error('Failed indexing for Daniel Wellington with error : ', error);
        console.error('entry : ', entry);
        return {};
    }
}

const extraction = async context => {
    const { client, entry, base, ...rest } = context;
    const baseURL = base ? base : 'https://www.danielwellington.com/us';
    const result = { ...rest, url: entry, spec: [], };
    if (!result.source) result.source = 'official';
    if (!result.lang) result.lang = 'en';
    if (!result.brand) result.brand = 'Daniel Wellington';
    if (!result.brandID) result.brandID = 438;
    try {
        const { data } = await client.get(entry);
        const $ = cheerio.load(data);
        $('script[type="application/ld+json"]').each((idx, el) => {
            const c = $(el).contents().toString();
            const j = JSON.parse(c);
            if (j['@type'] === "Product") {
                if (j.offers) {
                    if (Array.isArray(j.offers)) {
                        const p = j.offers[0];
                        result.price = p.priceCurrency + p.price;
                    } else {
                        result.price = j.offers.priceCurrency + ' ' + j.offers.price;
                    }
                }
                result.reference = j.sku;
                result.description = j.description.replace(/\s+/g, ' ').trim();
                if (!result.name) result.name = j.name;
                if (!result.thumbnail) result.thumbnail = j.image ? Array.isArray(j.image) ? j.image[0] : j.image : null;
            }
        })
        $('section > div > div > div > div > div > div').each((idx, el) => {
            const cn = $(el).attr('class');
            if (cn && cn.match(/DetailsTable__Row/i)) {
                const key = $(el).find('span').first().text();
                const value = $(el).find('span').last().text();
                result.spec.push({ key, value });
            }
        })
    } catch (error) {
        console.error('Failed extraction for Daniel Wellington with error : ', error);
        if (error.response) result.code = error.response.status;
        else result.code = 'UNKNOWN ERROR';
    }
    return result;
}

(async () => {
    // const r = await indexing({
    //     entry: 'https://www.danielwellington.com/us/sitemap.xml',
    //     base: 'https://www.danielwellington.com/us',
    // })
    // r.collections && r.collections.forEach(c => {
    //     r.items[c].forEach(w => { console.log(w); });
    // })

    const u = [
        'https://www.danielwellington.com/us/dw-watch-classic-dover-rose-gold-36mm/',
        'https://www.danielwellington.com/us/dw-watch-classic-dover-rose-gold-white-28mm/',
        'https://www.danielwellington.com/us/dw-watch-classic-petite-ashfield-36-rose-gold/',
        'https://www.danielwellington.com/us/dw-watch-classic-petite-ashfield-36-silver/',
        'https://www.danielwellington.com/us/dw-watch-classic-petite-dover-rose-gold-black-32mm/',
        'https://www.danielwellington.com/us/dw-watch-classic-petite-dover-rose-gold-white-32mm/',
        'https://www.danielwellington.com/us/dw-watch-classic-petite-evergold-36-black/',
        'https://www.danielwellington.com/us/dw-watch-classic-petite-evergold-36-white/',
        'https://www.danielwellington.com/us/dw-watch-classic-petite-melrose-36-black/',
        'https://www.danielwellington.com/us/dw-watch-classic-petite-melrose-36-white/',
        'https://www.danielwellington.com/us/dw-watch-classic-petite-sterling-36-black/',
        'https://www.danielwellington.com/us/dw-watch-classic-petite-sterling-36-white/',
        'https://www.danielwellington.com/us/dw-watch-men-classic-bayswater-rose-gold-40mm/',
        'https://www.danielwellington.com/us/dw-watch-men-classic-bayswater-silver-40mm/',
        'https://www.danielwellington.com/us/dw-watch-men-classic-bedford-rose-gold-40mm/',
        'https://www.danielwellington.com/us/dw-watch-men-classic-bedford-silver-40mm/',
        'https://www.danielwellington.com/us/dw-watch-men-classic-black-bayswater-40mm-rose-gold/',
        'https://www.danielwellington.com/us/dw-watch-men-classic-black-bristol-rose-gold-40mm/',
        'https://www.danielwellington.com/us/dw-watch-men-classic-black-cornwall-rose-gold-40mm/',
        'https://www.danielwellington.com/us/dw-watch-men-classic-black-cornwall-silver-40mm/',
        'https://www.danielwellington.com/us/dw-watch-men-classic-black-reading-rose-gold-40mm/',
        'https://www.danielwellington.com/us/dw-watch-men-classic-black-reading-silver-40mm/',
        'https://www.danielwellington.com/us/dw-watch-men-classic-black-roselyn-40mm-rose-gold/',
        'https://www.danielwellington.com/us/dw-watch-men-classic-black-sheffield-rose-gold-40mm/',
        'https://www.danielwellington.com/us/dw-watch-men-classic-black-sheffield-silver-40mm/',
        'https://www.danielwellington.com/us/dw-watch-men-classic-black-st-mawes-rose-gold-40mm/',
        'https://www.danielwellington.com/us/dw-watch-men-classic-black-york-rose-gold-40mm/',
        'https://www.danielwellington.com/us/dw-watch-men-classic-bristol-rose-gold-40mm/',
        'https://www.danielwellington.com/us/dw-watch-men-classic-cambridge-rose-gold-40mm/',
        'https://www.danielwellington.com/us/dw-watch-men-classic-cambridge-silver-40mm/',
        'https://www.danielwellington.com/us/dw-watch-men-classic-canterbury-rose-gold-40mm/',
        'https://www.danielwellington.com/us/dw-watch-men-classic-cornwall-rose-gold-40mm/',
        'https://www.danielwellington.com/us/dw-watch-men-classic-durham-rose-gold-40mm/',
        'https://www.danielwellington.com/us/dw-watch-men-classic-glasgow-rose-gold-40mm/',
        'https://www.danielwellington.com/us/dw-watch-men-classic-glasgow-silver-40mm/',
        'https://www.danielwellington.com/us/dw-watch-men-classic-oxford-rose-gold-40mm/',
        'https://www.danielwellington.com/us/dw-watch-men-classic-reading-rose-gold-40mm/',
        'https://www.danielwellington.com/us/dw-watch-men-classic-reading-silver-40mm/',
        'https://www.danielwellington.com/us/dw-watch-men-classic-sheffield-rose-gold-40mm/',
        'https://www.danielwellington.com/us/dw-watch-men-classic-sheffield-silver-40mm/',
        'https://www.danielwellington.com/us/dw-watch-men-classic-southport-rose-gold-40mm/',
        'https://www.danielwellington.com/us/dw-watch-men-classic-southport-silver-40mm/',
        'https://www.danielwellington.com/us/dw-watch-men-classic-st-mawes-rose-gold-40mm/',
        'https://www.danielwellington.com/us/dw-watch-men-classic-st-mawes-silver-40mm/',
        'https://www.danielwellington.com/us/dw-watch-men-classic-york-rose-gold-40mm/',
        'https://www.danielwellington.com/us/dw-watch-women-classic-bayswater-rose-gold-36/',
        'https://www.danielwellington.com/us/dw-watch-women-classic-bedford-rose-gold-36mm/',
        'https://www.danielwellington.com/us/dw-watch-women-classic-bedford-silver-37mm/',
        'https://www.danielwellington.com/us/dw-watch-women-classic-black-cornwall-rose-gold-36mm/',
        'https://www.danielwellington.com/us/dw-watch-women-classic-black-cornwall-silver-36mm/',
        'https://www.danielwellington.com/us/dw-watch-women-classic-black-sheffield-rose-gold-36mm/',
        'https://www.danielwellington.com/us/dw-watch-women-classic-black-sheffield-silver-36mm/',
        'https://www.danielwellington.com/us/dw-watch-women-classic-black-st-mawes-rose-gold-36mm/',
        'https://www.danielwellington.com/us/dw-watch-women-classic-bristol-rose-gold-36mm/',
        'https://www.danielwellington.com/us/dw-watch-women-classic-canterbury-rose-gold-36mm/',
        'https://www.danielwellington.com/us/dw-watch-women-classic-canterbury-silver-36mm/',
        'https://www.danielwellington.com/us/dw-watch-women-classic-cornwall-rose-gold-36mm/',
        'https://www.danielwellington.com/us/dw-watch-women-classic-durham-rose-gold-36mm/',
        'https://www.danielwellington.com/us/dw-watch-women-classic-glasgow-silver-36mm/',
        'https://www.danielwellington.com/us/dw-watch-women-classic-petite-ashfield-rose-gold-black-28mm/',
        'https://www.danielwellington.com/us/dw-watch-women-classic-petite-ashfield-rose-gold/',
        'https://www.danielwellington.com/us/dw-watch-women-classic-petite-ashfield-silver-black-28mm/',
        'https://www.danielwellington.com/us/dw-watch-women-classic-petite-ashfield-silver/',
        'https://www.danielwellington.com/us/dw-watch-women-classic-petite-bondi-rose-gold-white-28mm/',
        'https://www.danielwellington.com/us/dw-watch-women-classic-petite-bondi-silver-white-28mm/',
        'https://www.danielwellington.com/us/dw-watch-women-classic-petite-bristol-white-rose-gold-32mm-mic/',
        'https://www.danielwellington.com/us/dw-watch-women-classic-petite-cornwall-rose-gold-black-28mm/',
        'https://www.danielwellington.com/us/dw-watch-women-classic-petite-cornwall-rose-gold-black-32mm/',
        'https://www.danielwellington.com/us/dw-watch-women-classic-petite-cornwall-silver-black-32mm/',
        'https://www.danielwellington.com/us/dw-watch-women-classic-petite-durham-rose-gold-white-28mm/',
        'https://www.danielwellington.com/us/dw-watch-women-classic-petite-durham-white-rose-gold-32mm/',
        'https://www.danielwellington.com/us/dw-watch-women-classic-petite-evergold-32-gold-black/',
        'https://www.danielwellington.com/us/dw-watch-women-classic-petite-evergold-32-gold-white/',
        'https://www.danielwellington.com/us/dw-watch-women-classic-petite-evergold-gold-black-28mm/',
        'https://www.danielwellington.com/us/dw-watch-women-classic-petite-evergold-gold-white-28mm/',
        'https://www.danielwellington.com/us/dw-watch-women-classic-petite-melrose-rose-gold-black-28mm/',
        'https://www.danielwellington.com/us/dw-watch-women-classic-petite-melrose-rose-gold-black/',
        'https://www.danielwellington.com/us/dw-watch-women-classic-petite-melrose-rose-gold-white-28mm/',
        'https://www.danielwellington.com/us/dw-watch-women-classic-petite-melrose-rose-gold-white/',
        'https://www.danielwellington.com/us/dw-watch-women-classic-petite-sheffield-black-rose-gold-32mm/',
        'https://www.danielwellington.com/us/dw-watch-women-classic-petite-sheffield-rose-gold-black-28mm/',
        'https://www.danielwellington.com/us/dw-watch-women-classic-petite-sheffield-rose-gold-white-28mm/',
        'https://www.danielwellington.com/us/dw-watch-women-classic-petite-sheffield-silver-white-28mm/',
        'https://www.danielwellington.com/us/dw-watch-women-classic-petite-sheffield-white-rose-gold-32mm/',
        'https://www.danielwellington.com/us/dw-watch-women-classic-petite-sheffield-white-silver-32mm/',
        'https://www.danielwellington.com/us/dw-watch-women-classic-petite-st-mawes-black-rose-gold-32mm/',
        'https://www.danielwellington.com/us/dw-watch-women-classic-petite-st-mawes-rose-gold-black-28mm/',
        'https://www.danielwellington.com/us/dw-watch-women-classic-petite-st-mawes-rose-gold-white-28mm/',
        'https://www.danielwellington.com/us/dw-watch-women-classic-petite-st-mawes-white-rose-gold-32mm/',
        'https://www.danielwellington.com/us/dw-watch-women-classic-petite-sterling-silver-black-28mm/',
        'https://www.danielwellington.com/us/dw-watch-women-classic-petite-sterling-silver-black/',
        'https://www.danielwellington.com/us/dw-watch-women-classic-petite-sterling-silver-white-28mm/',
        'https://www.danielwellington.com/us/dw-watch-women-classic-petite-sterling-silver-white/',
        'https://www.danielwellington.com/us/dw-watch-women-classic-petite-white-bondi-rose-gold-32mm/',
        'https://www.danielwellington.com/us/dw-watch-women-classic-roselyn-rose-gold-36/',
        'https://www.danielwellington.com/us/dw-watch-women-classic-roselyn-silver-36mm/',
        'https://www.danielwellington.com/us/dw-watch-women-classic-sheffield-rose-gold-36mm/',
        'https://www.danielwellington.com/us/dw-watch-women-classic-sheffield-silver-36mm/',
        'https://www.danielwellington.com/us/dw-watch-women-classic-southampton-rose-gold-36mm/',
        'https://www.danielwellington.com/us/dw-watch-women-classic-southport-rose-gold-36mm/',
        'https://www.danielwellington.com/us/dw-watch-women-classic-southport-silver-36mm/',
        'https://www.danielwellington.com/us/dw-watch-women-classic-st-mawes-rose-gold-36mm/',
        'https://www.danielwellington.com/us/dw-watch-women-classic-winchester-rose-gold-36mm/',
        'https://www.danielwellington.com/us/dw-watch-iconic-link-ceramic-28-black/',
        'https://www.danielwellington.com/us/dw-watch-iconic-link-ceramic-32-black/',
        'https://www.danielwellington.com/us/dw-watch-iconic-link-emerald-rose-gold-28-green/',
        'https://www.danielwellington.com/us/dw-watch-iconic-link-emerald-rose-gold-32-green/',
        'https://www.danielwellington.com/us/dw-watch-iconic-link-emerald-rose-gold-36-green/',
        'https://www.danielwellington.com/us/dw-watch-iconic-link-emerald-silver-40-green/',
        'https://www.danielwellington.com/us/dw-watch-iconic-link-lumine-rose-gold-silver-28-white/',
        'https://www.danielwellington.com/us/dw-watch-iconic-link-lumine-rose-gold-silver-32-white/',
        'https://www.danielwellington.com/us/dw-watch-iconic-link-rose-gold-28-black/',
        'https://www.danielwellington.com/us/dw-watch-iconic-link-rose-gold-28-white/',
        'https://www.danielwellington.com/us/dw-watch-iconic-link-rose-gold-32-black/',
        'https://www.danielwellington.com/us/dw-watch-iconic-link-rose-gold-32-white/',
        'https://www.danielwellington.com/us/dw-watch-iconic-link-rose-gold-36-black/',
        'https://www.danielwellington.com/us/dw-watch-iconic-link-rose-gold-36-white/',
        'https://www.danielwellington.com/us/dw-watch-iconic-link-rose-gold-40-black/',
        'https://www.danielwellington.com/us/dw-watch-iconic-link-rose-gold-40-white/',
        'https://www.danielwellington.com/us/dw-watch-iconic-link-silver-28-black/',
        'https://www.danielwellington.com/us/dw-watch-iconic-link-silver-28-white/',
        'https://www.danielwellington.com/us/dw-watch-iconic-link-silver-32-black/',
        'https://www.danielwellington.com/us/dw-watch-iconic-link-silver-32-white/',
        'https://www.danielwellington.com/us/dw-watch-iconic-link-silver-36-black/',
        'https://www.danielwellington.com/us/dw-watch-iconic-link-silver-36-white/',
        'https://www.danielwellington.com/us/dw-watch-iconic-link-silver-40-black/',
        'https://www.danielwellington.com/us/dw-watch-iconic-link-silver-40-white/',
        'https://www.danielwellington.com/us/dw-watch-iconic-link-unitone-gold-28/',
        'https://www.danielwellington.com/us/dw-watch-iconic-link-unitone-rose-gold-28/',
        'https://www.danielwellington.com/us/dw-watch-iconic-link-unitone-silver-28/',
        'https://www.danielwellington.com/us/dw-watch-iconic-motion-rose-gold-32-black/',
        'https://www.danielwellington.com/us/dw-watch-iconic-motion-rose-gold-40-black/',
        'https://www.danielwellington.com/us/dw-watch-iconic-motion-silver-40-black/',
        'https://www.danielwellington.com/us/dw-watch-petite-pressed-ashfield-rose-gold-black-24/',
        'https://www.danielwellington.com/us/dw-watch-petite-pressed-melrose-rose-gold-black-24/',
        'https://www.danielwellington.com/us/dw-watch-petite-pressed-melrose-rose-gold-white-24/',
        'https://www.danielwellington.com/us/dw-watch-petite-pressed-sterling-white-24/',
        'https://www.danielwellington.com/us/dw-watch-petite-rosewater-rose-gold-white-28mm/',
        'https://www.danielwellington.com/us/dw-watch-petite-rosewater-rose-gold-white-32mm/',
        'https://www.danielwellington.com/us/dw-watch-petite-rosewater-rose-gold-white-36mm/',
        'https://www.danielwellington.com/us/dw-watch-petite-sheffield-rose-gold-black-24/',
        'https://www.danielwellington.com/us/dw-watch-petite-sheffield-rose-gold-white-24/',
        'https://www.danielwellington.com/us/dw-watch-quadro-pressed-ashfield-rose-gold-black-20x26mm/',
        'https://www.danielwellington.com/us/dw-watch-quadro-pressed-melrose-rose-gold-black-20x26mm/',
        'https://www.danielwellington.com/us/dw-watch-quadro-pressed-melrose-rose-gold-green-20x26mm/',
        'https://www.danielwellington.com/us/dw-watch-quadro-pressed-melrose-rose-gold-white-20x26mm/',
        'https://www.danielwellington.com/us/dw-watch-quadro-pressed-sheffield-rose-gold-black-20x26mm-3648/',
        'https://www.danielwellington.com/us/dw-watch-quadro-pressed-sheffield-rose-gold-black-20x26mm/',
        'https://www.danielwellington.com/us/dw-watch-quadro-pressed-sheffield-rose-gold-green-20x26mm/',
        'https://www.danielwellington.com/us/dw-watch-quadro-pressed-sterling-silver-white-20x26mm/',
    ];

    for (let i = 0; i < u.length; i++) {
        const ex = await extraction({
            client: axios,
            entry: u[i],
        })
        console.log(ex);
    }
    console.log('done.')
    process.exit(0)
})();