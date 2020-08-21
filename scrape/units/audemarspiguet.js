const axios = require('axios');

const scrapeResult = async (market = 'SGP') => {
  const jsonData = 'https://www.audemarspiguet.com/api/v1/watches/?lang=en';
  let json;

  const brandId = 18;
  const type = 'OFFICIAL';
  const price = 0;
  const tax = 0;
  const sourceId = 1;

  try {
    json = (await axios.get(jsonData))['data'];
    const currency = ['USD', 'JPY', 'CNY', 'HKD', 'SGD'];
    let results = [];

    for (const i in json['data']) {
      let reference = json['data'][i]['reference'];
      let state = [];
      const jsonPData = 'https://www.audemarspiguet.com/api/v1/watchprice/?lang=en&reference=' + reference;
      try {
        let jsonP = (await axios.get(jsonPData)).data.data;
        jsonP.some(data => {
          if (data.price && data.price.currency && currency.indexOf(data.price.currency)>= 0) {
            if (state.indexOf(data.price.currency) < 0) {
              state.push(data.price.currency);
              amount = parseFloat(data.price.amount);
              switch (data.price.currency) {
                case 'SGD':
                  currencyId = 11;
                  market = 'SGP';
                  break;
                case 'HKD':
                  currencyId = 1;
                  market = 'HKG';
                  break;
                case 'JPY':
                  currencyId = 7;
                  market = 'JPN';
                  break;
                case 'CNY':
                  currencyId = 20;
                  market = 'CHN';
                  break;
                case 'USD':
                default:
                  currencyId = 2;
                  market = 'USA';
                  break;
              }
              results.push({
                sourceId,
                type,
                market,
                brandId,
                reference,
                currencyId,
                price,
                tax,
                amount,
              });
              return (state.length === currency.length);
            } // if state
          } // if price
        }) // json some  
      } catch (error) {
        if (!(error.response.status === 403)) {
          console.log("*** error ***");
          console.log(jsonPData);
          console.log(error);
          return [];
        }    
      }
    } // for
    return results;
  } catch (error) {
    console.log("*** error ***");
    console.log(jsonData);
    console.log(error);
  }

  // scrape for 5 types of currency and market
  // const source = 'official';
  // const lang = 'en';
  // const brand = 'Audemars Piguet';
    
    // let url = base + json['data'][i]['permalink'];
    // let collection = json['data'][i]['permalink'].split('/watch-collection/')[1].split('/')[0];
    // let name = json['data'][i]['alt'];
    // let thumbnail = base + json['data'][i]['assets']['standup_flattened'];

    // await coll.findOneAndUpdate(
    //   { reference, lang, url, brandID },
    //   { $set: { productID: null, name, brand, source, collection, retail, thumbnail } },
    //   { upsert: true }
    // );
}

module.exports = scrapeResult;

