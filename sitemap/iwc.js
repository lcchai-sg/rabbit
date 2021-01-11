const sitemapper = require('sitemapper');
const axios = require('axios');
const cheerio = require('cheerio');

const indexing = async (context) => {
  try {
    const { entry } = context;
    const brand = 'IWC';
    const brandID = 4;
    const source = 'official';
    const lang = 'en';
    const result = { source, lang, brand, brandID, collections: [], item: {} };
    const sitemap = new sitemapper({
      url: entry,
      timeout: 300000,
    });
    const data = await sitemap.fetch();
    for (let i = 0; i < data.sites.length; i++) {
      if (data.sites[i].match(/-collections\//i)) {
        const s = data.sites[i].split('/');
        if (s.length === 7) {
          const nref = s[6].replace('.html', '').split('-');
          const reference = nref[0].toUpperCase();
          const name = nref.slice(1, nref.length).join(' ').toUpperCase();
          const coll = s[5].replace(/-/g, ' ').toUpperCase();
          if (result.collections.indexOf(coll) < 0) {
            result.collections.push(coll);
            result.item[coll] = [];
          }
          result.item[coll].push({
            source, lang, brand, brandID,
            url: data.sites[i], collection: coll,
            name, reference, price: null,
          })
        }
      }
    }
    return result;
  } catch (error) {
    console.log(error);
  }
};

const extraction = async (context) => {
  try {
    const { entry, } = context;
    const lang = 'en';
    const brand = 'IWC';
    const brandID = 4;
    const result = {
      source: 'official',
      url: entry,
      brand,
      brandID,
      lang,
      thumbnail: null,
      retail: null,
      scripts: [],
      spec: [],
      related: []
    };
    const base = "https://www.iwc.com";
    const $ = cheerio.load((await axios.get(entry)).data);
    const reference = $('.iwc-buying-options-reference').text().trim();
    $("#iwc-features > div > div:nth-child(1) > ul li.iwc-product-detail-item").each((idx, elem) => {
      const caseDetail = $(elem).text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
      result.spec.push({ key: 'case', value: caseDetail });
    });
    $("#iwc-features > div > div:nth-child(2) > ul li.iwc-product-detail-item").each((idx, elem) => {
      const movement = $(elem).text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
      result.spec.push({ key: 'movement', value: movement });
    });
    $("#iwc-features > div > div:nth-child(3) > ul li.iwc-product-detail-item").each((idx, elem) => {
      const feature = $(elem).text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
      result.spec.push({ key: 'feature', value: feature });
    });
    $("#iwc-features > div > div:nth-child(4) > ul li.iwc-product-detail-item").each((idx, elem) => {
      const dial = $(elem).text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
      result.spec.push({ key: 'dial', value: dial });
    });
    $("#iwc-features > div > div:nth-child(5) > ul li.iwc-product-detail-item").each((idx, elem) => {
      const strap = $(elem).text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
      result.spec.push({ key: 'strap', value: strap });
    });
    result.name = $('.iwc-buying-options-title').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").replace('Add to my wishlist', '').trim();
    // result.retail = retail;
    result.reference = reference;
    result.gender = 'M';
    result.thumbnail = base + $(".iwc-watch-image-zoom").attr('src');
    const pInfo = entry.replace('.html', '.productinfo.US.json');
    const { data } = await axios.get(pInfo);
    const pd = JSON.parse(JSON.stringify(data));
    const key = 'IW' + reference;
    $(".iwc-product-link.rcms_productrelated").each((idx, el) => {
      result.related.push($(el).attr('data-tracking-related'));
    })
    result.retail = pd[key].formattedPrice;
    result.description = $('.iwc-description-text').text().trim();
    return result;
  } catch (error) {
    console.log('Failed extraction for IWC with error : ' + error);
    return {};
  }
};

(async () => {
  // let r = await indexing({
  //   entry: "https://www.iwc.com/en.sitemap.xml",
  // });
  // console.log(r)
  // console.log()
  // for (const c of r.collections) {
  //   r.item[c].forEach(v => console.log(v));
  // }

  const urls = [
    'https://www.iwc.com/en/watch-collections/pilot-watches/iw503601-big-pilots-watch-perpetual-calendar-spitfire.html',
    'https://www.iwc.com/en/watch-collections/portofino/iw516501-portofino-hand-wound-tourbillon-retrograde.html',
    'https://www.iwc.com/en/past-collections/portugieser/iw545407-portugieser-hand-wound.html',
    'https://www.iwc.com/en/watch-collections/portugieser/iw390303-portugieser-chronograph-classic.html',
    'https://www.iwc.com/en/past-collections/pilot-watches/iw387804-pilot_s-watch-spitfire-chronograph.html',
    'https://www.iwc.com/en/watch-collections/jubilee-collection/iw377725-pilot_s-watch-chronograph-edition-150-years.html',
  ];

  for (let i = 0; i < urls.length; i++) {
    const ex = await extraction({ entry: urls[i] });
    console.log(urls[i], ex)
  }

})();