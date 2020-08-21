const axios = require('axios');
const cheerio = require('cheerio');

(async () => {
  const base = "https://www.breguet.com";
  const entry = "https://www.breguet.com/en/timepieces";
  const source = "official";
  const brand = "Breguet";
  const brandID = 132;
  const lang = "en";

  let cats = [];
  const $ = cheerio.load((await axios.get(entry)).data);
  $('.views-row ').each((idx, el) => {
    const name = $(el).find('h2 a').text();
    const url = base + $(el).find('h2 a').attr('href');
    const amount = $(el).find('.watches-number').text().replace('models', '').trim();
    const page = Math.floor(parseInt(amount) / 12);

    if (name && url) {
      cats.push({ name, url, page });
    }
  });

  let results = [];
  for (const cat of cats) {
    for (let i=0; i<=cat.page; i++) {
      const link = cat.url + '?page=' + i;
      const $$ = cheerio.load((await axios.get(link)).data);
      $$('.item-list .views-row a').each((idx, el) => {
        const url = base + $$(el).attr('href');
        const thumbnail = base + $$(el).find('img').attr('src');
        const name = $$(el).find('h2').text();
        results.push({
          brandID,
          brand,
          source,
          lang,
          name,
          collection: cat.name,
          url,
          thumbnail,
          productID: null,
        });
      });
    }
  } // for

  for (let i=0; i<results.length; i++) {
    console.log(results[i].url);
    const $ = cheerio.load((await axios.get(results[i].url)).data);
    const reference = $('.show-price-button').attr('data-ref').trim().replace(/(?:\r\n|\r|\n|\s+)/g, " ");
    const ajaxData = 'https://www.breguet.com/en/ajax/price/' + reference;
    results[i].retail = (await axios.get(ajaxData)).data.replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    results[i].reference = reference;
    console.log(results[i].retail)
  }

  console.log(results)
  process.exit(0);
})();

/*
export const extraction = async (context) => {
try {
const { client, entry, lang, brand, brandID, base } = context;
const result: any = {
source: 'official',
url: entry,
brand,
brandID,
lang,
scripts: [],
spec: [],
related: []
};
const $ = cheerio.load((await client.get(entry)).data);
result.description = $('.field.field-name-field-description p').text().trim().replace(/(?:\r\n|\r|\n|\s+)/g, " ");
result.name = entry.split('/timepieces/')[1].split('/')[0] + ' ' + entry.split('/timepieces/')[1].split('/')[1];
result.reference = $('.infos-watch h2').text().trim().replace(/(?:\r\n|\r|\n|\s+)/g, " ");
result.collection = entry.split('/timepieces/')[1].split('/')[0].trim();
result.thumbnail = $('.pane-variante img').attr('src');

const id = $('.show-price-button').attr('data-ref').trim().replace(/(?:\r\n|\r|\n|\s+)/g, " ");
const ajaxData = 'https://www.breguet.com/en/ajax/price/' + id;
result.retail = (await axios.get(ajaxData)).data.replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();

$('.list-produits-associes a').each((idx, el) => {
const related = base + $(el).attr('href');
result.related.push(related);
});
$('.list-spec li').each((idx, el) => {
const key = $(el).find('label').text().trim();
const value = $(el).find('.value').text().trim();
result.spec.push({ key, value });
});
return result;
}
catch (error) {
const { brand, brandID, entry } = context;
console.log('Failed for extraction class of brandId : ' + brandID +
' ,brand : ' + brand +
' ,url : ' + entry +
' with error : ' + error
)
const result = [];
return result;
}
};

export const distill = async (context) => {
try {
const { payload } = context;
const { brand, brandID, reference, lang, source, collection, productID, pair, gender, related, url, spec, description, retail, ...other } = payload;
const result: any = {
brand,
brandID,
reference,
lang,
source,
collection,
productID,
pair,
gender,
description,
related,
url,
retail,
case: <any>{},
caliber: <any>{},
bezel: <any>{},
dial: <any>{},
band: <any>{},
additional: [],
...other
};
let restKey = [];
for (const s of spec) {
let pp = false;
const key = s.key.toLowerCase();
const value = s.value;
if (key === 'winding') {
pp = true;
result.caliber.type = value.trim();
}
if (key === 'power reserve (hours)') {
pp = true;
result.caliber.reserve = value.trim() + ' hours';
}
if (key === 'calibre') {
pp = true;
result.caliber.reference = value.trim();
}
if (key === 'jewels') {
pp = true;
result.caliber.jewels = value.trim();
}
if (key === 'frequency') {
pp = true;
result.caliber.frequency = value.trim();
}
if (key === 'number of components') {
pp = true;
result.caliber.components = value.trim();
}
if (key === 'metal') {
pp = true;
result.case.material = value.trim();
}
if (key === 'case shape') {
pp = true;
result.case.shape = value.trim();
}
if (key === 'sapphire caseback') {
pp = true;
if (value.match(/yes/i)) {
result.case.back = 'Sapphire'
}
}
if (key === 'case width (mm)') {
pp = true;
result.case.width = value.trim() + ' mm';
}
if (key === 'case thickness (mm)') {
pp = true;
result.case.thickness = value.trim() + ' mm';
}
if (key === 'water-resistant (m)') {
pp = true;
result.waterResistance = value.trim() + ' m';
}
result.caliber.brand = 'Breguet';
result.caliber.label = 'Swiss';
const data = [];
if (!pp) {
const key = s.key.replace(':', '').trim();
const value = s.value.trim()
data.push({ key, value })
}
for (const singleData of data) {
const temp = {};
temp[singleData.key] = singleData.value;
result.additional.push(temp);
}
}
if (restKey.length > 0) {
result.restKey = restKey;
}
return result;
}
catch (error) {
const { payload } = context;
const { brandID, brand, reference, url } = payload;
console.log('Failed for distillation class of brandId : ' + brandID +
' ,brand : ' + brand +
' ,reference : ' + reference +
' ,url : ' + url +
' with error : ' + error
)
const result = [];
return result;
}
};
*/