const client = require('axios');
const cheerio = require('cheerio');
const xml2js = require('xml2js');

const getCollection = (name, url) => {
  if (name.match(/(FORMULA)[\s-_]?1/i) || url.match(/(FORMULA)[\s-_]?1/i)) {
    return 'FORMULA 1';
  }
  if (name.match(/MONACO/i) || url.match(/MONACO/i)) {
    return 'MONACO';
  }
  if (name.match(/CARRERA/i) || url.match(/CARRERA/i)) {
    return 'CARRERA';
  }
  if (name.match(/AQUARACER/i) || url.match(/AQUARACER/i)) {
    return 'AQUARACER';
  }
  if (name.match(/LINK/i) || url.match(/LINK/i)) {
    return 'LINK';
  }
  if (name.match(/CONNECTED/i) || url.match(/CONNECTED/i)) {
    return 'CONNECTED';
  }
  if (name.match(/AUTAVIA/i) || url.match(/AUTAVIA/i)) {
    return 'AUTAVIA';
  }
}

const indexing = async (context) => {
  try {
    const { entry, base, } = context;
    const source = 'official';
    const brand = 'Tag Heuer';
    const brandID = 54;
    const lang = 'en';
    const result = { source, lang, brand, brandID, collections: [], items: {} };
    const { data } = await client.get(entry);
    const parser = new xml2js.Parser();
    parser.parseString(data, (err, res) => {
      for (let i = 1; i < res.urlset.url.length; i++) {
        const url = res.urlset.url[i]['loc'][0];
        if (!(url.match(/accessories/i))) {
          const name = res.urlset.url[i]['image:image'][0]['image:title'][0];
          const collection = getCollection(name, url);

          const thumbnail = res.urlset.url[i]['image:image'][0]['image:loc'][0];
          const r = url.split('/');
          const reference = r[r.length - 1].replace('.html', '');
          // const collection = name.replace('TAG HEUER ', '');
          if (result.collections.indexOf(collection) < 0) {
            result.collections.push(collection);
            result.items[collection] = [];
          }
          result.items[collection].push({
            source, lang, brand, brandID, url, collection,
            name, thumbnail, reference, price: null,
          })
        }
      }
    });
    return result;
  } catch (error) {
    console.log('Failed indexing for Tag Heuer with error : ' + error);
    return {};
  }
};

const extraction = async (context) => {
  try {
    const { entry } = context;
    const result = {
      source: 'official',
      url: entry,
      brand: "Tag Heuer",
      brandID: 54,
      lang: "en",
      scripts: [],
      spec: [],
      related: [],
      thumbnail: null,
      price: null,
      retail: null,
    };
    const $ = cheerio.load((await client.get(entry)).data);
    const retail = $('.sales').first().text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    result.retail = retail;
    result.name = $('.product-name').text().trim();
    result.description = $('#collapseDescription').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim().replace("...", "");
    const collection = $('.product-name').text().trim();
    let reference = '';
    $('#tech-accordion .card').each((idx, tab) => {
      let key = '';
      let value = '';
      const keys = [];
      const values = [];
      const cat = $(tab).find('.card-header h3').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
      $(tab).find('.col-12.col-lg-6 .spec-title').each((idx, el) => {
        key = $(el).text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
        keys.push(key);
      });
      $(tab).find('.spec-value').each((idx, el) => {
        value = $(el).text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
        values.push(value);
      });
      keys.map((key, i) => {
        if (cat === 'Reference number' || cat === 'Referenznummer') {
          result.reference = value;
        } else {
          const value = values[i];
          result.spec.push({ cat, key, value });
        }
      });
    });
    result.name = collection + " " + reference;
    result.collection = collection;
    result.gender = 'M';
    return result;
  } catch (error) {
    console.log('Failed extraction for Tag Heuer with error : ' + error);
    return {};
  }
};

(async () => {
  const r = await indexing({
    entry: "https://www.tagheuer.com/us/en/sitemap_1-image.xml",
    brand: "Tag Heuer",
    brandID: 54,
    lang: "en",
    base: "https://www.tagheuer.com/",
  });
  for (const c of r.collections) {
    console.log('>>>>> collection:', c)
    for (const u of r.items[c]) {
      console.log('               ', u.url);
      console.log('               ', u.thumbnail);
    }
  }

  // const u = [
  //   "https://www.tagheuer.com/us/en/timepieces/collections/tag-heuer-formula-1/no-size-quartz/CAZ1014.FT8028.html",
  //   "https://www.tagheuer.com/us/en/timepieces/collections/tag-heuer-formula-1/43-mm-quartz/CAZ101E.BA0842.html",
  //   "https://www.tagheuer.com/us/en/timepieces/collections/tag-heuer-formula-1/44-mm-calibre-16-automatic/CAZ2017.BA0647.html",
  //   "https://www.tagheuer.com/us/en/timepieces/collections/tag-heuer-formula-1/44-mm-calibre-heuer02-automatic/CAZ201A.BA0641.html",
  //   "https://www.tagheuer.com/us/en/timepieces/collections/tag-heuer-link/41-mm-calibre-17-automatic/CBC2112.BA0603.html",
  //   "https://www.tagheuer.com/us/en/timepieces/collections/tag-heuer-link/32-mm-quartz/WBC1310.BA0600.html",
  //   "https://www.tagheuer.com/us/en/timepieces/collections/tag-heuer-link/41-mm-calibre-5-automatic/WBC2110.BA0603.html",
  //   "https://www.tagheuer.com/us/en/smartwatches/collections/tag-heuer-connected/45-mm/SBG8A10.BA0646.html",
  //   "https://www.tagheuer.com/us/en/smartwatches/collections/tag-heuer-connected/45-mm/SBG8A10.BT6219.html",
  //   "https://www.tagheuer.com/us/en/43-mm-calibre-heuer01-automatic/CAR201M.FT6156.html",
  //   "https://www.tagheuer.com/us/en/45-mm-calibre-heuer01-automatic/CAR2A1J.FC6416.html",
  //   "https://www.tagheuer.com/us/en/timepieces/collections/tag-heuer-carrera/45-mm-calibre-heuer02t-cosc/CAR5A5U.FC6377.html",
  //   "https://www.tagheuer.com/us/en/timepieces/collections/tag-heuer-carrera/45-mm-cal-heuer02t-cosc-nanograph/CAR5A8K.FT6172.html",
  //   "https://www.tagheuer.com/us/en/timepieces/collections/tag-heuer-monaco/39-mm-calibre-12-automatic/CAW2111.FC6255.html",
  //   "https://www.tagheuer.com/us/en/39-mm-calibre-12-automatic/CAW2111.FC6356.html",
  //   "https://www.tagheuer.com/us/en/timepieces/collections/tag-heuer-monaco/39-mm-calibre-12-automatic/CAW211J.FC6476.html",
  //   "https://www.tagheuer.com/us/en/timepieces/collections/tag-heuer-aquaracer/43-mm-calibre-16-automatic/CAY2110.BA0927.html",
  //   "https://www.tagheuer.com/us/en/timepieces/collections/tag-heuer-aquaracer/43-mm-calibre-16-automatic/CAY2112.BA0927.html",
  //   "https://www.tagheuer.com/us/en/timepieces/collections/tag-heuer-aquaracer/43-mm-quartz/WAY101A.BA0746.html",
  // ];

  // for (let i = 0; i < u.length; i++) {
  //   let ex = await extraction({
  //     entry: u[i],
  //   });
  //   console.log(ex);
  // }
})();