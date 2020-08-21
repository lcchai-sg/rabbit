const client = require('axios');
const cheerio = require('cheerio');

const indexing = async (context) => {
    try {
        const { entry, base } = context;
        const result = { collections: [], items: {} };
        const $ = cheerio.load((await client.get(entry)).data);
        const cats = [];
        $('.vac-colctrl').each((idx, el) => {
            const url = base + $(el).find('.vac-ctapush__content a').attr('href');
            const name = $(el).find('.vac-ctapush__title').text();
            result.collections.push(name);
            result.items[name] = [];
            cats.push({ name, url });
        });
        for (const cat of cats) {
            const $$ = cheerio.load((await client.get(cat.url)).data);
            $$('.cell.small-6.medium-4.large-3').each((idx, el) => {
                const url = base + $$(el).find('.vac-productpush.vac-productpush--vertical a').attr('href');
                const name = $$(el).find('.vac-productpush__title').text().trim() + ' ' + $$(el).find('.vac-productpush__specs').text().trim();
                const thumbnail = base + $$(el).find('.vac-productpush.vac-productpush--vertical a img').attr('data-src');
                const retail = $$(el).find('.vac-productpush__price').text().trim();
                let reference = $$(el).find('.vac-productpush.vac-productpush--vertical a').attr('data-tracking-product').trim();
                result.items[cat.name].push({
                    url,
                    thumbnail,
                    collection: cat.name,
                    name,
                    reference,
                    retail
                });
            });
            return result;
        }
        return result;
    } catch (error) {
        console.log('Failed indexing for Vacheron Constantin with error : ' + error);
        return [];
    }
};

const extraction = async (context) => {
    try {
        const { url: entry, base } = context;
        const result = {
            url: entry,
            reference: "",
            scripts: [],
            spec: [],
            related: [],
        };
        const $ = cheerio.load((await client.get(entry)).data);
        const name = $('.product-detail__title').text().trim() + ' ' + $('.product-detail__specs').text().trim();
        const reference = $('.product-detail__reference').text().replace('Reference:', '').trim() ? $('.product-detail__reference').text().replace('Reference:', '').trim() : '';
        $('.product-related__carousel a').each((idx, el) => {
            const related = base + $(el).attr('href');
            result.related.push(related);
        });
        let count = 1;
        $('.product-specifications__specs li').each((idx, el) => {
            let key = $(el).find('label').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ");
            if (key.toLowerCase() === 'material' && count === 1) {
                key = 'Case Material';
                count++;
            }
            if (key.toLowerCase() === 'material' && count === 2) {
                key = 'Band Material';
                count++;
            }
            if (key.toLowerCase() === 'material' && count === 3) {
                key = 'Buckle Material';
                count++;
            }
            const value = $(el).find('p').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ");
            if (key) {
                result.spec.push({ key, value });
            }
        });
        result.name = name;
        result.reference = reference;
        result.gender = 'X';
        return result;
    } catch (error) {
        console.log('Failed extraction for Vacheron Constantin with error : ' + error);
        return [];
    }
};

(async () => {
    const context = {
        entry: "https://www.vacheron-constantin.com/en/all_collections.html",
        base: "https://www.vacheron-constantin.com/",
    };
    const r = await indexing(context);
    console.log(r)
    if (r && r.items && r.collections) {
        const context = r.items[r.collections[0]][0];
        console.log(context)
        // const context = {
        //     url: "https://www.tissotwatches.com/en-en/shop/t1274071104100.html",
        //     base: "https://www.tissotwatches.com/",
        // }
        const e = await extraction(context);
        if (e.spec && e.spec.length > 0) {
            console.log(e)
        } else {
            console.log('extraction failed...')
            console.log(e)
        }
    } else {
        console.log('indexing failed...')
    }
})();

