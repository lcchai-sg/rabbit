const axios = require("axios");
const cheerio = require("cheerio");

const indexing = async (context) => {
    const { client, entry, interval, } = context;
    const source = "official";
    const lang = "en";
    const brand = "Longines";
    const brandID = 120;
    const result = { source, lang, brand, brandID, collections: [], items: {} };
    const cats = [];
    try {
        const { data } = await client.get(entry);
        const $ = cheerio.load(data);
        $('#watches-menu-tabs').find('.level2').each((idx, el) => {
            const collection = $(el).find('.title').text();
            $(el).find('.level3').each((idx, el) => {
                const subCollection = $(el).text();
                const url = $(el).find('a').attr('href');
                if (collection && url)
                    cats.push({ collection, subCollection, url });
            })
        })
        for (let i = 0; i < cats.length; i++) {
            let cp = 0; let cnt = 0; let prev = '';
            const collection = cats[i].collection;
            if (result.collections.indexOf(collection) < 0) {
                result.collections.push(collection);
                result.items[collection] = [];
            }
            do {
                cp++;
                cnt = 0;
                const link = cats[i].url + "?p=" + cp;
                console.debug(link);
                const { data } = await client.get(link);
                const $ = cheerio.load(data);
                $('.product-list-item').each((idx, el) => {
                    const thumbnail = $(el).find('img').attr('src');
                    const url = $(el).find('a').attr('href');
                    const name = $(el).find('.product-list-item-name').find('strong').text().replace(/(?:\r\n|\r|\n|\s+)/g, ' ').trim();
                    const reference = $(el).find('.product-list-item-purchasable').text().replace('Shop now for ', '').trim();
                    const retail = $(el).find('.price-final_price').first().text().replace(/(?:\r\n|\r|\n|\s+)/g, ' ').trim();
                    if (idx === 0) {
                        if (name + reference === prev) prev = 'STOP';
                        else prev = name + reference;
                    }
                    result.items[collection].push({
                        source, lang, brand, brandID, url, collection,
                        name, reference, retail, thumbnail,
                    })
                    cnt++;
                })
                await new Promise(r => setTimeout(r, interval));
            } while (cnt >= 18 && prev !== 'STOP');
        }
        return result;
    } catch (error) {
        console.error('Failed indexing for Longines with error : ' + error);
        return {};
    }
};

const extraction = async (context) => {
    const { client, base, entry, ...rest } = context;
    const result = { ...rest, url: entry, spec: [], related: [], };
    try {
        const { data } = await client.get(entry);
        const $ = cheerio.load(data);
        result.name = $('meta[name="title"]').attr('content');
        result.reference = $('meta[property="og:title"]').attr('content').trim();
        result.thumbnail = $('meta[property="og:image"]').attr('content');
        result.price = $('meta[property="product:price:currency"]').attr('content') + ' ' + $('meta[property="product:price:amount"]').attr('content');
        const keys = []; const values = [];
        $('.lg-product__top-attributes').find("dt").each((idx, el) => {
            keys.push($(el).text().trim());
        })
        $('.lg-product__top-attributes').find("dd").each((idx, el) => {
            values.push($(el).text().trim());
        })
        values.forEach((value, i) => {
            result.spec.push({ cat: "general", key: keys[i], value });
        })
        $('.lg-product__accordion-inner').each((idx, el) => {
            const cats = [];
            $(el).find('.lg-product__accordion-item').each((idx, el) => {
                cats.push($(el).text().replace(/(?:\r\n|\r|\n|\s+)/g, ' ').trim());
            })
            $(el).find('.lg-product__accordion-panel').each((idx, el) => {
                const keys = []; const values = [];
                $(el).find("dt").each((idx, el) => {
                    keys.push($(el).text().trim());
                })
                $(el).find("dd").each((idx, el) => {
                    values.push($(el).text().trim());
                })
                values.forEach((value, i) => {
                    result.spec.push({ cat: cats[idx], key: keys[i], value });
                })
            })
        })
        $('.lg-prod__info').each((idx, el) => {
            const rel = $(el).text().replace(/(?:\r\n|\r|\n|\s+)/g, ' ').trim();
            const relate = rel.split('  ');
            result.related.push(relate[0] + ' ' + relate[1]);
        })
    } catch (error) {
        console.error('Failed extraction for Longines with error : ' + error);
        console.error('entry :', entry);
        if (error.response) result.code = error.response.status;
        else result.code = 'UNKNOWN ERROR';
    }
    return result;
};

(async () => {
    console.time("indexing");
    const r = await indexing({
        client: axios,
        entry: "https://www.longines.com/en-us/watches",
    });
    console.timeLog("indexing")
    let cnt = 0;
    r.collections.forEach(c => {
        console.log('>>>>>', c);
        r.items[c].forEach(d => {
            console.log('                ', d.url);
            cnt++;
        })
    })
    console.log('no. of watches: ', cnt)
    //https://www.longines.com/en-us/watches/heritage/heritage-collection?p=2
    // console.log(r);

    // const r = [
    //   {
    //     url: 'https://www.longines.com/en-us/watch-conquest-classic-l2-386-3-92-7',
    //     thumbnail: 'https://www.longines.com/media/catalog/product/cache/143364df61af4b4832ff74693d0cfd57/w/a/watch-collection-conquest-classic-l2-386-3-92-7-560x660.jpg',
    //     collection: 'Elegance',
    //     name: 'Conquest Classic',
    //     reference: 'L2.386.3.92.7',
    //     price: '$1,075.00',
    //     client: axios,
    //   },
    //   {
    //     url: 'https://www.longines.com/en-us/watch-conquest-classic-l2-386-3-72-7',
    //     thumbnail: 'https://www.longines.com/media/catalog/product/cache/143364df61af4b4832ff74693d0cfd57/w/a/watch-collection-conquest-classic-l2-386-3-72-7-560x660.jpg',
    //     collection: 'Elegance',
    //     name: 'Conquest Classic',
    //     reference: 'L2.386.3.72.7',
    //     price: '$1,075.00',
    //     client: axios,
    //   },
    //   {
    //     url: 'https://www.longines.com/en-us/watch-longines-symphonette-l2-306-5-87-7',
    //     collection: 'Elegance',
    //     name: 'Longines Symphonette',
    //     reference: 'L2.306.5.87.7',
    //     price: '$2,275.00',
    //     thumbnail: 'https://www.longines.com/media/catalog/product/cache/143364df61af4b4832ff74693d0cfd57/w/a/watch-collection-longines-symphonette-l2-306-5-87-7-560x660.jpg',
    //     client: axios,
    //   }
    // ];

    // for (let i = 0; i < r.length; i++) {
    //   const ex = await extraction(r[i]);
    //   console.log(ex);
    // }


    // const ext = {
    //   "brandID": 120,
    //   "lang": "en",
    //   "reference": "L4.319.4.11.6",
    //   "source": "official",
    //   "url": "https://www.longines.com/en-us/watch-presence-l4-319-4-11-6",
    //   "brand": "Longines",
    //   "collection": "Classic",
    //   "name": "Présence",
    //   "price": "$850.00",
    //   "related": [
    //     "Présence  L4.805.1.11.2",
    //     "Présence  L4.921.1.11.2",
    //     "Présence  L4.321.4.11.6",
    //     "Présence  L4.320.4.11.6",
    //     "Présence  L4.743.6.12.0",
    //     "Présence  L4.821.2.11.2",
    //     "Présence  L4.322.2.12.7",
    //     "Présence  L4.322.1.12.7",
    //     "Présence  L4.805.4.11.6",
    //     "Présence  L4.921.2.11.2",
    //     "Présence  L4.921.2.11.7",
    //     "Présence  L4.321.2.11.7",
    //     "Présence  L4.322.4.12.6",
    //     "Présence  L4.805.2.11.2",
    //     "Présence  L4.321.4.11.2",
    //     "Présence  L4.321.2.11.2",
    //     "Présence  L4.321.4.12.6",
    //     "Présence  L4.821.4.11.2",
    //     "Présence  L4.821.4.11.6",
    //     "Présence  L4.322.4.11.6"
    //   ],
    //   "spec": [
    //     {
    //       "cat": "general",
    //       "key": "Dimension:",
    //       "value": "Ø 23.50 mm"
    //     },
    //     {
    //       "cat": "general",
    //       "key": "Movement Type:",
    //       "value": "Quartz"
    //     },
    //     {
    //       "cat": "general",
    //       "key": "Material:",
    //       "value": "Stainless steel"
    //     },
    //     {
    //       "cat": "general",
    //       "key": "Colour:",
    //       "value": "White matt"
    //     },
    //     {
    //       "cat": "Case",
    //       "key": "Shape",
    //       "value": "Round"
    //     },
    //     {
    //       "cat": "Case",
    //       "key": "Material",
    //       "value": "Stainless steel"
    //     },
    //     {
    //       "cat": "Case",
    //       "key": "Glass",
    //       "value": "Scratch-resistant sapphire crystal"
    //     },
    //     {
    //       "cat": "Case",
    //       "key": "Dimension",
    //       "value": "Ø 23.50 mm"
    //     },
    //     {
    //       "cat": "Case",
    //       "key": "Water Resistance",
    //       "value": "Water-resistant to 3 bar"
    //     },
    //     {
    //       "cat": "Dial and Hands",
    //       "key": "Colour",
    //       "value": "White matt"
    //     },
    //     {
    //       "cat": "Dial and Hands",
    //       "key": "Hour markers",
    //       "value": "Painted Roman numerals"
    //     },
    //     {
    //       "cat": "Dial and Hands",
    //       "key": "Hands",
    //       "value": "Black hands"
    //     },
    //     {
    //       "cat": "Movement and Functions",
    //       "key": "Movement Type",
    //       "value": "Quartz"
    //     },
    //     {
    //       "cat": "Movement and Functions",
    //       "key": "Caliber",
    //       "value": "L152"
    //     },
    //     {
    //       "cat": "Movement and Functions",
    //       "key": "Functions",
    //       "value": "Hours, minutes, seconds and date"
    //     },
    //     {
    //       "cat": "Movement and Functions",
    //       "key": "Special Functions",
    //       "value": "E.O.L."
    //     },
    //     {
    //       "cat": "Strap",
    //       "key": "Material",
    //       "value": "Stainless steel"
    //     },
    //     {
    //       "cat": "Strap",
    //       "key": "Buckle",
    //       "value": "With triple safety folding clasp and push-piece opening mechanism"
    //     }
    //   ],
    //   "strategy": "longines",
    //   "thumbnail": "https://www.longines.com/media/catalog/product/cache/143364df61af4b4832ff74693d0cfd57/w/a/watch-collection-presence-l4-319-4-11-6-560x660.jpg"
    // };

    // const dist = await distill(ext);
    // console.log(dist);
})();