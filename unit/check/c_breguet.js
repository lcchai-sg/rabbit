const client = require('axios');
const cheerio = require('cheerio');

const indexing = async (context) => {
    try {
        const { entry, base } = context;
        const result = { collections: [], items: {} };
        const cats = [];
        const $ = cheerio.load((await client.get(entry)).data);
        $('.views-row ').each((idx, el) => {
            const name = $(el).find('h2 a').text();
            const url = base + $(el).find('h2 a').attr('href');
            const amount = $(el).find('.watches-number').text().replace('models', '').trim();
            const page = Math.floor(parseInt(amount) / 12);
            if (name && url) {
                cats.push({ name, url, page });
                result.collections.push(name);
                result.items[name] = [];
            }
        });
        for (const cat of cats) {
            const $$ = cheerio.load((await client.get(cat.url)).data);
            $$('.item-list .views-row a').each((idx, el) => {
                const url = base + $$(el).attr('href');
                const thumbnail = base + $$(el).find('img').attr('src');
                const name = $$(el).find('h2').text();
                result.items[cat.name].push({
                    url,
                    thumbnail,
                    collection: cat.name,
                    name
                });
            });
            return result;
        }
    } catch (error) {
        console.log('Failed for indexing class of Breguet ' +
            ' with error : ' + error
        )
        return [];
    }
}

const extraction = async (context) => {
    try {
        const { url: entry, base } = context;
        const result = { url: entry, scripts: [], spec: [], related: [] };
        const $ = cheerio.load((await client.get(entry)).data);
        result.description = $('.field.field-name-field-description p').text().trim().replace(/(?:\r\n|\r|\n|\s+)/g, " ");
        result.name = entry.split('/timepieces/')[1].split('/')[0] + ' ' + entry.split('/timepieces/')[1].split('/')[1];
        result.reference = $('.infos-watch h2').text().trim().replace(/(?:\r\n|\r|\n|\s+)/g, " ");
        result.collection = entry.split('/timepieces/')[1].split('/')[0].trim();
        result.thumbnail = $('.pane-variante img').attr('src');

        const id = $('.show-price-button').attr('data-ref').trim().replace(/(?:\r\n|\r|\n|\s+)/g, " ");
        const ajaxData = 'https://www.breguet.com/en/ajax/price/' + id;
        result.retail = (await client.get(ajaxData)).data.replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();

        $('.list-produits-associes a').each((idx, el) => {
            const related = base + $(el).attr('href');
            result.related.push(related);
        });
        $('.list-spec li').each((idx, el) => {
            const key = $(el).find('label').text().trim();
            const value = $(el).find('.value').text().trim();
            result.spec.push({ key, value });
        });
        return result;
    }
    catch (error) {
        console.log('Failed for extraction class of Breguet ' +
            ' with error : ' + error
        )
        return [];
    }
}

(async () => {
    const context = {
        entry: "https://www.breguet.com/en/timepieces",
        base: "https://www.breguet.com",
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
