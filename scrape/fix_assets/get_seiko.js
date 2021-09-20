const u = [
    "https://www.seikowatches.com/au-en/products/presage/SSA411J1",
    "https://www.seikowatches.com/au-en/products/presage/SSA412J1",
    "https://www.seikowatches.com/au-en/products/presage/SSA413J1",
    "https://www.seikowatches.com/ca-en/products/presage/spb219j1",
    "https://www.seikowatches.com/ca-en/products/presage/spb221j1",
    "https://www.seikowatches.com/ca-en/products/prospex/SRPE99J8",
    "https://www.seikowatches.com/ca-en/products/prospex/SRPE99K1",
    "https://www.seikowatches.com/ca-en/products/prospex/spb209j1",
    "https://www.seikowatches.com/ca-en/products/prospex/spb241j1",
    "https://www.seikowatches.com/ca-en/products/prospex/spb243j1",
    "https://www.seikowatches.com/global-en/products/presage/SSA411J1",
    "https://www.seikowatches.com/global-en/products/presage/SSA412J1",
    "https://www.seikowatches.com/global-en/products/presage/SSA413J1",
    "https://www.seikowatches.com/global-en/products/presage/ssa411j1",
    "https://www.seikowatches.com/global-en/products/presage/ssa412j1",
    "https://www.seikowatches.com/global-en/products/presage/ssa413j1",
    "https://www.seikowatches.com/nz-en/products/presage/SSA411J1",
    "https://www.seikowatches.com/nz-en/products/presage/SSA412J1",
    "https://www.seikowatches.com/nz-en/products/presage/SSA413J1",
    "https://www.seikowatches.com/nz-en/products/presage/spb223j1",
    "https://www.seikowatches.com/ph-en/products/presage/spb219j1",
    "https://www.seikowatches.com/ph-en/products/prospex/sla051j1",
    "https://www.seikowatches.com/ph-en/products/prospex/spb211j1",
    "https://www.seikowatches.com/uk-en/products/presage/ssa439j1",
    "https://www.seikowatches.com/uk-en/products/prospex/spb239j1",
    "https://www.seikowatches.com/us-en/products/prospex/SPB143",
    "https://www.seikowatches.com/us-en/products/prospex/spb143"
];
const axios = require('axios');
const cheerio = require('cheerio');
const cfg = { headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/601.3.9 (KHTML, like Gecko) Version/9.0.2 Safari/601.3.9' } };

(async () => {
    for (const x of u) {
        try {
            const { data } = await axios.get(x, cfg);
            const $ = cheerio.load(data);
            let thumbnail = $(".okra-carousel-slide-inner").first().find("noscript").toString();
            thumbnail = thumbnail.split("=")[1].replace(/"/g, "").replace("alt", "").trim();
            console.log(`db.reference_product.updateMany({thumbnail:null, url:"${x}"},{$set:{thumbnail:"${thumbnail}"}})`);
            console.log();
        } catch (error) {
        }
    }
})()