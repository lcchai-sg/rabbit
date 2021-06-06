const axios = require('axios');
const cheerio = require('cheerio');

const extraction = async (context) => {
    const { client, base, entry, ...rest } = context;
    const result = { ...rest, url: entry, spec: [], related: [], };
    result.source = "official";
    result.lang = "en";
    result.brand = "Longines";
    result.brandID = 120;
    try {
        const { data } = await client.get(entry);
        const $ = cheerio.load(data);
        const url = $('meta[property="og:url"]').attr('content');
        if (url !== entry || data.match(/404 page not found/i)) {
            result.code = 404;
            return result;
        }
        result.name = $('meta[name="title"]').attr('content');
        result.reference = $('.lg-product__title-sku').text().replace(/\s+/g, ' ').trim();
        // result.reference = $('meta[property="og:title"]').attr('content').trim();
        result.thumbnail = $('meta[property="og:image"]').attr('content');
        result.retail = $('meta[property="product:price:currency"]').attr('content') + ' ' + $('meta[property="product:price:amount"]').attr('content');
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
    const u = [
        "https://www.longines.com/en-us/watch-flagship-l4-374-4-21-6",
        "https://www.longines.com/en-us/watch-hydroconquest-l3-782-4-96-6",
        "https://www.longines.com/en-us/watch-heritage-l2-330-4-93-0",
        "https://www.longines.com/en-us/watch-hydroconquest-l3-781-4-76-9",
        "https://www.longines.com/en-us/watch-longines-dolcevita-l5-255-4-71-7",
        "https://www.longines.com/en-us/watch-record-collection-l2-320-4-57-6",
        "https://www.longines.com/en-us/watch-record-collection-l2-320-4-96-6",
        "https://www.longines.com/en-us/watch-record-collection-l2-320-8-87-2",
        "https://www.longines.com/en-us/watch-record-collection-l2-321-4-57-6",
        "https://www.longines.com/en-us/watch-record-collection-l2-321-4-72-6",
        "https://www.longines.com/en-us/watch-record-collection-l2-321-4-87-6",
        "https://www.longines.com/en-us/watch-record-collection-l2-321-4-96-6",
        "https://www.longines.com/en-us/watch-record-collection-l2-321-5-57-7",
        "https://www.longines.com/en-us/watch-record-collection-l2-321-5-59-7",
        "https://www.longines.com/en-us/watch-record-collection-l2-820-4-11-6",
        "https://www.longines.com/en-us/watch-record-collection-l2-820-4-72-6",
        "https://www.longines.com/en-us/watch-record-collection-l2-820-4-96-6",
        "https://www.longines.com/en-us/watch-record-collection-l2-820-8-72-2",
        "https://www.longines.com/en-us/watch-record-collection-l2-821-4-56-6",
        "https://www.longines.com/en-us/watch-record-collection-l2-821-4-76-6",
        "https://www.longines.com/en-us/watch-record-collection-l2-821-5-72-2",
        "https://www.longines.com/en-us/watch-record-collection-l2-821-5-72-7",
    ];

    for (let i = 0; i < u.length; i++) {
        const ex = await extraction({
            entry: u[i],
            client: axios,
        });
        console.log(ex);
    }
    console.log();
    console.log('done.');
    process.exit(0);
})();