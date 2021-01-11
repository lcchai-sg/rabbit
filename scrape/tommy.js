const { fetchUrl } = require('fetch');
const cheerio = require('cheerio');
const axios = require('axios');
// const { Mappers } = require("./utils");
// const r = require('./tommy_urls');
// const r = require('./tommy_raw');

const indexing = async (context) => {
  try {
    const source = "official";
    const lang = "en";
    const brand = "Tommy Hilfiger";
    const brandID = 252;
    const { client, entry, base, } = context;
    // const entry = "https://usa.tommy.com/static/sitemap.xml";
    const result = { source, lang, brand, brandID, collections: ['all'], items: { 'all': [] } };
    // const data = await new Promise((resolve, reject) => {
    //   fetchUrl(entry, { headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/601.3.9 (KHTML, like Gecko) Version/9.0.2 Safari/601.3.9' } },
    //     (err, res, body) => {
    //       if (err) reject(err);
    //       resolve(body.toString());
    //     }
    //   )
    // });
    // console.log(data)
    {
      const client = axios.create({
        // headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_0_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.66 Safari/537.36' }
        headers: { 'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.66 Safari/537.36" }
      });
      const { data } = await client.get(entry);
      console.log('axios >>>>>', data)
    }
    const $ = cheerio.load(data);
    $('loc').each((idx, el) => {
      const url = $(el).text();
      if (url.match(/watch/i) && !(url.match(/watches/i))) {
        const splitUrl = url.split('/');
        const nameRef = splitUrl[splitUrl.length - 1].split('-');
        const reference = nameRef[nameRef.length - 1];
        const name = nameRef.slice(0, nameRef.length - 1).join(' ');
        result.items['all'].push({
          source, lang, brand, brandID, url, name, reference, price: null,
        });
      }
    });
    return result;
  } catch (error) {
    console.error('Failed indexing for Tommy Hilfiger with error : ' + error)
    return {};
  }
};

const extraction = async (context) => {
  const { client, entry, ...rest } = context;
  const result = { ...rest, url: entry, spec: [], related: [], }
  try {
    const data = await new Promise((resolve, reject) => {
      fetchUrl(entry, { headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/601.3.9 (KHTML, like Gecko) Version/9.0.2 Safari/601.3.9' } },
        (err, res, body) => {
          if (err) reject(err);
          resolve(body.toString());
        }
      )
    });
    console.log(data); process.exit(0);

    const $ = cheerio.load(data);
    result.reference = $('meta[property="og:product_id"]').attr('content');
    result.name = $('.productNameInner').text().trim();
    result.thumbnail = $('.product_main_image').find('img').attr('data-src');
    result.price = $('#price_display').text().trim();
    result.description = $('.itemDescription>p').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    result.gender = result.description.match(/women/i) ? 'F' : 'M';
    result.spec = [];
    const spec = $('.productBullets').first().text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim().replace('Description  ', '').replace('  Fabric & Care  ', '');
    if (spec) {
      let sp = [];
      if (spec.match(/\d+\.\d+/)) sp = [spec];
      else sp = spec.split('.');
      sp.forEach(v => {
        const s = v.split(',');
        s.forEach(v => {
          if (v.indexOf('.') > 0 && !(v.match(/\d+\.\d+/))) { // split others with '.'
            const ss = v.split('.');
            ss.forEach(v => v && result.spec.push(v.trim()))
          } else {
            v && result.spec.push(v.trim())
          }
        })
      })
    } else {
      const spec = result.description.split('•');
      for (let k = 1; k < spec.length; k++) {
        const sp = spec[k].split(',');
        sp.forEach(s => {
          if (s) result.spec.push(s.trim())
        })
      }
    }
  } catch (error) {
    console.error('Failed extraction for Tommy Hilfiger with error : ' + error);
    console.error('url:', entry);
    result.code = error.response.status;
  }
  return result;
};

// const distill = async (context) => {
//   const { spec, ...rest } = context;
//   const result = {
//     ...rest, functions: [], features: [],
//     case: {}, caliber: {}, bezel: {},
//     dial: {}, band: {}, additional: [],
//   };
//   try {
//     for (const s of spec) {
//       let assigned = false;

//       // handle case
//       // measurement
//       if (s.match(/mm/i) && s.match(/case|watch/i)) {
//         if (s.match(/mm case/i)) assigned = true;    // only measurement of case
//         if (s.match(/case thickness/i)) {
//           assigned = true;
//           const t = s.match(/\d{1,2}.?\d{0,2} ?mm/ig);
//           if (t) result.case.thickness = t[0];
//         } else {
//           const m = s.match(/(\d{2}.?\d{0,2})? ?(mm)? ?x? ?\d{2}.?\d{0,2} ?mm/ig);
//           if (m) {
//             if (m[0].match(/x/)) result.case.size = m[0];
//             else result.case.diameter = m[0];
//           }
//         }
//       }
//       // case material
//       if (s.match(/case|watch/i)) {
//         let c = [];
//         if (!result.case.materials) result.case.materials = [];
//         if (s.match(/case/i)) c = s.split('case')[0].split('mm');
//         else c = s.split('watch')[0].split('mm');
//         if (c.length === 1) assigned = true;
//         const cm = c.length === 1 ? c[0].trim() : c[1].trim();
//         if (cm) {
//           let { bm, bms, } = Mappers.getMaterial.map(cm);
//           result.case.material = bm ? bm : cm;
//           result.case.materials = bm ? bms : [cm];
//         }
//       }
//       // handle band
//       if (s.match(/strap|band|bracelet|bangle/i)) {
//         if (s.match(/strap|band/i)) result.band.type = 'Strap';
//         if (s.match(/bracelet|bangle/i)) result.band.type = 'Bracelet';
//         let b = [s];
//         if (!(s.match(/and strap|and bracelet/i))) {
//           // if (s.match(/strap/i)) b = s.split('strap');
//           // if (s.match(/band/i)) b = s.split('band');
//           // if (s.match(/bangle/i)) b = s.split('bangle');
//           if (b[0].match(/ and /i)) b = b[0].split(' and ');
//           if (b[0].match(/ with /i)) b = b[0].split(' with ');
//         }
//         assigned = b.length === 1;
//         b.forEach(value => {
//           if (value.match(/strap|bracelet|bangle|band/i)) {
//             if (!result.band.materials) result.band.materials = [];
//             const { bm, bms, bt, } = Mappers.getMaterial.map(value);
//             if (bm) {
//               result.band.type = result.band.type ? result.band.type : bt;
//               result.band.material = result.band.material ? result.band.material : bm;
//               bms.forEach(val => {
//                 if (result.band.materials.indexOf(val) < 0) {
//                   result.band.materials.push(val);
//                 }
//               })
//             } else {
//               result.band.material = result.band.material ? result.band.material : value;
//               result.band.materials.push(value);
//             }
//             // color
//             let r = Mappers.getColor.map(value);
//             if (r) result.band.color = r;
//           }
//         })
//       }
//       // handle dial
//       if (s.match(/dial/i) && !(s.match(/sub/i))) {     // filter subdial
//         let dial = s;
//         if (!(s.match(/and dial/i))) {      // assumes no descriptive dial
//           const dc = s.split('dial');
//           if (dc[0].match(/and/i)) dial = dc[0].split(' and ')[1].trim();
//           else { assigned = true; dial = dc[0]; }
//         }
//         let r = Mappers.getColor.map(dial);
//         result.dial.color = r ? r : dial;
//         result.dialColor = result.dialColor ? result.dialColor :
//           result.dial.color.match(/mother of pearl/i) ? 'Mother of Pearl' :
//             result.dial.color.match(/diamond/i) ? 'Diamond' : result.dial.color;
//       }
//       // handle bezel
//       if (s.match(/bezel/i)) {
//         let bz = s;
//         if (!(s.match(/and bezel/i))) {   // check if .* case|dial|band and bezel
//           const dc = s.split('bezel');
//           if (dc[0].match(/and/i)) bz = dc[0].split(' and ')[1].trim();
//           else assigned = true;
//         }
//         let r = Mappers.getBezel.map(bz);
//         if (r) result.bezel.type = r;
//         const { bm, bms, } = Mappers.getMaterial.map(bz);
//         if (bm) {
//           result.bezel.material = bm;
//           result.bezel.materials = bms;
//         }
//         const c = Mappers.getColor.map(bz);
//         if (c) result.bezel.color = c;
//       }

//       if (s.match(/movement/i)) {
//         if (!(s.match(/with/i) || s.match(/and/i))) assigned = true;
//         let functionAdded = false;
//         if (s.match(/2-hand movement|two-hand movement/i)) {
//           assigned = true; functionAdded = true;
//           result.dial.handStyle = '2-hand';
//           result.dial.type = 'Analog';
//         }
//         if (s.match(/3-hand movement|three-hand movement/i)) {
//           assigned = true; functionAdded = true;
//           result.dial.handStyle = '3-hand';
//           result.dial.type = 'Analog';
//         }
//         if (s.match(/multi-function|multifunction|multi function|dual-time|dual time|multi-eye|multi eye/i)) {
//           if (s.match(/multi-function|multifunction|multi function/i)) {
//             if (result.functions.indexOf('Multi-function') < 0) {
//               functionAdded = true;
//               result.functions.push('Multi-function movement');
//             }
//           }
//           if (s.match(/dual-time|dual time/i)) {
//             if (result.functions.indexOf('Dual-time') < 0) {
//               functionAdded = true;
//               result.functions.push('Dual-time movement');
//             }
//           }
//           if (s.match(/multi-eye|multi eye/i)) {
//             if (result.functions.indexOf('Multi-eye') < 0) {
//               functionAdded = true;
//               result.functions.push('Multi-eye movement');
//             }
//           }
//         }
//         if (!functionAdded && result.functions.indexOf(s) < 0) result.functions.push(s);
//       }
//       if (s.match(/water/i)) {
//         assigned = true;
//         result.case.waterResistance = s.split(' to ')[1].replace('.', '');
//         result.waterResistance = Mappers.getWaterResistance.map(s);
//       }
//       if (s.match(/marker|indices|numeral/i)) {
//         assigned = true;
//         const r = Mappers.getIndexType.map(s);
//         result.dial.indexType = r ? r : s;
//       }
//       if (s.match(/sub[ -]?dial/i)) {
//         assigned = true;
//         if (result.features.indexOf('Sub-dials') < 0) result.features.push('Sub-dials');
//       }
//       if (s.match(/import/i)) {
//         assigned = true;
//         if (result.features.indexOf('Imported') < 0) result.features.push('Imported');
//       }
//       if (s.match(/light$|date|display/i)) {
//         assigned = true;
//         if (result.functions.indexOf(s) < 0) result.functions.push(s);
//       }
//       if (!assigned) result.additional.push(s);
//     }
//   } catch (error) {
//     console.debug('Failed distillation for Tommy Hilfiger with error : ' + error)
//   }
//   return result;
// };

(async () => {
  const r = await indexing({
    entry: "https://usa.tommy.com/static/sitemap.xml",
  })
  console.log(r)
  // for (let i = 0; i < r.length - 1; i++) {
  //   const ex = await distill({
  //     entry: r[i].url,
  //     ...r[i],
  //   })
  //   console.log(r[i].spec);
  //   console.log()
  //   console.log('features: ', ex.features);
  //   console.log('functions: ', ex.functions);
  //   console.log('dial: ', ex.dial);
  //   console.log('case: ', ex.case);
  //   console.log('band: ', ex.band);
  //   console.log('caliber: ', ex.caliber);
  //   console.log('bezel: ', ex.bezel);
  //   console.log('additional: ', ex.additional);
  //   console.log()
  //   console.log('--------------------------------------------------');
  //   console.log()
  // }
  // for (let i = 0; i < r.length - 1; i++) {
  //   const ex = await extraction({
  //     entry: r[i],
  //   })
  //   console.log(ex);
  //   // const dist = await distill(ex);
  //   // console.log()
  //   // console.log('distilled > ', dist)
  //   // console.log()
  //   // console.log('--------------------------------------------------');
  //   // console.log()
  //   await new Promise(r => setTimeout(r, 3000));
  // }
})();