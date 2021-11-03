const axios = require('axios');
const cheerio = require('cheerio');
const e = "https://parmigiani.com/en/";

const indexing = async (context) => {
    const { client, entry, base, interval, } = context;
    const source = "official";
    const lang = "en";
    const brand = "Parmigiani Fleurier";
    const brandID = 158;
    const baseURL = base ? base : "https://www.parmigiani.com";
    const result = { source, lang, brand, brandID, collections: [], items: {} };
    const cats = [];
    try {
        const getCategory = async () => {
            const e = "https://parmigiani.com/en/";
            const { data } = await client.get(e)
            const $ = cheerio.load(data);
            $("#collectionmenu").find(".post_title").each((idx, el) => {
                const name = $(el).text().replace(/the|collection/ig, '').trim();
                if (cats.indexOf(name) < 0) cats.push(name);
            })
            cats.push("Tonda PF");                  // hardcode new collection
        }

        const getCollection = input => {
            let coll = "OTHER";
            cats.forEach(c => {
                const ex = new RegExp(c, "i");
                if (input.match(ex)) coll = c;
            })
            return coll;
        }

        await getCategory();
        console.log('cats : ', cats);

        const entry = "https://parmigiani.com/en/watches/";
        const { data } = await client.get(entry);
        const $ = cheerio.load(data);
        $(".l-main").find("article").each((idx, el) => {
            const name = $(el).find(".post_image").find("a").attr("aria-label");
            const url = $(el).find(".post_image").find("a").attr("href");
            const thumbnail = $(el).find(".post_image").find("img").attr("src");
            const ref = thumbnail.split("/");
            const reference = ref[ref.length - 1].replace(".png", "").toUpperCase();
            const collection = getCollection(name);
            if (result.collections.indexOf(collection) < 0) {
                result.collections.push(collection);
                result.items[collection] = [];
            }
            result.items[collection].push({
                source, lang, brand, brandID, url, collection, name, reference,
                thumbnail, retail: null,
            })
        })
        // $('.product.type-product').each((idx, el) => {
        //     const url = $(el).find(".post_image").find("a").attr("href");
        //     const name = $(el).find(".post_image").find("a").attr("aria-label");
        //     const thumbnail = $(el).find(".post_image").find("a").find("img").attr("src");
        //     const ref = thumbnail ? thumbnail.split('/') : null;
        //     const reference = ref ? ref[ref.length - 1].replace(".png", "").toUpperCase() : null;
        //     result.items[cat.name].push({
        //         source, lang, brand, brandID, url, collection: cat.name,
        //         name, reference, thumbnail, retail: null,
        //     })
        // })
        // await new Promise(r => setTimeout(r, interval));
        return result;
    } catch (error) {
        console.error('Failed indexing for Parmigiani Fleurier with error : ' + error)
        return {};
    }
};

const extraction = async (context) => {
    const { client, entry, ...rest } = context;
    const result = { ...rest, url: entry, spec: [], };
    result.source = "official";
    result.lang = "en";
    result.brand = "Parmigiani Fleurier";
    result.brandID = 158;
    try {
        const res = await client.get(entry);
        const cUrl = res.request.res.responseUrl;
        if (cUrl != entry) {
            result.code = 404;
            return;
        }
        const { data } = res;
        const $ = cheerio.load(data);
        result.thumbnail = $('meta[property="og:image"]').attr('content');
        result.name = $('meta[property="og:title"]').attr('content').split("-")[0].trim();
        const breadcrumbs = $(".l-main").find(".g-breadcrumbs").text();
        console.log(breadcrumbs);
        if (breadcrumbs) {
            const b = breadcrumbs.split("chevron_right");
            result.collection = b[b.length - 2];
        }
        result.reference = $(".l-main").find(".sku").find(".sku").text();
        result.retail = $('.woocommerce-Price-amount').text();
        result.description = $('.post_content').last().text().replace(/\s+/g, " ").trim();
        $(".l-main").find(".vc_col-sm-12.wpb_column.vc_column_container .vc_column-inner .wpb_wrapper").each((idx, el) => {
            const cat = $(el).find(".wpb_text_column").first().text().replace(/\s+/g, ' ').trim();
            if (cat) {
                $(el).find(".w-hwrapper").each((idx, el) => {
                    const key = $(el).find(".wpb_text_column").text().replace(/\s+/g, ' ').trim();
                    const value = $(el).find(".w-post-elm-value").text().replace(/\s+/g, ' ').trim();
                    if (key) result.spec.push({ cat, key, value });
                })
            } else {
                const key = $(el).find(".w-text-value").text().replace(/\s+/g, ' ').trim();
                if (key) {
                    const value = $(el).find(".w-post-elm-value").text().replace(/\s+/g, ' ').trim();
                    result.spec.push({ cat, key, value });
                }
            }
        })
    } catch (error) {
        console.error('Failed extraction for Parmigiani Fleurier with error : ' + error);
        console.error('entry : ', entry);
        if (error.response) result.code = error.response.status;
        else result.code = 'UNKNOWN ERROR';
    }
    return result;
};

(async () => {
    const r = await indexing({
        client: axios,
        entry: e,
    })
    let cnt = 0;
    r.collections && r.collections.forEach(c => {
        r.items[c].forEach(w => {
            console.log(w);
            cnt++;
        })
    })
    console.log(`total : ${cnt}`);
    // const r = [
    //     'https://parmigiani.com/en/watches/tonda-pf-micro-rotor-steel/',
    //     'https://parmigiani.com/en/watches/tonda-pf-chrono-integre-rattrapante/',
    //     'https://parmigiani.com/en/watches/tonda-pf-micro-rotor-rose-gold/',
    //     'https://parmigiani.com/en/watches/tonda-pf-chrono-rose-gold/',
    //     'https://parmigiani.com/en/watches/tonda-pf-chrono-integre-rattrapante/',
    //     'https://parmigiani.com/en/watches/tonda-pf-micro-rotor-rose-gold/',
    //     'https://parmigiani.com/en/watches/tonda-pf-annual-calendar-steel/',
    //     'https://parmigiani.com/en/watches/tonda-pf-micro-rotor-steel/',
    //     'https://parmigiani.com/en/watches/tonda-pf-chrono-steel/',
    //     'https://parmigiani.com/en/watches/tonda-pf-micro-rotor-steel/',
    //     'https://parmigiani.com/en/watches/tonda-pf-chrono-integre-rattrapante/',
    //     'https://parmigiani.com/en/watches/tonda-pf-micro-rotor-rose-gold/',
    //     'https://parmigiani.com/en/watches/toric-hemispheres-retrograde-steel-black/',
    //     'https://parmigiani.com/en/watches/toric-hemispheres-retrograde-rose-gold-slate/',
    //     'https://parmigiani.com/en/watches/toric-hemispheres-retrograde-rose-gold-grained-white/',
    //     'https://parmigiani.com/en/watches/toric-qualite-fleurier-white-gold-silver-guilloche/',
    //     'https://parmigiani.com/en/watches/toric-qualite-fleurier-red-gold-silver-guilloche/',
    //     'https://parmigiani.com/en/watches/toric-quantieme-perpetuel-retrograde-red-gold-grained-white/',
    //     'https://parmigiani.com/en/watches/toric-quantieme-perpetuel-retrograde-red-gold-slate/',
    //     'https://parmigiani.com/en/watches/toric-tourbillon-red-gold-slate/',
    //     'https://parmigiani.com/en/watches/tonda-pf-micro-rotor-steel/',
    //     'https://parmigiani.com/en/watches/tonda-pf-chrono-integre-rattrapante/',
    //     'https://parmigiani.com/en/watches/tonda-pf-micro-rotor-rose-gold/',
    //     'https://parmigiani.com/en/watches/tonda-pf-micro-rotor-steel/',
    //     'https://parmigiani.com/en/watches/tonda-pf-chrono-steel/',
    //     'https://parmigiani.com/en/watches/tonda-pf-annual-calendar-steel/',
    //     'https://parmigiani.com/en/watches/tonda-pf-ac-rose-gold/',
    //     'https://parmigiani.com/en/watches/tonda-pf-micro-rotor-rose-gold/',
    //     'https://parmigiani.com/en/watches/tonda-pf-chrono-rose-gold/',
    //     'https://parmigiani.com/en/watches/tonda-pf-micro-rotor-steel/',
    //     'https://parmigiani.com/en/watches/tonda-pf-chrono-integre-rattrapante/',
    //     'https://parmigiani.com/en/watches/tonda-pf-micro-rotor-rose-gold/',
    //     'https://parmigiani.com/en/watches/kalpagraphe-steel-blue/',
    //     'https://parmigiani.com/en/watches/kalpagraphe-steel-adlc-grey-sapphire/',
    //     'https://parmigiani.com/en/watches/kalpagraphe-steel-adlc-5n-grey-sapphire/',
    //     'https://parmigiani.com/en/watches/kalpagraphe-chronometre-titanium-slate-cosc/',
    //     'https://parmigiani.com/en/watches/kalpagraphe-chronometre-titanium-blue-cosc/',
    //     'https://parmigiani.com/en/watches/kalpagraphe-chronometre-titanium-green-cosc/',
    // ];
    // for (let i = 0; i < r.length; i++) {
    //     const ex = await extraction({
    //         client: axios,
    //         entry: r[i],
    //     })
    //     console.log(ex);
    //     await new Promise(r => setTimeout(r, 5000));
    // }
    // console.log();

    // for (const c of r.collections) {
    //     console.log(c, r.items[c].length);
    // for (const w of r.items[c]) {
    //     const ex = await extraction({
    //         client: axios,
    //         entry: w.url,
    //     })
    //     ex.spec.forEach(s => {
    //         console.log(`${s.cat}||${s.key}||${s.value}`);
    //     })
    //     await new Promise(r => setTimeout(r, 3000));
    // }
    // }
    console.log();
    console.log('done......');
})()