const axios = require('axios');
const cheerio = require('cheerio');
const { Mappers } = require("./utils");

const indexing = async (context) => {
  try {
    const source = "official";
    const lang = "en";
    const brand = "Nomos Glashuette";
    const brandID = 134;
    const { client, base, entry } = context;
    const result = { source, lang, brand, brandID, collections: [], items: {} };
    const $ = cheerio.load((await client.get(entry)).data);
    $('.product-group.product-group--store a').each((idx, el) => {
      const collection = $(el).attr('data-category');
      if (result.collections.indexOf(collection) < 0) {
        result.collections.push(collection);
        result.items[collection] = [];
      }
    });
    $('.product-group.product-group--store a').each((idx, el) => {
      const url = base + $(el).attr('href');
      const name = $(el).attr('title');
      const thumbnail = $(el).find('.media-box-wrapper img').attr('data-src');
      const retail = $(el).find('.price--default ').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
      const collection = $(el).attr('data-category');
      const reference = $(el).find('.teaser__ref').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();

      result.items[collection].push({
        source, lang, brand, brandID, url, collection,
        name, reference, thumbnail, retail,
      });
    });
    return result;
  } catch (error) {
    console.error('Failed indexing for Nomos Glashuette with error : ' + error);
    return {};
  }
};

const extraction = async (context) => {
  const { client, entry, base, ...rest } = context;
  const result = { ...rest, url: entry, spec: [], related: [], };
  try {
    const $ = cheerio.load((await client.get(entry)).data);
    result.name = $('.head-wrapper h1').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    result.retail = $('.product--price.price--default').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    result.reference = $('.product__main-ref').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    result.description = $('.product-description .text-container.text-big p').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    $('.specs-list dl').each((idx, el) => {
      const key = $(el).find('dt').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
      const value = $(el).find('dd').text().replace(/^\s+|\n|\s+$/gm, ' ').trim();
      result.spec.push({ key, value });
    });
  } catch (error) {
    console.error('Failed extraction for Nomos Glashuette with error : ' + error);
    console.error('entry : ', entry);
    result.code = error.response.status;
  }
  return result;
};

const distill = async (context) => {
  try {
    const { payload } = context;
    const { spec, ...rest } = payload;
    const result = {
      ...rest, functions: [], features: [],
      case: {}, caliber: {}, bezel: {},
      dial: {}, band: {}, additional: [],
    };

    for (const s of spec) {
      let pp = false;
      const key = s.key.replace(":", "").toLowerCase();
      const value = s.value.trim();

      if (key === 'ref.') {
        pp = true;
        result.reference = value;
      }
      if (key === 'case') {
        pp = true;
        const v = value.split("  ");
        v.forEach(val => {
          const vv = val.split(";");
          vv.forEach(val => {
            const v = val.split(",");
            v.forEach((value, i) => {
              if (i === 0) {
                const { bm, bms, } = Mappers.getMaterial.map(value);
                result.case.material = bm ? bm : value;
                result.case.materials = bm ? bms : [value];
              } else {
                if (value.match(/back/i)) {
                  const r = Mappers.getCaseBack.map(value);
                  if (r) result.case.back = r;
                }
                if (value.match(/crown/i)) {
                  const r = Mappers.getCaseCrown.map(value);
                  if (r) result.case.crown = r;
                }
              }
            })
          })
        })
      }
      if (key === 'glass') {
        pp = true;
        const c = Mappers.getCrystal.map(value);
        const cc = Mappers.getCrystalCoating.map(value);
        result.case.crystal = c ? c : value;
        if (cc) result.case.crystalCoating = cc;
      }
      if (key === 'winding') {
        pp = true;
        const r = Mappers.getCaliberType.map(value);
        result.caliber.type = r ? r : value;
        result.movementType = r ? r : value;
      }
      if (key === 'dimensions') {
        pp = true;
        const words = value.split(' ');
        for (const word of words) {
          if (word.match(/diameter/i)) {
            result.case.diameter = word.replace(/[^\d.-]/g, '').trim() + ' mm';
          }
          if (word.match(/height/i)) {
            result.case.thickness = word.replace(/[^\d.-]/g, '').trim() + ' mm';
          }
        }
      }
      if (key === 'water resistance') {
        pp = true;
        result.case.waterResistance = value;
        result.waterResistance = Mappers.getWaterResistance.map(value);
      }
      if (key === 'dial') {
        pp = true;
        const c = Mappers.getColor.map(value);
        result.dial.color = c ? c : value;
        result.dialColor =
          result.dial.color.match(/mother of pearl/i) ? 'Mother of Pearl' :
            result.dial.color.match(/diamond/i) ? 'Diamond' : result.dial.color;
        const f = Mappers.getDialFinish.map(value);
        if (f) result.dial.finish = f;
      }
      if (key === 'hands') {
        pp = true;
        const hs = Mappers.getHandStyle.map(value);
        result.dial.handStyle = hs ? hs : value;
      }
      if (key === 'strap') {
        pp = true;
        const c = Mappers.getColor.map(value);
        result.band.color = c ? c : value;
        const { bm, bms, bt, } = Mappers.getMaterial.map(value);
        if (bt) result.band.type = bt;
        result.band.material = bm ? bm : value;
        result.band.materials = bm ? bms : [value];
        const lw = value.match(/lug width \d{1,2}.?\d{0,2} ?mm/ig);
        const l = lw ? lw[0].replace("lug width ", "") : null;
        if (l) result.case.lugWidth = l;
      }
      if (key === 'caliber') {
        pp = true;
        result.caliber.reference = value;
        result.caliber.brand = 'Nomos Glashuette';
        result.caliber.label = 'German';
      }
      if (key === 'power reserve') {
        pp = true;
        result.caliber.reserve = value.replace("up to ", "");
      }
      if (key === 'jewels') {
        pp = true;
        result.caliber.jewels = value;
      }
      if (!pp) result.additional.push({ [key]: value });
    }
    return result;
  } catch (error) {
    console.log('Failed distillation for Nomos Glashuette with error : ' + error);
    return {};
  }
};

(async () => {
  const r = await indexing({
    client: axios,
    entry: "https://nomos-glashuette.com/en/watchfinder",
    brandID: 134,
    brand: "Nomos Glashütte",
    base: "https://nomos-glashuette.com",
  });
  // // console.log(r);
  // r.collections.forEach(c => {
  //   r.items[c].forEach(w => {
  //     console.log(w);
  //   })
  // })

  // const rr = [
  //   "https://nomos-glashuette.com/en/lambda/lambda-175-years-watchmaking-glashutte-960-s3",
  //   "https://nomos-glashuette.com/en/tangente/tangente-101",
  // ];

  // for (let i = 0; i < rr.length; i++) {
  //   const ex = await extraction({
  //     entry: rr[i],
  //     client: axios,
  //     brand: "Nomos Glashütte",
  //     brandID: 134,
  //   })
  //   console.log(ex);
  // }

  for (let i = 0; i < r.collections.length; i++) {
    const c = r.collections[i];
    for (let j = 0; j < r.items[c].length; j++) {
      const w = r.items[c][j];
      const ex = await extraction({
        ...w, client: axios, entry: w.url,
      })
      ex.spec.forEach(s => console.log(s.key + " | " + s.value));
    }
  }
})();