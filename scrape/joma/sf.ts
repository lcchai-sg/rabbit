const client = require('axios');
const cheerio = require('cheerio');

const indexing = async (context) => {
    const { client, base, entry, interval, } = context;
    const source = "official";
    const lang = "en";
    const brand = "Sevenfriday";
    const brandID = 142;
    const baseURL = base ? base : "https://www.sevenfriday.com";
    const result = { source, lang, brand, brandID, collections: [], items: {} };
    const cats = [];
    try {
        const $ = cheerio.load((await client.get(entry)).data);
        $('ul.navigation-submenu[data-linklist="watches-0"] li').each((idx, el) => {
            if (idx >= 0 && idx < 7) {
                const name = $(el).find('a').text().replace(/(?:\r\n|\r|\n|\s+)/g, ' ').split('>')[1].trim();
                const url = baseURL + $(el).find('a').attr('href');
                cats.push({ name, url });
                result.collections.push(name);
                result.items[name] = [];
            }
        });
        for (const cat of cats) {
            let next = cat.url;
            do {
                const $$ = cheerio.load((await client.get(next)).data);
                $$('#bc-sf-filter-products article').each((idx, el) => {
                    const url = baseURL + $$(el).find('a').attr('href');
                    const name = $$(el).find('.product-list-item-title a').text();
                    const thumbnail = 'https:' + $$(el).find('.product-list-item-thumbnail img').attr('src');
                    const retail = $$(el).find('.product-list-item-price span.money').text().trim();
                    const reference = $$(el).find('.product-list-item-thumbnail').attr('data-url') ? $$(el).find('.product-list-item-thumbnail').attr('data-url').split(/[,/]+/).pop().toUpperCase() : '';
                    result.items[cat.name].push({
                        source, lang, brand, brandID, url, collection: cat.name,
                        name, reference, retail, thumbnail,
                    })
                })
                next = $$("link[rel='next']").attr('href');
                if (next) next = baseURL + next;
                await new Promise(r => setTimeout(r, interval));
            } while (next);
        }
        return result;
    } catch (error) {
        console.error('Failed indexing for Severfriday with error : ' + error);
        console.error('entry : ', entry);
        return {};
    }
};

const extraction = async (context) => {
    const { client, entry, ...rest } = context;
    const result = { ...rest, url: entry, spec: [], };
    result.source = "official";
    result.lang = "en";
    result.brand = "Sevenfriday";
    result.brandID = 142;
    try {
        const $ = cheerio.load((await client.get(entry)).data);
        result.name = $('.product-title').first().text().replace(/\s+/g, " ").trim();
        result.reference = result.name.split(' ')[0].trim();
        result.collection = $('.breadcrumbs').text().split('/')[2].trim();
        result.retail = $('.product-price-minimum.money').text().trim();
        result.gender = 'M';
        result.description = $('meta[property="og:description"]').attr('content');
        result.description = result.description ? result.description : $(".product__description").text();
        result.description = $('.rte').text().trim();
        result.thumbnail = 'https:' + $('.product-main-image img').attr('src');
        // update 2021-03-15, attributes / description / nfc uses same tag
        // switch to sub tag 'rte', currently itemprop undefined will be attributes
        // itemprop = 'description' to capture as description
        $('.additional-information-element').find('.rte').each((idx, el) => {
            // $('.additional-information-element').each((idx, el) => {
            const itemprop = $(el).attr('itemprop');
            if (idx === 0) {
                $(el).find('li').each((idx, el) => {
                    let key = $(el).find('strong').text();
                    if (!key) key = $(el).find('b').text();
                    const r = new RegExp(key, 'i');
                    const value = $(el).text().replace(r, '').replace(/\s+/g, ' ').trim();
                    key = key.replace(":", "").trim();
                    result.spec.push({ key, value });
                })
            } else if (itemprop === 'description') {
                result.description = $(el).text().replace(/\s+/g, " ").trim();
            }
            // updated 2021-03-15, change in structure
            // let process = true;
            // if (idx !== 0) {
            //     const key = $(el).find('h2').text();
            //     $(el).find('p').each((idx, el) => {
            //         const v = $(el).text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").split('  ');
            //         v.forEach(value => {
            //             if (value.match(/sunglass/i)) process = false;
            //             if (process && value.trim() && !value.match(/watch:/i)) result.spec.push({ key, value });
            //         })
            //     })
            // }
        });
        if (result.spec.length === 0) {
            // different format
            $('.product__specification').find('li').each((idx, el) => {
                const key = $(el).find('strong').first().text();
                if (key === 'Dimensions') {
                    $(el).find('p').each((idx, el) => {
                        let key = $(el).find('strong').text().replace(':','').trim();
                        key = key ? key : $(el).find('b').text().replace(':','').trim();
                        const k = new RegExp(key,'i');
                        const value = $(el).text().replace(k,'').replace(':','').trim();
                        if (value) result.spec.push({ key, value });
                    })
                } else if (key === 'Case') {
                    $(el).find('p').each((idx, el) => {
                        let key1 = $(el).find('strong').text().replace(':','').trim();
                        key1 = key1 ? key1 : $(el).find('b').text().replace(':','').trim();
                        key1 = key1 ? key1 : key;
                        const k = new RegExp(key1,'i');
                        const value = $(el).text().replace(k,'').replace(':','').trim();
                        if (value) result.spec.push({ key, value });
                    })
                } else {
                    $(el).find('p').each((idx, el) => {
                        const v = $(el).text().replace(/\s+/g, " ").split('  ');
                        v.forEach(value => {
                            if (value.trim()) result.spec.push({ key, value });
                        })
                    })
                }
            });
            $('.product__other-features').find('li').each((idx, el) => {
                const key = $(el).find('strong').text();
                $(el).find('p').each((idx, el) => {
                    const v = $(el).text().replace(/\s+/g, " ").split('  ');
                    v.forEach(value => {
                        if (value.trim()) result.spec.push({ key, value });
                    })
                })
            });
        }
    } catch (error) {
        console.error('Failed extraction for Sevenfriday with error : ' + error);
        console.error('entry : ', entry);
        if (error.response) result.code = error.response.status;
        else result.code = 'UNKNOWN ERROR';
    }
    return result;
};

(async() => {
    const u = [
        'https://www.sevenfriday.com/collections/p-series/products/sf-p1b-01m',
        'https://www.sevenfriday.com/collections/p-series/products/p3c-04-red-carbon',
        'https://www.sevenfriday.com/collections/p-series/products/sf-p1b-01',
        'https://www.sevenfriday.com/collections/p-series/products/p3c-07-white-carbon',
        'https://www.sevenfriday.com/collections/p-series/products/p3c-09-orange-carbon',
        'https://www.sevenfriday.com/collections/p-series/products/sf-p3b-06',
        'https://www.sevenfriday.com/collections/q-series/products/sf-q1-01',
        'https://www.sevenfriday.com/collections/t-series/products/t1-01',
    ];

    for (let i = 0; i < u.length; i++) {
        const ex = await extraction({
            client,
            entry: u[i],
        })
        if (ex.spec) {
            console.log(ex)
            console.log()
        }
    }
    console.log('done.')
    process.exit(0)
})();