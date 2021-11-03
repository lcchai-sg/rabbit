const axios = require('axios');
const cheerio = require('cheerio');
const e = "https://shop.ballwatch.ch/en/watchfinder";

const indexing = async (context) => {
    try {
        const { client, base, interval, } = context;
        const source = "official";
        const lang = "en";
        const brand = "Ball";
        const brandID = 188;
        const result = { source, lang, brand, brandID, collections: [], items: {} };
        const collections = [];
        // {
        //     const entry = 'https://www.ballwatch.com/global/en/sitemap.html';
        //     console.log(entry);
        //     const { data } = await client.get(entry);
        //     const $ = cheerio.load(data);
        //     $('.sitemap-list.col1-4').each((idx, el) => {
        //         const collection = $(el).find('.sitemap-list-title').text().trim();
        //         if (collections.indexOf(collection) < 0) {
        //             collections.push(collection);
        //             result.collections.push(collection);
        //             result.items[collection] = [];
        //         }
        //         $(el).find('li').each((idx, el) => {
        //             const name = $(el).text().trim().toUpperCase();
        //             const url = $(el).find('a').attr('href');
        //             const u = url.split('/');
        //             const nref = u[u.length - 1].split('---');
        //             const ref = nref[1].toUpperCase();
        //             const reference = (ref[0] === '-') ? ref.slice(1, ref.length) : ref;
        //             result.items[collection].push({
        //                 source, lang, brand, brandID, url, collection, name, reference, retail: null,
        //             });
        //         })
        //     })
        // }
        {
            const entry = 'https://shop.ballwatch.ch/en/watchfinder';
            console.log(entry);
            const { data } = await client.get(entry);
            const $ = cheerio.load(data);
            const lastp = $('.pagination').find('li').last().find('a').attr('href');
            const lastpage = parseInt(lastp.match(/\d{1,3}/g)[0])
            const entry1 = "https://shop.ballwatch.ch/en/watchfinder?page=";
            for (let i = 1; i <= lastpage; i++) {
                const link = entry1 + i;
                console.log(link);
                const { data } = await client.get(link);
                const $ = cheerio.load(data);
                $('.col-6.col-lg-4').each((idx, el) => {
                    const url = $(el).find('a').attr('href');
                    const name = $(el).find('.wic--name').text();
                    let collection = 'others';
                    collections.forEach(val => {
                        if (name.match(new RegExp(val, 'i'))) {
                            collection = val;
                        }
                    })
                    if (!(name.match(/strap/i))) {
                        let reference = '';
                        if (url.match(/model=/i)) {
                            reference = url.split('model=')[1].toUpperCase();
                        } else {
                            const u = url.split('/');
                            const r = u[u.length - 1].split('-');
                            if (r.length === 4)
                                reference = (r[1] + '-' + r[2] + '-' + r[3]).toUpperCase();
                            else if (r.length === 3)
                                reference = (r[0] + '-' + r[1] + '-' + r[2]).toUpperCase();
                            else
                                reference = r.join('-');
                        }
                        const thumbnail = $(el).find('img').attr('src');
                        const retail = $(el).find('.wic--price').text();
                        if (!result.items[collection]) result.items[collection] = [];
                        result.items[collection].push({
                            source, lang, brand, brandID, collection, url, name, reference, retail, thumbnail,
                        })
                    }
                });
                await new Promise(r => setTimeout(r, interval));
            }
        }
        return result;
    } catch (error) {
        console.log(error)
        return {};
    }
};

const extraction = async (context) => {
    const { client, entry, ...rest } = context;
    const result = { ...rest, url: entry, spec: [], related: [], };
    result.source = "official";
    result.lang = "en";
    result.brand = "Ball";
    result.brandID = 188;
    try {
        const res = await client.get(entry);
        const cUrl = res.request.res.responseUrl;
        if (cUrl != entry) {
            result.code = 404;
            return;
        }
        const { data } = res;
        const $ = cheerio.load(data);
        if (entry.match(/shop/i)) {
            const keys = [];
            const values = [];
            result.reference = $('.ciopmodel').first().text().trim();
            result.retail = $('.product-price').first().text().trim();
            result.name = $('.cioptitle').first().text().trim();
            result.thumbnail = $(".product-main--image").first().find("img").attr("src");
            $('.product-description-content').first().find('h6').each((idx, el) => {
                keys.push($(el).text().trim());
            })
            $('.product-description-content').first().find('ul').each((idx, el) => {
                const id = idx;
                $(el).find('li').each((idx, eli) => {
                    const value = $(eli).text().trim();
                    values.push({ id, value })
                })
            })
            values.forEach(val => {
                result.spec.push({ key: keys[val.id], value: val.value });
            })
        } else {
            result.thumbnail = $('#collectionInfoBox').find('img').first().attr('src');
            result.reference = $(".watchitem").find(".watch-no").text();
            result.name = $(".watchitem").find(".watch-title").text() + ' ' + $(".watchitem").find(".watch-type").text()
            result.collection = $(".watchitem").find(".watch-title").text();
            let key = ""; let value = "";
            $('.watch-info > p').each((idx, el) => {
                if (idx % 2 === 0) {
                    key = $(el).text().trim();
                } else {
                    value = $(el).text().trim();
                    result.spec.push({ key, value });
                }
            })
            $('#otherviewCarousel').find('p').each((idx, el) => {
                const url = $(el).find('a').attr('href');
                const u = url.split('/');
                const ref = u[u.length - 1].split('---')[1].toUpperCase();
                result.related.push(ref);
            })
        }
    } catch (error) {
        console.error('Failed extraction for Ball with error : ' + error);
        console.error('url:', entry);
        if (error.response) result.code = error.response.status;
        else result.code = 'UNKNOWN ERROR';
    }
    return result;
};

(async () => {
    // const r = await indexing({
    //     client: axios,
    //     entry: "",
    //     base: "",
    // })
    // console.log(r);
    const r = [
        "https://shop.ballwatch.ch/en/ball-watches/trainmaster/NM3288D-trainmaster-endeavour",
        "https://shop.ballwatch.ch/en/ball-watches/trainmaster/NM3888D-S1CJ-WH",
        "https://shop.ballwatch.ch/en/ball-watches/trainmaster/NM3888D-S3CJ-WH",
        "https://shop.ballwatch.ch/en/ball-watches/trainmaster/PW1098E-WH",
        "https://shop.ballwatch.ch/en/ball-watches/trainmaster/TR_MSF_Humanity",
        "https://shop.ballwatch.ch/en/ball-watches/trainmaster/pulsemeter_GMT_MSF",
    ];
    for (const x of r) {
        const ex = await extraction({
            entry: x,
            client: axios,
        });
        console.log(ex);
        await new Promise(r => setTimeout(r, 5000));
    }
    console.log('done.............');
    process.exit(0);
})()