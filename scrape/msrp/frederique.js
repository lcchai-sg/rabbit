const cheerio = require("cheerio");
const fetch = require('cross-fetch');
const proxy_dnk_ip = '217.61.236.218';
const proxy_usa_ip = 'usvpn.tell.com';
const proxy_host = '3128';
const proxy_user = 'proxyclient';
const proxy_password = '4uFra6iTrAw1Pr';
const u = [
    // "https://frederiqueconstant.com",
    // "https://us.frederiqueconstant.com/collections/",
    "https://frederiqueconstant.com/de/sitemap_products_1.xml?from=4620948963375&to=6739284754479",
    // "https://frederiqueconstant.com/fr/sitemap_products_1.xml?from=4620948963375&to=6739284754479",
    // "https://frederiqueconstant.com/it/sitemap_products_1.xml?from=4620948963375&to=6739284754479",
];
const results = [];

(async () => {
    const res = await fetch(u[0]);
    const data = await res.text();
    const s = data.match(/<loc>.*<\/loc>/ig);
    console.log('total : ', s.length);
    for (let i = 0; i < s.length; i++) {
        // await new Promise(r => setTimeout(r, 2000));
        const u = s[i].replace(/<loc>|<\/loc>/ig, '');
        console.log(u);
        const res = await fetch(u);
        const data = await res.text();
        const pid = data.match(/productId: '(FC-\w+|\w+)'/ig);
        const reference = pid ? pid[0].split(':')[1].replace(/'/g, '').trim() : null;
        const prc = data.match(/productPrice: '\d{0,3},?\d{3}.?\d{0,2}'/ig);
        const amount = prc ? parseFloat(prc[0].split(':')[1].replace(/'/g, '').trim()) : null;
        results.push({ reference, amount });
    }
    results && results.forEach(r => { console.log(r) });
    console.log(`results : ${results.length}`);
})();
