const client = require('axios');
const cheerio = require('cheerio');

const indexing = async (context) => {
  try {
    const { entry, base } = context;
    const result = { collections: [], items: {} };
    const cats = [];
    const $ = cheerio.load((await client.get(entry)).data);
    $('.nav__item.underline.parent ').each((idx, el) => {
      const word = $(el).find('a img').attr('alt');
      const url = base + $(el).find('a').attr('href');
      if (word && idx > 0) {
        const name = word.replace('>', '').trim();
        cats.push({ name, url });
        result.collections.push(name);
        result.items[name] = [];
      }
    });
    for (const cat of cats) {
      const $$ = cheerio.load((await client.get(cat.url)).data);
      $$('.watch.notext.pure-u-1.pure-u-sm-1-2 ').each((idx, el) => {
        const url = base + $$(el).attr('href');
        const thumbnail = $$(el).find('.centered-img img').attr('data-srcset').split(' ')[0];
        const name = $$(el).find('.centered-img img').attr('alt');
        const reference = name.split(' ').pop();
        result.items[cat.name].push({
          source: 'official',
          url,
          thumbnail,
          collection: cat.name,
          lang,
          name,
          reference
        });
      });
      return result;
    }
    return result;
  } catch (error) {
    console.log('Failed for indexing class of Rado' +
      ' with error : ' + error
    )
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
    };
    const $ = cheerio.load((await client.get(entry)).data);
    result.name = $('.swp-hero__title.swp-hero__title--desktop.htitle').text().trim().replace(/(?:\r\n|\r|\n|\s+)/g, " ");
    result.description = $('.swp-hero__text p').text().trim().replace(/(?:\r\n|\r|\n|\s+)/g, " ");
    result.retail = $('.price').text().trim().replace(/(?:\r\n|\r|\n|\s+)/g, " ");
    result.reference = $('.dash.dash--standard-size.swp-specifications__watch-codes').text().trim().replace(/(?:\r\n|\r|\n|\s+)/g, " ");
    result.gender = 'X';
    $('.swp-slider .wrapper ul div div div li a ').each((idx, el) => {
      const related = $(el).find(' div .watch-block__price').text().trim().replace(/(?:\r\n|\r|\n|\s+)/g, " ");
      result.related.push(related);
    });
    $('.swp-hero__specs-item ').each((idx, el) => {
      const key = $(el).text().split(':')[0].replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
      const value = $(el).text().split(':')[1].replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
      result.spec.push({ key, value });
    });
    $('.swp-specifications__specs-item ').each((idx, el) => {
      const key = $(el).find('strong').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
      const value = $(el).find('span').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
      result.spec.push({ key, value });
    });
    return result;
  } catch (error) {
    console.log('Failed for extraction class of Rado' +
      ' with error : ' + error
    )
    return [];
  }
};

(async () => {
  const context = {
    entry: "https://www.rado.com",
    base: "https://www.rado.com",
  };
  const r = await indexing(context);
  console.log(r)
  if (r && r.items && r.collections) {
    const context = r.items[r.collections[0]][0];
    // const context = {
    //   url: 
    //   base: 
    // }
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
