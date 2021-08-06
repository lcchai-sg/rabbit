const axios = require('axios');
const cheerio = require('cheerio');

(async () => {
    const e =
        // "https://www.luminox.com.sg/sitemap.xml";
        // "https://www.luminox.com/sitemap.xml";
        // "https://ca.luminox.com/sitemap.xml";
        // "https://de.luminox.com/sitemap.xml";
        // "https://uk.luminox.com/sitemap.xml";
        "https://luminox.jp/watch-sitemap.xml";
    // "https://www.luminox.it/sitemap.xml";

    const { data } = await axios.get(e);
    let d = data;
    let cnt = 0;
    if (d.match(/com(.sg)?\/sitemap_products/i)) {
        // need to drill-down
        const dd = data.match(/<loc>.*<\/loc>/ig);
        if (dd) {
            const url = dd[0].replace(/<loc>|<\/loc>/ig, '');
            const { data } = await axios.get(url);
            d = data;
        }
    }
    const dd = d.replace(/></g, '>\n<').match(/<loc>.*<\/loc>/ig);
    if (dd) {
        for (const u of dd) {
            const url = u.replace(/<loc>|<\/loc>/ig, '');
            if (url.match(/product|watch-collection/i) && url.match(/\d{4}/) && !url.match(/f[pmen]x-|fe-|fp-|strap/i)) {
                console.log(`watch url : ${url}`);
                cnt++;
            }
        }
    }
    console.log();
    console.log(`watches : ${cnt}`);
})();

// 