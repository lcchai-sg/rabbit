const cheerio = require('cheerio');
// const axios = require('axios');

const indexing = async (context) => {
    const { client, entry, base, } = context;
    const source = "official";
    const lang = "en";
    const brand = "Tommy Hilfiger";
    const brandID = 252;
    // const entry = "https://usa.tommy.com/static/sitemap.xml";
    const result = { source, lang, brand, brandID, collections: ['all'], items: { 'all': [] } };
    const cfg = { headers: { 'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1' } }
    try {
        console.log(entry);
        process.exit(0)
        const $ = cheerio.load(data);
        $('loc').each((idx, el) => {
            const url = $(el).text();
            if (url.match(/watch/i) && !(url.match(/watches/i))) {
                const splitUrl = url.split('/');
                const nameRef = splitUrl[splitUrl.length - 1].split('-');
                const reference = nameRef[nameRef.length - 1];
                const name = nameRef.slice(0, nameRef.length - 1).join(' ');
                result.items['all'].push({
                    source, lang, brand, brandID, url, name, reference, retail: null,
                });
            }
        });
        return result;
    } catch (error) {
        console.error('Failed indexing for Tommy Hilfiger with error : ' + error)
        return {};
    }
};

const extraction = async (context) => {
    const { client, entry, ...rest } = context;
    const result = { ...rest, url: entry, spec: [], related: [], };
    result.source = "official";
    result.lang = "en";
    result.brand = "Tommy Hilfiger";
    result.brandID = 252;
    try {
        const data = await new Promise((resolve, reject) => {
            fetchUrl(entry, { headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/601.3.9 (KHTML, like Gecko) Version/9.0.2 Safari/601.3.9' } },
                (err, res, body) => {
                    if (err) reject(err);
                    resolve(body.toString());
                }
            )
        });
        const $ = cheerio.load(data);
        result.reference = $('meta[property="og:product_id"]').attr('content');
        result.name = $('.productNameInner').text().trim();
        result.thumbnail = $('.product_main_image').find('img').attr('data-src');
        result.retail = $('#price_display').text().trim();
        result.description = $('.itemDescription>p').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
        result.gender = result.description.match(/women/i) ? 'F' : 'M';
        result.spec = [];
        const spec = $('.productBullets').first().text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim().replace('Description  ', '').replace('  Fabric & Care  ', '');
        if (spec) {
            let sp = [];
            if (spec.match(/\d+\.\d+/)) sp = [spec];
            else sp = spec.split('.');
            sp.forEach(v => {
                const s = v.split(',');
                s.forEach(v => {
                    if (v.indexOf('.') > 0 && !(v.match(/\d+\.\d+/))) { // split others with '.'
                        const ss = v.split('.');
                        ss.forEach(v => v && result.spec.push(v.trim()))
                    } else {
                        v && result.spec.push(v.trim())
                    }
                })
            })
        } else {
            const spec = result.description.split('•');
            for (let k = 1; k < spec.length; k++) {
                const sp = spec[k].split(',');
                sp.forEach(s => {
                    if (s) result.spec.push(s.trim())
                })
            }
        }
    } catch (error) {
        console.error('Failed extraction for Tommy Hilfiger with error : ' + error);
        console.error('url:', entry);
        if (error.response) result.code = error.response.status;
        else result.code = 'UNKNOWN ERROR';
    }
    return result;
};

(async () => {
    const r = await indexing({
        entry: "https://usa.tommy.com/static/sitemap.xml",
    })
    console.log(r)
    // for (let i = 0; i < r.length - 1; i++) {
    //   const ex = await distill({
    //     entry: r[i].url,
    //     ...r[i],
    //   })
    //   console.log(r[i].spec);
    //   console.log()
    //   console.log('features: ', ex.features);
    //   console.log('functions: ', ex.functions);
    //   console.log('dial: ', ex.dial);
    //   console.log('case: ', ex.case);
    //   console.log('band: ', ex.band);
    //   console.log('caliber: ', ex.caliber);
    //   console.log('bezel: ', ex.bezel);
    //   console.log('additional: ', ex.additional);
    //   console.log()
    //   console.log('--------------------------------------------------');
    //   console.log()
    // }
    // for (let i = 0; i < r.length - 1; i++) {
    //   const ex = await extraction({
    //     entry: r[i],
    //   })
    //   console.log(ex);
    //   // const dist = await distill(ex);
    //   // console.log()
    //   // console.log('distilled > ', dist)
    //   // console.log()
    //   // console.log('--------------------------------------------------');
    //   // console.log()
    //   await new Promise(r => setTimeout(r, 3000));
    // }
})();