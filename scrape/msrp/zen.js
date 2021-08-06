const fetch = require('cross-fetch');
const cheerio = require('cheerio');

(async () => {
    // const e = "https://www.zenith-watches.com/en_us/products/all";
    const e =
        // "https://www.zenith-watches.com/en_us/products/all?page=";
        // "https://www.zenith-watches.com/en_ca/products/all?page=";
        // "https://www.zenith-watches.com/fr_fr/products/all?page=";
        // "https://www.zenith-watches.com/de_de/products/all?page=";
        // "https://www.zenith-watches.com/it_it/products/all?page=";
        // "https://www.zenith-watches.com/en_gb/products/all?page=";
        // "https://www.zenith-watches.com/en_sg/products/all?page=";
        // "https://www.zenith-watches.com/en_tw/products/all?page=";
        // "https://www.zenith-watches.com/en_hk/products/all?page=";
        "https://www.zenith-watches.com/ja_jp/products/all";
    let cnt = 0; let p = 0;
    do {
        cnt = 0;
        const ee = e + `${p ? "?page= " + p : ""}`;
        console.log(ee);
        const res = await fetch(ee);
        const data = await res.text();
        const $ = cheerio.load(data);
        $("script").each((idx, el) => {
            const dd = $(el).contents();
            if (dd) {
                const d = dd.toString();
                if (d.match(/window.__INITIAL_STATE__=/i)) {
                    const j = d.replace("window.__INITIAL_STATE__=", "").split(';')[0];
                    if (ee.match(/ja_jp/i)) {
                        const skus = d.match(/"sku":("[0-9A-Za-z]*.[0-9A-Za-z]*.[0-9A-Za-z]*\\u002F[0-9A-Za-z]*.[0-9A-Za-z]*"|"ic-\d{0,10}")/ig);
                        const prices = d.match(/"priceInclTax":\d{0,10}/ig);
                        const urls = d.match(/"url_key":"[0-9a-zA-Z_-]*"/ig);
                        skus && skus.forEach((sku, idx) => {
                            const reference = sku.replace(/"/g, "").replace("\\u002F", "/").split(":")[1];
                            const amount = parseFloat(prices[idx].split(":")[1]);
                            const url = "https://www.zenith-watches.com/ja_jp/product/" + urls[idx].split(":")[1].replace(/"/g, "");
                            console.log({ reference, amount, url });
                        })
                        cnt = skus ? skus.length : 0;
                    } else {
                        const js = JSON.parse(j);
                        // console.log(js);
                        const items = js.product.list.items;
                        // console.log(items);
                        for (const item of items) {
                            const amount = item.priceInclTax;
                            const reference = item.sku;
                            const url = "https://www.zenith-watches.com/en_us/product/" + item.url_key;
                            console.log(`ref : ${reference}   amount : ${amount}    url : ${url}`);
                            cnt++;
                        }
                    }
                    // process.exit(0);
                }
            }
        })
        p++;
        await new Promise(r => setTimeout(r, 3000));
    } while (cnt > 10);
})();