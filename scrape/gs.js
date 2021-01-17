const cheerio = require('cheerio');
const axios = require('axios');

const baseImageUrl = "https://storage.grand-seiko.com/production-b/uploads";
const CATEGORY_MAP = {
  2248: "watch",
  2255: "Elegance Collection",
  2256: "Heritage Collection",
  2257: "Sport Collection",
  6108: "Masterpiece Collection",
};
const LOCALE_MAP = {
  'en': 14,
  // 'jp': 2
};

const indexing = async (context) => {
  const { client, entry, base, } = context;
  const baseURL = base ? base : "https://www.grand-seiko.com/us-en/collections/";
  const source = 'official';
  const lang = 'en';
  const brand = 'Grand Seiko';
  const brandID = 84;
  try {
    const indexing = {
      target: 'collection',
      payload: {
        source, lang, brand, brandID,
        collections: [
          "Elegance Collection",
          "Heritage Collection",
          "Sport Collection",
          "Masterpiece Collection",
        ], items: {
          "Elegance Collection": [],
          "Heritage Collection": [],
          "Sport Collection": [],
          "Masterpiece Collection": [],
        }
      }
    };
    const extract = {
      target: "scrape.data.raw",
      payload: []
    };
    let total = 0;
    let count;
    let page = 1;
    do {
      count = 0;
      const products = await client.get(
        entry, {
        params: {
          category_id: 2248,
          locale_id: LOCALE_MAP[lang],
          page: page++,
          paginate: true,
          sort: '-publish_date',
          unit: 18
        }
      }
      );

      console.log('products.data.results >>> ', products.data.results)

      products.data.results.map(product => {
        let catId = product.category_ids.filter(id => id !== 2248)[0];
        const idx = {
          source, lang, brand, brandID,
          reference: product.title,
          name: product.title,
          url: baseURL + product.slug,
          collection: CATEGORY_MAP[catId],
          thumbnail: baseImageUrl + product.thumbnail.url_key + "_jpg.jpg",
          retail: product.acf_values.product_price
        };
        const detail = {
          source, lang, brand, brandID,
          reference: product.title,
          rawData: product
        };
        console.log('catId : ', catId)
        console.log('CATEGORY_MAP[catId] : ', CATEGORY_MAP[catId])
        console.log('idx : ', idx)
        console.log('detail : ', detail)
        indexing.payload.items[CATEGORY_MAP[catId]].push(idx);
        extract.payload.push(detail);
        count++;
        total++;
      })
    } while (!(count < 18));
    return indexing.payload;
  } catch (error) {
    console.error('Failed indexing for Grand Seiko with error : ' + error)
    return {};
  }
};

const extraction = async (context) => {
  const { client, entry, ...rest } = context;
  const result = { ...rest, url: entry, spec: [], related: [] };
  try {
    const $ = cheerio.load((await client.get(entry)).data);
    result.name = $('.product-top-header h1').text().trim() + ' ' + $('.product-top-movement').text().trim();
    result.reference = $('h1.product-top-item').text().trim();
    const description = $('.product-outline.product-tab-content').text().trim();
    result.description = description.replace("FEATURES", "");
    result.collection = $('.product-top-movement').text().trim().replace("[", "").replace("]", "");
    result.thumbnail = $('.okra-carousel-slide-inner img').attr('src');
    if (description.toLocaleLowerCase().indexOf('woman') === 1) {
      result.gender = 'F'
    } else {
      result.gender = 'M';
    }
    $('.product-spec-inner tr').each((idx, el) => {
      const key = $(el).find('th').text().replace(":", "");
      const value = $(el).find('td ').text();
      result.spec.push({ key, value });
    });
    $('.posts-list-content.swiper-container ul li div a').each((idx, el) => {
      const ref = $(el).find('.posts-list-name').text();
      result.related.push(ref);
    });
  } catch (error) {
    console.error('Failed extraction for Grand Seiko with error : ' + error);
    console.error('entry : ', entry);
    if (error.response) result.code = error.response.status;
    else result.code = 'UNKNOWN ERROR';
  }
  return result;
};

const distill = async (context) => {
  try {
    const { payload } = context;
    const { spec, description, ...rest } = payload;
    const result = {
      ...rest, description, functions: [], features: [],
      case: {}, caliber: {}, bezel: {},
      dial: {}, band: {}, additional: [],
    };
    if (description.match(/polished/i)) {
      result.dial.finish = 'Polished';
    }
    if (description.match(/gloss/i)) {
      result.dial.finish = 'Gloss';
    }
    if (description.match(/brushed/i)) {
      result.dial.finish = 'Brushed';
    }
    if (description.match(/sunburst/i)) {
      result.dial.finish = 'Sunburst';
    }
    if (description.match(/luminescent/i)) {
      result.dial.finish = 'luminescent';
    }
    if (description.match(/coating/i)) {
      result.dial.finish = 'Coating';
    }

    for (const s of spec) {
      let pp = false;
      const key = s.key.toLowerCase();
      const value = s.value.trim();
      // case
      if (value.match(/oval/i)) {
        result.case.shape = 'Oval';
      } else {
        result.case.shape = 'Round';
      }
      if (key === 'case material ') {
        pp = true;
        const { bm, bms } = Mappers.getMaterial.map(value);
        result.case.material = bm ? bm : value;
        result.case.materials = bm ? bms : [value];
      }
      if (key === 'glass material ') {
        pp = true;
        let r = Mappers.getCrystal.map(value);
        result.case.crystal = r ? r : value;
        let cc = Mappers.getCrystalCoating.map(value);
        if (cc) result.case.crystalCoating = cc;
      }
      if (key === 'glass coating ') {
        pp = true;
        let r = Mappers.getCrystalCoating.map(value);
        result.case.crystalCoating = r ? r : value;
      }
      if (key === 'case size ') {
        pp = true;
        const words = value.split('×');
        for (const word of words) {
          if (word.match(/diameter/i)) {
            result.case.diameter = word.replace('Diameter', '').trim();
          }
          if (word.match(/thickness/i)) {
            result.case.thickness = word.replace('Thickness', '').trim();
          }
        }
      }
      // band
      if (key === 'band material ') {
        pp = true;
        let { bm, bms, bt } = Mappers.getMaterial.map(value);
        if (bt) result.band.type = bt;
        result.band.material = bm ? bm : value;
        result.band.materials = bm ? bms : [value];
      }
      // caliber
      if (key === 'caliber no. ') {
        pp = true;
        result.caliber.reference = value.replace('Instructions', '').trim();
        result.caliber.brand = 'Grand-Seiko';
        result.caliber.label = 'Japan';
      }
      if (key === 'other details / features ') {
        result.caliber.jewels = value.split('jewels')[0].slice(-3).trim() ? value.split('jewels')[0].slice(-3).trim() : '';
      }
      if (key === 'movement type ') {
        pp = true;
        let r = Mappers.getCaliberType.map(value);
        result.caliber.type = r ? r : value;
      }
      if (key === 'power reserve ') {
        pp = true;
        result.caliber.reserve = value.replace('Approx.', '').trim();
      }
      // water resistance
      if (key === 'water resistance ') {
        pp = true;
        result.case.waterResistance = value;
        result.waterResistance = Mappers.getWaterResistance.map(value);
      }
      if (key === 'clasp type ') {
        pp = true;
        let r = Mappers.getBuckle.map(value);
        result.band.buckle = r ? r : value;
      }
      if (key === 'other details / features ') {
        pp = true;
        const data = value.split('・');
        for (const eachData of data) {
          if (eachData.match(/dial/i)) {
            // dial color
            let r = Mappers.getColor.map(eachData);
            result.dial.color = r ? r : eachData;
            result.dialColor = Mappers.getDialColor.map(result.dial.color);
          }
          if (eachData.match(/case back/i)) {
            let r = Mappers.getCaseBack.map(eachData);
            result.case.back = r ? r : eachData;
          }
        }
      }
      if (key === 'accuracy ') {
        pp = true;
        const features = value.split('/') ? value.split('/') : '';
        result.features = features.map(x => x.trim());
      }
      if (!pp) result.additional.push({ [key]: value });
    }
    return result;
  } catch (error) {
    console.error('Failed distillation for Grand Seiko with error : ' + error)
    return {};
  }
};

(async () => {
  const context = {
    "base": "https://www.grand-seiko.com/us-en/collections/",
    "source": "official",
    "entry": "https://www.grand-seiko.com/__api/posts/list",
    "brand": "Grand Seiko",
    "brandID": 84,
    "lang": "en",
  };
  const r = await indexing({
    client: axios,
    ...context,
  });
  console.log(r);
})();