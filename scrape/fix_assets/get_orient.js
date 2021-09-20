const u = [
    "https://www.orientwatchusa.com/collections/classic/products/ra-nr2002p100b"
];
const axios = require('axios');
const cheerio = require('cheerio');

(async () => {
    for (const x of u) {
        const { data } = await axios.get(x);
        console.log(data);
        console.log();
        console.log();
        console.log();
        const $ = cheerio.load(data);
        const thumb = $('.product-images').find('img:nth-child(3)').attr('data-src');
        console.log(thumb);
        process.exit(0);
    }
})()