const axios = require('axios');
const cheerio = require('cheerio');

const indexing = async context => {
  const { client, entry, base, } = context;
  const baseURL = base ? base : "https://www.seikowatches.com/jp-ja/special/products/en/";
  const source = "official";
  const lang = "en";
  const brand = "Seiko";
  const brandID = 72;
  const result = { source, lang, brand, brandID, collections: [], items: {}, };
  const cats = [
    {
      name: "Astron",
      url: "https://www.seikowatches.com/jp-ja/special/products/en/astron/",
      ent: "https://products.seikowatches.com/v1/products?brand=87&format=json&limit=1000&locale=jp-en&sort=-release",
    },
    {
      name: "Prospex",
      url: "https://www.seikowatches.com/jp-ja/special/products/en/prospex/",
      ent: "https://products.seikowatches.com/v1/products?brand=34&format=json&limit=1000&locale=jp-en&sort=-release",
    },
    {
      name: "Presage",
      url: "https://www.seikowatches.com/jp-ja/special/products/en/presage/",
      ent: "https://products.seikowatches.com/v1/products?brand=85&format=json&limit=1000&locale=jp-en&sort=-release",
    },
    {
      name: "Lukia",
      url: "https://www.seikowatches.com/jp-ja/special/products/en/lukia/",
      ent: "https://products.seikowatches.com/v1/products?brand=14&format=json&limit=1000&locale=jp-en&sort=-release",
    },
    {
      name: "Brightz",
      url: "https://www.seikowatches.com/jp-ja/special/products/en/bz/",
      ent: "https://products.seikowatches.com/v1/products?brand=2&format=json&limit=1000&locale=jp-en&sort=-release",
    },
    {
      name: "Dolce & Exceline",
      url: "https://www.seikowatches.com/jp-ja/special/products/en/de/",
      ent: "https://products.seikowatches.com/v1/products?brand=3&format=json&limit=1000&locale=jp-en&sort=-release",
    }
  ];
  try {
    for (const cat of cats) {
      result.collections.push(cat.name);
      result.items[cat.name] = [];
      const { data } = await axios.get(cat.ent);
      const d = data.results ? data.results : [];
      for (let i = 0; i < d.length; i++) {
        const reference = d[i].id;
        const price = d[i].price;
        const collection = cat.name;
        const name = collection + ' ' + reference;
        const thumbnail = d[i].main_image;
        const url = cat.url + reference;
        result.items[cat.name].push({
          source, lang, brand, brandID, url, name, reference, price, thumbnail,
        })
      }
    }
    return result;
  } catch (error) {
    console.error('Failed indexing for Seiko with error : ', error);
    console.error('entry : ', entry);
    return {}
  }
}

const extraction = async (context) => {
  const { client, entry, ...rest } = context;
  const result = { ...rest, url: entry, spec: [], variations: [], };
  const u = entry ? entry.split('/') : null;
  if (u && u.length === 7) {
    try {
      const { data } = await client.get(entry);
      const $ = cheerio.load(data);
      const title = $('meta[property="og:title"]').attr('content').split('|');
      result.name = title[1].trim() + ' ' + title[0].trim();
      result.reference = title[0].trim();
      result.collection = title[1].trim();
      result.thumbnail = $('meta[property="og:image"]').attr('content');
      result.price = $(".blk-ProductList_PriceTaxIn").first().text();
      $(".pr-Spec_Group").each((idx, el) => {
        const cat = $(el).find(".pr-Spec_HeadingLv1").text();
        if (cat === 'Other features') {
          console.log('other features..........')
          $(el).find("li").each((idx, el) => {
            const key = cat;
            const value = $(el).text();
            console.log('other features..........', value)
            result.spec.push({ cat, key, value });
          })
        } else {
          $(el).find(".pr-Spec_Item").each((idx, el) => {
            const key = $(el).find(".pr-Spec_HeadingLv2").text();
            if (key === 'Other specifications') {
              console.log('other specifications..........')
              $(el).find("li").each((idx, el) => {
                const value = $(el).text();
                console.log('other specifications..........', value)
                result.spec.push({ cat, key, value });
              })
            } else {
              const value = $(el).find(".pr-Spec_Text").text();
              result.spec.push({ cat, key, value })
            }
          })
        }
      })
      $(".blk-ProductList_Name").each((idx, el) => {
        result.variations.push($(el).text());
      })
    } catch (error) {
      console.error('Failed extraction for Seiko with error : ' + error);
      console.error('entry : ', entry)
      if (error.response) result.code = error.response.status;
      else result.code = 'UNKNOWN ERROR';
    }
  } else if (u.length === 9) {
    const attr = [
      //'limited', 
      'calibre_code', 'sex', 'limited_quantity', 'weight',
      'thickness', 'diameter', 'length', 'glass', 'glass_coating', 'diashield',
      'lumibright', 'battery', 'drive_duration', 'accuracy', 'drive', 'water_resist',
      'case_material', 'band_material', 'clasp_structure', 'other',
    ]
    //can use this as well instead of needing to get all watches & filter
    //https://products.seikowatches.com/v1/products?format=json&id=STXD009&locale=jp-en
    try {
      const link = "https://products.seikowatches.com/v1/products?format=json&locale=jp-en&id=" + u[8];
      console.debug(link);
      const { data } = await client.get(link);
      const d = data.results ? data.results : [];
      if (d.length > 0) {
        result.reference = d[0].id;
        result.thumbnail = d[0].main_image;
        result.collection = d[0].brand;
        result.price = 'JPY' + d[0].price.split('.')[0];
        result.gender = d[0].sex && d[0].sex === "Ladies'" ? 'F' : 'M';
        Object.keys(d[0]).forEach(key => {
          if (attr.indexOf(key) >= 0 && d[0][key]) {
            if (Array.isArray(d[0][key])) {
              d[0][key].forEach(value => {
                result.spec.push({ key, value })
              })
            } else {
              result.spec.push({ key, value: d[0][key] });
            }
          }
        })
      }
    } catch (error) {
      console.error('Failed extraction for Seiko with error : ' + error);
      console.error('entry : ', entry)
      if (error.response) result.code = error.response.status;
      else result.code = 'UNKNOWN ERROR';
    }
  } else {
    result.code = 'Incorrect Format';
  }
  return result;
};

const extraction1 = async (context) => {
  const { client, entry, ...rest } = context;
  const result = { ...rest, url: entry, spec: [], variations: [], };
  try {
    const { data } = await client.get(entry);
    const $ = cheerio.load(data);
    const title = $('meta[property="og:title"]').attr('content').split('|');
    result.name = title[1].trim() + ' ' + title[0].trim();
    result.reference = title[0].trim();
    result.collection = title[1].trim();
    result.thumbnail = $('meta[property="og:image"]').attr('content');
    result.price = $(".blk-ProductList_PriceTaxIn").first().text();
    $(".pr-Spec_Group").each((idx, el) => {
      const cat = $(el).find(".pr-Spec_HeadingLv1").text();
      $(el).find(".pr-Spec_Item").each((idx, el) => {
        const key = $(el).find(".pr-Spec_HeadingLv2").text();
        const value = $(el).find(".pr-Spec_Text").text();
        result.spec.push({ cat, key, value })
      })
    })
    $(".blk-ProductList_Name").each((idx, el) => {
      result.variations.push($(el).text());
    })
  } catch (error) {
    console.error('Failed extraction for Seiko with error : ' + error);
    console.error('entry : ', entry)
    if (error.response) result.code = error.response.status;
    else result.code = 'UNKNOWN ERROR';
  }
  return result;
};

(async () => {
  // const r = await indexing({
  //   client: axios,
  //   entry: "https://www.seikowatches.com/jp-ja/special/products/",
  //   base: "https://www.seikowatches.com/jp-ja/special/products/",
  // })

  // console.log(r)
  // r.collections.forEach(c => {
  //   r.items[c].forEach(w => console.log(w))
  // })
  const r = {
    source: 'official',
    lang: 'en',
    brand: 'Seiko',
    brandID: 72,
    collections: ['Astron'],
    items: {
      'Astron': [
        {
          source: 'official',
          lang: 'en',
          brand: 'Seiko',
          brandID: 72,
          url: 'https://www.seikowatches.com/jp-ja/special/products/en/astron/STXD009',
          name: 'Astron STXD009',
          reference: 'STXD009',
          price: '250000.0',
          thumbnail: 'https://products-api.seikowatches.com/images/STXD009/STXD009.PNG',
        },
        {
          source: 'official',
          lang: 'en',
          brand: 'Seiko',
          brandID: 72,
          url: 'https://www.seikowatches.com/ph-en/products/presage/SRPF41J1',
        }
      ]
    }
  };

  for (let i = 0; i < r.collections.length; i++) {
    const c = r.collections[i];
    console.log(c, r.items[c].length)
    for (let j = 0; j < r.items[c].length; j++) {
      console.log(r.items[c][j])
      const ex = await extraction({
        client: axios,
        entry: r.items[c][j].url,
        ...r.items[c][j],
      });
      console.log(ex);
    }
  }
  process.exit(0)
})();