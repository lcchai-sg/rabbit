const axios = require('axios');
const xml2js = require('xml2js');
const cheerio = require('cheerio');

const indexing = async context => {
    const { client, entry, base, } = context;
    console.log('entry : ', entry)
    const source = 'official';
    const lang = 'en';
    const brand = 'Michael Kors';
    const brandID = 190;
    const result = { source, lang, brand, brandID, collections: ['all'], items: { 'all': [] } };
    try {
        const { data } = await client.get(entry);
        const parser = new xml2js.Parser();
        parser.parseString(data, (err, res) => {
            for (let i = 1; i < res.urlset.url.length; i++) {
                const url = res.urlset.url[i]['loc'] ? res.urlset.url[i]['loc'][0] : null;
                if (url && url.match(/watch/i) && !(url.match(/watch-strap/i))) {
                    let name = res.urlset.url[i]['image:image'] ? res.urlset.url[i]['image:image'][0]['image:title'][0] : null;
                    name = name ? name.slice(0, name.length - 2) : null;
                    const ref = url.split('/');
                    const reference = entry.match(/en_SG/i) ? ref[ref.length - 1].replace('R-', '') : ref[ref.length - 1].replace('R-US_', '');
                    let thumbnail = '';
                    if (res.urlset.url[i]['image:image']) {
                        const image = res.urlset.url[i]['image:image'][0]['image:loc'][0];
                        thumbnail = image.split('_')[0] + '_1';
                    }
                    result.items['all'].push({
                        source, lang, brand, brandID, url, name, reference, thumbnail,
                    })
                }
            }
        })
        return result;
    } catch (error) {
        console.error('Failed indexing for Micheal Kors with error : ', error);
        return {};
    }
}

const extraction = async (context) => {
    const { client, entry, base, ...rest } = context;
    const result = { ...rest, url: entry, spec: [], related: [], };
    result.source = "official";
    result.lang = "en";
    result.brand = "Michael Kors";
    result.brandID = 190;
    try {
        const { data } = await client.get(entry);
        const $ = cheerio.load(data);
        console.log(data);
        result.name = $('meta[name="og:title"]').attr('content');
        console.log('name : ', result.name)
        result.name = $('meta[name="og:title"]').attr('content').split('|')[0].trim();
        console.log('name : ', result.name);
        // result.name = result.name.match(/\|/) ? result.name.split('|')[0].trim() : result.name;
        result.description = $('meta[name="description"]').attr('content');
        result.thumbnail = $('meta[property="og:image"]').attr('content');
        $('script').each((idx, el) => {
            const d = $(el).contents().toString();
            if (d.match(/window.__INITIAL_STATE__ =/i)) {
                const r = d.match(/"identifier":"\w+"/ig);
                console.log('r : ', r);
                if (r) result.reference = r[0].split(':')[1].replace(/"/g, '');
                console.log('reference : ', result.reference);
                const dd = d.match(/"richTextDescription":"(.*)","displayNameEn"/ig);
                console.log('dd : ', dd)
                const ddd = dd[0].split(',');
                ddd.forEach(v => {
                    if (v.match(/richTextDescription/i)) {
                        const vvv = v.replace(new RegExp('"', 'g'), '').replace(new RegExp('\\\\n', 'g'), '').replace(new RegExp('\\n', 'g'), '').replace('richTextDescription:', '');
                        const vv = vvv.match(/<br \/>/i) ? vvv.split('<br />') :
                            vvv.match(/<br>/) ? vvv.split('<br>') :
                                vvv.match(/<BR>/) ? vvv.split('<BR>') : vvv.split('<br/>');
                        result.spec = vv.filter(v => v);
                    }
                    if (v.match(/highSalePrice/i)) result.retail = v.split(':')[1].replace(/"/g, '');
                })
            }
        })
    } catch (error) {
        console.error('Failed extraction for Michael Kors with error : ' + error);
        if (error.response) result.code = error.response.status;
        else result.code = 'UNKNOWN ERROR';
    }
    return result;
};


(async () => {
    // const mk_usa = await indexing({
    //     client: axios,
    //     // entry: 'https://www.michaelkors.com/productsitemap_en_US.xml',
    //     entry: 'https://www.michaelkors.com/product-image-sitemap_en_US.xml',
    //     base: '',
    //     //
    // });

    // const uniq_usa = [];
    // for (let i = 0; i < mk_usa.items['all'].length; i++) {
    //     console.log(mk_usa.items['all'][i])
    //     if (uniq_usa.indexOf(mk_usa.items['all'][i].reference) < 0) uniq_usa.push(mk_usa.items['all'][i].reference);
    // }
    // const uniq_usa = [];
    // for (let i = 0; i < mk_usa.items['all'].length; i++) {
    //     console.log(`   usa : ${mk_usa.items['all'][i].reference}          ${mk_usa.items['all'][i].url}`);
    //     if (uniq_usa.indexOf(mk_usa.items['all'][i].reference) < 0) uniq_usa.push(mk_usa.items['all'][i].reference);
    // }
    // console.log(`mk_usa : ${mk_usa.items['all'].length}           uniq_usa : ${uniq_usa.length}`);
    // console.log();
    // console.log();
    // console.log();

    // const mk_sg = await indexing({
    //     client: axios,
    //     // entry: 'https://www.michaelkors.com/product-image-sitemap_en_US.xml',
    //     entry: 'https://www.michaelkors.global/en_SG/product-image-sitemap_en_SG.xml',
    //     base: '',
    // });
    // for (let i = 0; i < mk_sg.items['all'].length; i++) {
    //     console.log(mk_sg.items['all'][i])
    //     if (uniq_usa.indexOf(mk_sg.items['all'][i].reference) >= 0) console.log('dup ref : ', mk_sg.items['all'][i].reference);
    // }

    // const uniq_sg = [];
    // for (let i = 0; i < mk_sg.items['all'].length; i++) {
    //     console.log(`   sg : ${mk_sg.items['all'][i].reference}            ${mk_sg.items['all'][i].url}`);
    //     if (uniq_sg.indexOf(mk_sg.items['all'][i].reference) < 0) uniq_sg.push(mk_sg.items['all'][i].reference);
    // }
    // console.log(`mk_sg : ${mk_sg.items['all'].length}           uniq_sg : ${uniq_sg.length}`);

    // const not_usa = [];
    // uniq_sg.forEach(ref => {
    //     if (uniq_usa.indexOf(ref) < 0) not_usa.push(ref);
    // })
    // console.log(`not in usa : ${not_usa.length}`)

    const u = [
        // "https://www.michaelkors.global/en_SG/pyper-two-tone-watch/_/R-MK4547",
        // "https://www.michaelkors.global/en_SG/ritz-gold-tone-and-acetate-curb-link-watch/_/R-MK6939",
        // "https://www.michaelkors.com/oversized-bradshaw-black-tone-watch/_/R-US_MK5550",
        // "https://www.michaelkors.com/oversized-gage-black-tone-and-woven-watch/_/R-US_MK8788",
        "https://www.michaelkors.com/oversized-camille-pave-gold-tone-watch/_/R-US_MK6958",
    ];

    for (let i = 0; i < u.length; i++) {
        const ex = await extraction({
            client: axios,
            entry: u[i],
            base: 'https://www.michaelkors.com',
        })
        // console.log(ex)
    }

    console.log();
    console.log('done.');
    process.exit(0);
})();