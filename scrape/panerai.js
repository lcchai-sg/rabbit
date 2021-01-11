const axios = require('axios');
const cheerio = require('cheerio');

const indexing = async (context) => {
  const source = "official";
  const lang = "en";
  const brand = "Panerai";
  const brandID = 58;
  const { client, entry, base, } = context;
  const result = { source, lang, brand, brandID, collections: [], items: {} };
  const cats = [];
  try {
    const $ = cheerio.load((await client.get(entry)).data);
    $('.pan-nav-item-collection-menu .pan-nav-sub-items').find('a').each((idx, el) => {
      const url = base + $(el).attr('href');
      const name = $(el).text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
      if (url.match(/watch-collection/i)) {
        // exclude CLOCKS AND INSTRUMENTS
        result.collections.push(name);
        result.items[name] = [];
      }
      cats.push({ name, url });
    });

    for (const cat of cats) {
      // normal watch collections
      // json file for USD pricing
      if (cat.url.match(/watch-collection/i)) {
        const link = cat.url.replace('html', 'product-filter.US.json');
        console.log(link);
        const { data } = await client.get(link);
        data.forEach(w => {
          result.items[cat.name].push({
            source, lang, brand, brandID,
            url: base + w.productPageUrl.replace('content/pan/ww/global', 'us') + '.html',
            collection: w.productCollection,
            name: w.name,
            reference: w.reference,
            thumbnail: base + w.imagePath,
            price: w.formattedPrice,
          });
        })
      } else if (cat.url.match(/special-editions/i)) {
        // archived special editions
        // based on years, JSON file not much help
        const { data } = await client.get(cat.url);
        const $ = cheerio.load(data);
        const years = []
        $(".pan-carousel-item.pan-se-year-menu-item").each((idx, el) => {
          const url = base + $(el).find('a').attr('href');
          const name = cat.name + '-' + $(el).find('a').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
          years.push({ name, url });
        })
        for (const year of years) {
          console.log(year.url)
          const { data } = await client.get(year.url);
          const $ = cheerio.load(data);
          result.collections.push(year.name);
          result.items[year.name] = [];
          $('.pan-prod-ref-collection-item').each((idx, el) => {
            const url = base + $(el).find('a').attr('href');
            const thumbnail = base + $(el).find('img').attr('srcset');
            const name = $(el).find(".pan-prod-ref-name").text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
            const reference = $(el).find(".pan-prod-ref-code").text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
            result.items[year.name].push({
              source, lang, brand, brandID, url, collection: year.name,
              name, reference, thumbnail, price: null,
            })
          })
        }
      }
    }
    return result;
  } catch (error) {
    console.log('Failed indexing for Panerai with error : ' + error);
    return {};
  }
};

// const index = async context => {
//   try {
//     const cats = [];
//     const { client, entry, base, } = context;
//     const { data } = await client.get(entry);
//     const $ = cheerio.load(data);
//     $('.pan-nav-item-collection-menu .pan-nav-sub-items').find('a').each((idx, el) => {
//       const href = base + $(el).attr('href');
//       const name = $(el).text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
//       console.log({ name, href })
//     })
//   } catch (error) {
//     console.log(error)
//   }
// }

const extraction = async (context) => {
  const { client, entry, ...rest } = context;
  const result = { ...rest, url: entry, spec: [], related: [], features: [] };
  try {
    const $ = cheerio.load((await client.get(entry)).data);
    result.reference = $('.pan-ref-prod-id').text().trim();
    result.name = $('.pan-ref-detail-name').text().trim();
    if (entry.match(/watch-collection/)) result.collection = entry.split('/watch-collection/')[1].split('/')[0];
    else if (entry.match(/special-editions-archive/)) {
      const col = entry.split('/');
      result.collection = col[5].replace(new RegExp('-', 'g'), ' ').toUpperCase() + '-' + col[6];
    }
    result.gender = 'M';
    $('.pan-technical-spec-inner').each((idx, el) => {
      let key = '';
      let value = '';
      const keys = [];
      const values = [];
      $(el).find('h4').each((idx, el) => {
        key = $(el).text().trim().replace(/(?:\r\n|\r|\n|\s+)/g, " ");
        keys.push(key);
      });
      $(el).find('p').each((idx, el) => {
        value = $(el).text().trim().replace(/(?:\r\n|\r|\n|\s+)/g, " ");
        values.push(value);
      });
      keys.map((key, i) => {
        const value = values[i];
        result.spec.push({ key, value });
      });
    });
    $('.pan-product-carousel-wrapper').each((idx, el) => {
      let name = '';
      $(el).find('.pan-product-carousel-title').each((idx, el) => {
        name = $(el).text().trim().replace(/(?:\r\n|\r|\n|\s+)/g, " ");
        result.related.push(name);
      });
    });
  } catch (error) {
    console.log('Failed extraction for Panerai with error : ' + error);
    console.log('entry : ', entry);
    if (error.response) result.code = error.response.status;
    else result.code = 'UNKNOWN ERROR';
  }
  return result;
};


(async () => {
  // const r = await indexing({
  //   client: axios,
  //   // entry: "https://www.panerai.com/us/en",
  //   entry: "https://www.panerai.com/en/collections/watch-collection.html",
  //   brandID: 58,
  //   brand: "Panerai",
  //   base: "https://www.panerai.com",
  // });
  // const rr = await index({
  //   client: axios,
  //   // entry: "https://www.panerai.com/us/en",
  //   entry: "https://www.panerai.com/en/collections/watch-collection.html",
  //   brandID: 58,
  //   brand: "Panerai",
  //   base: "https://www.panerai.com",
  // });
  // console.log(r);
  // r.collections.forEach(c => {
  //   console.log(c)
  //   r.items[c].forEach(w => console.log(w));
  //   console.log('................................................')
  // })

  // const r = {
  //   source: "official",
  //   lang: "en",
  //   brand: "panerai",
  //   brandID: 58,
  //   collections: ['Submersible', 'Luminor', 'Luminor Due', 'Radiomir'],
  //   items: {
  //     'Submersible': [
  //       {
  //         source: 'official',
  //         lang: 'en',
  //         brand: 'Panerai',
  //         brandID: 58,
  //         url: 'https://www.panerai.com/us/en/collections/watch-collection/submersible/pam00683-submersible---42mm.html',
  //         collection: 'Submersible',
  //         name: 'Submersible - 42mm',
  //         reference: 'PAM00683',
  //         thumbnail: 'https://www.panerai.com/content/dam/rcq/pan/17/99/60/7/1799607.png',
  //         price: '$9,800.00'
  //       },
  //     ],
  //     'Luminor': [
  //       {
  //         source: 'official',
  //         lang: 'en',
  //         brand: 'Panerai',
  //         brandID: 58,
  //         url: 'https://www.panerai.com/us/en/collections/watch-collection/luminor/pam01316-luminor-marina--specchio-blu---44mm.html',
  //         collection: 'Luminor',
  //         name: 'Luminor Marina  Specchio Blu - 44mm',
  //         reference: 'PAM01316',
  //         thumbnail: 'https://www.panerai.com/content/dam/rcq/pan/20/33/17/9/2033179.png',
  //         price: '$8,500.00'
  //       },
  //     ],
  //     'Luminor Due': [
  //       {
  //         source: 'official',
  //         lang: 'en',
  //         brand: 'Panerai',
  //         brandID: 58,
  //         url: 'https://www.panerai.com/us/en/collections/watch-collection/luminor-due/pam00927-luminor-due---42mm.html',
  //         collection: 'Luminor Due',
  //         name: 'Luminor Due - 42mm',
  //         reference: 'PAM00927',
  //         thumbnail: 'https://www.panerai.com/content/dam/rcq/pan/18/14/39/5/1814395.png',
  //         price: '$7,200.00'
  //       },
  //     ],
  //     'Radiomir': [
  //       {
  //         source: 'official',
  //         lang: 'en',
  //         brand: 'Panerai',
  //         brandID: 58,
  //         url: 'https://www.panerai.com/us/en/collections/watch-collection/radiomir/pam01144-radiomir---42mm.html',
  //         collection: 'Radiomir',
  //         name: 'Radiomir - 42mm',
  //         reference: 'PAM01144',
  //         thumbnail: 'https://www.panerai.com/content/dam/rcq/pan/20/29/79/5/2029795.png',
  //         price: '$7,900.00'
  //       },
  //     ]
  //   }
  // };

  // for (let i = 0; i < r.collections.length; i++) {
  //   const c = r.collections[i];
  //   for (let j = 0; j < r.items[c].length; j++) {
  //     const ex = await extraction({
  //       ...r.items[c][j],
  //       client: axios,
  //       entry: r.items[c][j]['url'],
  //     });
  //     // console.log(ex);
  //     console.log(ex.url)
  //     ex.spec.forEach(s => {
  //       console.log(s.key + ' | ' + s.value);
  //     });
  //     console.log()
  //   }
  // }
  const ex = await extraction({
    client: axios,
    entry: "https://www.panerai.com/en/collections/special-editions-archive/2017/pam00725-luminor-1950-oracle-team-usa-3-days-chrono-flyback-auto.html",
    base: "https://www.panerai.com",
  })
  console.log(ex)
})();