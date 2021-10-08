const axios = require('axios');
const e = "https://www.tw.cartier.com/zh-tw/系列/腕錶/所有腕錶.productlistingservletv2.json";

(async () => {
    const { data } = await axios.get(encodeURI(e));
    const { listing } = data;
    for (const [name, list] of Object.entries(listing)) {
        console.log(`name : ${name}`);
        console.log(list);
        console.log();
        for (const item of list) {
            let { reference, priceFormatted } = item;
            priceFormatted = priceFormatted.replace(/[,.]/g, (x) => (x === "," ? "." : ","));
            const price = priceFormatted.replace(/[^\d.]/g, "");
            const amount = parseFloat(price);
            console.log({ reference, priceFormatted, amount });
        }
    }
})()