const client = require('axios');
const cheerio = require('cheerio');

const indexing = async (context) => {
  try {
    const { entry, base, } = context;
    const result = { collections: [], items: {} };
    const cats = [];
    const $ = cheerio.load((await client.get(entry)).data);
    $('.zth-menu .main-nav ul li:nth-child(1) .submenu li').each((idx, el) => {
      const href = $(el).find('a').attr('href');
      const name = $(el).text().trim();
      const url = href;
      result.collections.push(name);
      result.items[name] = [];
      cats.push({ name, url });
    });
    for (const cat of cats) {
      const $$ = cheerio.load((await client.get(cat.url)).data);
      $$('.block-variantes .swiper-wrapper .block-watch').each((idx, el) => {
        const href = $$(el).find('a').attr('href');
        const thumbnailImg = $$(el).find('img').attr('src');
        const name = $$(el).find('.watch-name').text().trim();
        const reference = $$(el).find('.watch-ref').text().trim();
        result.items[cat.name].push({
          source: 'official',
          url: href,
          thumbnail: thumbnailImg,
          name,
          reference,
        })
      })
      return result;
    }
    return result;
  } catch (error) {
    console.log('Failed indexing for Zenith with error : ' + error);
    return [];
  }
};

const extraction = async (context) => {
  try {
    const { url: entry, } = context;
    const result = {
      url: entry,
      scripts: [],
      spec: [],
      related: [],
      feature: []
    };
    const $ = cheerio.load((await client.get(entry)).data);
    result.reference = $('.section-product_resume .sku ').text().trim();
    result.description = $('.section-product_resume > p').text().trim().replace(/(?:\r\n|\r|\n|\s+)/g, " ");
    result.name = $('.section-product_resume h1').text().trim();
    result.collection = $(' .section-more-collection_header .title-icon h3').text().trim();
    result.gender = 'M';
    $('.specification ').each((idx, el) => {
      if (idx === 4) {
        const value = $(el).text().split('\n').map(x => x.trim());
        const filtered = value.filter(function (el) {
          return el != null && el != "";
        });
        result.feature = filtered;
      }
    });
    $('.section-numbers_content .swiper-container  .swiper ul li ').each((idx, el) => {
      const key = $(el).find('h5').text();
      const value = $(el).find('div .number').text() + $(el).find('div .bottom').text().trim();
      result.spec.push({ key, value });
    });
    $('.section-product_specifications div:nth-child(3) .specification ').each((idx, el) => {
      const key = $(el).find('.title').html();
      const value = $(el).html().replace(key, "").replace("<span class=\"title\"></span>", "").replace(/(?:\r\n|\r|\n|\s+)/g, " ").replace("&#xA0;", " ").trim();
      result.spec.push({ key, value });
    });
    $('.section-product_specifications div:nth-child(4) .specification').each((idx, el) => {
      const key = $(el).find('.title').html();
      const value = $(el).html().replace(key, "").replace("<span class=\"title\"></span>", "").replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
      result.spec.push({ key, value });
    });
    return result;
  } catch (error) {
    console.log('Failed extraction for Zenith with error : ' + error);
    return [];
  }
};

(async () => {
  const context = {
    entry:
      // "https://www.zenith-watches.com/en_en/",
      "https://www.zenith-watches.com/en_us/products/all",
    base: "https://www.zenith-watches.com",
  };
  const r = await indexing(context);
  console.log(r)
  if (r && r.items && r.collections) {
    const context =
    // r.items[r.collections[0]][0];
    {
      url: "https://www.zenith-watches.com/en_us/product/defy-el-primero-21-boutique-edition-49-9001-9004-78-r915",
      base: "https://www.zenith-watches.com",
    }
    const e = await extraction(context);
    console.log(e)
    if (e.spec && e.spec.length > 0) {
      console.log(e)
    } else {
      console.log('extraction failed...')
    }
  } else {
    console.log('indexing failed...')
  }
})();
