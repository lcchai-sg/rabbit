const fetch = require('cross-fetch');
const cheerio = require('cheerio');
const urls = [
    "https://www.chanel.com/jp/watches/collection/c/4x2/",
    // "https://www.chanel.com/jp/watches/boy-friend/c/4x2x3/",                            // 29
    // "https://www.chanel.com/jp/watches/code-coco/c/4x2x8/",                             // 13
    // "https://www.chanel.com/jp/watches/premiere/c/4x2x2/",                              // 25
    // "https://www.chanel.com/jp/watches/monsieur/c/4x2x6/",                              // 10
    // "https://www.chanel.com/jp/watches/jewelry-watches/c/4x2x5/",                       // 34
    // "https://www.chanel.com/jp/watches/j12/c/4x2x1/",                                   // 43
    // "https://www.chanel.com/jp/watches/mademoiselle-prive/c/4x2x4/",                    // 14
];

const exist = (arr, itm) => {
    let ex = false;
    arr.forEach(r => {
        if (r.reference == itm.reference && r.amount == itm.amount) {
            ex = true;
        }
    })
    return ex;
}

(async () => {
    for (const u of urls) {
        let cnt = 0; let pg = 1; let results = [];
        do {
            cnt = 0;
            const link = pg > 1 ? u + "page-" + pg : u;
            console.log(link);
            const res = await fetch(link);
            const data = await res.text();
            const d = data.match(/"productList":{.*}/ig);
            const dd = d[0].split(",");
            let dat = {};
            for (let i = 0; i < dd.length; i++) {
                if (dd[i].match(/"dimension8":"(h\d{4}|j\d{5})"/i)) {
                    const ddd = dd[i].match(/"dimension8":"(h\d{4}|j\d{5})"/gi);
                    const dddd = ddd ? ddd[0].split(":")[1].replace(/"/g, "").toUpperCase() : null;
                    dat.reference = dddd;
                }
                if (dd[i].match(/"price":"\d{0,12}"/i)) {
                    const ddd = dd[i].match(/"price":"\d{0,12}"/ig);
                    const dddd = ddd ? parseFloat(ddd[0].split(":")[1].replace(/"/g, "")) : null;
                    dat.amount = dddd;
                }
                if (Object.keys(dat).length >= 2) {
                    results.push(dat);
                    dat = {};
                    cnt++;
                }
            }
        } while (cnt >= 24);
        results.sort((a, b) => a.reference < b.reference ? -1 : 1).forEach(r => { console.log({ reference: r.reference, amount: r.amount }) });
        console.log();
        console.log(`total : ${results.length}`);
    }
})();