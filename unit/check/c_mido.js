const client = require('axios');
const cheerio = require('cheerio');

function extractItems() {
  const extractedElements = document.querySelectorAll('.col-12.col-md-6.col-lg-4.my-2.my-lg-4 .reference a');
  const items = [];
  const temp = [];
  for (let element of extractedElements) {
    const base = 'https://www.midowatches.com';
    const url = base + element.getAttribute('href').toString().replace('javascript:;', '').trim();
    temp.push(url);
  }
  for (let i = 0; i in temp; i++) {
    if (i % 2 !== 0) {
      items.push(temp[i]);
    }
  }
  return items;
}

async function scrapeInfiniteScrollItems(page, extractItems, itemTargetCount, scrollDelay = 1000) {
  let items = [];
  try {
    let previousHeight;
    while (items.length < itemTargetCount) {
      items = await page.evaluate(extractItems);
      previousHeight = await page.evaluate('document.body.scrollHeight');
      await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
      await page.waitForFunction(`document.body.scrollHeight > ${previousHeight}`);
      await page.waitFor(scrollDelay);
    }
  } catch (e) { }
  return items;
}

const indexing = async (context) => {
  try {
    const { entry, base } = context;
    const result = { collections: [], items: {} };
    const cats = [];
    const $ = cheerio.load((await client.get(entry)).data);
    $('.slick__slide.slide  ').each((idx, el) => {
      const name = $(el).find('.field-content').text();
      const url = $(el).find('a').attr('href');
      if (name) {
        result.collections.push(name);
        result.items[name] = [];
        cats.push({ name, url })
      }
    });
    for (const cat of cats) {
      const page = cheerio.load((await client.get(cat.url)).data);
      const items = await scrapeInfiniteScrollItems(page, extractItems, 10000);
      for (let i = 0; i in items; i++) {
        result.items[cat.name].push({
          url: items[i],
          source: 'official',
          collection: cat.name
        })
      }
      return result;
    }
    return result;
  } catch (error) {
    console.log('Failed for indexing class of Mido' +
      ' with error : ' + error
    )
    return [];
  }
};

const extraction = async (context) => {
  try {
    const { url: entry, base } = context;
    const result = {
      url: entry,
      spec: [],
      related: [],
      caliber: {},
    };
    const $ = cheerio.load((await client.get(entry)).data);
    result.name = $('.page-title').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    result.reference = result.name.split(' ').pop();
    result.retail = $('.reference-price .h4').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    result.description = $('.col-12.col-md-10.col-lg-8.offset-md-1.offset-lg-2.my-lg-2.text-justify p').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    result.thumbnail = base + ($('.field--name-field-reference-top-image img').attr('src') ? $('.field--name-field-reference-top-image img').attr('src') : $('.col-12.col-md-6 .slider.watches-slider img').attr('src'));
    result.caliber.reference = $('.taxonomy-term.vocabulary-caliber-movement .field.field--name-name.field--type-string ').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    $('.reference-price .h4').each((idx, el) => {
      if (idx === 0) {
        result.retail = $(el).text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
      }
    });
    $('.col-12.col-md-6.col-lg-3.technical-details-items ul li').each((idx, el) => {
      const key = $(el).find('.field--label').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
      const value = $(el).find('.field--item').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
      if (key || value) {
        result.spec.push({ key, value });
      }
    });
    $('.image-caption').each((idx, el) => {
      const ref = $(el).text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim().split(' ').pop();
      result.related.push(ref);
    });
    return result;
  } catch (error) {
    console.log('Failed for extraction class of Mido' +
      ' with error : ' + error
    )
    return [];
  }
};

(async () => {
  const context = {
    entry: "https://www.midowatches.com/us/swiss-watches-collections",
    base: "https://www.midowatches.com",
  };
  const r = await indexing(context);
  console.log(r)
  if (r && r.items && r.collections) {
    // const context = r.items[r.collections[0]][0];
    const context = {
      url: "https://www.midowatches.com/us/swiss-watches-collections/sport-watch-ocean-star/ocean-star-decompression-timer-1961-limited-edition-m0268071105100",
      base: "https://www.midowatches.com",
    }
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