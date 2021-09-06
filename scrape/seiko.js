const axios = require('axios');
// const u = "https://www.seiko.com.tw/apo/search.php?form%5B0%5D%5Bname%5D=gender&form%5B0%5D%5Bvalue%5D=female&form%5B1%5D%5Bname%5D=gender&form%5B1%5D%5Bvalue%5D=male&form%5B2%5D%5Bname%5D=sort&form%5B2%5D%5Bvalue%5D=hightolow&_=1630556584288";
const u = "https://www.seikowatches.com/__api/posts/list?locale_id=9&paginate=false&unit=9999";

(async () => {
    const { data } = await axios.get(u, { timeout: 60000 });
    console.log(data);
    // const p = data.product;
    // p.forEach(r => {
    //     console.log({ reference: r.ProductTitle, amount: r.Price });
    // })
    // console.log(`\ntotal : ${p.length}`);
})()