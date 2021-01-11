const axios = require('axios');
const cheerio = require('cheerio');

const indexing = async (context) => {
  const source = "official";
  const lang = "en";
  const brand = "Blancpain";
  const brandID = 52;
  const { client, entry, base, } = context;
  const result = { source, lang, brand, brandID, collections: [], items: {} };
  const collections = {}

  const getCollection = url => {
    let collection = "";
    Object.keys(collections).forEach(key => {
      if (url.match(new RegExp(key, 'i'))) {
        collection = collections[key];
      }
    })
    return collection;
  }

  try {
    const { data } = await client.get(entry);
    const $ = cheerio.load(data);
    $('.pf-card--background-image').each((idx, el) => {
      const collection = $(el).find(".pf-card__title.title").text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
      if (!collection.match(/cufflink/i)) {
        result.collections.push(collection);
        result.items[collection] = [];
        const url = $(el).find('a').attr('href');
        const name = (url) ? url.replace("/en/", "").replace("-collection", "") : null;
        if (name) collections[name] = collection;
        else {
          const img = $(el).attr('style').split('/');
          const name = img[img.length - 1].replace(".jpg)", "");
          collections[name] = collection;
        }
      }
    })
    $('.pf-card--2-cols').each((idx, el) => {
      const url = base + $(el).find(".col-6.pf-card__col").find('a').attr('href');
      const thumbnail = base + $(el).find('img').attr('src');
      const title = $(el).find(".pf-card__title.title").text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
      const subtitle = $(el).find(".pf-card__subtitle").text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
      const name = title + ' ' + subtitle;
      const reference = $(el).find(".text-center").text();
      const collection = getCollection(url);
      if (collection)
        result.items[collection].push({
          url, collection, name, reference, thumbnail,
        });
    });
    // variants
    $(".col-lg-4.col-6").each((idx, el) => {
      const url = base + $(el).find('a').attr('href');
      const thumbnail = base + $(el).find('img').attr('src');
      const reference = $(el).find(".text-center").find("a").text();
      const names = $(el).find(".text-center").first().text();
      const name = names.replace(new RegExp(reference), " ");
      const collection = getCollection(url);
      if (collection)
        result.items[collection].push({
          url, collection, name, reference, thumbnail,
        })
    });
    return result;
  } catch (error) {
    console.error('Failed indexing for Blancpain with error : ' + error);
    return {};
  }
};

const extraction = async (context) => {
  const { client, entry, ...rest } = context;
  const base = 'https://www.blancpain.com';
  const result = { ...rest, url: entry, spec: [], related: [], };

  const getSpec = ($, el, key, value) => {
    const keys = []; const values = [];
    $(el).find(key).each((idx, el) => {
      keys.push($(el).text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim());
    })
    $(el).find(value).each((idx, el) => {
      values.push($(el).text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim());
    })
    values.forEach((value, i) => {
      result.spec.push({ key: keys[i], value });
    })
  }

  try {
    const $ = cheerio.load((await client.get(entry)).data);
    const bc = $(".product-page__breadcrumbs.pt-2").text().split("|");
    result.collection = bc[0].replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    result.name = $(".subtitle").text().trim();
    result.reference = bc[1].replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    result.thumbnail = $(".product-page__image-front").find("img").attr('src');
    getSpec($, ".product-page__table", "th", "td");
    getSpec($, "#case-dropdown", ".text-bold", ".mb-2");
    getSpec($, "#strap-dropdown", ".text-bold", ".mb-2");
    getSpec($, "#complications-dropdown", ".text-bold", ".mb-2");
    getSpec($, ".product-page__dual-attribute-container.product-page__dual-attribute-container--light", "title", ".text-bold");
  } catch (error) {
    console.error('Failed extraction for Blancpain with error : ' + error);
    console.error('entry : ', entry)
    result.code = error.response.status;
  }
  return result;
};

const distill = async (context) => {
  try {
    const { spec, ...rest } = context;
    const result = {
      ...rest, functions: [], features: [],
      case: {}, caliber: {}, bezel: {},
      dial: {}, band: {}, additional: [],
    };

    for (const s of spec) {
      let pp = false;
      const key = s.key.replace(":", "").toLowerCase();
      const value = s.value.trim();
      if (key === 'winding') {
        pp = true;
        const r = Mappers.getCaliberType.map(value);
        result.caliber.type = r ? r : value;
        result.movementType = result.caliber.type;
      }
      if (key === 'gender') {
        pp = true;
        result.gender = Mappers.getGender.map(value);
      }
      if (key === 'collection') {
        pp = true;
        result.collection = value;
      }
      if (key === 'caliber') {
        pp = true;
        result.caliber.reference = value;
        result.caliber.label = 'Swiss Made';
        result.caliber.brand = 'Blancpain';
      }
      if (key === 'price') {
        pp = true;
        result.price = value;
      }
      if (key === 'case material') {
        pp = true;
        const { bm, bms, } = Mappers.getMaterial.map(value);
        result.case.material = bm ? bm : value;
        result.case.materials = bm ? bms : [value];
      }
      if (key === 'case diameter') {
        pp = true;
        result.case.diameter = value;
      }
      if (key === 'case thickness') {
        pp = true;
        result.case.thickness = value;
      }
      if (key === 'water resistance') {
        pp = true;
        result.case.waterResistance = value;
        result.waterResistance = Mappers.getWaterResistance.map(value);
      }
      if (key === 'width between horns') {
        pp = true;
        result.case.lugWidth = value;
      }
      if (key === 'specificities') {
        pp = true;
        result.features.push(value.replace("Specificities  ", ""));
      }
      if (key === 'strap type' || key === 'strap material') {
        pp = true;
        if (!result.band.materials) result.band.materials = [];
        const { bm, bms, bt, } = Mappers.getMaterial.map(value);
        if (bm) {
          result.band.type = bt;
          result.band.material = result.band.material ? result.band.material : bm;
          bms.forEach(val => {
            if (result.band.materials.indexOf(val) < 0)
              result.band.materials.push(val);
          })
        } else {
          result.band.material = result.band.material ? result.band.material : value;
          if (result.band.materials.indexOf(value) < 0)
            result.band.materials.push(value);
        }
        const c = Mappers.getColor.map(value);
        if (c) result.band.color = c;
      }
      if (key === 'strap clasp') {
        pp = true;
        const r = Mappers.getBuckle.map(value);
        result.band.buckle = r ? r : value;
      }
      if (key === 'caliber-diameter') {
        pp = true;
        result.caliber.diameter = value;
      }
      if (key === 'caliber-thickness') {
        pp = true;
        result.caliber.thickness = value;
      }
      if (key === 'caliber-power-reserve') {
        pp = true;
        result.caliber.reserve = value;
      }
      if (key === 'caliber-jewels') {
        pp = true;
        result.caliber.jewels = value;
      }
      if (key === 'caliber-components') {
        pp = true;
        result.caliber.components = value;
      }
      if (key === 'caliber-frequency') {
        pp = true;
        result.caliber.frequency = value;
      }
      if (!pp) result.additional.push({ [key]: value });
    }
    return result;
  } catch (error) {
    console.log('Failed distillation for Blancpain with error : ' + error);
    return {};
  }
};

(async () => {
  const r = await indexing({
    client: axios,
    entry: "https://www.blancpain.com/en/product-finder",
    base: "https://www.blancpain.com",
  });
  let cnt = 0;
  r.collections.forEach(c => {
    r.items[c].forEach(w => console.log(w));
  })
  r.collections.forEach(c => {
    console.log('collection... ', c, r.items[c].length);
    cnt += r.items[c].length;
  })
  console.log()
  console.log(cnt)
  // const r = [
  //   {
  //     url: 'https://www.blancpain.com/en/villeret/carrousel-repetition-minutes-0233-6232a-55b',
  //     collection: 'Villeret',
  //     name: 'Carrousel Répétition Minutes',
  //     reference: '0233 6232A 55B',
  //     thumbnail: 'https://www.blancpain.com/sites/default/files/styles/product_finder_watch/public/images/2019-04/0233-6232a-55_front_copie.png?itok=J50OH9HV'
  //   }
  // ];

  // for (let i = 0; i < r.collections.length; i++) {
  //   const c = r.collections[i];
  //   for (let j = 0; j < r.items[c].length; j++) {
  //     const ex = await extraction({
  //       client: axios,
  //       entry: r.items[c][j].url,
  //       base: "https://www.blancpain.com",
  //       ...r.items[c][j]
  //     });
  //     console.log(ex.url)
  //     console.log()
  //     ex.spec.forEach(s => console.log(s.key + ' | ' + s.value))
  //     console.log()
  //     console.log('--------------------------------------------------')
  //   }
  // }
  // const ex = await extraction({
  //   client: axios,
  //   entry: r[0].url,
  //   base: "https://www.blancpain.com",
  //   ...r[0],
  // });
  // console.log(ex)
})();