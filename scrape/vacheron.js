const axios = require('axios');
const cheerio = require('cheerio');
const sitemapper = require('sitemapper')

const indexing = async (context) => {
  const source = "official";
  const lang = "en";
  const brand = "Vacheron Constantin"
  const brandID = 3;
  const { client, entry, base, } = context;
  const result = { source, lang, brand, brandID, collections: [], items: {} };
  const cats = [];
  try {
    // const $ = cheerio.load((await client.get(entry)).data);
    // $('.vac-colctrl').each((idx, el) => {
    //   const url = base + $(el).find('.vac-ctapush__content a').attr('href');
    //   const name = $(el).find('.vac-ctapush__title').text();
    //   result.collections.push(name);
    //   result.items[name] = [];
    //   cats.push({ name, url });
    // });
    // for (const cat of cats) {
    //   const $$ = cheerio.load((await client.get(cat.url)).data);
    //   $$('.cell.small-6.medium-4.large-3').each((idx, el) => {
    //     const url = base + $$(el).find('.vac-productpush.vac-productpush--vertical a').attr('href');
    //     const name = $$(el).find('.vac-productpush__title').text().trim() + ' ' + $$(el).find('.vac-productpush__specs').text().trim();
    //     const thumbnail = base + $$(el).find('.vac-productpush.vac-productpush--vertical a img').attr('data-src');
    //     const retail = $$(el).find('.vac-productpush__price').text().trim();
    //     let reference = $$(el).find('.vac-productpush.vac-productpush--vertical a').attr('data-tracking-product').trim();
    //     result.items[cat.name].push({
    //       source, lang, brand, brandID, url, collection: cat.name,
    //       name, reference, thumbnail, retail,
    //     });
    //   });
    // }

    const sitemap = new sitemapper({
      url: entry,
      timeout: 300000,
    });
    const d = await sitemap.fetch();
    d.sites.forEach(w => {
      const u = w.split('/');
      if (u.length === 7 && w.match(/\/watches\//i)) {
        const collection = u[5].toUpperCase();
        const nr = u[u.length - 1].replace('.html', '').toUpperCase().split('-');
        const reference = nr.length >= 3 ? nr.slice(nr.length - 3, nr.length).join('-') : nr.join('-');
        const name = nr.slice(0, nr.length - 3).join(' ');
        if (result.collections.indexOf(collection) < 0) {
          result.collections.push(collection);
          result.items[collection] = [];
        }
        result.items[collection].push({
          source, lang, brand, brandID, url: w, collection, name,
          reference, thumbnail: null, price: null,
        })
      }
    })
    return result;
  }
  catch (error) {
    console.log('Failed indexing for Vacheron Constantin with error : ' + error);
    return {};
  }
};


const extraction = async (context) => {
  const { client, entry, base, ...rest } = context;
  const result = { ...rest, url: entry, spec: [], variations: [] };
  try {
    const { data } = await client.get(entry);
    const pref = data.match(/product-ref="\w+"/ig);
    const $ = cheerio.load(data);
    result.thumbnail = base + $('.detail__picture').find('img').attr('data-src');
    result.reference = $(".detail__reference").text().replace("Reference: ", "").trim();
    result.name = $(".detail__title").text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim() + $(".detail__specs").text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    result.description = $(".detail__description").text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    if (pref) {
      //https://www.vacheron-constantin.com/en/watches/patrimony/patrimony-perpetual-calendar-ultra-thin-43175-000r-b343
      // /_jcr_content.ajax.price.US.VMX43R1476.json
      const pr = pref[0].match(/\w+/g)[2];
      const pLink = entry.replace('.html', '/_jcr_content.ajax.price.US.') + pr + '.json';
      const { data } = await client.get(pLink);
      result.price = data[pr].formattedPrice;
    }
    $(".rcms_productvariation").each((idx, el) => {
      result.variations.push($(el).attr("data-tracking-variation"));
    })
    $(".specifications__list").find("h4").each((idx, el) => {
      const cat = $(el).text();
      // console.log('cat >>>', cat)
      let bracelet = true; let buckle = false;
      if (!cat.match(/bar|meter/i)) {
        $(el).parent().parent().find('li').each((idx, el) => {
          let key = $(el).find("label").first().text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
          let value = $(el).find("p").last().text();

          if (value) {
            // if (cat === 'BRACELET') {
            //   if (key === 'Material') {
            //     if (bracelet) {
            //       result.spec.push({ cat, key, value });
            //       bracelet = false;
            //     }
            //   } else if (key === 'Size') {
            //     result.spec.push({ cat, key, value });
            //   }
            // } else if (cat === 'BUCKLE') {
            //   if (key === 'Material') {
            //     if (!buckle) buckle = true;
            //     else result.spec.push({ cat, key, value });
            //   } else if (key === 'Type') {
            //     result.spec.push({ cat, key, value });
            //   }
            // } else {
            //   if (key.match(/water-resist/i)) {
            //     key = key.split('  ')[0];
            //     value = value.match(/water/i) ? value : value + ' bar';
            //   }
            //   result.spec.push({ cat, key, value });
            // }

            if (key.match(/water-resist/i)) {
              key = key.split('  ')[0];
              value = value.match(/water/i) ? value : value + ' bar';
            }
            result.spec.push({ cat, key, value });
          }
        })
      }
    })

  } catch (error) {
    console.log('Failed extraction for Vacheron Constantin with error : ' + error);
    result.code = error.response.status;
  }
  return result;
};


(async () => {
  const r = await indexing({
    client: axios,
    // entry: "https://www.vacheron-constantin.com/en/all_collections.html",
    entry: "https://www.vacheron-constantin.com/en/sitemap.xml",
    brandID: 3,
    brand: "Vacheron Constantin",
    base: "https://www.vacheron-constantin.com",
  });
  // console.log(r);
  // r.collections.forEach(c => {
  //   console.log(`collection ${c}..........`);
  //   r.items[c].forEach(w => console.log(w));
  // })

  // const rr = [
  //   'https://www.vacheron-constantin.com/en/watches/patrimony/patrimony-minute-repeater-ultra-thin-collection-excellence-platine-30110-000p-b108.html',
  //   'https://www.vacheron-constantin.com/en/watches/traditionnelle/traditionnelle-grandes-complications-80172-000p-9589.html',
  //   'https://www.vacheron-constantin.com/en/watches/fiftysix/fiftysix-complete-calendar-4000e-000r-b065.html',
  //   'https://www.vacheron-constantin.com/en/watches/historiques/historiques-cornes-de-vache-1955-5000h-000p-b058.html',
  // ];

  // for (let i = 0; i < rr.length; i++) {
  //   const ex = await extraction({
  //     entry: rr[i],
  //     client: axios,
  //     brand: "Vacheron Constantin",
  //     brandID: 3,
  //     base: "https://www.vacheron-constantin.com",
  //   })
  //   console.log(ex);
  // }

  for (let i = 0; i < r.collections.length; i++) {
    const c = r.collections[i];
    for (let j = 0; j < r.items[c].length; j++) {
      const ex = await extraction({
        ...r.items[c][j],
        client: axios,
        entry: r.items[c][j]['url'],
      });
      // console.log(ex);
      console.log(ex.url)
      ex.spec.forEach(s => {
        console.log(s.cat + ' | ' + s.key + ' | ' + s.value);
      });
      console.log()
    }
  }
})();