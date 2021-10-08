const axios = require('axios');
const u = "https://svc-1-usf.hotyon.com/search?q=&apiKey=6ccb0536-e2c3-4a40-bd97-651bbc86f955&locale=en&collection=270070513831&take=200";
const baseURL = "https://us.maseratistore.com/collections/watches/products/";

(async () => {
    const { data } = await axios.get(u);
    const items = data && data.data.items ? data.data.items : null;
    items && items.forEach(p => {
        const url = baseURL + p.urlName;
        const name = p.title;
        const description = p.description;
        const reference = p.variants[0].sku;
        const retail = p.variants[0].price;
        let thumbnail = p.images && p.images.length > 0 ? p.images[0].url : null;
        if (thumbnail) thumbnail = "https:" + thumbnail; else console.log(url, p.images);
        console.log({ url, name, reference, description, thumbnail, retail, })
    })
})()