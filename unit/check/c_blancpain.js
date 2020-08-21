const cheerio = require('cheerio');
const client = require('axios');

const indexing = async (context) => {
    try {
        const { entry, base } = context;
        const result = { collections: [], items: {} };
        const d = (await client.get(entry)).data;
        const $$ = cheerio.load(d);
        $$('.field.field--name-field-watch-collection.field--type-entity-reference.field--label-hidden.field--item').each((idx, el) => {
            const name = $$(el).text().trim();
            if (result.collections.indexOf(name) < 0) {
                result.collections.push(name);
                result.items[name] = [];
            }
        });
        $$('.col-lg-4').each((idx, el) => {
            const url = base + $$(el).find('a').attr('href');
            const thumbnail = base + $$(el).find('.watch-main-image img').attr('src');
            const name = $$(el).text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
            const collection = $$(el).find('.field.field--name-field-watch-collection.field--type-entity-reference.field--label-hidden.field--item').text().trim();
            const reference = $$(el).find('.field.field--name-field-watch-reference.field--type-string.field--label-hidden.field--item').text();
            result.items[collection].push({
                url,
                thumbnail,
                collection,
                name,
                reference
            });
        });
        return result;
    }
    catch (error) {
        console.log('Failed for indexing class of Blancpain' +
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
        result.name = $('.field-content.h3').text().trim().replace(/(?:\r\n|\r|\n|\s+)/g, " ") + ' ' + $('.views-row h1').text().trim().replace(/(?:\r\n|\r|\n|\s+)/g, " ") + ' ' + $('.views-field.views-field-field-watch-caliber').text().trim().replace(/(?:\r\n|\r|\n|\s+)/g, " ");
        result.reference = $('.views-field.views-field-field-watch-reference').text().trim().replace(/(?:\r\n|\r|\n|\s+)/g, " ").replace('Reference:', '').trim();
        result.collection = $('.views-row h1').text().trim().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
        result.thumbnail = base + $('#slick-1 picture source').attr('srcset');
        if (result.collection === 'Women') {
            result.gender = 'F';
        } else {
            result.gender = 'M';
        }
        $('.views-field').each((idx, el) => {
            let key = $(el).find('.views-label').text().trim();
            const value = $(el).find('.field-content').text().trim();
            if (!key) {
                key = 'Specification';
            }
            result.spec.push({ key, value });
        });
        return result;
    }
    catch (error) {
        console.log('Failed for extraction class of Blancpain ' +
            ' with error : ' + error
        )
        return [];
    }
};

(async () => {
    const context = {
        entry: "https://www.blancpain.com/en/watchfinder",
        base: "https://www.blancpain.com",
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
