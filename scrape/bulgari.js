const axios = require('axios');
const cheerio = require('cheerio');
const { Mappers } = require("./utils");

const indexing = async (context) => {
  const source = "official";
  const lang = "en";
  const brand = "Bvlgari";
  const brandID = 32;
  const { client, entry, base, } = context;
  const result = { source, lang, brand, brandID, collections: [], items: {} };
  const cats = [];
  try {
    const $ = cheerio.load((await client.get(entry)).data);
    let gender = "";
    $('.links-nav-box .nav-title .lvl-3-wrap a').each((idx, el) => {
      const name = $(el).text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
      const url = base + $(el).attr('href');
      if (url.match(/\/watches\/by-collection\//i)) {
        if (name === "Women's") {
          gender = "F";
        } else if (name === "Men's") {
          gender = "M";
        } else {
          cats.push({ name, url, gender });
          if (result.collections.indexOf(name) < 0) {
            result.collections.push(name);
            result.items[name] = [];
          }
        }
      }
    });
    console.log(cats)
    for (const cat of cats) {
      const $ = cheerio.load((await client.get(cat.url + '?sz=120')).data);
      $('.grid-row-item .cardContainer').each((idx, el) => {
        const url = base + $(el).find('.product-url ').attr('href');
        const thumbnail = $(el).find('.image-container .tile-image-container a picture source').attr('data-srcset');
        const reference = url.split('/').pop().replace('.html', '').trim();
        result.items[cat.name].push({
          source, lang, brand, brandID, url, collection: cat.name,
          name: cat.name, reference, thumbnail, price: null, gender: cat.gender,
        });
      });
    }
    return result;
  } catch (error) {
    console.error('Failed indexing for Bvlgari with error : ' + error);
    console.error('entry: ', entry);
    return {};
  }
};

const extraction = async (context) => {
  const { client, entry, ...rest } = context;
  const result = { ...rest, url: entry, spec: [], related: [], };
  try {
    const $ = cheerio.load((await client.get(entry)).data);
    result.description = $('.product-short-description.show-for-medium p').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    const key = 'Spec';
    const value = $('.value.content.grid-container.text-center').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    if (value) {
      result.spec.push({ key, value });
    }
    $('.spec-article ').each((idx, el) => {
      const key = $(el).find('h4').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
      const value = $(el).find('p').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
      if (key) {
        result.spec.push({ key, value });
      }
    });
    result.retail = $('.prices .shoppable-price ').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    result.reference = $('.product-id').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    result.collection = $('.product-name.show-for-medium').text().replace('Watch', '').trim();
    result.name = $('.product-name.show-for-medium').text().trim() + ' ' + result.reference;
    if (result.collection.toLowerCase().indexOf('serpenti' || 'lvcea' || 'divas dream' || 'high jewellery watches') > -1) {
      result.gender = 'F';
    }
    if (result.collection.toLowerCase().indexOf('octo' || 'gerald genta') > -1) {
      result.gender = 'M';
    }
    if (result.collection.toLowerCase().indexOf('bvlgari bvlgari' || 'grandes complications') > -1) {
      result.gender = 'X';
    }
  } catch (error) {
    console.error('Failed extraction for Bvlgari with error : ' + error);
    console.error('entry: ', entry);
    result.code = error.response.status;
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
    if (description.toLowerCase().indexOf('automatic' || 'self-winding' || 'self winding' || 'selfwinding') > -1) {
      result.caliber.type = 'Automatic';
    }
    if (description.toLowerCase().indexOf('manual' || 'manual winding' || 'hand winding') > -1) {
      result.caliber.type = 'Manual';
    }
    if (description.toLowerCase().indexOf('quartz') > -1) {
      result.caliber.type = 'Quartz';
    }
    if (description.match(/steel/i)) {
      result.case.material = 'stainless steel';
      result.case.materials.push('stainless steel');
    }
    if (description.match(/rose gold/i)) {
      result.case.material = 'rose gold';
      result.case.materials.push('rose gold');
    }
    if (description.match(/yellow gold/i)) {
      result.case.material = 'yellow gold';
      result.case.materials.push('yellow gold');
    }
    if (description.match(/white gold/i)) {
      result.case.material = 'white gold';
      result.case.materials.push('white gold');
    }
    if (description.match(/aluminium/i)) {
      result.case.material = 'aluminium';
      result.case.materials.push('aluminium');
    }
    if (description.match(/titanium/i)) {
      result.case.material = 'titanium';
      result.case.materials.push('titanium');
    }
    // band material
    if (description.match(/alligator/i)) {
      result.band.material = 'Alligator Leather';
      result.band.materials.push('Alligator Leather');
    }
    if (description.match(/aluminium/i)) {
      result.band.material = 'aluminium';
      result.band.materials.push('aluminium');
    }
    if (description.match(/titanium/i)) {
      result.band.material = 'titanium';
      result.band.materials.push('titanium');
    }
    if (description.match(/rubber/i)) {
      result.band.material = 'rubber';
      result.band.materials.push('rubber');
    }
    if (description.match(/leather/i)) {
      result.band.material = 'Leather';
      result.band.materials.push('Leather');
    }
    if (description.match(/calfskin/i)) {
      result.band.material = 'Calfskin';
      result.band.materials.push('Calfskin');
    }
    if (description.match(/strap/i)) {
      result.band.type = 'Strap';
    }
    if (description.match(/bracelet/i)) {
      result.band.type = 'Bracelet';
    }
    for (const s of spec) {
      let pp = false;
      const key = s.key.replace(":", "").toLowerCase();
      const value = s.value.trim();
      if (key === 'spec') {
        const words = value.split(',');
        for (const word of words) {
          if (word.match(/caliber/i)) {
            result.caliber.reference = word.trim();
          }
        }
      }
      if (value.match(/clasp/i)) {
        result.band.buckle = 'Folding clasp';
      }
      if (value.match(/fold/i)) {
        result.band.buckle = 'Fold';
      }
      if (value.match(/buckle/i)) {
        result.band.buckle = 'Buckle';
      }
      if (value.match(/deployant/i)) {
        result.band.buckle = 'Deployant';
      }
      if (value.match(/pin/i)) {
        result.band.buckle = 'Pin';
      }
      if (key === 'diameter (mm)') {
        pp = true;
        result.case.width = value + ' (mm)';
      }
      if (key === 'functions') {
        pp = true;
        if (result.features.indexOf(value) < 0)
          result.features.push(value);
      }
      if (key === 'movement typology') {
        pp = true;
        const r = Mappers.getCaliberType.map(value);
        result.caliber.type = r ? r : value;
        result.movementType = r ? r : value;
      }
      if (key === 'band material') {
        pp = true;
        const { bm, bms, bt, } = Mappers.getMaterial.map(value);
        if (bt) result.band.type = bt;
        result.band.material = bm ? bm : value;
        result.band.materials = bm ? bms : [value];
      }
      if (key === 'power reserve') {
        pp = true;
        result.caliber.reserve = value;
      }
      if (key === 'water resistance') {
        pp = true;
        result.case.waterResistance = value;
        result.waterResistance = Mappers.getWaterResistance.map(value);
      }
      if (key === 'buckle') {
        pp = true;
        const b = Mappers.getBuckle.map(value);
        result.band.buckle = b ? b : value;
      }
      if (key === 'material​') {
        pp = true;
        const { bm, bms, } = Mappers.getMaterial.map(value);
        result.case.material = bm ? bm : value;
        result.case.materials = bm ? bms : [value];
      }
      if (key === 'color​') {
        pp = true;
        const c = Mappers.getColor.map(value);
        result.dial.color = c ? c : value;
        result.dialColor =
          result.dial.color.match(/mother of pearl/i) ? 'Mother of Pearl' :
            result.dial.color.match(/diamond/i) ? 'Diamond' : result.dial.color;
      }
      if (key === 'made in') {
        pp = true;
        result.caliber.label = value;
      }
      if (!pp) result.additional.push({ [key]: value });
    }
    return result;
  } catch (error) {
    console.log('Failed distillation for Bvlgari with error : ' + error);
    return {};
  }
};

(async () => {
  const client = axios.create({
    headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/601.3.9 (KHTML, like Gecko) Version/9.0.2 Safari/601.3.9' }
  });

  const r = await indexing({
    client,
    entry: "https://www.bulgari.com/en-int/watches/",
    brandID: 32,
    brand: "Bvlgari",
    base: "https://www.bulgari.com",
  });
  console.log(r);
  r.collections && r.collections.forEach(c => {
    r.items[c].forEach(w => {
      console.log(w);
    })
  })
  // r.items[r.collections[0]].forEach((w, i) => (i < 5) ? console.log(w) : null);

  // for (let i = 0; i < r.length - 1; i++) {
  //   const ex = await extraction({
  //     entry: rr[i].url,
  //     client,
  //     brand: "Bvlgari",
  //     brandID: 32,
  //     base: "https://www.bulgari.com",
  //   })
  //   console.log(ex);
  // }
})();