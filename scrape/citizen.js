const axios = require('axios');
const cheerio = require('cheerio');

const sleep = async t => {
    await new Promise(r => setTimeout(r, t));
}

const indexing = async context => {
    const { client, entry, base, interval } = context;
    const urls = [
        { name: "mens", url: "https://www.citizenwatch.com/on/demandware.store/Sites-citizen_US-Site/en_US/Search-UpdateGrid?cgid=mens&start=0&sz=1000" },
        { name: "womens", url: "https://www.citizenwatch.com/on/demandware.store/Sites-citizen_US-Site/en_US/Search-UpdateGrid?cgid=womens&start=0&sz=1000" },
        { name: "Wear OS", url: "https://www.citizenwatch.com/on/demandware.store/Sites-citizen_US-Site/en_US/Search-UpdateGrid?cgid=smartwatch&start=0&sz=1000" },
        { name: "Disney", url: "https://www.citizenwatch.com/on/demandware.store/Sites-citizen_US-Site/en_US/Search-UpdateGrid?cgid=disney&start=0&sz=1000" },
        { name: "Marvel", url: "https://www.citizenwatch.com/on/demandware.store/Sites-citizen_US-Site/en_US/Search-UpdateGrid?cgid=marvel&start=0&sz=1000" },
        { name: "Star Wars", url: "https://www.citizenwatch.com/on/demandware.store/Sites-citizen_US-Site/en_US/Search-UpdateGrid?cgid=star-wars&start=0&sz=1000" },
    ];
    let cnt = 0; const uniq = [];
    for (const u of urls) {
        console.log(u.url);
        await sleep(interval);
        const { data } = await client.get(u.url);
        const $ = cheerio.load(data);
        $(".product").each((idx, el) => {
            const d = $(el).attr("data-gtmdata");
            const j = JSON.parse(d);
            const reference = j.id;
            const name = j.name;
            const retail = j.price;
            const url = "https://www.citizenwatch.com" + $(el).find("a").attr("href");
            const thumbnail = $(el).find(".product-tile-image").attr("src");
            console.log(`url : ${url}`);
            // console.log(`thumbnail : ${thumbnail}`);
            // console.log(`name : ${name}   reference : ${reference}   retail : ${retail}`);
            if (uniq.indexOf(reference) < 0) uniq.push(reference);
            cnt++;
        })
    }
    console.log();
    console.log(`cnt : ${cnt}`);
    console.log(`uniq : ${uniq.length}`);
}

const extraction = async (context) => {
    const { client, entry, base, ...rest } = context;
    const result = { ...rest, url: entry, spec: [], related: [], features: [] };
    result.source = "official";
    result.lang = "en";
    result.brand = "Citizen";
    result.brandID = 86;
    try {
        const res = await client.get(entry);
        const cUrl = res.request.res.responseUrl;
        if (cUrl != entry) {
            result.code = 404;
            return;
        }
        const { data } = res;
        const $ = cheerio.load(data);
        const title = $(".product-name").first().text();
        const subtitle = $(".product-subtitle").text();
        result.name = title + (subtitle ? subtitle : "");
        result.reference = $(".product-id").text();
        result.retail = $(".price").find(".list").find(".value").attr("content");
        result.price = $(".price").find(".sales").find(".value").attr("content");
        if (result.price) result.price = result.price.replace(/\s+/g, " ").trim();
        if (!result.retail) result.retail = result.price;
        result.description = $(".show-more-text-content").text().trim();
        result.thumbnail = $(".primary-images-main").find(".slide").first().attr("data-zoom-image");
        if (result.url.match(/\bmens\b/)) result.gender = "M";
        $(".recommendation-thumbnail").each((idx, el) => {
            const url = $(el).find("a").attr("href");
            const u = url ? url.split('/') : null;
            const r = u ? u[u.length - 1].replace('.html', '') : null;
            if (r) result.related.push(r);
        })
        let key, value;
        $(".key-details-col-2").find(".row").find("div").each((idx, el) => {
            const c = $(el).attr("class");
            if (c.match(/pdp-detail-attribute-header/i)) {
                key = $(el).text();
                if (key) key = key.replace(/\s+/g, " ").trim();
            } else if (c.match(/pdp-detail-attribute-col/i)) {
                value = $(el).find(".pdp-detail-attribute-list").text();
                if (value) {
                    const v = value.split('\n');
                    let nval = "";
                    v.forEach(val => {
                        const vv = val.replace(/\n|\s+/g, " ").trim();
                        if (vv) nval = nval + vv + " | ";
                    })
                    value = nval.slice(0, nval.length - 3);
                }
            }
            if (key && value) {
                result.spec.push({ key, value });
                key = ""; value = "";
            }
        })
        $(".feature-text-list-item").each((idx, el) => {
            const key = "feature";
            const value = $(el).text().replace(/\s+/g, " ").trim();
            result.spec.push({ key, value });
        })
        key = ""; value = "";
        $(".features-attributes-row").find(".row").find("div").each((idx, el) => {
            const c = $(el).attr("class");
            if (c.match(/pdp-detail-attribute-header/i)) {
                key = $(el).text();
                if (key) key = key.replace(/\s+/g, " ").trim();
            } else if (c.match(/pdp-detail-attribute-col/i)) {
                value = $(el).find(".pdp-detail-attribute-list").text();
                if (value) {
                    const v = value.split('\n');
                    let nval = "";
                    v.forEach(val => {
                        const vv = val.replace(/\n|\s+/g, " ").trim();
                        if (vv) nval = nval + vv + " | ";
                    })
                    value = nval.slice(0, nval.length - 3);
                }
            }
            if (key && value) {
                result.spec.push({ key, value });
                key = ""; value = "";
            }
        })
        $(".pdp-additional-functions-list").each((idx, el) => {
            const key = "functions";
            const value = $(el).text();
            if (value) {
                const v = value.split('\n');
                v.forEach(val => {
                    const value = val.replace(/\n|\s+/g, " ").trim();
                    if (value) result.spec.push({ key, value });
                })
            }
        })
    } catch (error) {
        console.error('Failed extraction for Citizen with error : ' + error);
        console.error('entry : ', entry)
        if (error.response) result.code = error.response.status;
        else result.code = 'UNKNOWN ERROR';
    }
    return result;
};

(async () => {
    // await indexing({
    //     client: axios,
    //     interval: 5000,
    // })
    const rr = [
        "https://www.citizenwatch.com/us/en/product/JG2110-51W.html?cgid=star-wars",
        "https://www.citizenwatch.com/us/en/product/AW1609-08W.html?cgid=marvel",
        "https://www.citizenwatch.com/us/en/product/EX1499-50W.html?cgid=disney",
        "https://www.citizenwatch.com/us/en/product/MX0007-P9X.html?cgid=smartwatch",
        "https://www.citizenwatch.com/us/en/product/FD0006-56D.html?cgid=womens",
        "https://www.citizenwatch.com/us/en/product/JY8101-52L.html?cgid=mens",
    ];
    for (const u of rr) {
        const ex = await extraction({
            client: axios,
            entry: u,
            base: "https://www.citizenwatch.com",
        })
        console.log(ex);
        await sleep(5000);
    }
    console.log();
    console.log(`done......................`);
})()
