//https://www.midowatches.com/media/sitemap/sitemap_us.xml
const axios = require('axios');
const xml2js = require('xml2js');
const cheerio = require('cheerio');
const xml = "https://www.midowatches.com/media/sitemap/sitemap_us.xml";

(async () => {
    const { data } = await axios.get(xml);
    const $ = cheerio.load(data);
    $('url').each((idx, el) => {
        const url = $(el).find('loc').text();
        const u = url.split('/');
        if (u.length === 5 && url.match(/html/i) && !url.match(/news-|privacy|customer-service|terms-of-use|watches.html|homepage|collection/i)) {
            // console.log($(el).contents().toString());
            // console.log();
            // console.log();
            // $(el).find("'image:loc'").each((idx, el) => {
            //     const img = $(el).text();
            //     if (img.match(/front/i)) thumbnail = img;
            // })
            // const name = $(el).find("['image:title']").first().text();
            const name = $(el).find("DataObject").find("Attribute").first().attr("value");
            const thumbnail = $(el).find("DataObject").find("Attribute").last().attr("value");
            // console.log({ url, name, thumbnail, name1, thumbnail1 });
            console.log({ url, name, thumbnail });
            console.log();
        }
    })
    // const parser = new xml2js.Parser();
    // parser.parseString(data, (err, res) => {
    //     for (let i = 1; i < res.urlset.url.length; i++) {
    //         const d = res.urlset.url[i];
    //         const url = d['loc'][0];
    //         const u = url.split('/');
    //         if (u.length === 5) {
    //             const name = d['image:image'][0]['image:title'][0];
    //             const thumbnail = d['image:image'][0]['image:loc'][0];
    //             const ref = thumbnail.split('/');
    //             const refr = ref[ref.length - 1].split('?')[0];
    //             const reference = (refr.match(/al-\d{3}[A-z]/i)) ? refr.substr(0, 12) : null;
    //             const collection = name.match(/comtesse/i) ? 'COMTESSE' : name.split(' ')[0].toUpperCase();
    //             if (result.collections.indexOf(collection) < 0) {
    //                 result.collections.push(collection);
    //                 result.items[collection] = [];
    //             }
    //             result.items[collection].push({
    //                 source, lang, brand, brandID, collection, url, name,
    //                 reference, thumbnail, retail: null,
    //             })
    //         }
    //     }
    // });

})();