const cheerio = require('cheerio');
const axios = require('axios');


const extraction = async (context) => {
    const { client, entry, ...rest } = context;
    const result = { ...rest, url: entry, spec: [], related: [], };
    result.source = "official";
    result.lang = "en";
    result.brand = "MeisterSinger";
    result.brandID = 280;
    try {
        const data = (await client.get(entry)).data;
        const $ = cheerio.load(data);
        // result.shortDesc = $('.woocommerce-product-details__short-description').text().trim();
        result.collection = $('.product_title').text();
        result.name = $('.product-subtitle').text();
        result.reference = $('.product_meta .sku_wrapper').first().text().replace('', '');
        result.description = $('.long-description').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
        $('.description').each((idx, el) => {
            const key = $(el).find('h5').text();
            const d = $(el).find('div').text();
            const dd = d.split('\n');
            dd.forEach(value => {
                result.spec.push({ key, value });
            })
        })
        let strap = $('.variations_form').attr('data-product_variations')
        if (strap) {
            strap = strap.replace(/\\\//g, '/');
            const varN = strap.match(/"attribute_pa_strap":"(\w+[-]?)*"/ig);
            const varP = strap.match(/"display_price":\d{0,6}/ig);
            const varS = strap.match(/"sku":"(\w+[-]?)*"/ig);
            const varU = strap.match(/"url":"https:\/\/[\w_-]+(?:\.[\w_-]+)+(?:[\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])?"/ig);
            if (varN.length !== varP.length) { console.debug('variation data error!!!'); }
            else {
                varN.forEach((val, i) => {
                    const v = val.split(":");
                    const vn = v[1].split("-").join(" ").toUpperCase();
                    result.spec.push({ key: "strap" + i, value: vn.replace(/"/g, ''), });
                    const vv = varP[i].split(":");
                    result.spec.push({ key: "retail" + i, value: vv[1], });
                    const vs = varS[i].split(":");
                    result.spec.push({ key: "sku" + i, value: vs[1].replace(/"/g, '').toUpperCase(), });
                    const vu = varU[i].split(":");
                    const value = vu.slice(1, vu.length).join(":").replace(/"/g, '');
                    result.spec.push({ key: "thumbnail" + i, value, });
                })
            }
        }
    } catch (error) {
        console.error('Failed extraction for MeisterSinger with error : ' + error);
        console.error('entry : ', entry);
        if (error.response) result.code = error.response.status;
        else result.code = 'UNKNOWN ERROR';
    }
    return result;
};

(async () => {
    const u = [
        'https://meistersinger.us/shop/perigraph-ivory/',
        'https://meistersinger.us/shop/astroscope-black-blue/',
        'https://meistersinger.us/shop/astroscope-black-old-radium/',
        'https://meistersinger.us/shop/metris-black-line-edition/',
        'https://meistersinger.us/shop/salthora-meta-x-transparent/',
    ];

    for (let i = 0; i < u.length; i++) {
        const ex = await extraction({
            client: axios,
            entry: u[i],
        });
        console.log(ex);
        await new Promise(r => setTimeout(r, 5000));
    }
    console.log('done');
    process.exit(0);
})();

