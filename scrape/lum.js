const axios = require('axios');
const cheerio = require('cheerio');
const xml2js = require('xml2js');
const httpsProxyAgent = require('https-proxy-agent');

const extraction = async context => {
    const { client, entry, ...rest } = context;
    const result = { ...rest, url: entry, spec: [], related: [], };
    result.source = "official";
    result.lang = "en";
    result.brand = "Luminox";
    result.brandID = 442;
    try {
        const { data } = await client.get(entry);
        console.log(data);
        const $ = cheerio.load(data);
        result.retail = $("#ProductPrice-product").text();
        result.collection = $("#productInfo-product").find("a").first().text();
        result.name = $("#productInfo-product").find("h1").first().text();
        result.description = $("#productInfo-product").find(".product-description").text().replace(/\s+/g, ' ').trim();
        result.reference = result.name ? result.name.match(/-/) ? result.name.split('-')[1].trim() : result.name : null;
        result.thumbnail = $(".ProductImg-product").first().attr("data-mfp-src");
        result.thumbnail = result.thumbnail.match("https") ? result.thumbnail : "https:" + result.thumbnail;
        const d = $(".product-description").contents().toString().replace(/<h1>(.*)<\/h1>/ig, '');
        console.log('d : ', d);
        if (d.match(/<li>/i)) {
            $(".product-description").find('li').each((idx, el) => {
                result.spec.push($(el).text().replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim());
            })
        } else {
            d.replace(/&nbsp;/g, ' ').replace(/\n/g, '<br>').replace(/<br *\/?>/ig, '|').split('|').forEach(s => {
                const v = s.replace(/<[^>]*>?/gm, '').trim();
                if (v) if (result.spec.indexOf(v) < 0) result.spec.push(v);
            })
            // console.log('no <ul> ................................');
            // const d1 = d.match(/<p>(.*)<\/p>/ig);
            // if (d1) {
            //     for (let i = 0; i < d1.length; i++) {
            //         d1[i].replace('<p>', '').replace('</p>', '').replace(/<br *\/?>/ig, '|').split('|').forEach(s => {
            //             const v = s.trim();
            //             if (v) if (result.spec.indexOf(v) < 0) result.spec.push(v);
            //         })
            //     }
            // } else {
            //     d.replace('<p>', '').replace('</p>', '').replace(/<br *\/?>/ig, '|').split('|').forEach(s => {
            //         const v = s.trim();
            //         if (v) if (result.spec.indexOf(v) < 0) result.spec.push(v);
            //     })
            // }
        }
    } catch (error) {
        console.error('Failed extraction for Luminox with error : ' + error);
        console.error('entry :', entry);
        if (error.response) result.code = error.response.status;
        else result.code = 'UNKNOWN ERROR';
    }
    return result;
}

(async () => {
    const r = [
        // 'https://luminox.com/products/original-navy-seal-3001',
        // 'https://luminox.com/products/modern-mariner-automatic-6502',
        // 'https://luminox.com/products/navy-seal-steel-3252',
        // 'https://luminox.com/products/navy-seal-steel-3252-bo',
        // 'https://luminox.com/products/navy-seal-steel-3258',
        // 'https://luminox.com/products/navy-seal-steel-3253',
        // 'https://luminox.com/products/navy-seal-steel-3254',
        // 'https://luminox.com/products/navy-seal-3502',
        // 'https://luminox.com/products/navy-seal-3501',
        // 'https://luminox.com/products/navy-seal-3501-bo',
        // 'https://luminox.com/products/navy-seal-3502-bo',
        // 'https://luminox.com/products/navy-seal-3503-f-new',
        // 'https://luminox.com/products/navy-seal-3507-wo',
        // 'https://luminox.com/products/navy-seal-3508-gold-holiday-edition',
        // 'https://luminox.com/products/f-117-nighthawk-6421',
        // 'https://luminox.com/products/f-117-nighthawk-6422',
        // 'https://luminox.com/products/f-22-raptor-9241',
        // 'https://luminox.com/products/f-117-nighthawk-6441',
        // 'https://luminox.com/products/sr-71-blackbird-9098',
        // 'https://luminox.com/products/field-automatic-day-date-1801',
        // 'https://luminox.com/products/leatherback-sea-turtle-0301',
        // 'https://luminox.com/products/leatherback-sea-turtle-0301-bo',
        // 'https://luminox.com/products/leatherback-sea-turtle-0307-wo-1',
        // 'https://luminox.com/products/leatherback-sea-turtle-giant-0321-bo',
        // 'https://luminox.com/products/leatherback-sea-turtle-giant-0321',
        // 'https://luminox.com/products/leatherback-sea-turtle-giant-0337',
        // 'https://luminox.com/products/navy-seal-chronograph-3580-series',
        // 'https://luminox.com/products/navy-seal-chronograph-3581-bo',
        // 'https://luminox.com/products/navy-seal-chronograph-3583',
        // 'https://luminox.com/products/atacama-field-automatic-1902',
        // 'https://luminox.com/products/atacama-field-automatic-1907-nf',
        // 'https://luminox.com/products/automatic-sport-timer-0921',
        // 'https://luminox.com/products/automatic-sport-timer-0924',
        // 'https://luminox.com/products/bear-grylls-survival-air-series-3761-gmt-watch',
        // 'https://luminox.com/products/bear-grylls-survival-air-series-3762-gmt-watch',
        'https://luminox.com/products/revo-x-luminox-giftset-navy-seal-watch-sunglasses',
        // 'https://luminox.com/products/ice-sar-arctic-1001',
        // 'https://luminox.com/products/ice-sar-arctic-1002',
        // 'https://luminox.com/products/ice-sar-arctic-1003',
        // 'https://luminox.com/products/ice-sar-arctic-1007',
        // 'https://luminox.com/products/copy-of-ice-sar-arctic-1003',
        // 'https://luminox.com/products/navy-seal-3601',
        // 'https://luminox.com/products/navy-seal-3603',
        // 'https://luminox.com/products/navy-seal-3617-set',
        // 'https://luminox.com/products/copy-of-commando-frogman-3301',
        // 'https://luminox.com/products/bear-grylls-survival-master-series-3749',
        // 'https://luminox.com/products/bear-grylls-survival-master-series-3741',
        // 'https://luminox.com/products/bear-grylls-survival-chronograph-master-series-3745',
        // 'https://luminox.com/products/bear-grylls-survival-sea-series-3723',
        // 'https://luminox.com/products/bear-grylls-survival-sea-series-3729',
        // 'https://luminox.com/products/bear-grylls-survival-land-series-3782',
        // 'https://luminox.com/products/bear-grylls-survival-land-series-3798',
        // 'https://luminox.com/products/pacific-diver-3123',
        // 'https://luminox.com/products/pacific-diver-3122',
        // 'https://luminox.com/products/pacific-diver-3121',
        // 'https://luminox.com/products/pacific-diver-3121-bo',
        // 'https://luminox.com/products/pacific-diver-3127',
        // 'https://luminox.com/products/pacific-diver-3135',
        // 'https://luminox.com/products/navy-seal-foundation-exclusive-3503-nsf',
        // 'https://luminox.com/products/bear-grylls-survival-sea-series-never-give-up-model-3729-ngu',
        // 'https://luminox.com/products/navy-seal-colormark-3051-go-nsf-navy-seal-foundation-exclusive-watch',
    ]

    for (let i = 0; i < r.length; i++) {
        const ex = await extraction({
            client: axios,
            entry: r[i],
            base: 'https://www.luminox.com',
        });
        console.log(ex);
    }

    console.log();
    console.log('done...');
    process.exit(0);
})();