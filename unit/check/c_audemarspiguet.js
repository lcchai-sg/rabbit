const axios = require('axios');
const cheerio = require('cheerio');

const codes = {
  "ba": "18-carat Yellow Gold",
  "bc": "18-carat White Gold",
  "ca": "Black Rubber",
  "ce": "Black Ceramic",
  "ch": "Chronograph",
  "cl": "Classique",
  "co": "CODE 11.59 by Audemars Piguet",
  "cu": "Alligator strap",
  "d": "Diamond",
  "da": "Day Date",
  "du": "Dual Time",
  "e": "Emeralds",
  "eq": "Equation of Time",
  "fs": "Forged Carbon",
  "gr": "Ggrande Complication",
  "ha": "Hand-Wound",
  "hj": "Haute Joaillerie",
  "ju": "Jules Audemars",
  "ke": "Aramide fibers",
  "lt": "Laptimer",
  "ma": "Minute Repeater With Audemars Piguet Escapement",
  "mi": "Minute Repeater",
  "mo": "Moon Phases",
  "o": "Onyx",
  "or": "18-carat Pink Gold",
  "pe": "Perpetual Calendar",
  "pl": "950 Platinum",
  "qu": "Quartz",
  "rc": "Royal Oak Concept",
  "re": "[RE]Master01",
  "ro": "Royal Oak",
  "ry": "Royal Oak Offshore",
  "s": "Sapphires",
  "se": "Self Winding",
  "sm": "Small Seconds",
  "st": "Stainless Steel",
  "su": "Technological silk strap with diamond-set 18-carat white gold AP folding clasp",
  "ti": "Titanium",
  "to": "Tourbillon",
};

const indexing = async () => {
  try {
    const base = "https://www.audemarspiguet.com";
    const results = [];

    const jsonData = 'https://www.audemarspiguet.com/api/v1/watches/?lang=en';
    const json = (await axios.get(jsonData)).data;
    for (const i in json['data']) {
      result = {};
      result.description = json['data'][i]['alt']
      result.url = base + json['data'][i]['permalink'];
      result.thumbnail = base + json['data'][i]['assets']['standup_large'];
      const urlCollection = json['data'][i]['permalink'].split('/watch-collection/')[1].split('/')[0];
      result.collection = checkCollectionBaseUrl(urlCollection);
      result.id = json['data'][i]['id'];
      result.name = json['data'][i]['alt'].split(',')[0];
      result.reference = json['data'][i]['reference'];
      const tdata = json['data'][i]['facets'];

      for (let j = 0; j < tdata.length; j++) {
        const d = tdata[j]['values'].map(val => codes[val['code']] ? codes[val['code']] : val['code']);

        switch (tdata[j]['type']) {
          case 'case_width':
          case 'case_thickness':
            if (!result.case) result.case = {};
            result.case[tdata[j]['type'].split('_')[1]] = tdata[j]['values'][0]['code'] + ' mm';
            break;
          case 'case_material':
            if (!result.case) result.case = {};
            if (d.length > 0) result.case.materials = d;
            break;
          case 'water_depth':
            if (tdata[j]['values'][0]['code'] !== 0)
              result.waterResistance = tdata[j]['values'][0]['code'] + ' m';
            break;
          case 'gender':
            result.gender = (tdata[j]['values'][0]['code'] === 'is_male') ? 'M' : 'F';
            break;
          case 'bracelet_material':
            console.log('bracelet_material', d)
            if (d.length > 0) {
              if (!result.bracelet) result.bracelet = {};
              result.bracelet.materials = d;
            }
            break;
          case 'collection':
            if (d.length > 0) result.collection_code = d;
            break;
          case 'color':
          case 'complication':
          case 'mechanism':
          case 'stone_setting':
          case 'watch_grouping':
            if (d.length > 0) result[tdata[j]['type']] = d;
            break;
          default: break;
        }
      }
      results.push(result);
    }
    return results;
  } catch (error) {
    console.log('Failed for indexing class of Audemars Piguet : ' +
      ' with error : ' + error
    )
    return [];
  };
}

function checkCollectionBaseUrl(urlCollection) {
  let collection = "";
  const catalog = [
    {
      name: 'Code 11.59 by Audemars Piguet',
      url: 'code1159byap'
    },
    {
      name: 'Royal Oak',
      url: 'royal-oak'
    },
    {
      name: 'Royal Oak Offshore',
      url: 'royal-oak-offshore'
    },
    {
      name: 'Royal Oak Concept',
      url: 'royal-oak-concept'
    },
    {
      name: 'Millenary',
      url: 'millenary'
    },
    {
      name: 'Haute Joaillerie',
      url: 'haute-joaillerie'
    },
    {
      name: 'Jules Audemars',
      url: 'jules-audemars'
    },
    {
      name: 'Classique',
      url: 'classique'
    }
  ];

  for (const cat of catalog) {
    if (cat.url === urlCollection) {
      collection = cat.name
      return collection;
    }
  }
}

const extraction = async (context) => {
  try {
    const { url, reference } = context;
    const result = { ...context, spec: [] };
    const d = (await axios.get(url)).data;
    const $ = cheerio.load(d);
    // const refNumber = $('.watch-detail-header__reference-number').text().trim().replace(/(?:\r\n|\r|\n|\s+)/g, " ").replace('Ref. ', '').replace('#', '');
    // console.log('refNumber>', refNumber)
    const jsonData = 'https://www.audemarspiguet.com/api/v1/watchprice/?lang=en&reference=' + reference;
    const json = (await axios.get(jsonData)).data;
    result.retail = json['data'][7]['price']['formatted_price'].replace('&#36;', '$');
    result.description = $('.watch-detail-header__description-container .type-body-2').text().trim().replace(/(?:\r\n|\r|\n|\s+)/g, " ");
    // result.reference = refNumber;

    if (result.description.indexOf('woman') > -1) {
      result.gender = 'F';
    } else {
      result.gender = 'M';
    }
    $('.tech-specs__desktop-specs .tech-specs__specs-inner-wrap .tech-specs__spec').each((idx, el) => {
      const key = $(el).find('h5').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
      const value = $(el).find('p').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
      result.spec.push({ key, value });
    });
    $('.watch-carousel__carousel-slide a').each((idx, el) => {
      const ref = $(el).attr('href').split('/watch-collection/')[1].split('/')[1];
      result.related.push(ref);
    });
    return result;
  } catch (error) {
    console.log('Failed for extraction class of Audemars Piguet ' +
      ' with error : ' + error
    );
    return {};
  };
}

(async () => {
  const r = await indexing();
  r.forEach(val => console.log(val))
  if (r.length > 0) {
    const e = await extraction(r[0]);
    if (e && e.spec.length > 0) {
      //
    } else {
      console.log('extraction failed...');
    }
  } else {
    console.log('indexing failed...');
  }
})();