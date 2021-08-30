const fetch = require('cross-fetch');
const cheerio = require('cheerio');
const usa = "https://www.longines.com/en-us/watches/selector";
const gbr = "https://www.longines.com/en-gb/watches/selector";

(async () => {
    let cnt = 0; let pg = 1; let prev = ""; let stop = false;
    const uniq = []; const dup = [];
    do {
        cnt = 0;
        try {
            const target = gbr + "?p=" + pg;
            console.log(target);
            const res = await fetch(target);
            const html = await res.text();
            const $ = cheerio.load(html);
            $(".product-list-grid").find("li").each((idx, el) => {
                const reference = $(el).find('.lg-prod__collection').last().text().trim();
                if (uniq.indexOf(reference) < 0) uniq.push(reference);
                else dup.push(reference);
                // if (idx === 0)
                //     if (reference === prev) stop = true;
                //     else prev = reference;
                // if (!stop) {
                const amt = $(el).find('.price-container').find('.price-wrapper').attr('data-price-amount');
                const amount = parseFloat(amt)
                console.log({ reference, amount });
                cnt++;
                // }
            });
        } catch (error) {
            console.log('Failed MSRP scraping for Longines with error : ', error);
        }
        pg++;
    } while (cnt >= 18 && !stop);
    console.log(`total : `, uniq.length);
    console.log();
    console.log();
    console.log();
    dup.sort().forEach(r => {
        console.log(r);
    })
    console.log('dup : ', dup.length);
})()