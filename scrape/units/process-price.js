const { Logger } = require('@cosmos/logger');
const { GraphQLClient } = require('graphql-request');
require('dotenv').config();

const logger = Logger.getLogger('cs:appraise:scraper', 'error');



const scrape = async (market, scraper) => {
  logger.info('Scraper for Appraise official price reference - begin');

  try {
    const client = new GraphQLClient("http://localhost:8400/v1/api");
    const scrapeResult = require('./' + scraper);

    const results = await scrapeResult(market);
    for (let i=0; i<results.length; i++) {
      logger.trace('Scrape Data', results);
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
    return results.length;
  } catch(error) {
    console.log(error);
    logger.error(error);
    return -1;
  }
}

module.exports = scrape;