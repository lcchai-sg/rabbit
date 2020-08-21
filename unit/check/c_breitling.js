const cheerio = require('cheerio');
const client = require('axios');

const indexing = async (context) => {
    try {
        const { entry, base } = context;
        const result = { collections: [], items: {} };
        const $ = cheerio.load((await client.get(entry)).data);
        const watches = [];

        $('.modelBox a').each((idx, el) => {
            const name = $(el).find('.description .model-name ').text();
            const url = $(el).attr('href');
            result.collections.push(name);
            result.items[name] = [];
            watches.push({ url, name });
        });
        for (const watch of watches) {
            const link = base + watch.url;
            const $$ = cheerio.load((await client.get(link)).data);
            $$('div#versions-result-container .soldier').each((idx, el) => {
                const url = base + $$(el).find('a').attr('href');
                const thumbnail = base + $$(el).find('img').attr('src');
                const name = $$(el).find('img').attr('alt');
                const reference = name.trim().slice(-13);
                result.items[watch.name].push({
                    url,
                    thumbnail,
                    collection: watch.name,
                    name,
                    reference
                });
            });
        }
        return result;
    }
    catch (error) {
        console.log('Failed for indexing class of Breitling ' +
            ' with error : ' + error
        )
        return [];
    }
};

const extraction = async (context) => {
    try {
        const { url: entry, base } = context;
        const result = { url: entry, scripts: [], spec: [], related: [] };
        const $ = cheerio.load((await client.get(entry)).data);
        const reference = $('.pr-reference').text().trim();

        result.retail = $('.pr-price').text().trim().replace(' Excl. Sales Tax', '');
        result.name = $('.pr-informations h1').text().trim();
        result.collection = entry.split('/watches/')[1].split('/')[0];
        result.thumbnail = base + $('.version-slider-cell').find('img').attr('src')
        result.reference = reference;
        result.gender = 'M';
        result.description = $('section > .brContent > div > div > p#version-description').text().trim();

        $('.dtech tr').each((idx, el) => {
            const key = $(el).find('th').text();
            let value = '';
            $(el).find('td').each((idx, el) => {
                value += $(el).text().trim();
            });
            result.spec.push({ key, value });
        });
        return result;
    }
    catch (error) {
        console.log('Failed for extraction class of Breitling' +
            ' with error : ' + error
        )
        return [];
    }
};

(async () => {
    const context = {
        entry: "https://www.breitling.com/us-en/watches/",
        base: "https://www.breitling.com",
    };
    const r = await indexing(context);
    console.log(r)
    if (r && r.items && r.collections) {
        const context = r.items[r.collections[0]][0];
        const e = await extraction(context);
        if (e.spec && e.spec.length > 0) {
            console.log(e)
        } else {
            console.log('extraction failed...')
        }
    } else {
        console.log('indexing failed...')
    }
})();
