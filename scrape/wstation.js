const axios = require('axios');
const cheerio = require('cheerio');

const indexing = async context => {
    const { client, entry } = context;
    const source = "watchstation";
    const result = []; const uniq = [];
    let cnt = 0; let sn = 0; const b = [];
    try {
        do {
            cnt = 0;
            const link = entry + sn;
            console.log(link);
            const { data } = await client.get(link);
            const $ = cheerio.load(data);
            $(".quickview").each((idx, el) => {
                const curr = $(el).attr("data-ccode");
                const d = $(el).attr("data-gtmdata").replace("&quot;", "\"");
                const j = JSON.parse(d);
                if (j && j.name.match(/watch/i)) {
                    if (uniq.indexOf(j.name + j.id) < 0) uniq.push(j.name + j.id);
                    else {
                        console.log('dup : ', j.brand, j.name, j.id, j.msrp);
                    }
                    if (b.indexOf(j.brand) < 0) b.push(j.brand);
                    result.push({
                        source, brand: j.brand, name: j.name, reference: j.id, msrp: j.msrp, price: j.price,
                    })
                    cnt++;
                }
            })
            sn += 12;
            // sn += sn === 0 ? 11 : 12;
            await new Promise(r => setTimeout(r, 3000))
        } while (cnt > 0);
        b.sort().forEach(brand => { console.log(brand) });
        return result;
    } catch (e) {
        console.log(e);
        return [];
    }//1304
}

(async () => {
    const r = await indexing({
        client: axios,
        entry: "https://www.watchstation.com/on/demandware.store/Sites-wsi-us-Site/en_US/Search-UpdateGrid?cgid=shopbybrand&start=",
        // entry: "https://www.watchstation.com/on/demandware.store/Sites-wsi-ca-Site/en_CA/Search-UpdateGrid?cgid=shopbybrand&start=",
    })
    console.log(r);
    console.log(r.length)
    process.exit(0);
})();

