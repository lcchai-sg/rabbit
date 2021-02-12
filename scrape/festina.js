const axios = require('axios');
const cheerio = require('cheerio');

const indexing = async context => {
    const { client, entry, base, } = context;
    const baseURL = base ? base : "https://festina.com";
    const source = "official";
    const lang = "en";
    const brand = "Festina";
    const brandID = 364;
    const result = { source, lang, brand, brandID, collections: [], items: {} };
    const cats = [];
    try {
        const { data } = await client.get(entry);
        const $ = cheerio.load(data);
        $(".panel-container").each((idx, el) => {
            const t = $(el).text();
            if (t.match(/collections/i)) {
                // get the collections
                $(el).find("a").each((idx, el) => {
                    const n = $(el).text().trim();
                    const nm = n.split(" ");
                    const name = nm.slice(0, nm.length - 1).join(" ");
                    const url = baseURL + $(el).attr('href');
                    cats.push({ name, url });
                    result.collections.push(name);
                    result.items[name] = [];
                })
            }
        })
        for (const cat of cats) {
            let next = cat.url;
            do {
                console.log(next);
                const { data } = await client.get(next);
                const $ = cheerio.load(data);
                $('script[type="application/ld+json"]').each((idx, el) => {
                    const j = JSON.parse($(el).contents().toString());
                    if (j['@type'] === 'ItemList') {
                        const il = j['itemListElement'];
                        for (let i = 0; i < il.length; i++) {
                            const url = il[i].item.url.replace('https://festina.com', 'https://festina.com/en-GB');
                            const name = il[i].item.name;
                            const reference = il[i].item.sku;
                            const thumbnail = il[i].item.image;
                            const retail = il[i].item.offers && il[i].item.offers.price ? il[i].item.offers.priceCurrency + ' ' + il[i].item.offers.price : null;
                            const collection = cat.name;
                            result.items[collection].push({
                                source, lang, brand, brandID, url, collection, name,
                                reference, thumbnail, retail,
                            })
                        }
                    }
                });
                next = $('link[rel="next"]').attr('href');
                await new Promise(r => setTimeout(r, 3000));
            } while (next);
        }
        return result;
    } catch (error) {
        console.error('Failed indexing for Festina with error : ', error);
        return {};
    }
}

const extraction = async context => {
    const { client, entry, ...rest } = context;
    const result = { ...rest, url: entry, spec: [], related: [], variations: [], };
    try {
        const { data } = await client.get(entry);
        const $ = cheerio.load(data);
        result.name = $('meta[property="og:title"]').attr('content');
        result.description = $('meta[property="og:description"]').attr('content').trim();
        result.thumbnail = $('meta[property="og:image"]').attr('content');
        $('script[type="application/ld+json"]').each((idx, el) => {
            const j = JSON.parse($(el).contents().toString());
            if (j['@type'] === 'Product') {
                result.reference = j.sku;
                result.gtin = j.gtin;
                result.retail = j.offers && j.offers.price ? j.offers.priceCurrency + ' ' + j.offers.price : null;
            }
        })
        $('#especificaciones').find(".row.ng-star-inserted").each((idx, el) => {
            const key = $(el).find(".col-6.subtitle-4").text().trim();
            const value = $(el).find(".col-6.header-6.spec").text().trim();
            result.spec.push({ key, value });
        })
        $(".img-fluid.miniatura").each((idx, el) => {
            const m = $(el).attr('alt');
            if (m !== result.reference) result.variations.push(m);
        })
        $(".card-image.ng-star-inserted").each((idx, el) => {
            const ref = $(el).find("img").attr("alt");
            if (ref) result.related.push(ref);
        })
    } catch (error) {
        console.error('Failed extraction for Festina with error : ', error);
        console.error('entry : ', entry);
        if (error.response) result.code = error.response.status;
        else result.code = 'UNKNOWN ERROR';
    }
    return result;
}

(async () => {
    // const r = await indexing({
    //     client: axios,
    //     entry: "https://festina.com/en-GB/watch",
    //     base: "https://festina.com",
    // })
    // r.collections.forEach(c => {
    //     console.log(`collection : ${c}   watches: ${r.items[c].length}`);
    //     r.items[c].forEach(w => console.log(w))
    // })

    const r = [
        'https://festina.com/en-GB/watch/man/festina/festina-automatic-watch-f20480_1-blue-steel-bracelet-man.html',
        'https://festina.com/en-GB/watch/woman/festina/festina-automatic-watch-f20485_1-silver-colour-steel-bracelet-woman.html',
        'https://festina.com/en-GB/watch/man/festina/festina-automatic-watch-f20537_1.html',
        'https://festina.com/en-GB/watch/woman/festina/festina-automatic-watch-f20538_1.html',
        'https://festina.com/en-GB/watch/woman/festina/festina-boyfriend-collection-watch-f20503_1-nacar-steel-bracelet-woman.html',
        'https://festina.com/en-GB/watch/man/festina/festina-ceramic-watch-f20516_2-black-rubber-strap-man.html',
        'https://festina.com/en-GB/watch/woman/festina/festina-ceramic-watch-f20497_1-white-steel-bracelet-woman.html',
    ];

    for (let i = 0; i < r.length; i++) {
        const ex = await extraction({
            client: axios,
            entry: r[i],
            base: "https://festina.com",
        });
        console.log(ex);
    }
})();