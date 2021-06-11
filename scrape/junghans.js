const axios = require('axios');
const cheerio = require('cheerio');

const indexing = async (context) => {
    const { client, entry, base, interval, } = context;
    const baseURL = base ? base : "https://www.junghans.de/en/";
    const source = 'official';
    const lang = 'en';
    const brand = 'Junghans';
    const brandID = 440;
    const result = { source, lang, brand, brandID, collections: [], items: {}, }
    const cats = [];
    try {
        const { data } = await client.get(entry);
        const $ = cheerio.load(data);
        $(".footer--column").each((idx, el) => {
            const type = $(el).find(".column--headline").text();
            if (type === 'Collection') {
                const url = $(el).find("a").attr("href");
                const name = $(el).find("a").text();
                result.collections.push(name);
                result.items[name] = [];
                cats.push({ name, url });
            }
        })
        for (const cat of cats) {
            let p = 1;
            do {
                const link = cat.url + "?p=" + p;
                console.log(link);
                const { data } = await client.get(link);
                const $ = cheerio.load(data);
                $('script').each((idx, el) => {
                    console.log('script found..................')
                    const c = $(el).contents();
                    console.log('c : ', c.toString())
                    if (c && c.toString().match(/ecommerce/i)) {
                        const cc = c.toString().match(/{ "name"(.*)"12" }/ig);
                        if (cc) {
                            console.log(cc);
                            const j = JSON.parse(cc);
                            console.log(j);
                        }
                    }
                })
            } while (1 > 1);
        }
        return result;
    } catch (error) {
        console.error('Failed indexing for Daniel Wellington with error : ', error);
        console.error('entry : ', entry);
        return {};
    }
}

(async () => {
    const r = await indexing({
        client: axios,
        entry: "https://www.junghans.de/en/",
        base: "https://www.junghans.de/en/",
    });
    let cnt = 0;
    r.collections && r.collections.forEach(c => {
        console.log(`collection : ${c}`)
        r.items[c].forEach(w => {
            console.log(w);
            cnt++;
        })
    });
    console.log();
    console.log(`watches : ${cnt}`);
    process.exit(0);
})();