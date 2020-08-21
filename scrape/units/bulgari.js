const cheerio = require('cheerio');
const axios = require('axios');

const scrapeResult = async (market = 'SGP') => {
  const brandId = 32;
  const type = 'OFFICIAL';
  const price = 0;
  const tax = 0;
  const sourceId = 1;
  let currencyId;
  let results = [];

  let entry;

  switch (market) {
    case 'SGP':
      entry = "https://www.bulgari.com/en-sg/watches/?sz=1000";
      currencyId = 11;
      break;
    case 'HKG':
      entry = "https://www.bulgari.com/en-hk/watches/?sz=1000";
      currencyId = 1;
      break;
    case 'JPN':
      entry = "https://www.bulgari.com/ja-jp/%E3%82%A6%E3%82%A9%E3%83%83%E3%83%81/?sz=1000"; // jp
      currencyId = 7;
    case 'USA':
    default:
      entry = "https://www.bulgari.com/en-us/watches/?sz=1000";
      currencyId = 2;
      break;
  }
  try {
    const $ = cheerio.load((await axios.get(entry)).data);
    $('.productCardContainer').each((idx, el) => {
      let reference = $(el).attr('data-pid');
      let retail = $(el).find('.value').attr('content').replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
      results.push({
        sourceId,
        type,
        market,
        brandId,
        reference,
        currencyId,
        price,
        tax,
        amount: parseFloat(retail),
      });
    });
    return results;
  } catch (error) {
    console.log("Scraper for Appraise official price reference - ERROR");
    console.log(error);
    return [];
  }
}

module.exports = scrapeResult;