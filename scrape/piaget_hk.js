const axios = require('axios');
const cheerio = require('cheerio');

(async () => {
    // const e = "https://www.piaget.com/hk-zh/watches/all-watches";
    const e = "https://www.piaget.com/gb-en/watches/all-watches";
    // const e = "https://www.piaget.com/hk-zh/watches/all-watches?page=100";
    const { data } = await axios.get(e);
    const $ = cheerio.load(data);
    const d = $(".phoenix-mixed-grid").attr(":products");
    const dd = d.replace(/&quot;/g, '"').replace(/\\\//g, '/');
    const j = JSON.parse(dd);
    let cnt = 0;
    if (Array.isArray(j)) {
        for (const w of j) {
            const name = w.name;
            const reference = w.modelReference;
            // const amount = w.price && w.price.HK && w.price.HK.value ? w.price.HK.value : null;
            const amount = w.price;
            console.log({ name, reference, amount });
            cnt++;
        }
    }
    console.log();
    console.log(`watches : ${cnt}`);
    console.log('done.');
})()