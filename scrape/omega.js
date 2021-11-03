const axios = require('axios');
const cheerio = require('cheerio');

const sleep = async t => {
    await new Promise(r => setTimeout(r, t));
}

const indexing = async (context) => {
    const { client, entry, interval, } = context;
    const source = "official";
    const lang = "en";
    const brand = "Omega";
    const brandID = 20;
    const result = { source, lang, brand, brandID, collections: [], items: {} };
    const PageCount = 24;
    const cats = [];
    try {
        const { data } = await client.get(entry);
        const $ = cheerio.load(data);
        $(".ow-collection__list-item").each((idx, el) => {
            const subCollection = $(el).find("a").text().replace(/\s+/g, ' ').trim();
            const href = $(el).find("a").attr("href");
            const coll = href.split('/')[5];
            const collection = coll[0].toUpperCase() + coll.slice(1);
            const url = href.replace("/product", "/catalog");
            result.collections.push({ collection, subCollection });
            result.items[collection + ' ' + subCollection] = [];
            cats.push({ collection, subCollection, url });
        })
        for (const cat of cats) {
            console.log(cat.url);
            await sleep(5000);
            const { data } = await client.get(cat.url);
            const $ = cheerio.load(data);
            const count = parseInt($('.ow-filters__counter').first().find("span").text());
            const totalPage = Math.ceil(count / PageCount);
            console.log(`${cat.collection} ${cat.subCollection}    count : ${count}       totalPage : ${totalPage}`);
            for (let i = 1; i <= totalPage; i++) {
                const link = cat.url + '?p=' + i;
                console.log(link);
                await sleep(5000);
                const { data } = await client.get(link);
                const $ = cheerio.load(data);
                $('.product-item').each((idx, el) => {
                    const url = $(el).find('a').attr('href');
                    const th = $(el).find('source').attr('data-srcset');
                    const thumbnail = th.split(' ')[0];
                    const ref = $(el).find('img').attr('alt');
                    const refr = ref.split(';');
                    const refrn = refr[refr.length - 1].split('-');
                    const reference = refrn[refrn.length - 1].trim();
                    const name = $(el).find(".ow-prod__desc-top").find('p').text();
                    const retail = $(el).find('.price').text().trim();
                    const key = cat.collection + ' ' + cat.subCollection;
                    result.items[key].push({
                        source, lang, brand, brandID, url, collection: cat.collection,
                        subCollection: cat.subCollection, name, reference, retail,
                        thumbnail,
                    });
                })
            }
        }
        return result;
    } catch (error) {
        console.error('Failed indexing for Omega with error : ' + error);
        return {};
    }
};

const extraction = async (context) => {
    const { client, entry, ...rest } = context;
    const result = { ...rest, url: entry, spec: [], related: [], variations: [], };
    result.source = "official";
    result.lang = "en";
    result.brand = "Omega";
    result.brandID = 20;
    try {
        const res = await client.get(entry);
        const cUrl = res.request.res.responseUrl;
        if (cUrl != entry) {
            result.code = 404;
            return;
        }
        const { data } = res;
        const $ = cheerio.load(data);
        const url = $('meta[property="og:url"]').attr('content');
        if (url !== entry) {
            result.code = 404;
            return result;
        }
        result.gender = 'M';
        const img = data.match(/"full":"https:\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?.png"/ig);
        if (img) result.thumbnail = img[0].split(":")[1].replace(/"/g, "").trim();
        if (!result.thumbnail) result.thumbnail = $('meta[property="og:image"]').attr('content');
        $('script[type="application/ld+json"]').each((idx, el) => {
            const c = $(el).contents().toString();
            const j = JSON.parse(c);
            if ((j['@type']) === 'Product') {
                result.name = j.name;
                result.reference = j.sku;
                result.description = j.description;
                if (j.offers) result.retail = j.offers.priceCurrency + ' ' + j.offers.price;
            }
        })
        $('.pm-feature-tooltip a').each((idx, el) => {
            const key = 'Features';
            const value = $(el).text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
            result.spec.push({ key, value });
        });
        $('.product-info-data-content.technical-data.watches li').each((idx, el) => {
            const key = $(el).find('strong').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
            const value = $(el).find('span').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
            result.spec.push({ key, value });
        });
        $('.pm-grid-center.pm-module-37-title').each((idx, el) => {
            const key = 'Caliber...';
            const value = $(el).find('h2').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
            result.spec.push({ key, value });
        });
        $('.pm-module-37-pictos li').each((idx, el) => {
            const value = $(el).find('span').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
            if (value.match(/hours/i)) {
                const key = 'Power Reserve';
                result.spec.push({ key, value });
            } else {
                const key = 'Caliber Type';
                result.spec.push({ key, value });
            }
        });
        {
            const value = $('#ow-mod_caliber_product_page').find('.pm-title').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
            const key = 'caliber_ref';
            result.spec.push({ key, value });
        }
        {
            const value = $('#ow-mod_caliber_product_page').find('.pm-text').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
            const key = 'caliber_text';
            result.spec.push({ key, value });
        }
        {
            const value = $('#ow-mod_caliber_product_page').find('.ow-mod_37__picto--power-reserve').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
            const key = 'power_reserve';
            result.spec.push({ key, value });
        }
        {
            const value = $('#ow-mod_caliber_product_page').find('.ow-mod_37__picto--self-winding').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
            const key = 'caliber_movement';
            result.spec.push({ key, value });
        }
        $('.ow-product-list>li').each((idx, el) => {
            if (idx < 20) {
                const i = $(el).find('img').attr('alt');
                const ir = i.split('-');
                const v = ir[ir.length - 1].trim();
                result.variations.push(v);
            }
        });
    } catch (error) {
        console.error('Failed extraction for Omega with error : ' + error);
        console.error('entry : ', entry)
        if (error.response) result.code = error.response.status;
        else result.code = 'UNKNOWN ERROR';
    }
    return result;
};

(async () => {
    // const r = await indexing({
    //     client: axios,
    //     "base": "https://www.omegawatches.com/en-us",
    //     "entry": "https://www.omegawatches.com/en-us/watches",
    // });
    // let cnt = 0;
    // console.log(r);
    // r.collections && r.collections.forEach(c => {
    //     const cc = c.collection + " " + c.subCollection;
    //     r.items[cc].forEach(w => {
    //         console.log(w);
    //         cnt++;
    //     })
    // })
    const rr = [
        'https://www.omegawatches.com/en-us/watch-omega-de-ville-prestige-quartz-24-4-mm-42420246055001',
        'https://www.omegawatches.com/en-us/watch-omega-de-ville-tourbillon-co-axial-chronometer-numbered-edition-44-mm-52853442103001',
        'https://www.omegawatches.com/en-us/watch-omega-de-ville-tourbillon-co-axial-chronometer-numbered-edition-38-7-mm-51353392199001',
        'https://www.omegawatches.com/en-us/watch-omega-de-ville-tourbillon-co-axial-chronometer-limited-edition-38-7-mm-51398392156001',
        'https://www.omegawatches.com/en-us/watch-omega-de-ville-tourbillon-co-axial-master-chronometer-43-mm-52953432201001',
    ];
    for (let i = 0; i < rr.length; i++) {
        const ex = await extraction({
            client: axios,
            entry: rr[i],
            base: "https://www.omegawatches.com/en-us",
        });
        console.log(ex);
        console.log();
    }
    // console.log(`cnt : ${cnt}`);
    console.log();
    console.log('done...........');
})()