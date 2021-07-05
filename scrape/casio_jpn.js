const axios = require('axios');
const fetch = require('cross-fetch');

(async () => {
    // const e = "https://casio.jp/temp/data/jp_ja/watch.json";
    const e = "https://www.casio.com/content/casio/locales/jp/ja/products/watches/jcr:content/root/responsivegrid/container/product_panel_list_f.products.json";
    const ee = "https://www.casio.com/jp/watches/";
    const { data } = await axios.get(e);
    // const data = await fetch(e);
    console.log('data : ', data);
    if (data.data) {
        for (const p of data.data) {
            console.log(`reference : ${p.sku}      amount : ${p.listPrice}`);
        }
        console.log();
        console.log(`watches : ${data.data.length}`);
    }
})();