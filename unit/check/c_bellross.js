const cheerio = require('cheerio');
const client = require('axios');

const indexing = async (context) => {
    try {
        const { entry } = context;
        const result = { source: 'official', collections: [], items: {} };
        const $ = cheerio.load((await client.get(entry)).data);
        $('.vintage_sec.comm_sel h1').each((idx, el) => {
            const name = $(el).text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
            result.collections.push(name);
            result.items[name] = [];
        });
        $('.gall_sec_rht li').each((idx, el) => {
            const url = $(el).find('a').attr('href');
            const thumbnail = $(el).find('a img').attr('src');
            const retail = $(el).find('.price-category').text();
            const name = $(el).find('a img').attr('alt');
            let collection = '';
            if (url.match(/vintage/i)) {
                collection = 'Vintage';
            }
            if (url.match(/instruments/i)) {
                collection = 'Instruments';
            }
            if (url.match(/experimental/i)) {
                collection = 'Experimental';
            }
            if (name) {
                result.items[collection].push({
                    url,
                    thumbnail,
                    collection,
                    name,
                    retail
                });
            }
        });
        return result;
    }
    catch (error) {
        console.log('Failed for indexing class of Bell Ross ' +
            ' with error : ' + error
        )
        return [];
    }
};

const extraction = async (context) => {
    try {
        const { url: entry, collection, name, retail } = context;
        console.log(entry)
        const result = {
            url: entry,
            collection,
            name,
            retail,
            scripts: [],
            spec: [],
            related: []
        };
        const $ = cheerio.load((await client.get(entry)).data);
        $('.tech_spec_cont p').each((idx, el) => {
            const key = $(el).text().split(':')[0];
            const value = $(el).text().split(':')[1] ? $(el).text().split(':')[1].trim() : '';
            if (key && value) {
                result.spec.push({ key, value });
            }
        });
        $('.product_desc_dtls_mid p').each((idx, el) => {
            result.reference = $(el).text().trim().replace(/(?:\r\n|\r|\n|\s+)/g, " ").replace('Ref:', '').trim();
        });
        result.gender = 'M';
        return result;
    } catch (error) {
        console.log('Failed for extraction class of Bell & Ross ' +
            ' with error : ' + error
        )
        return [];
    }
};

(async () => {
    const c = { entry: "https://www.bellross.com/our-collections" }
    const r = await indexing(c);
    console.log((r.items[r.collections[0]][0]))
    if (r) {
        const e = await extraction(r.items[r.collections[0]][0]);
        if (e.spec && e.spec.length > 0) {
            console.log(e)
        } else {
            console.log('extraction failed...')
        }
    } else {
        console.log('indexing failed...')
    }
})();
