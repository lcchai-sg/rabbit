const axios = require('axios');
require('dotenv').config();
const { Logger } = require('@cosmos/logger');
const { MessageStation } = require('@cosmos/utils');
const { GraphQLClient } = require('graphql-request');

const logger = Logger.getLogger('cs:appraise:scraper', 'debug');

(async function () {
  logger.info('Scraper for Appraise official price reference - begin');

  const station = await MessageStation.connect({
    host: process.env.MESSAGE_HOST,
    user: process.env.MESSAGE_USER,
    pass: process.env.MESSAGE_PASS,
    vhost: process.env.MESSAGE_VHOST
  });

  const scrapeResult = async () => {
    logger.info('Scrapping Data');
    const brandId = 58;
    const currencyId = 11;
    const type = 'OFFICIAL';
    const market = 'SGP';
    const price = 0;
    const tax = 0;
    const sourceId = 1;
    const urls = [
      "https://www.panerai.com/en/collections/watch-collection/submersible.product-filter.SG.json",
      "https://www.panerai.com/en/collections/watch-collection/luminor.product-filter.SG.json",
      "https://www.panerai.com/en/collections/watch-collection/luminor-due.product-filter.SG.json",
      "https://www.panerai.com/en/collections/watch-collection/radiomir.product-filter.SG.json"
    ];
    let result = [];
    
    try {
      for (const i in urls) {
        const json = (await axios.get(urls[i])).data;
        for (const j in json) {
          let reference = json[j]['reference'];
          let amount = json[j]['formattedPrice'].split('$')[1];
          amount = amount ? parseFloat(amount.replace(',','')) : 0;
          // let url = base + json[j]['productPageUrl'].split('/content/pan/ww/global')[1]+'.html';
          let productId = null;
          result.push({
            sourceId,
            type,
            market,
            brandId,
            // brand,
            // source,
            // lang,
            // collection,
            // name,
            reference,
            productId,
            currencyId,
            price,
            tax,
            amount,
            // url,
            // thumbnail,
          })
        } //for (const j)
      } //for (const i)
      return result;
    } catch (error) {
      console.log("***** scrape data error *****");
      console.log(error);
      logger.error(error);
      return result;
    }
  }

  // const client = await station.createQLClient({
  //   exchange: 'appraise',
  //   endpoint: 'graphql',
  //   route: 'graphql',
  //   queue: 'appraise/endpointLC'
  // });

  try {
    const client = new GraphQLClient("http://localhost:8400/v1/api")

    const results = await scrapeResult();
    for (let i=0; i<results.length; i++) {
      logger.trace('Scrape Data', results);
  
      // let result = await client.request({
      //   query: `mutation savePriceReference($input:PriceReferenceInput){savePriceReference(input: $input){id}}`,
      //   variables: {
      //     input: {
      //       sourceId: results[i].sourceId,
      //       type: results[i].type,
      //       market: results[i].market,
      //       brandId: results[i].brandId,
      //       reference: results[i].reference,
      //       productId: results[i].productId,
      //       currencyId: results[i].currencyId,
      //       price: results[i].price,
      //       tax: results[i].tax,
      //       amount: results[i].amount,
      //     }
      //   }
      // }, {state: {userId: 1101}});
      const query = `mutation savePriceReference($input:PriceReferenceInput) {
        savePriceReference(input: $input) {id} }`;
      const variables = { input: {
        sourceId: results[i].sourceId,
        type: results[i].type,
        market: results[i].market,
        brandId: results[i].brandId,
        reference: results[i].reference,
        currencyId: results[i].currencyId,
        price: results[i].price,
        tax: results[i].tax,
        amount: results[i].amount,
      } };
      let result = await client.request(query, variables);
      logger.debug('Result', result.savePriceReference);
    }
    logger.info('Scraper for Appraise official price reference - Completed');
    process.exit(0);
  } catch(error) {
    console.log("***** error *****")
    console.log(error);
    process.exit(1);
  }
})();
