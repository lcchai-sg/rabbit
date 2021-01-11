const axios = require('axios');
const cheerio = require('cheerio');
const { Mappers } = require('../normalize/prod/utils');

const indexing = async context => {
  const result = { collections: [], items: {} };
  const entry1 = "https://meistersinger.us/shop-tagged/single-hand-watch/";
  let link = entry1;
  do {
    const { data } = await axios.get(link);
    const $ = cheerio.load(data);
    $('.product-grid-item').each((idx, el) => {
      const p = $(el).find('.gtm4wp_productdata');
      const price = p.attr('data-gtm4wp_product_price')
      const url = p.attr('data-gtm4wp_product_url');
      const thumbnail = $(el).find('img').attr('src');
      const n = url.split('/');
      const name = n[n.length - 2].split('-').join(' ').toUpperCase();
      const collection = p.attr('data-gtm4wp_product_cat');
      const ref = thumbnail.split('/');
      const refrn = ref[ref.length - 1].split('-');
      const reference = refrn[refrn.length - 3].toUpperCase();
      let coll = collection;
      if (collection.indexOf('/') > 0) {
        const c = collection.split('/');
        coll = c[0] + ' ' + c[1]
      }
      if (result.collections.indexOf(coll) < 0) {
        result.collections.push(coll);
        result.items[coll] = [];
      }
      result.items[coll].push({
        url, collection, name, reference, price, thumbnail,
      })
    })
    link = $('link[rel="next"]').attr('href');
  } while (link)

  // const urls = [];
  // const entry = "https://meistersinger.us/";
  // const { data } = await axios.get(entry);
  // const $ = cheerio.load(data);
  // $('.ms-footer ').find('.menu-item-object-product_cat').each((idxP, elP) => {
  //   const collection = $(elP).text();
  //   const coll_url = $(elP).find('a').attr('href');
  //   urls.push({ collection, url: coll_url });
  // })
  // for (const coll of urls) {
  //   const { data } = await axios.get(coll.url);
  //   const $ = cheerio.load(data);
  //   $('.product-grid-item').each((idx, el) => {
  //     const p = $(el).find('.gtm4wp_productdata');
  //     const price = p.attr('data-gtm4wp_product_price')
  //     const url = p.attr('data-gtm4wp_product_url');
  //     const thumbnail = $(el).find('img').attr('src');
  //     const n = url.split('/');
  //     const name = n[n.length - 2].split('-').join(' ').toUpperCase();
  //     const collection = coll.collection;

  //     if (uniq.indexOf(url) < 0) {
  //       result.items[collection].push({
  //         collection, url, name, price, thumbnail,
  //       })
  //     }
  //   })
  // }

  return result;
}

const extraction = async context => {
  const result = { ...context, spec: [], };
  const { data } = await axios.get(result.url);
  const $ = cheerio.load(data);
  // result.shortDesc = $('.woocommerce-product-details__short-description').text().trim();
  result.description = $('.long-description').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
  $('.description').each((idx, el) => {
    const key = $(el).find('h5').text();
    const d = $(el).find('div').text();
    const dd = d.split('\n');
    dd.forEach(value => {
      result.spec.push({ key, value });
    })
  })

  const strap = $('.variations_form').attr('data-product_variations');
  const varN = strap.match(/"attribute_pa_strap":"(\w+[-]?)*"/ig);
  const varP = strap.match(/"display_price":\d{0,6}/ig);
  const varS = strap.match(/"sku":"(\w+[-]?)*"/ig);
  if (varN.length !== varP.length) { logger.debug('variation data error!!!'); }
  else {
    varN.forEach((val, i) => {
      const v = val.split(":");
      const vn = v[1].split("-").join(" ").toUpperCase();
      result.spec.push({ key: "strap" + i, value: vn.replace(/"/g, ''), });
      const vv = varP[i].split(":");
      result.spec.push({ key: "wprice" + i, value: vv[1], });
      const vs = varS[i].split(":");
      result.spec.push({ key: "sku" + i, value: vs[1].replace(/"/g, ''), });
    })
  }
  return result;
}

const distill = async (context) => {
  try {
    const { brand, brandID, reference, lang, source, collection, gender, related, url, spec, description, name, ...other } = context;
    const result = {
      source, lang, brand, brandID, url, collection, name, reference, description,
      gender, related, additional: [], functions: [], features: [],
      case: {}, band: {}, dial: {}, caliber: {}, bezel: {}, ...other,
    };

    const results = [];
    const vars = [];
    let first = true;
    for (const s of spec) {
      const key = s.key.toLowerCase();
      const value = s.value.trim();
      let assigned = false;

      if (key === 'technology') {
        if (first) {  // assume caliber
          result.caliber.reference = value;
          assigned = true;
          first = false;
          const r = Mappers.getCaliberType.map(value);
          if (r) {
            result.caliber.type = r;
            result.movementType = r;
          }
        }
        if (value.match(/jewels/i)) {
          assigned = true;
          result.caliber.jewels = value.replace('jewels', '').trim();
        }
        if (value.match(/oscillations|Hz|per h/i)) {
          assigned = true;
          const v = value.match(/\d{1,3},?\d{1,3}/g)
          if (v) result.caliber.frequency = v[0] + ' vph';
        }
        if (value.match(/Power reserve/i)) {
          assigned = true;
          result.caliber.reserve = value.replace('Power reserve', '').trim();
        }
        if (!assigned) {
          const r = Mappers.getCaliberType.map(value);
          if (r) {
            assigned = true;
            result.caliber.type = r;
            result.movementType = r;
          }
        }
      }
      if (key === 'glass') {
        const r = Mappers.getCrystal.map(value);
        const cc = Mappers.getCrystalCoating.map(value);
        if (r) {
          assigned = true;
          result.case.crystal = r;
        }
        if (cc) {
          result.case.crystalCoating = cc;
        }
      }
      if (key === 'case') {
        if (value.match(/diameter/i)) {
          result.case.diameter = value.replace('Diameter ', '').trim();
          assigned = true;
        }
        if (value.match(/height/i)) {
          result.case.thickness = value.replace('Height ', '').trim();
          assigned = true;
        }
        if (!assigned) {
          const { bm, bms, } = Mappers.getMaterial.map(value);
          if (bm) {
            assigned = true;
            result.case.material = bm;
            result.case.materials = bms;
          }
          const r = Mappers.getCaseBack.map(value);
          if (r) result.case.back = r;
        }
      }
      if (key === 'water resistance') {
        result.case.waterResistance = value;
        result.waterResistance = Mappers.getWaterResistance.map(value);
        assigned = true;
      }
      if (key.match(/sku|strap|price/i)) {
        const ind = key.match(/\d/g);
        if (ind) {
          const idx = parseInt(ind[0]);
          if (key.match(/sku/i)) if (vars[idx]) vars[idx].sku = value;
          else { vars[idx] = { sku: value } }
          if (key.match(/strap/i)) if (vars[idx]) vars[idx].strap = value;
          else { vars[idx] = { strap: value } }
          if (key.match(/price/i)) if (vars[idx]) vars[idx].price = value;
          else { vars[idx] = { price: value } }
        }
      }
      if (!assigned) {
        result.additional.push({ [key]: value });
      }
    }

    vars.forEach(v => {
      const r = { ...result, }
      r.reference = v.sku;
      r.band = {};
      const { bm, bms, bt, } = Mappers.getMaterial.map(v.strap);
      if (bt) r.band.type = bt;
      r.band.material = bm ? bm : v.strap
      r.band.materials = bm ? bms : [v.strap];
      r.price = v.price;
      console.log('r.band >>>', r.band)
      results.push(r);
    })
    return results;
  } catch (error) {
    console.debug('Failed distillation for MeisterSinger with error : ' + error)
    return {};
  }
};

(async () => {
  // const r = await indexing();
  // r.collections.forEach(c => {
  //   r.items[c].forEach(v => console.log(v));
  // })

  const r = [
    {
      url: 'https://meistersinger.us/shop/phanero-sunburst-blue/',
      collection: 'Casual/Phanero',
      name: 'PHANERO SUNBURST BLUE',
      reference: 'PH308',
      price: '1595',
      thumbnail: 'https://meistersinger.us/wp-content/uploads/2018/07/meistersinger-phanero-ph308-mgb18_960x1280_20200218-300x400.png'
    },
    {
      url: 'https://meistersinger.us/shop/phanero-mother-of-pearl-appliques-blue/',
      collection: 'Casual/Phanero',
      name: 'PHANERO MOTHER OF PEARL APPLIQUES BLUE',
      reference: 'PHM1B',
      price: '1895',
      thumbnail: 'https://meistersinger.us/wp-content/uploads/2018/07/meistersinger-phanero-phm1b-mgb18_960x1280_20200218-300x400.png'
    },
    {
      url: 'https://meistersinger.us/shop/phanero-mother-of-pearl-appliques-silver/',
      collection: 'Casual/Phanero',
      name: 'PHANERO MOTHER OF PEARL APPLIQUES SILVER',
      reference: 'PHM1C',
      price: '1895',
      thumbnail: 'https://meistersinger.us/wp-content/uploads/2018/07/meistersinger-phanero-phm1c-mgb18_960x1280_20200218-300x400.png'
    },
    {
      url: 'https://meistersinger.us/shop/phanero-mother-of-pearl-appliques-gold/',
      collection: 'Casual/Phanero',
      name: 'PHANERO MOTHER OF PEARL APPLIQUES GOLD',
      reference: 'PHM1G',
      price: '2095',
      thumbnail: 'https://meistersinger.us/wp-content/uploads/2018/07/meistersinger-phanero-phm1g-mgb18_960x1280_20200218-300x400.png'
    }
  ];

  // for (let i = 0; i < r.length; i++) {
  //   const ex = await extraction(r[i]);
  //   console.log('number of sku: ', ex.length);
  //   console.log(ex);
  // }

  const ext = [
    {
      source: 'official',
      lang: 'en',
      brand: 'MeisterSinger',
      brandID: 280,
      url: 'https://meistersinger.us/shop/vintago-opaline-silver/',
      collection: 'New Vintage Vintago',
      name: 'VINTAGO OPALINE SILVER',
      reference: 'Ref.: VT901',
      thumbnail: 'https://meistersinger.us/wp-content/uploads/2019/04/meistersinger-vintago-vt901-skk01_960x1280_20200218-300x400.png',
      spec: [
        { key: 'Technology', value: 'Sellita SW 200-1' },
        { key: 'Technology', value: 'Automatic' },
        { key: 'Technology', value: '26 jewels' },
        { key: 'Technology', value: '28800 Semioscillations per h – 4 Hz' },
        { key: 'Technology', value: 'Power reserve 38 h' },
        { key: 'Glass', value: 'Sapphire glass' },
        {
          key: 'Case',
          value: 'Stainless steel case with 6-screwed exhibition back'
        },
        { key: 'Case', value: 'Diameter 38 mm' },
        { key: 'Case', value: 'Height 10.15 mm' },
        { key: 'Water resistance', value: '5 bar' },
        { key: 'strap0', value: 'NAPPA GREY' },
        { key: 'wprice0', value: '1895' },
        { key: 'sku0', value: 'VT901_SN06' },
        { key: 'strap1', value: 'SUEDE LEATHER COGNAC' },
        { key: 'wprice1', value: '1895' },
        { key: 'sku1', value: 'VT901_SV03' },
        { key: 'strap2', value: 'MILANAISE BRACELET FINELY MESHED' },
        { key: 'wprice2', value: '1945' },
        { key: 'sku2', value: 'VT901_MLN20' }
      ],
      related: [],
      description: 'As the name suggests, the Vintago also provides a look back to the past because it embodies the design virtues of a rather elegant era. The purely functional typography and the flat glass domed over the unadorned dial are reminiscent of the austere design language of the 1960s. The finely brushed stainless steel case with its discreet 38-millimeter diameter is also typical of that decade. And, last but not least, the carefully designed crown also harks back to those bygone years.  But whereas MeisterSinger’s Neo looks at first glance like it’s been around since the 1950s, the Vintago’s design is also quite contemporary at the same time. Its curved single hand rotates around a multi-level dial, thereby adding further depth to its geometric appearance. The generous arched segment of the date display is cut out of the raised center. Both the form and the content are highly typical for MeisterSinger, as the wearer has an overview of five calendar days and a small dot marks the current date.',
      strategy: 'meistersinger'
    },
  ]
  // const ext = [
  //   {
  //     url: 'https://meistersinger.us/shop/phanero-sunburst-blue/',
  //     collection: 'Casual/Phanero',
  //     name: 'PHANERO SUNBURST BLUE',
  //     reference: 'PH308',
  //     price: '1595',
  //     thumbnail: 'https://meistersinger.us/wp-content/uploads/2018/07/meistersinger-phanero-ph308-mgb18_960x1280_20200218-300x400.png',
  //     spec: [
  //       { key: 'Technology', value: 'Sellita SW 210' },
  //       { key: 'Technology', value: 'Hand-wound' },
  //       { key: 'Technology', value: '19 jewels' },
  //       { key: 'Technology', value: '28800 Semioscillations per h – 4 Hz' },
  //       { key: 'Technology', value: 'Power reserve 42 h' },
  //       { key: 'Glass', value: 'Domed sapphire glass' },
  //       {
  //         key: 'Case',
  //         value: 'Stainless steel case with 4-screwed exhibition back'
  //       },
  //       { key: 'Case', value: 'Diameter 35 mm' },
  //       { key: 'Case', value: 'Height 7.5 mm' },
  //       { key: 'Water resistance', value: '3 bar' },
  //       { key: 'strap0', value: 'STAINLESS STEEL LINK BRACELET' },
  //       { key: 'wprice0', value: '1745' },
  //       { key: 'sku0', value: 'PH308_MGB18' },
  //       { key: 'strap1', value: 'SUEDE LEATHER BLUE' },
  //       { key: 'wprice1', value: '1595' },
  //       { key: 'sku1', value: 'PH308_SV14XS' },
  //       { key: 'strap2', value: 'SUEDE LEATHER COGNAC' },
  //       { key: 'wprice2', value: '1595' },
  //       { key: 'sku2', value: 'PH308_SV13XS' }
  //     ],
  //     description: 'The Phanero may be the smallest of all MeisterSinger models, but with its striking case and unusual color combinations it is also one of the most expressive. The various dials in the Phanero range are designed with hour digit appliqués in the sans serif typography typical of MeisterSinger – sometimes strongly contrasting, sometimes similar in color to the background. The stainless steel case is 35 millimeters in diameter and only 7.5 millimeters high.  Its angular lugs seem to ideally match the digits. A domed sapphire glass covers the dial and the Swiss hand-wound movement that powers the Phanero is clearly visible through the fourfold screwed glass exhibition back. The movement is decorated with ornamental cuts prior to installation.'
  //   },
  //   {
  //     url: 'https://meistersinger.us/shop/phanero-mother-of-pearl-appliques-blue/',
  //     collection: 'Casual/Phanero',
  //     name: 'PHANERO MOTHER OF PEARL APPLIQUES BLUE',
  //     reference: 'PHM1B',
  //     price: '1895',
  //     thumbnail: 'https://meistersinger.us/wp-content/uploads/2018/07/meistersinger-phanero-phm1b-mgb18_960x1280_20200218-300x400.png',
  //     spec: [
  //       { key: 'Technology', value: 'Sellita SW 210' },
  //       { key: 'Technology', value: 'Hand-wound' },
  //       { key: 'Technology', value: '19 jewels' },
  //       { key: 'Technology', value: '28800 Semioscillations per h – 4 Hz' },
  //       { key: 'Technology', value: 'Power reserve 42 h' },
  //       { key: 'Glass', value: 'Domed sapphire glass' },
  //       {
  //         key: 'Case',
  //         value: 'Stainless steel case with 4-screwed exhibition back'
  //       },
  //       { key: 'Case', value: 'Diameter 35 mm' },
  //       { key: 'Case', value: 'Height 7.5 mm' },
  //       { key: 'Water resistance', value: '3 bar' },
  //       { key: 'strap0', value: 'SUEDE LEATHER COGNAC' },
  //       { key: 'wprice0', value: '1895' },
  //       { key: 'sku0', value: 'PHM1B_SV13XS' },
  //       { key: 'strap1', value: 'SUEDE LEATHER BLUE' },
  //       { key: 'wprice1', value: '1895' },
  //       { key: 'sku1', value: 'PHM1B_SV14XS' },
  //       { key: 'strap2', value: 'STAINLESS STEEL LINK BRACELET' },
  //       { key: 'wprice2', value: '2045' },
  //       { key: 'sku2', value: 'PHM1B_MGB18' }
  //     ],
  //     description: 'The Phanero may be the smallest of all MeisterSinger models, but with its striking case and unusual color combinations it is also one of the most expressive. The various dials in the Phanero range are designed with hour digit appliqués in the sans serif typography typical of MeisterSinger – sometimes strongly contrasting, sometimes similar in color to the background. The stainless steel case is 35 millimeters in diameter and only 7.5 millimeters high.  Its angular lugs seem to ideally match the digits. A domed sapphire glass covers the dial and the Swiss hand-wound movement that powers the Phanero is clearly visible through the fourfold screwed glass exhibition back. The movement is decorated with ornamental cuts prior to installation.'
  //   },
  //   {
  //     url: 'https://meistersinger.us/shop/phanero-mother-of-pearl-appliques-silver/',
  //     collection: 'Casual/Phanero',
  //     name: 'PHANERO MOTHER OF PEARL APPLIQUES SILVER',
  //     reference: 'PHM1C',
  //     price: '1895',
  //     thumbnail: 'https://meistersinger.us/wp-content/uploads/2018/07/meistersinger-phanero-phm1c-mgb18_960x1280_20200218-300x400.png',
  //     spec: [
  //       { key: 'Technology', value: 'Sellita SW 210' },
  //       { key: 'Technology', value: 'Hand-wound' },
  //       { key: 'Technology', value: '19 jewels' },
  //       { key: 'Technology', value: '28800 Semioscillations per h – 4 Hz' },
  //       { key: 'Technology', value: 'Power reserve 42 h' },
  //       { key: 'Glass', value: 'Domed sapphire glass' },
  //       {
  //         key: 'Case',
  //         value: 'Stainless steel case with 4-screwed exhibition back'
  //       },
  //       { key: 'Case', value: 'Diameter 35 mm' },
  //       { key: 'Case', value: 'Height 7.5 mm' },
  //       { key: 'Water resistance', value: '3 bar' },
  //       { key: 'strap0', value: 'SUEDE LEATHER BROWN' },
  //       { key: 'wprice0', value: '1895' },
  //       { key: 'sku0', value: 'PHM1C_SV12XS' },
  //       { key: 'strap1', value: 'STAINLESS STEEL LINK BRACELET' },
  //       { key: 'wprice1', value: '2045' },
  //       { key: 'sku1', value: 'PHM1C_MGB18' },
  //       { key: 'strap2', value: 'SUEDE LEATHER COGNAC' },
  //       { key: 'wprice2', value: '1895' },
  //       { key: 'sku2', value: 'PHM1C_SV13XS' }
  //     ],
  //     description: 'The Phanero may be the smallest of all MeisterSinger models, but with its striking case and unusual color combinations it is also one of the most expressive. The various dials in the Phanero range are designed with hour digit appliqués in the sans serif typography typical of MeisterSinger – sometimes strongly contrasting, sometimes similar in color to the background. The stainless steel case is 35 millimeters in diameter and only 7.5 millimeters high.  Its angular lugs seem to ideally match the digits. A domed sapphire glass covers the dial and the Swiss hand-wound movement that powers the Phanero is clearly visible through the fourfold screwed glass exhibition back. The movement is decorated with ornamental cuts prior to installation.'
  //   },
  //   {
  //     url: 'https://meistersinger.us/shop/phanero-mother-of-pearl-appliques-gold/',
  //     collection: 'Casual/Phanero',
  //     name: 'PHANERO MOTHER OF PEARL APPLIQUES GOLD',
  //     reference: 'PHM1G',
  //     price: '2095',
  //     thumbnail: 'https://meistersinger.us/wp-content/uploads/2018/07/meistersinger-phanero-phm1g-mgb18_960x1280_20200218-300x400.png',
  //     spec: [
  //       { key: 'Technology', value: 'Sellita SW 210' },
  //       { key: 'Technology', value: 'Hand-wound' },
  //       { key: 'Technology', value: '19 jewels' },
  //       { key: 'Technology', value: '28800 Semioscillations per h – 4 Hz' },
  //       { key: 'Technology', value: 'Power reserve 42 h' },
  //       { key: 'Glass', value: 'Domed sapphire glass' },
  //       {
  //         key: 'Case',
  //         value: 'Stainless steel case with 4-screwed exhibition back'
  //       },
  //       { key: 'Case', value: 'Diameter 35 mm' },
  //       { key: 'Case', value: 'Height 7.5 mm' },
  //       { key: 'Water resistance', value: '3 bar' },
  //       { key: 'strap0', value: 'STAINLESS STEEL LINK BRACELET' },
  //       { key: 'wprice0', value: '2245' },
  //       { key: 'sku0', value: 'PHM1G_MGB18' },
  //       { key: 'strap1', value: 'SUEDE LEATHER BROWN' },
  //       { key: 'wprice1', value: '2095' },
  //       { key: 'sku1', value: 'PHM1G_SV12XS' },
  //       { key: 'strap2', value: 'SUEDE LEATHER COGNAC' },
  //       { key: 'wprice2', value: '2095' },
  //       { key: 'sku2', value: 'PHM1G_SV13XS' }
  //     ],
  //     description: 'The Phanero may be the smallest of all MeisterSinger models, but with its striking case and unusual color combinations it is also one of the most expressive. The various dials in the Phanero range are designed with hour digit appliqués in the sans serif typography typical of MeisterSinger – sometimes strongly contrasting, sometimes similar in color to the background. The stainless steel case is 35 millimeters in diameter and only 7.5 millimeters high.  Its angular lugs seem to ideally match the digits. A domed sapphire glass covers the dial and the Swiss hand-wound movement that powers the Phanero is clearly visible through the fourfold screwed glass exhibition back. The movement is decorated with ornamental cuts prior to installation.'
  //   }
  // ];

  for (let i = 0; i < ext.length; i++) {
    const dist = await distill(ext[i]);
    console.log('number of products > ', dist.length);
    console.log(dist);
  }
})();