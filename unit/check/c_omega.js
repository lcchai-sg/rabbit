const client = require('axios');
const cheerio = require('cheerio');

const indexing = async (context) => {
  try {
    const { entry, base } = context;
    const result = { collections: [], items: {} };
    const PageCount = 24;
    const cats = [];
    const urls = [];
    let id = 0;
    const $ = cheerio.load((await client.get(entry)).data);
    $('main .pm-collection').each((idx, el) => {
      const name = $(el).find('h2 title').text();
      const url = $(el).find('p a.action').attr('href');
      cats.push({ id, name, url });
    });
    for (const cat of cats) {
      const subCats = [];
      const $$ = cheerio.load((await client.get(cat.url)).data);
      $$('main .pm-collection').each((idx, el) => {
        const name = $$(el).find('h2.pm-title').text().trim();
        let url = $$(el).find('p a.action').attr('href');
        if (url.endsWith('product')) url = url.replace('product', 'catalog');
        subCats.push({ name, url });
        result.items[name] = [];
        result.collections.push({ collection: cat.name, subCollection: name });
      });
      if (subCats.length > 0) {
        for (const subCat of subCats) {
          const $$$ = cheerio.load((await client.get(subCat.url)).data);
          const count = parseInt($$$('span#cat_number').attr('data-counter'));
          let i = 0;
          const _$ = (i === 0) ? $$$ : cheerio.load((await client.get(subCat.url + '?p=' + (i + 1))).data);
          _$('li.item.product.product-item.product-item-watch').each((idx, el) => {
            const href = _$(el).find('a.product-item-link').attr('href');
            const thumbnail = _$(el).find('img.photo.image').attr('src');
            let reference = _$(el).find('img.photo.image').attr('alt');
            if (reference) {
              reference = reference.substr(reference.lastIndexOf('SKU') + 3).trim();
            }
            const name = _$(el).find('.product.name.product-item-name').text().trim();
            const material = _$(el).find('.product.material').text().trim();
            const retail = _$(el).find('.price-box .price-wrapper .price').text().trim();
            if (urls.indexOf(href) === -1) {
              urls.push(href);
            }
            result.items[subCat.name].push({
              url: href,
              thumbnail,
              collection: cat.name,
              subCollection: subCat.name,
              name,
              reference,
              material,
              retail
            });
          })
          return result;
        }
      } else {
        result.items[cat.name] = [];
        result.collections.push({ collection: cat.name, subCollection: cat.name });
        let page = 0;
        const _$ = (page === 0) ? $$ : cheerio.load((await client.get(cat.url + '?p=' + (page))).data);
        _$('li.item.product.product-item.product-item-watch').each((idx, el) => {
          const href = _$(el).find('a.product-item-link').attr('href');
          const thumbnail = _$(el).find('img.photo.image').attr('src');
          let reference = _$(el).find('img.photo.image').attr('alt');
          if (reference) {
            reference = reference.substr(reference.lastIndexOf('SKU') + 3).trim();
          }
          const name = _$(el).find('.product.name.product-item-name').text().trim();
          const material = _$(el).find('.product.material').text().trim();
          const retail = _$(el).find('.price-box .price-wrapper .price').text().trim();
          if (urls.indexOf(href) === -1) {
            urls.push(href);
          }
          result.items[cat.name].push({
            url: href,
            thumbnail,
            collection: cat.name,
            name,
            reference,
            material,
            retail
          });
        });
      }
      return result
    }
    return result;
  } catch (error) {
    console.log('Failed for indexing class of Omega' +
      ' with error : ' + error
    )
    return [];
  }
};

const extraction = async (context) => {
  try {
    const { url: entry, base, retail } = context;
    const result = {
      url: entry,
      scripts: [],
      spec: [],
      related: []
    };
    const $ = cheerio.load((await client.get(entry)).data);
    const name = $('.product.attribute.name').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    const reference = $('.product-info-sku').text().trim();
    const description = $('.description-wrapper').text().trim().replace(/(?:\r\n|\r|\n|\s+)/g, " ");
    result.name = name;
    result.reference = reference;
    result.description = description;
    result.gender = 'M';
    result.collection = entry.split('-omega-')[1].split('-')[0];
    $('.pm-feature-tooltip a').each((idx, el) => {
      const key = 'Features';
      const value = $(el).text().trim().replace(/(?:\r\n|\r|\n|\s+)/g, " ");
      result.spec.push({ key, value });
    });
    $('.product-info-data-content.technical-data.watches li').each((idx, el) => {
      const key = $(el).find('strong').text().trim().replace(/(?:\r\n|\r|\n|\s+)/g, " ");
      const value = $(el).find('span').text().trim().replace(/(?:\r\n|\r|\n|\s+)/g, " ");
      result.spec.push({ key, value });
    });
    $('.pm-grid-center.pm-module-37-title').each((idx, el) => {
      const key = 'Caliber';
      const value = $(el).find('h2').text().trim().replace(/(?:\r\n|\r|\n|\s+)/g, " ");
      result.spec.push({ key, value });
    });
    $('.pm-module-37-pictos li').each((idx, el) => {
      const value = $(el).find('span').text().trim().replace(/(?:\r\n|\r|\n|\s+)/g, " ");
      switch (lang) {
        case 'zh':
          if (value.match(/小时/i)) {
            const key = 'Power Reserve';
            result.spec.push({ key, value });
          }
          else {
            const key = 'Caliber Type';
            result.spec.push({ key, value });
          }
          break;
        case 'jp':
          if (value.match(/時間/i)) {
            const key = 'Power Reserve';
            result.spec.push({ key, value });
          }
          else {
            const key = 'Caliber Type';
            result.spec.push({ key, value });
          }
          break;
        case 'hk':
          if (value.match(/小時/i)) {
            const key = 'Power Reserve';
            result.spec.push({ key, value });
          }
          else {
            const key = 'Caliber Type';
            result.spec.push({ key, value });
          }
          break;
        case 'de':
          if (value.match(/stunden/i)) {
            const key = 'Power Reserve';
            result.spec.push({ key, value });
          }
          else {
            const key = 'Caliber Type';
            result.spec.push({ key, value });
          }
          break;
        default:
          if (value.match(/hours/i)) {
            const key = 'Power Reserve';
            result.spec.push({ key, value });
          }
          else {
            const key = 'Caliber Type';
            result.spec.push({ key, value });
          }
          break;
      }
    });
    result.retail = retail;
    return result;
  } catch (error) {
    console.log('Failed for extraction class of Omega' +
      ' with error : ' + error
    )
    return [];
  }
};

(async () => {
  const context = {
    entry: "https://www.omegawatches.com/en-us/watches",
    base: "https://www.omegawatches.com/",
  };
  const r = await indexing(context);
  console.log(r)
  if (r && r.items && r.collections) {
    const context = r.items[r.collections[0]['subCollection']][0];
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