// const axios = require('axios');
const fetch = require('cross-fetch');
const u = "https://svc-1-usf.hotyon.com/search?q=&apiKey=6ccb0536-e2c3-4a40-bd97-651bbc86f955&locale=en&collection=270070513831&take=200";
const baseURL = "https://us.maseratistore.com/collections/watches/products/";

const urls = [
    "https://svc-1-usf.hotyon.com/search?q=&apiKey=6c25d399-7bac-4ad2-837d-10872aa5c2b6&locale=en&getProductDescription=0&collection=272649650344&skip=0&take=1000",                        //sg
    "https://svc-1-usf.hotyon.com/search?q=&apiKey=6ccb0536-e2c3-4a40-bd97-651bbc86f955&getProductDescription=0&locale=en&collection=270070513831&skip=0&take=1000",                        //usa
    "https://svc-1001-usf.hotyon.com/search?q=&apiKey=26a32cd3-f14e-44d3-af75-68ac1be05573&locale=en&getProductDescription=0&collection=267261247656&skip=0&take=1000",                        //dnk
    "https://svc-1001-usf.hotyon.com/search?q=&apiKey=26a32cd3-f14e-44d3-af75-68ac1be05573&locale=de&getProductDescription=0&collection=267261247656&skip=0&take=1000",                        //deu
    "https://svc-1001-usf.hotyon.com/search?q=&apiKey=26a32cd3-f14e-44d3-af75-68ac1be05573&locale=en&getProductDescription=0&collection=267261247656&skip=0&take=1000",                        //grc
    "https://svc-1001-usf.hotyon.com/search?q=&apiKey=26a32cd3-f14e-44d3-af75-68ac1be05573&locale=fr&getProductDescription=0&collection=267261247656&skip=0&take=1000",                        //fra
    "https://svc-1001-usf.hotyon.com/search?q=&apiKey=26a32cd3-f14e-44d3-af75-68ac1be05573&locale=it&getProductDescription=0&collection=267261247656&skip=0&take=1000",                         //ita
    "https://svc-1-usf.hotyon.com/search?q=&apiKey=97f55622-3ac9-44f2-98ad-b426598db544&locale=en&getProductDescription=0&collection=270786199708&skip=0&take=1000",                        //gbr
];

(async () => {
    const u = urls[3]; let cnt = 0;
    // const { data } = await axios.get(u);
    const res = await fetch(u);
    const data = await res.json();
    const items = data && data.data.items ? data.data.items : null;
    items && items.forEach(p => {
        const name = p.title;
        const reference = p.variants[0].sku;
        const retail = p.variants[0].price;
        console.log(`name : ${name}   reference : ${reference}   retail : ${retail}`);
        cnt++;
    })
    console.log(`cnt : ${cnt}`);
})()