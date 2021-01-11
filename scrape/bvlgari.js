const axios = require('axios');
const cheerio = require('cheerio');
const xml2js = require('xml2js');

const indexing = async (context) => {
  const { client, entry, base, } = context;
  const source = "official";
  const lang = "en";
  const brand = "Bvlgari";
  const brandID = 32;
  const result = { source, lang, brand, brandID, collections: [], items: {}, }
  const cats = [];
  const uniqURLS = [];
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
        if (uniqURLS.indexOf(url) < 0) uniqURLS.push(url);
      });
    }
    uniqURLS.forEach(url => console.log(url));
    console.log()
    console.log('URLS >>> ', uniqURLS.length)
    return result;
  } catch (error) {
    console.log('Failed indexing for Bvlgari with error ' + error);
    return {};
  }
}

const extraction = async (context) => {
  const { client, entry, ...rest } = context;
  const result = { ...rest, url: entry, spec: [], related: [], };
  console.log('entry >>> ', entry)
  const { data } = await client.get(entry);
  const $ = cheerio.load(data);
  result.description = $('.product-short-description.show-for-medium p').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
  const key = 'Spec';
  const value = $('.value.content.grid-container.text-center').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
  if (value) result.spec.push({ key, value });
  $('.spec-article ').each((idx, el) => {
    const key = $(el).find('h4').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    const value = $(el).find('p').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    if (key) result.spec.push({ key, value });
  });
  result.retail = $('.prices .shoppable-price ').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
  result.reference = $('.product-id').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
  result.collection = $('.product-name.show-for-medium').text().replace('Watch', '').trim();
  result.name = $('.product-name.show-for-medium').text().trim() + ' ' + result.reference;
  return result;
}

const distill = async (context) => {
  const { spec, description, ...rest } = context;
  const result = {
    ...rest, description, functions: [], features: [],
    case: {}, caliber: {}, bezel: {},
    dial: {}, band: {}, additional: [],
  };

  try {
    const desc = description.split(',');
    desc.forEach(value => {
      if (value.match(/winding/i)) {
        const r = Mappers.getCaliberType.map(value);
        if (r) {
          result.caliber.type = r;
          result.movementType = r;
        }
      }
      if (value.match(/case/i)) {
        const { bm, bms, bt, } = Mappers.getMaterial.map(value);
        if (!result.case.materials) result.case.materials = [];
        result.case.material = bm ? bm : value;
        result.case.materials = bm ? bms : [value];
        if (value.match(/and (bracelet|strap)/i)) {
          if (bt) result.band.type = bt;
          result.band.material = result.case.material;
          result.band.materials = result.case.materials;
          const c = Mappers.getColor.map(value);
          if (c) result.band.color = c;
        }
      }
      if (value.match(/bezel/i)) {
        const { bm, bms, } = Mappers.getMaterial.map(value);
        if (bm) {
          result.bezel.material = bm;
          result.bezel.materials = bms;
        }
        const b = Mappers.getBezel.map(value);
        if (b) result.bezel.type = b;
        const c = Mappers.getColor.map(value);
        if (c) result.bezel.color = c;
      }
      if (value.match(/dial/i)) {
        const c = Mappers.getColor.map(value);
        if (c) {
          result.dial.color = c;
          result.dialColor =
            result.dial.color.match(/mother of pearl/i) ? 'Mother of Pearl' :
              result.dial.color.match(/diamond/i) ? 'Diamond' : result.dial.color;
        }
      }
    })
    for (const s of spec) {
      let pp = false;
      const key = s.key.replace(":", "").toLowerCase();
      const value = s.value.trim();

      if (value !== '-') {
        if (key === 'diameter (mm)') {
          pp = true;
          result.case.diameter = value + ' (mm)';
        }
        if (key === 'case shape') {
          pp = true;
          const r = Mappers.getCaseShape.map(value);
          result.case.shape = r ? r : value;
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
          const c = Mappers.getColor.map(value);
          if (c) result.band.color = c;
        }
        if (key === 'power reserve') {
          pp = true;
          result.caliber.reserve = value;
        }
        if (key === 'frequency') {
          pp = true;
          result.caliber.frequency = value;
        }
        if (key === 'number jewels') {
          pp = true;
          result.caliber.jewels = value;
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
          result.caliber.brand = 'Bvlgari';
          result.caliber.label = value;
        }
        if (key === 'band color') {
          pp = true;
          const c = Mappers.getColor.map(value);
          result.band.color = c ? c : value;
        }
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
    entry: "https://www.bulgari.com/en-us/watches/",
    brandID: 32,
    brand: "Bvlgari",
    base: "https://www.bulgari.com",
  });
  // console.log(r);
  // r.collections && r.collections.forEach(c => {
  //   r.items[c].forEach(w => {
  //     console.log(w);
  //   })
  // })
  // r.items[r.collections[0]].forEach((w, i) => (i < 5) ? console.log(w) : null);

  // const rr = r ? r.items[r.collections[0]] : [];
  // const rr = [
  // {
  //   source: 'official',
  //   lang: 'en',
  //   brand: 'Bvlgari',
  //   brandID: 32,
  //   url: 'https://www.bulgari.com/en-int/103144.html',
  //   collection: 'Serpenti',
  //   name: 'Serpenti',
  //   reference: '103144',
  //   thumbnail: 'https://media2.bulgari.com/f_auto,q_auto,w_240,c_scale/production/dw483e12d6/images/images/484596.png',
  //   price: null,
  //   gender: 'F'
  // },
  // {
  //   source: 'official',
  //   lang: 'en',
  //   brand: 'Bvlgari',
  //   brandID: 32,
  //   url: 'https://www.bulgari.com/en-int/103148.html',
  //   collection: 'Serpenti',
  //   name: 'Serpenti',
  //   reference: '103148',
  //   thumbnail: 'https://media2.bulgari.com/f_auto,q_auto,w_240,c_scale/production/dw915b952f/images/images/493234.png',
  //   price: null,
  //   gender: 'F'
  // }
  // ];

  // for (let i = 0; i < (rr.length - 1 > 5 ? 5 : rr.length - 1); i++) {
  //   console.log(i)
  //   const ex = await extraction({
  //     entry: rr[i].url,
  //     client,
  //     brand: "Bvlgari",
  //     brandID: 32,
  //     base: "https://www.bulgari.com",
  //   })
  //   console.log(ex);
  // }
  let cnt = 0;
  for (let i = 0; i < r.collections.length; i++) {
    const c = r.collections[i];
    for (let j = 0; j < r.items[c].length; j++) {
      const w = r.items[c][j];
      cnt++;
      // const ex = await extraction({
      //   client, entry: w.url, ...w,
      // })
      // ex.spec.forEach(s => console.log(s.key + ' | ' + s.value))
      // console.log()
      // console.log(ex.description)
      // console.log()
      // console.log('--------------------------------------------------')
    }
  }
  console.log()
  console.log('cnt >', cnt)
  process.exit(0)
})();