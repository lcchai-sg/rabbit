const sitemapper = require('sitemapper');
const axios = require('axios');
const cheerio = require('cheerio');
const { MongoClient } = require('mongodb');
const { Mappers } = require('./utils');

const extraction = async (context) => {
  try {
    const { client, entry, } = context;
    const result = {
      url: entry,
      spec: [],
      related: []
    };
    const $ = cheerio.load((await client.get(entry)).data);
    result.name = $('.page-title-wrapper.product h1').text().trim();
    result.reference = $('.product.attribute.sku .value').text().trim();
    result.description = $('.description p').text().trim();

    $('.price-box.price-final_price .price-container .price').each((idx, el) => {
      if (idx === 0) {
        result.retail = $(el).text().trim();
      }
    });
    $('.block-warranty').find('.product.attribute ').each((idx, el) => {
      const cat = 'warranty';
      const key = $(el).find('.type').text().trim();
      const value = $(el).find('.value').text().trim();
      result.spec.push({ cat, key, value });
    })
    $('.block-other-attributes').find('.product.attribute ').each((idx, el) => {
      const cat = 'attributes';
      const key = $(el).find('.type').text().trim();
      const value = $(el).find('.value').text().trim();
      result.spec.push({ cat, key, value });
    })
    $('.block-features').each((idx, el) => {
      const cat = $(el).find(".title").text().trim();
      $(el).find('.product.attribute ').each((idx, el) => {
        const key = $(el).find('.type').text().trim();
        const value = $(el).find('.value').text().trim();
        result.spec.push({ cat, key, value });
      });
    })
    return result;
  } catch (error) {
    console.error('Failed extraction for Maurice Lacroix with error : ' + error);
    console.error(entry);
  }
};

const distill = async (context) => {
  try {
    const { brand, brandID, reference, lang, source, collection, gender, related, url, spec, description, name, ...other } = context;
    const result = {
      brand, name, brandID, reference, lang, source, collection,
      bundled: false, limited: false, functions: [],
      features: [], gender, description,
      related, url, case: {}, caliber: {}, bezel: {}, dial: {},
      band: {}, additional: [], ...other
    };
    result.caliber.brand = 'Maurice Lecroix';
    result.caliber.label = 'Swiss';
    let restKey = [];
    for (const s of spec) {
      let pp = false;
      const cat = s.cat.toLowerCase();
      const key = s.key.toLowerCase();
      const value = s.value.trim();

      if (key === 'case diameter') {
        pp = true;
        result.case.diameter = value;
      }
      if (key === 'case material') {
        pp = true;
        const { bm, bms, } = Mappers.getMaterial.map(value);
        result.case.material = bm ? bm : value;
        result.case.materials = bm ? bms : [value];
      }
      if (key === 'water resistance') {
        pp = true;
        result.case.waterResistance = value;
        result.waterResistance = Mappers.getWaterResistance.map(value);
      }
      if (key === 'strap material') {
        pp = true;
        const { bt, bm, bms, } = Mappers.getMaterial.map(value);
        if (bt) result.band.type = bt;
        result.band.material = bm ? bm : value;
        result.band.materials = bm ? bms : [value];
      }
      if (key === 'buckle') {
        pp = true;
        const r = Mappers.getBuckle.map(value);
        result.band.buckle = r ? r : value;
      }
      if (key === 'movement') {
        if (value.match(/ML ?\d\d\d/i)) {
          pp = true;
          result.caliber.reference = value.match(/ML ?\d\d\d/gi)[0];
        }
        const r = Mappers.getCaliberType.map(value);
        if (r) {
          pp = true;
          result.caliber.type = r;
          result.movementType = r;
        }
      }
      if (key === 'case settings') {
        if (value.match(/crystal/i)) {
          pp = true;
          const r = Mappers.getCrystal.map(value);
          const cc = Mappers.getCrystalCoating.map(value);
          result.case.crystal = r ? r : value;
          if (cc) result.case.crystalCoating = cc;
        }
      }
      if (key === 'functions') {
        pp = true;
        const words = value.split(/\n/);
        for (const word of words) {
          let assigned = false;
          if (word.match(/vph/i)) {
            assigned = true;
            const fr = word.match(/\d{1,3}'\d{1,3} ?vph/gi);
            if (fr && fr.length > 0) result.caliber.frequency = fr[0];
          }
          if (word.match(/power reserve/i)) {
            assigned = true;
            const w = word.toLowerCase();
            const pr = w.match(/power reserve: \d\d ?hours/gi);
            if (pr && pr.length > 0) result.caliber.reserve = pr[0].replace('power reserve: ', '');
          }
          if (word.match(/jewels/i)) {
            assigned = true;
            const w = word.toLowerCase()
            const nj = word.match(/number of jewels: \d{1,3}/gi);
            if (nj && nj.length > 0) result.caliber.jewels = w.replace('number of jewels:', '').trim();
          }
          if (word.match(/blued|rhodium/i)) {
            assigned = true;
            const r = Mappers.getHandStyle.map(word);
            if (r) result.dial.handStyle = r;
          }
          if (word.match(/guilloche|satin|brushed|Superluminova|gloss|matte|sunburst|luminescent|luminous/i)) {
            assigned = true;
            const r = Mappers.getDialFinish.map(word);
            if (r) result.dial.finish = r;
          }
          if (word.match(/date|calendar/i)) {
            assigned = true;
            const r = Mappers.getCalendar.map(word);
            result.caliber.calendar = r ? r : word;
          }
          if (!assigned) {
            if (word && word !== 'Functions:')
              result.functions.push(word);
          }
        }
      }
      if (cat === 'dial') {
        pp = true;
        const words = value.split(/\n/);
        let first = true;
        for (const word of words) {
          let assigned = false;
          if (first) {
            const dc = Mappers.getColor.map(word);
            if (dc) {
              result.dial.color = dc;
              result.dialColor = dc.match(/mother of pearl/i) ? 'Mother Of Pearl' : dc;
            } else {
              result.dial.color = word;
              result.dialColor = word.match(/mother of pearl/i) ? 'Mother Of Pearl' : word;
            }
            const dt = Mappers.getDialType.map(word);
            if (dt) {
              result.dial.type = dt;
            }
            first = false;
          }
          if (word.match(/index/i)) {
            assigned = true;
            const r = Mappers.getIndexType.map(word);
            result.dial.indexType = r ? r : word;
          }
          if (word.match(/hand/i)) {
            assigned = true;
            const r = Mappers.getHandStyle.map(word);
            result.dial.handStyle = r ? r : word;
          }
          if (!assigned)
            result.additional.push({ 'dial': word })
        }
      }
      if (cat === 'warranty') {
        if (value.match(/warranty/i)) {
          result.warranty = value.replace('warranty :', '').trim();
          pp = true;
        }
      }
      if (cat === 'attributes') {
        if (value.match(/Case :|Water resistance|\d\d ?mm/i)) pp = true;
      }
      if (!pp) {
        result.additional.push({ [key]: value });
      }
    }
    return result;
  } catch (error) {
    console.log('Failed distillation for Maurice Lacroix with error : ' + error);
    return {};
  }
};

(async () => {
  // const sitemap = new sitemapper({
  //   url: "https://www.mauricelacroix.com/media/sitemap_us_en.xml",
  //   timeout: 300000,
  // });
  // const sm = await sitemap.fetch();
  // const result = [];
  // sm.sites.forEach(v => {
  //   if (v.match(/watches/i)) {
  //     const vv = v.split('/');
  //     if (vv.length === 7) {
  //       const collection = vv[vv.length - 2].replace('watches-', '').toUpperCase();
  //       if (!(v.match(/mm-/i))) {
  //         const name = vv[vv.length - 1].toUpperCase();
  //         const reference = name;
  //         result.push({ url: v, collection, name, reference, })
  //       } else {
  //         const nr = vv[vv.length - 1].toUpperCase().split('MM-');
  //         const name = nr[0].split('-').join(' ') + 'MM';
  //         const reference = nr[1];
  //         result.push({ url: v, collection, name, reference, })
  //       }
  //     }
  //   }
  // });
  // console.log(result)
  // process.exit(0)
  // const u = [
  //   'https://www.mauricelacroix.com/us_en/watches/watches-pontos/pontos-chronograph-monopusher-41mm-pt6428-ss001',
  //   'https://www.mauricelacroix.com/us_en/watches/watches-aikon/aikon-automatic-42mm-ai6008-ss002-130-2',
  //   'https://www.mauricelacroix.com/us_en/watches/watches-masterpiece/masterpiece-moon-retrograde-43mm',
  //   'https://www.mauricelacroix.com/us_en/watches/watches-fiaba/fiaba-date-fa1003-sd502-170-1',
  //   'https://www.mauricelacroix.com/us_en/watches/watches-aikon/aikon-automatic-35-mm-ai6006-ss002-170-1',
  // ];

  // for (let i = 0; i < 1; i++) {
  //   const ex = await extraction({
  //     client: axios,
  //     entry: u[i],
  //   });
  //   console.log('result >>>', ex);
  // }

  const mdb = {
    host: "127.0.0.1",
    port: 27017,
    user: 'synopsis',
    pass: 'synopsis',
    name: 'synopsis',
    coll: 'reference_raw',
  }
  const db_url = `mongodb://${mdb.user}:${mdb.pass}@${mdb.host}:${mdb.port}/${mdb.name}`;
  const conn = await MongoClient.connect(db_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = conn.db(mdb.name);

  const u = [
    "https://www.mauricelacroix.com/us_en/watches/watches-pontos/pontos-day-date-41mm-pt6358-ss001-331-1",
    "https://www.mauricelacroix.com/us_en/watches/watches-pontos/pontos-chronograph-43mm-pt6388-ss001-331-1",
    "https://www.mauricelacroix.com/us_en/watches/watches-pontos/pontos-chronograph-43mm-pt6388-ss001-430-1",
  ];

  for (let i = 0; i < u.length; i++) {
    const r = await db.collection(mdb.coll).findOne({ url: u[i] });
    const d = await distill(r);
    console.log(d);
  }

  console.log('*** complete ***')
  process.exit(0)
})();