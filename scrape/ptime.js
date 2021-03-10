const axios = require('axios');
const cheerio = require('cheerio');
const { Mappers, } = require('./utils');

const indexing = async context => {
    const { client, entry, base, } = context;
    const baseURL = base ? base : "https://www.prestigetime.com";
    const source = "prestigetime";
    const lang = "en";
    const cats = [
        { name: 'Men', url: "https://www.prestigetime.com/luxury-watches-for-men.html", },
        { name: 'Women', url: "https://www.prestigetime.com/luxury-watches-for-women.html", },
        { name: 'Preowned', url: "https://www.prestigetime.com/preowned/all-watches?page=2", },
    ];
    const result = [];
    let payload = { source, lang, collections: [], items: {} };
    try {
        let cnt = 0;
        for (const cat of cats) {
            payload.collections.push(cat.name);
            payload.items[cat.name] = [];
            let next = cat.url;
            let forced = false;
            do {
                console.log(next);
                const { data } = await client.get(next);
                const $ = cheerio.load(data);
                if (cat.name !== 'Preowned') {
                    $(".thumbnail.thumbnail-center").each((idx, el) => {
                        const url = $(el).find(".relative").find("a").attr("href");
                        const name = $(el).find(".relative").find("a").attr("title");
                        const thumbnail = $(el).find(".relative").find("img").attr("src");
                        const reference = $(el).find(".relative").find("img").attr("alt");
                        const rtl = $(el).find(".caption-bottom").text().replace(/\s+/g, ' ').trim();
                        const retail = rtl.match(/retail:/i) ? rtl.split(" ")[1] : null;
                        const price = $(el).find(".price").text();
                        const { id: brandID, name: brand, } = Mappers.generateBrandID.map(name);
                        payload.items[cat.name].push({
                            source, lang, brand, brandID, url, collection: cat.name, name,
                            reference, thumbnail, retail, price,
                        });
                        cnt++;
                        if (cnt % 100 === 0) {
                            result.push(payload);
                            payload = { source, lang, collections: [cat.name], items: { [cat.name]: [] } };
                        }
                    });
                } else {
                    $(".col-xs-12.col-sm-6.col-md-3").each((idx, el) => {
                        const model = $(el).find(".model").text();
                        if (!(model.match(/strap|bracelet|box|deployant buckle|stylus|tang buckle|instruction manual|link/i))) {
                            const url = baseURL + $(el).find("a").attr("href");
                            const reference = $(el).find("img").attr("alt");
                            const thumbnail = baseURL + $(el).find("img").attr("src");
                            const brandname = $(el).find(".brand").text();
                            const price = $(el).find(".price").text().replace(/\s+/g, " ");
                            const name = brandname + '  ' + model;
                            const { id: brandID, name: brand, } = Mappers.generateBrandID.map(brandname);
                            payload.items[cat.name].push({
                                source, lang, brand, brandID, url, collection: cat.name, name,
                                reference, thumbnail, price,
                            });
                            cnt++;
                            if (cnt % 100 === 0) {
                                result.push(payload);
                                payload = { source, lang, collections: [cat.name], items: { [cat.name]: [] } };
                            }
                        }
                    })
                }
                const href = $('a[rel="next"]').first().attr("href");
                next = href ? baseURL + href : null;
                if (cat.name === 'Men' && !forced) {
                    next = "https://www.prestigetime.com/luxury-watches-for-men.html&page=109";
                    forced = true;
                }
                else if (cat.name === 'Women' && !forced) {
                    next = "https://www.prestigetime.com/luxury-watches-for-women.html&page=88";
                    forced = true;
                }
            } while (next);
        }
        if (payload.collections.length > 0) result.push(payload);
        return result;
    } catch (error) {
        console.log("Failed indexing for Prestigetime with error : ", error);
        return {};
    }
}

(async () => {
    const r = await indexing({
        client: axios,
        entry: "",
        base: "",
    });
    console.log(r);

    r.forEach(rr => {
        rr.collections.forEach(c => {
            rr.items[c].forEach(w => { console.log(w) })
        })
    })
})();