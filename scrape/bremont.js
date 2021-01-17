const axios = require('axios');
const cheerio = require('cheerio');
const xml2js = require('xml2js');
const { Mappers, } = require('./utils');

const indexing = async context => {
  const { client, entry, base, } = context;
  const source = "official";
  const lang = "en";
  const brand = "Bremont";
  const brandID = 342;
  const baseURL = base ? base : "https://www.bremont.com";
  const result = { source, lang, brand, brandID, collections: [], items: {}, }
  try {
    const collections = [];
    {
      const { data } = await client.get(baseURL);
      const $ = cheerio.load(data);
      $(".navmenu-allwatches").first().each((idxN, el) => {
        $(el).find('li').each((idx, el) => {
          const name = $(el).find("a").text().replace(/\s+/g, ' ').trim();
          const url = baseURL + $(el).find("a").attr("href");
          collections.push({ name, url });
        })
      })
    }
    const { data } = await client.get(entry);
    const parser = new xml2js.Parser();
    parser.parseString(data, (err, res) => {
      for (let i = 0; i < res.urlset.url.length; i++) {
        const d = res.urlset.url[i]
        const url = d['loc'][0];
        if (url.match(/products/i)) {
          const name = d['image:image'][0]['image:caption'][0] ? d['image:image'][0]['image:caption'][0] : null;
          if (name.match(/watch/i) && !url.match(/pin-buckle|deployment-clasp|watch/i)) {
            const collname = d['image:image'][0]['image:title'][0] ? d['image:image'][0]['image:title'][0] : null;
            const thumbnail = d['image:image'][0]['image:loc'][0] ? d['image:image'][0]['image:loc'][0] : null;
            const reference = thumbnail ? thumbnail.split("v=")[1] : null;
            let collection = '';
            collections.forEach(c => {
              const u = c.url.split('/');
              const uu = u[u.length - 1];
              const ms = c.name + '|' + uu;
              const m = new RegExp(ms, 'i');
              if (collname.match(m) || url.match(m) || name.match(m) || thumbnail.match(m)) {
                collection = c.name;
              }
            })
            collection = collection ? collection : collname ? collname.split(" ")[0] : null;
            if (result.collections.indexOf(collection) < 0) {
              result.collections.push(collection);
              result.items[collection] = [];
            }
            result.items[collection].push({
              source, lang, brand, brandID, collection, url, name,
              reference, thumbnail, price: null,
            })
          }
        }
      }
    });
    return result;
  } catch (error) {
    console.error("Failed indexing for Bremont with error : ", error);
    console.error("entry : ", entry);
    return {};
  }
}

const extraction = async context => {
  const { client, entry, base, ...rest } = context;
  const result = { ...rest, url: entry, spec: [], related: [], }
  try {
    const { data } = await client.get(entry);
    const $ = cheerio.load(data);
    result.name = $('meta[property="og:title"]').attr('content');
    result.thumbnail = $('meta[property="og:image"]').attr('content');
    const title = $('meta[property="og:image:alt"]').attr('content');
    result.gender = Mappers.getGender.map(title);
    result.description = $(".product-description--content").text().replace(/\s+/g, ' ');
    $('script[type="application/ld+json"]').each((idx, el) => {
      if (idx === 0) {
        const c = $(el).contents().toString();
        const j = JSON.parse(c);
        if (j['@type'] === "Product") {
          if (j.offers && Array.isArray(j.offers)) {
            const p = j.offers[0];
            result.price = p.priceCurrency + p.price;
          }
          result.reference = j.sku;
          if (!result.name) result.name = j.name.replace(/(<([^>]+)>)/ig, '');
          if (!result.thumbnail) result.thumbnail = j.image;
        }
      }
    })
    $(".content__watch__main__features").find("li").each((idx, el) => {
      const key = "main_feature";
      const value = $(el).text();
      result.spec.push({ key, value });
    })
    $(".product-techoverview--item").each((idx, el) => {
      const key = $(el).find("h4").text();
      const value = $(el).find("p").text();
      result.spec.push({ key, value });
    })
  } catch (error) {
    console.error("Failed extraction for Bremont with error : ", error);
    console.error("entry : ", entry);
    if (error.response) result.code = error.response.status;
    else result.code = 'UNKNOW ERROR';
  }
  return result;
}

const distill = async (context) => {
  try {
    const { payload } = context;
    const { spec, ...other } = payload;
    const result = {
      ...other, additional: [], functions: [], features: [],
      case: {}, band: {}, dial: {}, caliber: {}, bezel: {},
    };

    for (const s of spec) {
      let assigned = false;
      const key = s.key.toLowerCase();
      const value = s.value.trim();

      if (key === 'case back') {
        const r = Mappers.getCaseBack.map(value);
        if (r) result.case.back = r;
      }
      if (key === 'case' || (key === 'main_feature' && value.match(/case|construction/i))) {
        const material = value.split('.')[0];     // assume case material
        const { bm, bms, } = Mappers.getMaterial.map(material);
        if (bm) {
          result.case.material = bm;
          result.case.materials = bms;
        }
        if (key === 'case') {
          const c = Mappers.getCoating.map(material);
          if (c) result.case.coating = c;
          const d = value.match(/case diameter \d{1,2}.?\d{0,2} ?mm/ig);
          const dv = d ? d[0].match(/\d{1,2}.?\d{0,2} ?mm/ig) : null;
          if (dv) result.case.diameter = dv[0];
          const h = value.match(/height \d{1,2}.?\d{0,2} ?mm/ig);
          const hv = h ? h[0].match(/\d{1,2}.?\d{0,2} ?mm/ig) : null;
          if (hv) result.case.thickness = hv[0];
          const th = value.match(/case thickness \d{1,2}.?\d{0,2} ?mm/ig);
          const thv = th ? th[0].match(/\d{1,2}.?\d{0,2} ?mm/ig) : null;
          if (thv) result.case.thickness = thv[0];
          const lw = value.match(/lug width \d{1,2}.?\d{0,2} ?mm/ig);
          const lwv = lw ? lw[0].match(/\d{1,2}.?\d{0,2} ?mm/ig) : null;
          if (lwv) result.case.lugWidth = lwv[0];
        }
      }
      if (key === 'crystal') {
        assigned = true;
        const c = Mappers.getCrystal.map(value);
        const cc = Mappers.getCrystalCoating.map(value);
        result.case.crystal = c ? c : value;
        if (cc) result.case.crystalCoating = cc;
      }
      if (key === 'dial and hands' || key === 'dial') {
        const dial = value.split(' with ')[0];
        const c = Mappers.getColor.map(dial);
        if (c) {
          result.dial.color = c ? c : value;
          result.dialColor = Mappers.getDialColor.map(result.dial.color);
        }
        if (value.match(/index|indices|marker/i)) {
          const r = Mappers.getIndexType.map(value);
          if (r) result.dial.indexType = r;
        }
        if (value.match(/hands/i)) {
          const r = Mappers.getHandStyle.map(value);
          if (r) result.dial.handStyle = r;
        }
        if (value.match(/lumin/i)) {
          const r = Mappers.getLuminescence.map(value);
          if (r) result.dial.luminescene = r;
        }
      }
      if (key === 'functions') {
        assigned = true;
        result.functions.push(value);
      }
      if (key === 'movement' || (key === 'main_feature' && value.match(/automatic/i))) {
        result.caliber.reference = value.split(' automatic ')[0];
        result.caliber.label = 'UK';
        result.caliber.brand = 'Bremont';
        const pr = value.match(/\d{1,3}(\+ | |-)hours?.*power reserve/ig);
        const prv = pr ? pr[0].match(/\d{1,3}(\+ | |-)hours?/ig) : null;
        if (prv) result.caliber.reserve = prv[0].replace('-', ' ').replace('hours', 'hour');
        const j = value.match(/\d{1,3} jewels/ig);
        const jv = j ? j[0].match(/\d{1,3}/ig) : null;
        if (jv) result.caliber.jewels = jv[0];
        const f = value.match(/\d{2,3},?\d{3} ?(bph|a\/h)/ig);
        const fv = f ? f[0].match(/\d{2,3},?\d{3}/ig) : null;
        if (fv) result.caliber.frequency = fv[0] + ' vph';
      }
      if (key === 'strap' || (key === 'main_feature' && value.match(/strap|bracelet/i))) {
        if (!value.match(/a variety/i)) {
          const m = value.split(' with ');
          const { bm, bms, bt, } = Mappers.getMaterial.map(m[0]);
          if (bt) result.band.type = bt;
          if (bm) {
            result.band.material = bm;
            result.band.materials = bms;
          }
          if (m.length > 1) {
            const b = Mappers.getBuckle.map(m[1]);
            if (b) result.band.buckle = b;
          }
          const c = Mappers.getColor.map(m[0]);
          if (c) result.band.color = c;
        }
      }
      if (key === 'water resistance' || (key === 'main_feature' && value.match(/water/i))) {
        assigned = true;
        const wr = value.match(/water/i) ? value.split(" to ")[1] : value;
        result.case.waterResistance = wr;
        result.waterResistance = Mappers.getWaterResistance.map(wr);
      }
      if (key === 'main_feature' && value.match(/limited to \d{1,4} pieces/i)) {
        result.limited = true;
      }
      if (!assigned) result.additional.push({ [key]: value });
    }
    return result;
  } catch (error) {
    console.error('Failed distillation for Bremont with error : ' + error)
    return {};
  }
};

(async () => {
  // const r = await indexing({
  //   client: axios,
  //   entry: "https://www.bremont.com/sitemap_products_1.xml?from=845600522355&to=6068768899252",
  //   base: "https://www.bremont.com",
  // });
  // // console.log(r);
  // let cnt = 0;
  // r.collections.forEach(c => {
  //   console.log('collection : ', c);
  //   r.items[c].forEach(i => {
  //     console.log('>>>>>>>>>> ', i.url);
  //     cnt++;
  //   });
  // })
  // console.log('number : ', cnt)

  // const r = [
  //   'https://www.bremont.com/products/solo-black-cream-bracelet',
  //   'https://www.bremont.com/products/u-2-blue-bracelet',
  //   'https://www.bremont.com/products/arrow-br',
  //   'https://www.bremont.com/products/solo-34-aj-mother-of-pearl-alligator',
  //   'https://www.bremont.com/products/airco-mach-2-anthracite-bracelet',
  // ]

  // for (let k = 0; k < r.collections.length; k++) {
  //   const c = r.collections[k];
  //   for (let i = 0; i < r.items[c].length; i++) {
  //     const ex = await extraction({
  //       client: axios,
  //       entry: r.items[c][i].url,
  //       base: "https://www.bremont.com",
  //       ...r.items[c][i],
  //     });
  //     console.log(ex.url);
  //     ex.spec.forEach(s => console.log(s.key + ' | ' + s.value));
  //   }
  // }

  const d = {
    payload: {
      source: 'official',
      lang: 'en',
      brand: 'Bremont',
      brandID: 342,
      collection: 'Supermarine',
      name: 'S2000 Yellow',
      reference: 'S2000-YL-S',
      price: 'GBP4195.00',
      thumbnail:
        'https://cdn.shopify.com/s/files/1/0024/5084/9907/products/Bremont_S2000_Yellow_front_1200x2013.png?v=1602948953',
      url: 'https://www.bremont.com/products/s2000-yellow',
      spec:
        [{
          key: 'Movement',
          value:
            'Modified calibre 11 ½’’’ BE-36AE automatic chronometer, 25 jewels, glucydur balance. Anachron balance spring, Nivaflex 1 mainspring, 28,800 bph, 38-hour power reserve, Bremont decorated rotor.'
        },
        {
          key: 'Functions',
          value: 'Hour/minute/seconds with date at 3H.'
        },
        {
          key: 'Case',
          value:
            'Stainless steel Bremont Trip-Tick® case construction with scratch resistant DLC treated case barrel. Inner soft iron anti-magnetic Faraday cage to protect movement. Protective anti-shock movement mount. Curved Sapphire uni-directional rotating bezel with X1 Grade Super-LumiNova® luminous coating. Case diameter 45mm. Overall height 18mm. Strap lug width 22mm.'
        },
        {
          key: 'Case Back',
          value: 'Stainless steel screw-in and decorated case back.'
        },
        {
          key: 'Dial and Hands',
          value:
            'Black painted dial with knurling effect and applied indexes. X1 Grade Super-LumiNova® filled indexes and hands.'
        },
        {
          key: 'Crystal',
          value: 'Domed anti-reflective, scratch resistant sapphire crystal.'
        },
        {
          key: 'Water Resistance',
          value: 'Water resistant to 200 ATM, 2000 metres.'
        },
        { key: 'Strap', value: '22mm integrated rubber strap.' },
        {
          key: 'Ratings and Certification',
          value: 'Chronometer rated to ISO 3159 standard.'
        }],
      related: [],
      gender: 'M',
      description:
        ' Since inception, the Bremont Supermarine range has had a distinctive look and feel. The robust diver’s timepiece features a larger case size at 45mm. Bremont developed the more technical S2000 enabling it to withstand further depths and making it the deepest diving watch within the entire collection. The new S2000 designs feature an updated sapphire uni-directional rotating bezel with 20-minute red marker, which ties in the red tip at the end of the minute hand. The knurled effect on the dial’s centre teamed with clean and crisp linear markings on the bezel and inner dial ring offer a fresh look. Turning the timepiece over reveals its updated case back design showcasing a stamped submarine screw. BE-36AE automatic chronometer with 38-hour power reserve 45mm stainless steel Trip-Tick® case construction with Anti-Shock and Faraday Cage Water resistant to 200 ATM, 2000 metres Integrated rubber strap ',
      strategy: 'bremont',
    }
  };
  const dd = await distill(d);

})();