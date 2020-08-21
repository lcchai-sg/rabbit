const client = require('axios');
const cheerio = require('cheerio');

const indexing = async (context) => {
  try {
    const { entry, base } = context;
    const result = { collections: [], items: {} };
    const cats = [
      {
        name: 'Men',
        url: 'https://us.louisvuitton.com/ajax/endeca/browse-frag/men/timepieces-jewelry/timepieces/_/N-1c6buoi?storeLang=eng-us&pageType=category&Nrpp=%7BrecordsPerPage%7D&showColor=true&No=',
        mainUrl: 'https://us.louisvuitton.com/eng-us/men/timepieces-jewelry/timepieces/_/N-1c6buoi',
        gender: 'M'
      },
      {
        name: 'Women',
        url: 'https://us.louisvuitton.com/ajax/endeca/browse-frag/women/timepieces/_/N-1wv8w4e?storeLang=eng-us&pageType=category&Nrpp=%7BrecordsPerPage%7D&showColor=true&No=',
        mainUrl: 'https://us.louisvuitton.com/eng-us/women/timepieces/_/N-1wv8w4e',
        gender: 'F'
      }
    ];
    for (const cat of cats) {
      result.collections.push(cat.name);
      result.items[cat.name] = [];
      // const link = cat.mainUrl;
      let current = 0;
      const link = cat.url + current;
      const $$ = cheerio.load((await client.get(link)).data);

      $$('ul.productsList li.productItem').each((idx, el) => {

        const sku = $$(el).find('a').attr('data-sku');

        if (sku.charAt(0) == "Q" || sku.charAt(0) == "q") {
          const url = base + $$(el).find('a').attr('href');
          const thumbnail = $$(el).find('picture source').attr('data-src').replace('{IMG_WIDTH}', '400').replace('{IMG_HEIGHT}', '400');
          const name = $$(el).find('.productName').text();
          const retail = $$(el).find('.productInfo span.productPrice span')['0']['attribs']['data-htmlcontent'];
          result.items[cat.name].push({
            url,
            thumbnail,
            collection: cat.name,
            name,
            gender: cat.gender,
            retail
          });
        }
      });
      return result;
    }
    return result;
  } catch (error) {
    console.log('Failed for indexing class of Louis Vuitton' +
      ' with error : ' + error
    )
    return [];
  }
};

const extraction = async (context) => {
  try {
    console.log('extraction context>', context)
    const { url: entry, base } = context;
    const result = {
      url: entry,
      scripts: [],
      spec: [],
      related: [],
    };

    const $ = cheerio.load((await client.get(entry)).data);
    const res = JSON.parse($("script[type='application/ld+json']")[0]["children"][0]["data"]);
    result.name = res["name"];
    result.sku = res["sku"];
    result.thumbnail = $("meta[property='og:image']").attr("content");
    result.description = $('#productDescription').text().trim();

    $('#text_productFeatures li').each((idx, el) => {
      result.spec.push({
        key: idx,
        value: $(el).text()
      });
    });

    return result;
  } catch (error) {
    console.log('Failed for extraction class of Louis Vuitton ' +
      ' with error : ' + error
    )
    return [];
  }
};

(async () => {
  const context = {
    entry: "",
    base: "https://us.louisvuitton.com",
  };
  const r = await indexing(context);
  console.log(r)
  if (r && r.items && r.collections) {
    const context = r.items[r.collections[0]][0];
    const e = await extraction(context);
    if (e.spec && e.spec.length > 0) {
      console.log(e)
    } else {
      console.log('extraction failed...')
    }
  } else {
    console.log('indexing failed...')
  }
})();