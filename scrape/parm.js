const axios = require('axios');
const cheerio = require('cheerio');
const e1 = "https://parmigiani.com/en/watches/";
const e2 = "https://parmigiani.com/en/watches/page/2/";
const uniq = [];

(async () => {
    let cnt = 0;
    {
        const { data } = await axios.get(e1);
        const $ = cheerio.load(data);
        $(".w-grid-list").find(".w-grid-item").each((idx, el) => {
            const url = $(el).find(".post_image").find("a").attr("href");
            console.log(url);
            if (uniq.indexOf(url) < 0) uniq.push(url);
            cnt++;
        })
    }
    {
        const { data } = await axios.get(e2);
        const $ = cheerio.load(data);
        $(".w-grid-list").find(".w-grid-item").each((idx, el) => {
            const url = $(el).find(".post_image").find("a").attr("href");
            console.log(url);
            if (uniq.indexOf(url) < 0) uniq.push(url);
            cnt++;
        })
    }
    console.log();
    console.log(`uniq : ${uniq.length}        cnt : ${cnt}`);
})()