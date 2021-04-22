const axios = require('axios');
const cheerio = require('cheerio');
const sitemapper = require('sitemapper');

const extraction = async (context) => {
    const { client, entry, ...rest } = context;
    const result = { ...rest, url: entry, spec: [], related: [], features: [] };
    try {
        const { data } = await client.get(entry);
        const $ = cheerio.load(data);
        const title = $('meta[property="og:title"]').attr('content').split('|');
        result.name = title[1].trim() + ' ' + title[0].trim();
        result.reference = title[0].trim();
        result.collection = title[1].trim();
        result.thumbnail = $('meta[property="og:image"]').attr('content');
        result.price = $(".blk-ProductList_PriceTaxIn").first().text();
        $(".pr-Spec_Group").each((idx, el) => {
            const cat = $(el).find(".pr-Spec_HeadingLv1").text();
            $(el).find(".pr-Spec_Item").each((idx, el) => {
                const key = $(el).find(".pr-Spec_HeadingLv2").text();
                const value = $(el).find(".pr-Spec_Text").text();
                result.spec.push({ cat, key, value })
            })
        })
    } catch (error) {
        console.log('Failed extraction for Vacheron Constantin with error : ' + error);
        result.code = error.response.status;
    }
    return result;
};

const index = async context => {
    const { client, entry, base, } = context;
    const source = "official";
    const lang = "en";
    const brand = "Seiko";
    const brandID = 72;
    const result = { source, lang, brand, brandID, collections: [], items: {}, };
    const refprod = { refs: [], items: {} };
    try {
        const sitemap = new sitemapper({
            url: entry,
            timeout: 300000,
        });
        const d = await sitemap.fetch();
        d.sites.forEach(url => {
            const ul = url.split('/');
            if (ul.length === 7 && url.match(/-en\/products/i)) {
                const collection = ul[5].replace(/-/g, ' ').toUpperCase();
                const reference = ul[6].toUpperCase();
                const name = collection + ' ' + reference
                if (reference && reference.match(/\d/) && !reference.match(/-|_/)) {
                    if (refprod.refs.indexOf(reference) < 0) {
                        refprod.refs.push(reference);
                        refprod.items[reference] = [];
                    }
                    refprod.items[reference].push({ url, collection, reference, name, })
                }
            }
        })
        refprod.refs.forEach(r => {
            const p = refprod.items[r].sort()[0];
            if (result.collections.indexOf(p.collection) < 0) {
                result.collections.push(p.collection);
                result.items[p.collection] = [];
            }
            result.items[p.collection].push({ source, lang, brand, brandID, ...p, price: null, })
        })
        return result;
    } catch (error) {
        console.error('Failed indexing for Seiko with error : ', error);
        console.error('entry : ', entry);
        return {}
    }
}

const indexing = async context => {
    const { client, entry, base, interval, } = context;
    const baseURL = base ? base : "https://www.seikowatches.com";
    const source = "official";
    const lang = "en";
    const brand = "Seiko";
    const brandID = 72;
    const result = { source, lang, brand, brandID, collections: [], items: {}, };
    const cats = [];
    try {
        const { data } = await client.get(entry);
        const $ = cheerio.load(data);
        $(".blk-LocalHeader_Item").each((idx, el) => {
            let col = $(el).find(".blk-LocalHeader_SeriesHeading").find('a').text().trim();
            let u = $(el).find(".blk-LocalHeader_SeriesHeading").find('a').attr('href');
            if (!col) col = $(el).find('a').text().trim();
            if (!u) u = $(el).find('a').attr('href');
            const url = u ? baseURL + u : null;
            let sub = false;
            $(el).find(".blk-LocalHeader_SeriesItem").each((idx, el) => {
                sub = true;
                const subcol = $(el).find('a').text().trim();
                const u = $(el).find('a').attr('href');
                const url = u ? baseURL + u : null;
                const name = (col + ' ' + subcol).trim();
                cats.push({ name, url });
                result.collections.push(name);
                result.items[name] = [];
            })
            if (!sub) {
                cats.push({ name: col, url });
                result.collections.push(col);
                result.items[col] = [];
            }
        })
        for (const cat of cats) {
            // await new Promise(r => setTimeout(r, interval));
            console.log(cat.url);
            const { data } = await client.get(cat.url);
            const $ = cheerio.load(data);
            const lineup = $(".bd-Lineup_Button").find("a").attr("href");
            if (lineup) {
                // has line up button
                const lup = baseURL + lineup;
                // await new Promise(r => setTimeout(r, interval));
                console.log(lup);
                const { data } = await client.get(lup);
                const $ = cheerio.load(data);
                $(".lu-List_Item").each((idx, el) => {
                    const href = $(el).find("a").attr("href");
                    const url = baseURL + href;
                    const img = $(el).find("noscript").text();
                    const src = img.match(/"[\w:\/.]+"/ig);
                    const thumbnail = src ? src[0].replace(/"/g, "") : null;
                    const collection = $(el).find(".lu-List_Collection").text();
                    const reference = $(el).find(".lu-List_Name").text();
                    const gender = $(el).find(".lu-List_TargetMens").text();
                    const name = collection + ' ' + reference;
                    result.items[collection].push({
                        source, lang, brand, brandID, url, collection, name, reference,
                        thumbnail, gender, retail: null,
                    })
                })
            } else {
                // no line up button
                $(".sr-Lineup_Item").each((idx, el) => {
                    const href = $(el).find("a").attr("href");
                    const url = baseURL + href;
                    const img = $(el).find("noscript").text();
                    const src = img.match(/"[\w:\/.]+"/ig);
                    const thumbnail = src ? src[0].replace(/"/g, "") : null;
                    const col = $(el).find(".sr-Lineup_Collection").text()
                    const reference = $(el).find(".sr-Lineup_Name").text();
                    const gender = $(el).find(".blk-ProductList_TargetMens").text();
                    const name = col + ' ' + reference;
                    const collection = cat.name;
                    result.items[collection].push({
                        source, lang, brand, brandID, url, collection, name, reference,
                        thumbnail, gender, retail: null,
                    })
                })
            }
        }
        console.log(cats);
        return result;
    } catch (error) {
        console.error('Failed indexing for Seiko with error : ', error);
        console.error('entry : ', entry);
        return {};
    }
}

(async () => {
    const r = await indexing({
        client: axios,
        entry: "https://www.seikowatches.com/global-en/products",
        base: "https://www.seikowatches.com",
        interval: 3000,
    });
    // const r = await index({
    //     entry: "https://www.seikowatches.com/sitemap.xml",
    // })
    // console.log(r)
    let cnt = 0;
    r && r.collections.forEach(c => {
        console.log('collection.....', c)
        r.items[c].forEach(w => {
            cnt++;
            console.log(w);
        });
    });
    console.log();
    console.log(`watches : ${cnt}`);
    // const r = await indexing({
    //   client: axios,
    //   // entry: "https://www.seiko-watch.co.jp/collections/en",
    //   entry: "https://www.seikowatches.com/jp-ja/special/products/en/",
    //   brandID: 72,
    //   brand: "Seiko",
    //   base: "https://www.seiko-watch.co.jp/",
    // });
    // console.log(r);

    // const rr = [
    //   'https://www.seikowatches.com/ph-en/products/presage/SRPF41J1',
    //   'https://www.seikowatches.com/nz-en/products/prospex/SRPE87K1',
    //   'https://www.seikowatches.com/uk-en/products/king-seiko/SJE083J1',
    //   'https://www.seikowatches.com/ph-en/products/astron/SSH077J1',
    //   'https://www.seikowatches.com/au-en/products/5sports/SRPE71K1',
    //   'https://www.seikowatches.com/nz-en/products/coutura/SSC800P1',
    //   'https://www.seikowatches.com/au-en/products/discovermore/SSC777P1',
    //   'https://www.seikowatches.com/us-en/products/lukia/SPB133',
    //   'https://www.seikowatches.com/us-en/products/diamondcollection/SUT371',
    //   'https://www.seikowatches.com/global-en/products/seikopremier/SNP165P1',
    // ];

    // for (let i = 0; i < rr.length; i++) {
    //   const ex = await extraction({
    //     entry: rr[i],
    //     client: axios,
    //     brand: "Seiko",
    //     brandID: 72,
    //   })
    //   console.log(ex);
    // }

    //   for (let i = 0; i < r.collections.length; i++) {
    //     const c = r.collections[i];
    //     for (let j = 0; j < r.items[c].length; j++) {
    //       const ex = await extraction({
    //         client: axios,
    //         entry: r.items[c][j].url,
    //         ...r.items[c][j],
    //       });
    //       console.log(ex);
    //       ex.spec.forEach(s => console.log(s.cat + ' | ' + s.key + ' | ' + s.value))
    //     }
    //   }
    console.log('done.');
    process.exit(0);
})();