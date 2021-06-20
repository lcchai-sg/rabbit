const axios = require('axios');
const cheerio = require('cheerio');
const xml2js = require('xml2js');
const httpsProxyAgent = require('https-proxy-agent');


const indexing = async (context) => {
    const { client, entry, base, } = context;
    const proxy = {
        dnk_ip: '217.61.236.218',
        usa_ip: 'usvpn.tell.com',
        port: '3128',
        user: 'proxyclient',
        pass: '4uFra6iTrAw1Pr',
    };
    const agent = new httpsProxyAgent(`http://${proxy.user}:${proxy.pass}@${proxy.usa_ip}:${proxy.port}`);
    const cfg = { httpsAgent: agent };
    const source = "official";
    const lang = "en";
    const brand = "Luminox";
    const brandID = 442;
    const result = { source, lang, brand, brandID, collections: [], items: {} };
    try {
        // const { data } = await client.get(entry, cfg);
        const { data } = await client.get(entry);
        console.log(data);
        const sm = data.match(/<loc>(.*)product(.*)<\/loc>/ig);
        if (sm) {
            const s = sm[0].replace(/<loc>|<\/loc>/ig, '');
            console.log(`sitemap : ${s}`);
            const { data } = await client.get(s, cfg);
            const parser = new xml2js.Parser();
            parser.parseString(data, (err, res) => {
                for (let i = 1; i < res.urlset.url.length; i++) {
                    const d = res.urlset.url[i];
                    const url = d['loc'][0];
                    const name = d['image:image'] ? d['image:image'][0]['image:title'][0] : null;
                    if (name && !name.match(/strap/i)) {
                        const thumbnail = d['image:image'] ? d['image:image'][0]['image:loc'][0] : null;
                        const reference = name ? name.match(/-/) ? name.split('-')[1].trim() : name : null;
                        const collection = name ? name.match(/-/) ? name.split('-')[0].trim() : 'OTHERS' : null;
                        if (result.collections.indexOf(collection) < 0) {
                            result.collections.push(collection);
                            result.items[collection] = [];
                        }
                        result.items[collection].push({
                            source, lang, brand, brandID, url, collection, name, reference, retail: null, thumbnail,
                        })
                    }
                }
            });
        }
        return result;
    } catch (error) {
        console.error('Failed indexing for Luminox with error : ' + error)
        return {};
    }
};

const extraction = async context => {
    const { client, entry, ...rest } = context;
    const result = { ...rest, url: entry, spec: [], related: [], };
    result.source = "official";
    result.lang = "en";
    result.brand = "Luminox";
    result.brandID = 442;
    try {
        const { data } = await client.get(entry);
        // console.log(data);
        const $ = cheerio.load(data);
        result.retail = $("#ProductPrice-product").text();
        result.collection = $("#productInfo-product").find("a").first().text();
        result.name = $("#productInfo-product").find("h1").first().text();
        result.description = $("#productInfo-product").find(".product-description").text().replace(/\s+/g, ' ').trim();
        result.reference = result.name ? result.name.match(/-/) ? result.name.split('-')[1].trim() : result.name : null;
        result.thumbnail = $(".ProductImg-product").first().attr("data-mfp-src");
        result.thumbnail = result.thumbnail.match("https") ? result.thumbnail : "https:" + result.thumbnail;
        const d = $(".product-description").contents().toString().replace(/<h1>(.*)<\/h1>/ig, '');
        if (d.match(/<li>/i)) {
            $(".product-description").find('li').each((idx, el) => {
                result.spec.push($(el).text().replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim());
            })
        } else {
            d.replace(/&nbsp;/g, ' ').replace(/\n/g, '<br>').replace(/<br *\/?>/ig, '|').split('|').forEach(s => {
                const v = s.replace(/<[^>]*>?/gm, '').trim();
                if (v) if (result.spec.indexOf(v) < 0) result.spec.push(v);
            })
        }
    } catch (error) {
        console.error('Failed extraction for Luminox with error : ' + error);
        console.error('entry :', entry);
        if (error.response) result.code = error.response.status;
        else result.code = 'UNKNOWN ERROR';
    }
    return result;
}

(async () => {
    const r = await indexing({
        client: axios,
        entry: "https://www.luminox.com.sg/sitemap.xml",
        base: "https://www.luminox.com.sg",
    })
    // const r = await indexing({
    //     client: axios,
    //     entry: "https://www.luminox.com/sitemap.xml",
    //     base: "https://www.luminox.com",
    // })
    let cnt = 0;
    console.log(r.collections);
    r.collections && r.collections.forEach(c => {
        console.log(`collection : ${c}`);
        r.items[c].forEach(w => {
            console.log(w);
            cnt++;
        })
    })
    console.log();
    console.log('watches : ', cnt);
    /*
        const r = [
            {
                source: 'official',
                lang: 'en',
                brand: 'Bulova',
                brandID: 268,
                url: 'https://luminox.com/products/original-navy-seal-3001',
                collection: 'Original Navy SEAL',
                name: 'Original Navy SEAL - 3001',
                reference: '3001',
                retail: null,
                thumbnail: 'https://cdn.shopify.com/s/files/1/2423/1151/products/3001-XS-S90-DNV-Day.png?v=1509046688'
            },
            {
                source: 'official',
                lang: 'en',
                brand: 'Bulova',
                brandID: 268,
                url: 'https://luminox.com/products/modern-mariner-automatic-6502',
                collection: 'Modern Mariner Automatic',
                name: 'Modern Mariner Automatic - 6502',
                reference: '6502',
                retail: null,
                thumbnail: 'https://cdn.shopify.com/s/files/1/2423/1151/products/6502-XS-S90-DNV-Day.png?v=1509049291'
            },
            {
                source: 'official',
                lang: 'en',
                brand: 'Bulova',
                brandID: 268,
                url: 'https://luminox.com/products/navy-seal-steel-3252',
                collection: 'Navy SEAL Steel',
                name: 'Navy SEAL Steel - 3252',
                reference: '3252',
                retail: null,
                thumbnail: 'https://cdn.shopify.com/s/files/1/2423/1151/products/3252-90.png?v=1512062920'
            },
            {
                source: 'official',
                lang: 'en',
                brand: 'Bulova',
                brandID: 268,
                url: 'https://luminox.com/products/navy-seal-steel-3252-bo',
                collection: 'Navy SEAL Steel',
                name: 'Navy SEAL Steel - 3252.BO.L',
                reference: '3252.BO.L',
                retail: null,
                thumbnail: 'https://cdn.shopify.com/s/files/1/2423/1151/products/3252.BO_2_-XS-S90-DNV-Day.png?v=1569252956'
            },
            {
                source: 'official',
                lang: 'en',
                brand: 'Bulova',
                brandID: 268,
                url: 'https://luminox.com/products/navy-seal-steel-3258',
                collection: 'Navy SEAL Steel',
                name: 'Navy SEAL Steel - 3258.L',
                reference: '3258.L',
                retail: null,
                thumbnail: 'https://cdn.shopify.com/s/files/1/2423/1151/products/3258_2_-XS-S90-DNV-Day.png?v=1509480309'
            },
            {
                source: 'official',
                lang: 'en',
                brand: 'Bulova',
                brandID: 268,
                url: 'https://luminox.com/products/navy-seal-steel-3253',
                collection: 'Navy SEAL Steel',
                name: 'Navy SEAL Steel - 3253',
                reference: '3253',
                retail: null,
                thumbnail: 'https://cdn.shopify.com/s/files/1/2423/1151/products/3253_front.png?v=1572971001'
            },
            {
                source: 'official',
                lang: 'en',
                brand: 'Bulova',
                brandID: 268,
                url: 'https://luminox.com/products/navy-seal-steel-3254',
                collection: 'Navy SEAL Steel',
                name: 'Navy SEAL Steel - 3254',
                reference: '3254',
                retail: null,
                thumbnail: 'https://cdn.shopify.com/s/files/1/2423/1151/products/3254_face.png?v=1572972611'
            },
            {
                source: 'official',
                lang: 'en',
                brand: 'Bulova',
                brandID: 268,
                url: 'https://luminox.com/products/navy-seal-3502',
                collection: 'Navy SEAL',
                name: 'Navy SEAL - 3502.L',
                reference: '3502.L',
                retail: null,
                thumbnail: 'https://cdn.shopify.com/s/files/1/2423/1151/products/350290.png?v=1536172801'
            },
            {
                source: 'official',
                lang: 'en',
                brand: 'Bulova',
                brandID: 268,
                url: 'https://luminox.com/products/navy-seal-3501',
                collection: 'Navy SEAL',
                name: 'Navy SEAL - 3501.L',
                reference: '3501.L',
                retail: null,
                thumbnail: 'https://cdn.shopify.com/s/files/1/2423/1151/products/3501-90.png?v=1536172532'
            },
            {
                source: 'official',
                lang: 'en',
                brand: 'Bulova',
                brandID: 268,
                url: 'https://luminox.com/products/navy-seal-3501-bo',
                collection: 'Navy SEAL',
                name: 'Navy SEAL - 3501.BO.L',
                reference: '3501.BO.L',
                retail: null,
                thumbnail: 'https://cdn.shopify.com/s/files/1/2423/1151/products/3501.BO-8.png?v=1555421790'
            },
            {
                source: 'official',
                lang: 'en',
                brand: 'Bulova',
                brandID: 268,
                url: 'https://luminox.com/products/navy-seal-3502-bo',
                collection: 'Navy SEAL',
                name: 'Navy SEAL - 3502.BO',
                reference: '3502.BO',
                retail: null,
                thumbnail: 'https://cdn.shopify.com/s/files/1/2423/1151/products/3502.BO-90.png?v=1511906512'
            },
            {
                source: 'official',
                lang: 'en',
                brand: 'Bulova',
                brandID: 268,
                url: 'https://luminox.com/products/navy-seal-3503-f-new',
                collection: 'Navy SEAL',
                name: 'Navy SEAL - 3503.F',
                reference: '3503.F',
                retail: null,
                thumbnail: 'https://cdn.shopify.com/s/files/1/2423/1151/products/3503_FRONT.png?v=1570636104'
            },
            {
                source: 'official',
                lang: 'en',
                brand: 'Bulova',
                brandID: 268,
                url: 'https://luminox.com/products/navy-seal-3507-wo',
                collection: 'Navy SEAL',
                name: 'Navy SEAL - 3507.WO',
                reference: '3507.WO',
                retail: null,
                thumbnail: 'https://cdn.shopify.com/s/files/1/2423/1151/products/FACE_e1b77771-aaee-46d3-9c04-2ab84b044987.png?v=1575569137'
            },
            {
                source: 'official',
                lang: 'en',
                brand: 'Bulova',
                brandID: 268,
                url: 'https://luminox.com/products/navy-seal-3508-gold-holiday-edition',
                collection: 'Navy SEAL',
                name: 'Navy SEAL - 3508 Gold',
                reference: '3508 Gold',
                retail: null,
                thumbnail: 'https://cdn.shopify.com/s/files/1/2423/1151/products/3508-UVshot-fullsize.png?v=1605026989'
            },
            {
                source: 'official',
                lang: 'en',
                brand: 'Bulova',
                brandID: 268,
                url: 'https://luminox.com/products/f-117-nighthawk-6421',
                collection: 'F',
                name: 'F-117 Nighthawk GMT Watch - 6421',
                reference: '117 Nighthawk GMT Watch',
                retail: null,
                thumbnail: 'https://cdn.shopify.com/s/files/1/2423/1151/products/6421-XA-S90-DNV-Day.png?v=1511288423'
            },
            {
                source: 'official',
                lang: 'en',
                brand: 'Bulova',
                brandID: 268,
                url: 'https://luminox.com/products/f-117-nighthawk-6422',
                collection: 'F',
                name: 'F-117 Nighthawk GMT Watch - 6422',
                reference: '117 Nighthawk GMT Watch',
                retail: null,
                thumbnail: 'https://cdn.shopify.com/s/files/1/2423/1151/products/6422-XA-S90-DNV-Day.png?v=1511288706'
            },
            {
                source: 'official',
                lang: 'en',
                brand: 'Bulova',
                brandID: 268,
                url: 'https://luminox.com/products/f-22-raptor-9241',
                collection: 'F',
                name: 'F-22 Raptor - 9241',
                reference: '22 Raptor',
                retail: null,
                thumbnail: 'https://cdn.shopify.com/s/files/1/2423/1151/products/9241-90.png?v=1511380913'
            },
            {
                source: 'official',
                lang: 'en',
                brand: 'Bulova',
                brandID: 268,
                url: 'https://luminox.com/products/f-117-nighthawk-6441',
                collection: 'F',
                name: 'F-117 Nighthawk GMT Watch - 6441',
                reference: '117 Nighthawk GMT Watch',
                retail: null,
                thumbnail: 'https://cdn.shopify.com/s/files/1/2423/1151/products/face_23dc8d16-21a3-49ab-a713-9372bc4c28fa.png?v=1573502524'
            },
            {
                source: 'official',
                lang: 'en',
                brand: 'Bulova',
                brandID: 268,
                url: 'https://luminox.com/products/sr-71-blackbird-9098',
                collection: 'SR',
                name: 'SR-71 Blackbird Automatic Chronograph - 9098',
                reference: '71 Blackbird Automatic Chronograph',
                retail: null,
                thumbnail: 'https://cdn.shopify.com/s/files/1/2423/1151/products/9098-XA-S90-DNV-Day_1.png?v=1565897252'
            },
            {
                source: 'official',
                lang: 'en',
                brand: 'Bulova',
                brandID: 268,
                url: 'https://luminox.com/products/field-automatic-day-date-1801',
                collection: 'Field Automatic Day Date',
                name: 'Field Automatic Day Date - 1801',
                reference: '1801',
                retail: null,
                thumbnail: 'https://cdn.shopify.com/s/files/1/2423/1151/products/1801-90.png?v=1511295320'
            },
            {
                source: 'official',
                lang: 'en',
                brand: 'Bulova',
                brandID: 268,
                url: 'https://luminox.com/products/leatherback-sea-turtle-0301',
                collection: 'Leatherback Sea Turtle',
                name: 'Leatherback Sea Turtle - 0301',
                reference: '0301',
                retail: null,
                thumbnail: 'https://cdn.shopify.com/s/files/1/2423/1151/products/0301-S90-_2016.png?v=1558420204'
            },
            {
                source: 'official',
                lang: 'en',
                brand: 'Bulova',
                brandID: 268,
                url: 'https://luminox.com/products/leatherback-sea-turtle-0301-bo',
                collection: 'Leatherback Sea Turtle',
                name: 'Leatherback Sea Turtle - 0301.BO.L',
                reference: '0301.BO.L',
                retail: null,
                thumbnail: 'https://cdn.shopify.com/s/files/1/2423/1151/products/0301.BO-S90-_2016.png?v=1536165758'
            },
            {
                source: 'official',
                lang: 'en',
                brand: 'Bulova',
                brandID: 268,
                url: 'https://luminox.com/products/leatherback-sea-turtle-0307-wo-1',
                collection: 'Leatherback Sea Turtle',
                name: 'Leatherback Sea Turtle - 0307.WO',
                reference: '0307.WO',
                retail: null,
                thumbnail: 'https://cdn.shopify.com/s/files/1/2423/1151/products/0307.WO-S90_1.png?v=1522350513'
            },
            {
                source: 'official',
                lang: 'en',
                brand: 'Bulova',
                brandID: 268,
                url: 'https://luminox.com/products/leatherback-sea-turtle-giant-0321-bo',
                collection: 'Leatherback Sea Turtle Giant',
                name: 'Leatherback Sea Turtle Giant - 0321.BO',
                reference: '0321.BO',
                retail: null,
                thumbnail: 'https://cdn.shopify.com/s/files/1/2423/1151/products/0321.BO-S90_1.png?v=1556204460'
            },
            {
                source: 'official',
                lang: 'en',
                brand: 'Bulova',
                brandID: 268,
                url: 'https://luminox.com/products/leatherback-sea-turtle-giant-0321',
                collection: 'Leatherback Sea Turtle Giant',
                name: 'Leatherback Sea Turtle Giant - 0321.L',
                reference: '0321.L',
                retail: null,
                thumbnail: 'https://cdn.shopify.com/s/files/1/2423/1151/products/0321-S90-_2016.png?v=1536166128'
            },
            {
                source: 'official',
                lang: 'en',
                brand: 'Bulova',
                brandID: 268,
                url: 'https://luminox.com/products/leatherback-sea-turtle-giant-0337',
                collection: 'Leatherback Sea Turtle Giant',
                name: 'Leatherback Sea Turtle Giant - 0337',
                reference: '0337',
                retail: null,
                thumbnail: 'https://cdn.shopify.com/s/files/1/2423/1151/products/0337-90.png?v=1525816420'
            },
            {
                source: 'official',
                lang: 'en',
                brand: 'Bulova',
                brandID: 268,
                url: 'https://luminox.com/products/navy-seal-chronograph-3580-series',
                collection: 'Navy SEAL Chronograph',
                name: 'Navy SEAL Chronograph - 3581',
                reference: '3581',
                retail: null,
                thumbnail: 'https://cdn.shopify.com/s/files/1/2423/1151/products/3581-90.png?v=1524173979'
            },
            {
                source: 'official',
                lang: 'en',
                brand: 'Bulova',
                brandID: 268,
                url: 'https://luminox.com/products/navy-seal-chronograph-3581-bo',
                collection: 'Navy SEAL Chronograph',
                name: 'Navy SEAL Chronograph - 3581.BO',
                reference: '3581.BO',
                retail: null,
                thumbnail: 'https://cdn.shopify.com/s/files/1/2423/1151/products/3581.BO.F-shot90.png?v=1524586647'
            },
            {
                source: 'official',
                lang: 'en',
                brand: 'Bulova',
                brandID: 268,
                url: 'https://luminox.com/products/navy-seal-chronograph-3583',
                collection: 'Navy SEAL Chronograph',
                name: 'Navy SEAL Chronograph - 3583',
                reference: '3583',
                retail: null,
                thumbnail: 'https://cdn.shopify.com/s/files/1/2423/1151/products/3583-90.png?v=1524588698'
            },
            {
                source: 'official',
                lang: 'en',
                brand: 'Bulova',
                brandID: 268,
                url: 'https://luminox.com/products/atacama-field-automatic-1902',
                collection: 'OTHERS',
                name: 'Atacama Field Automatic? 1902',
                reference: 'Atacama Field Automatic? 1902',
                retail: null,
                thumbnail: 'https://cdn.shopify.com/s/files/1/2423/1151/products/1902-90.png?v=1525876464'
            },
            {
                source: 'official',
                lang: 'en',
                brand: 'Bulova',
                brandID: 268,
                url: 'https://luminox.com/products/atacama-field-automatic-1907-nf',
                collection: 'OTHERS',
                name: 'Atacama Field Automatic? 1907.NF',
                reference: 'Atacama Field Automatic? 1907.NF',
                retail: null,
                thumbnail: 'https://cdn.shopify.com/s/files/1/2423/1151/products/1907.NF-90.png?v=1525877605'
            },
            {
                source: 'official',
                lang: 'en',
                brand: 'Bulova',
                brandID: 268,
                url: 'https://luminox.com/products/automatic-sport-timer-0921',
                collection: 'OTHERS',
                name: 'Automatic Sport Timer 0921',
                reference: 'Automatic Sport Timer 0921',
                retail: null,
                thumbnail: 'https://cdn.shopify.com/s/files/1/2423/1151/products/0921-fullsize.png?v=1601527020'
            },
            {
                source: 'official',
                lang: 'en',
                brand: 'Bulova',
                brandID: 268,
                url: 'https://luminox.com/products/automatic-sport-timer-0924',
                collection: 'OTHERS',
                name: 'Automatic Sport Timer 0924',
                reference: 'Automatic Sport Timer 0924',
                retail: null,
                thumbnail: 'https://cdn.shopify.com/s/files/1/2423/1151/products/0924-fullsize.png?v=1601525899'
            },
            {
                source: 'official',
                lang: 'en',
                brand: 'Bulova',
                brandID: 268,
                url: 'https://luminox.com/products/bear-grylls-survival-air-series-3761-gmt-watch',
                collection: 'OTHERS',
                name: 'Bear Grylls Survival AIR Series 3761 GMT Watch',
                reference: 'Bear Grylls Survival AIR Series 3761 GMT Watch',
                retail: null,
                thumbnail: 'https://cdn.shopify.com/s/files/1/2423/1151/products/BG-AIR-STRAP.png?v=1622659145'
            },
            {
                source: 'official',
                lang: 'en',
                brand: 'Bulova',
                brandID: 268,
                url: 'https://luminox.com/products/bear-grylls-survival-air-series-3762-gmt-watch',
                collection: 'OTHERS',
                name: 'Bear Grylls Survival AIR Series 3762 GMT Watch',
                reference: 'Bear Grylls Survival AIR Series 3762 GMT Watch',
                retail: null,
                thumbnail: 'https://cdn.shopify.com/s/files/1/2423/1151/products/BG-AIR-SILVER-FRONT.png?v=1622658994'
            },
            {
                source: 'official',
                lang: 'en',
                brand: 'Bulova',
                brandID: 268,
                url: 'https://luminox.com/products/revo-x-luminox-giftset-navy-seal-watch-sunglasses',
                collection: 'OTHERS',
                name: 'REVO x LUMINOX Set: Navy SEAL 3615 Watch + Sunglasses',
                reference: 'REVO x LUMINOX Set: Navy SEAL 3615 Watch + Sunglasses',
                retail: null,
                thumbnail: 'https://cdn.shopify.com/s/files/1/2423/1151/products/LUMINOXxREVOGiftsetNavySEALWatchplusSunglasses_5.png?v=1622658854'
            },
            {
                source: 'official',
                lang: 'en',
                brand: 'Bulova',
                brandID: 268,
                url: 'https://luminox.com/products/ice-sar-arctic-1001',
                collection: 'ICE',
                name: 'ICE-SAR ARCTIC - 1001',
                reference: 'SAR ARCTIC',
                retail: null,
                thumbnail: 'https://cdn.shopify.com/s/files/1/2423/1151/products/1001-90.png?v=1534351409'
            },
            {
                source: 'official',
                lang: 'en',
                brand: 'Bulova',
                brandID: 268,
                url: 'https://luminox.com/products/ice-sar-arctic-1002',
                collection: 'ICE',
                name: 'ICE-SAR ARCTIC - 1002',
                reference: 'SAR ARCTIC',
                retail: null,
                thumbnail: 'https://cdn.shopify.com/s/files/1/2423/1151/products/1002-90.png?v=1545148503'
            },
            {
                source: 'official',
                lang: 'en',
                brand: 'Bulova',
                brandID: 268,
                url: 'https://luminox.com/products/ice-sar-arctic-1003',
                collection: 'ICE',
                name: 'ICE-SAR ARCTIC - 1003',
                reference: 'SAR ARCTIC',
                retail: null,
                thumbnail: 'https://cdn.shopify.com/s/files/1/2423/1151/products/1003-XL-S90.png?v=1608167090'
            },
            {
                source: 'official',
                lang: 'en',
                brand: 'Bulova',
                brandID: 268,
                url: 'https://luminox.com/products/ice-sar-arctic-1007',
                collection: 'ICE',
                name: 'ICE-SAR ARCTIC - 1007',
                reference: 'SAR ARCTIC',
                retail: null,
                thumbnail: 'https://cdn.shopify.com/s/files/1/2423/1151/products/1007-90.png?v=1536259859'
            },
            {
                source: 'official',
                lang: 'en',
                brand: 'Bulova',
                brandID: 268,
                url: 'https://luminox.com/products/copy-of-ice-sar-arctic-1003',
                collection: 'ICE',
                name: 'ICE-SAR ARCTIC - 1003.ICE',
                reference: 'SAR ARCTIC',
                retail: null,
                thumbnail: 'https://cdn.shopify.com/s/files/1/2423/1151/products/LUM_ICE_FACE.png?v=1590523646'
            },
            {
                source: 'official',
                lang: 'en',
                brand: 'Bulova',
                brandID: 268,
                url: 'https://luminox.com/products/navy-seal-3601',
                collection: 'Navy SEAL Magnifying Glass',
                name: 'Navy SEAL Magnifying Glass - 3601',
                reference: '3601',
                retail: null,
                thumbnail: 'https://cdn.shopify.com/s/files/1/2423/1151/products/3601face.png?v=1567799040'
            },
            {
                source: 'official',
                lang: 'en',
                brand: 'Bulova',
                brandID: 268,
                url: 'https://luminox.com/products/navy-seal-3603',
                collection: 'Navy SEAL Magnifying Glass',
                name: 'Navy SEAL Magnifying Glass - 3603',
                reference: '3603',
                retail: null,
                thumbnail: 'https://cdn.shopify.com/s/files/1/2423/1151/products/3603face.png?v=1567799098'
            },
            {
                source: 'official',
                lang: 'en',
                brand: 'Bulova',
                brandID: 268,
                url: 'https://luminox.com/products/navy-seal-3617-set',
                collection: 'Navy SEAL Date Magnifier',
                name: 'Navy SEAL Date Magnifier - 3617.SET',
                reference: '3617.SET',
                retail: null,
                thumbnail: 'https://cdn.shopify.com/s/files/1/2423/1151/products/3617_box.png?v=1576609478'
            },
            {
                source: 'official',
                lang: 'en',
                brand: 'Bulova',
                brandID: 268,
                url: 'https://luminox.com/products/copy-of-commando-frogman-3301',
                collection: 'Commando Frogman',
                name: 'Commando Frogman - 3301',
                reference: '3301',
                retail: null,
                thumbnail: 'https://cdn.shopify.com/s/files/1/2423/1151/products/FACE_8a288fb6-8c4d-4b28-888b-b09e2a386a83.png?v=1573575148'
            },
            {
                source: 'official',
                lang: 'en',
                brand: 'Bulova',
                brandID: 268,
                url: 'https://luminox.com/products/bear-grylls-survival-master-series-3749',
                collection: 'Bear Grylls Survival Chronograph MASTER Series',
                name: 'Bear Grylls Survival Chronograph MASTER Series - 3749',
                reference: '3749',
                retail: null,
                thumbnail: 'https://cdn.shopify.com/s/files/1/2423/1151/products/3749_FACE.png?v=1590085540'
            },
            {
                source: 'official',
                lang: 'en',
                brand: 'Bulova',
                brandID: 268,
                url: 'https://luminox.com/products/bear-grylls-survival-master-series-3741',
                collection: 'Bear Grylls Survival Chronograph MASTER Series',
                name: 'Bear Grylls Survival Chronograph MASTER Series - 3741',
                reference: '3741',
                retail: null,
                thumbnail: 'https://cdn.shopify.com/s/files/1/2423/1151/products/3741_FACE.png?v=1590085307'
            },
            {
                source: 'official',
                lang: 'en',
                brand: 'Bulova',
                brandID: 268,
                url: 'https://luminox.com/products/bear-grylls-survival-chronograph-master-series-3745',
                collection: 'Bear Grylls Survival Chronograph MASTER Series',
                name: 'Bear Grylls Survival Chronograph MASTER Series - 3745',
                reference: '3745',
                retail: null,
                thumbnail: 'https://cdn.shopify.com/s/files/1/2423/1151/products/BEAR_GRYLLS_x_LUMINOX_Master_Series_Survival_Watch_Black_Yellow_Dial-removebg.png?v=1622658702'
            },
            {
                source: 'official',
                lang: 'en',
                brand: 'Bulova',
                brandID: 268,
                url: 'https://luminox.com/products/bear-grylls-survival-sea-series-3723',
                collection: 'Bear Grylls Survival SEA Series',
                name: 'Bear Grylls Survival SEA Series - 3723',
                reference: '3723',
                retail: null,
                thumbnail: 'https://cdn.shopify.com/s/files/1/2423/1151/products/3723.png?v=1590085825'
            },
            {
                source: 'official',
                lang: 'en',
                brand: 'Bulova',
                brandID: 268,
                url: 'https://luminox.com/products/bear-grylls-survival-sea-series-3729',
                collection: 'Bear Grylls Survival SEA Series',
                name: 'Bear Grylls Survival SEA Series - 3729',
                reference: '3729',
                retail: null,
                thumbnail: 'https://cdn.shopify.com/s/files/1/2423/1151/products/3729_FACE.png?v=1590085618'
            },
            {
                source: 'official',
                lang: 'en',
                brand: 'Bulova',
                brandID: 268,
                url: 'https://luminox.com/products/bear-grylls-survival-land-series-3782',
                collection: 'Bear Grylls Survival LAND Series',
                name: 'Bear Grylls Survival LAND Series - 3782',
                reference: '3782',
                retail: null,
                thumbnail: 'https://cdn.shopify.com/s/files/1/2423/1151/products/3782_FACE.png?v=1590085131'
            },
            {
                source: 'official',
                lang: 'en',
                brand: 'Bulova',
                brandID: 268,
                url: 'https://luminox.com/products/bear-grylls-survival-land-series-3798',
                collection: 'Bear Grylls Survival LAND Series',
                name: 'Bear Grylls Survival LAND Series - 3798',
                reference: '3798',
                retail: null,
                thumbnail: 'https://cdn.shopify.com/s/files/1/2423/1151/products/3798_FACE.png?v=1590085072'
            },
            {
                source: 'official',
                lang: 'en',
                brand: 'Bulova',
                brandID: 268,
                url: 'https://luminox.com/products/pacific-diver-3123',
                collection: 'Pacific Diver',
                name: 'Pacific Diver - 3123',
                reference: '3123',
                retail: null,
                thumbnail: 'https://cdn.shopify.com/s/files/1/2423/1151/products/3123_FRONT.png?v=1591388593'
            },
            {
                source: 'official',
                lang: 'en',
                brand: 'Bulova',
                brandID: 268,
                url: 'https://luminox.com/products/pacific-diver-3122',
                collection: 'Pacific Diver',
                name: 'Pacific Diver - 3122',
                reference: '3122',
                retail: null,
                thumbnail: 'https://cdn.shopify.com/s/files/1/2423/1151/products/3122_FACE.png?v=1591388551'
            },
            {
                source: 'official',
                lang: 'en',
                brand: 'Bulova',
                brandID: 268,
                url: 'https://luminox.com/products/pacific-diver-3121',
                collection: 'Pacific Diver',
                name: 'Pacific Diver - 3121',
                reference: '3121',
                retail: null,
                thumbnail: 'https://cdn.shopify.com/s/files/1/2423/1151/products/3121_FACE.png?v=1591388454'
            },
            {
                source: 'official',
                lang: 'en',
                brand: 'Bulova',
                brandID: 268,
                url: 'https://luminox.com/products/pacific-diver-3121-bo',
                collection: 'Pacific Diver',
                name: 'Pacific Diver - 3121.BO',
                reference: '3121.BO',
                retail: null,
                thumbnail: 'https://cdn.shopify.com/s/files/1/2423/1151/products/3121BO_FACE.png?v=1591388508'
            },
            {
                source: 'official',
                lang: 'en',
                brand: 'Bulova',
                brandID: 268,
                url: 'https://luminox.com/products/pacific-diver-3127',
                collection: 'Pacific Diver',
                name: 'Pacific Diver - 3137',
                reference: '3137',
                retail: null,
                thumbnail: 'https://cdn.shopify.com/s/files/1/2423/1151/products/PacificDiverLuminoxDiveWatchXS.3137EmeraldGreenDialSilverStainlessSteelCaseBraceletStrapWatch.png?v=1623121312'
            },
            {
                source: 'official',
                lang: 'en',
                brand: 'Bulova',
                brandID: 268,
                url: 'https://luminox.com/products/pacific-diver-3135',
                collection: 'Pacific Diver',
                name: 'Pacific Diver - 3135',
                reference: '3135',
                retail: null,
                thumbnail: 'https://cdn.shopify.com/s/files/1/2423/1151/products/PacificDiverLuminoxDiveWatchXS.3135CrimsonRedDialSilverStainlessSteelCasewithBlackRubberStrapWatch.png?v=1623121472'
            },
            {
                source: 'official',
                lang: 'en',
                brand: 'Bulova',
                brandID: 268,
                url: 'https://luminox.com/products/navy-seal-foundation-exclusive-3503-nsf',
                collection: 'Navy SEAL Foundation Exclusive',
                name: 'Navy SEAL Foundation Exclusive - 3503.NSF',
                reference: '3503.NSF',
                retail: null,
                thumbnail: 'https://cdn.shopify.com/s/files/1/2423/1151/products/3503.NSF_FRONT.png?v=1593611575'
            },
            {
                source: 'official',
                lang: 'en',
                brand: 'Bulova',
                brandID: 268,
                url: 'https://luminox.com/products/bear-grylls-survival-sea-series-never-give-up-model-3729-ngu',
                collection: 'Bear Grylls Survival SEA Series Never Give Up Model',
                name: 'Bear Grylls Survival SEA Series Never Give Up Model - 3729.NGU',
                reference: '3729.NGU',
                retail: null,
                thumbnail: 'https://cdn.shopify.com/s/files/1/2423/1151/products/BEARGRYLLSxLUMINOXNeverGiveUpWatch_2.png?v=1622658644'
            },
            {
                source: 'official',
                lang: 'en',
                brand: 'Bulova',
                brandID: 268,
                url: 'https://luminox.com/products/navy-seal-colormark-3051-go-nsf-navy-seal-foundation-exclusive-watch',
                collection: 'Navy SEAL Colormark 3051.GO.NSF',
                name: 'Navy SEAL Colormark 3051.GO.NSF - Navy SEAL Foundation Exclusive Watch',
                reference: 'Navy SEAL Foundation Exclusive Watch',
                retail: null,
                thumbnail: 'https://cdn.shopify.com/s/files/1/2423/1151/products/LuminoxNavySEALColormarkNavySEALFoundationDiveWatch3051grayout_1.png?v=1622659402'
            }
        ]
    
        for (let i = 0; i < r.length; i++) {
            const ex = await extraction({
                ...r[i],
                client: axios,
                entry: r[i].url,
                base: 'https://www.luminox.com',
            });
            console.log(ex.spec);
        }
    */
    for (let i = 0; i < r.collections.length; i++) {
        const c = r.collections[i];
        for (let j = 0; j < r.items[c].length; j++) {
            const ex = await extraction({
                client: axios,
                entry: r.items[c][j].url,
                base: "https://www.luminox.com.sg",
            });
            console.log(ex);
        }
    }
    console.log();
    console.log('done...');
    process.exit(0);
})();