const axios = require('axios');
const cheerio = require('cheerio');

(async () => {
    // const e = "https://www.armani.com/us/armanicom/emporio-armani/women/all-watches";
    const e = "https://www.armani.com/jp/armanicom/emporio-armani/レディース/すべての時計";
    // const e = "https://www.armani.com/jp/armanicom/emporio-armani/レディース/すべての時計?page=2";
    // const e = "https://www.armani.com/jp/armanicom/emporio-armani/%25E3%2583%25AC%25E3%2583%2587%25E3%2582%25A3%25E3%2583%25BC%25E3%2582%25B9/%25E3%2581%2599%25E3%2581%25B9%25E3%2581%25A6%25E3%2581%25AE%25E6%2599%2582%25E8%25A8%2588?page=2";
    const results = [];
    let next = e; const arr = [];
    try {
        do {
            console.log(next);
            await new Promise(r => setTimeout(r, 2000));
            const { data } = await axios.get(encodeURI(next));
            const $ = cheerio.load(data);
            $(".item").each((idx, el) => {
                const j = JSON.parse($(el).attr("data-ytos-track-product-data"));
                const href = $(el).find("a").attr("href");
                arr.push({ ref: j.product_cod10, amount: j.product_price, href });
            })
            next = $('link[rel="next"]').attr("href");
            if (next) {
                const p = next.split("?")[1];
                next = e + "?" + p;
            }
        } while (next);
        for (const x of arr) {
            await new Promise(r => setTimeout(r, 2000));
            const { data } = await axios.get(encodeURI(x.href));
            const $ = cheerio.load(data);
            const reference = $('.modelFabricColor span.value').text();
            if (reference) results.push({ reference, amount: x.amount });
            else console.log(x.href, '     >>>>> NO REFERENCE FOUND!');
            // if (ref) {
            //     let reference = ref.match(/AR\d{4,5}/);
            //     if (reference) {
            //         reference = reference[0];
            //         results.push({ reference, amount: x.amount })
            //     }
            // } else {
            //     console.log(x.href, '     >>>>> NO REFERENCE FOUND!');
            // }
        }
    } catch (error) {
        console.log(error);
    }
    console.log();
    console.log(results);
    console.log(`watches : ${results.length}`);
    console.log('done.');
})();