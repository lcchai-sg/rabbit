const axios = require('axios');
const cheerio = require('cheerio');
const e = "https://www.orientwatchusa.com/collections/all";

(async () => {
    const { data } = await axios.get(e);
    // console.log(data);
    const $ = cheerio.load(data);
    const results = [];
    $('.product').each((idx, el) => {
        const href = $(el).find('.meta').find('a').attr('href');
        if (!href.match(/watch-strap|no-core/i)) {
            const ref = href.split('/');
            const reference = ref[ref.length - 1].toUpperCase();
            let prc = $(el).find('.meta').find('.price').find('strike').text();
            if (!prc) prc = $(el).find('.meta').find('.price').text();
            const amount = parseFloat(prc.replace(/\$|,/g, ''));
            results.push({ collection: ref[ref.length - 2], reference, amount, prc });
        }
    })
    results.forEach(r => { console.log(r); });
    console.log(`total : ${results.length}`);
})()