// TODO At this case the dotenv config must the first line of code here
require('dotenv').config();
const { Logger } = require('@cosmos/logger');
const logger = Logger.getLogger('cs:appr:scrapper', 'debug');
const axios = require('axios');
const { Subject } = require('rxjs');
const { map, mergeMap } = require('rxjs/operators');
const { MessageStation } = require('@cosmos/utils');

const scrape = async (context) => {
  const { market, scraper } = context;
  logger.info('Scraper for official price reference');

  try {
    const scrapeResult = require('./' + scraper);
    const results = await scrapeResult(market);
    return results;
  } catch (error) {
    logger.error('Scrapper error');
    logger.error(error);
    return [];
  }
};

(async function () {
  logger.info('Scraper Official Price');
  const mqHost = process.env.MESSAGE_HOST;
  const mqUser = process.env.MESSAGE_USER;
  const mqPass = process.env.MESSAGE_PASS;
  const mqVhost = process.env.MESSAGE_VHOST;
  const station = await MessageStation.connect({
    host: mqHost,
    user: mqUser,
    pass: mqPass,
    vhost: mqVhost,
  });
  const apprClient = await station.createQLClient({
    exchange: 'appraise',
    endpoint: 'graphql',
    queue: 'appraise/endpoint',
    route: 'graphql',
  });
  function createClient(type, agent, base, proxy) {
    const config = {
      baseURL: null,
      headers: null,
      proxy: null,
    };
    if (base) {
      config.baseURL = base;
    }
    if (agent) {
      config.headers = { 'User-Agent': agent };
    }
    if (proxy) {
      config.proxy = proxy;
    }
    return axios.create(config);
  }

  // TODO In general the exchange name is relative short
  // TODO In most use case, exType are default direct type, and that is good enough for usage
  // TODO Seems here th´route and queue are swapped
  const client = await station.createClient(
    {
      exchange: 'appraise',
      route: 'official-price',
      queue: 'price-scraper',
      timeout: 30000,
      handler: async (message) => {
        const { correlationId, replyTo } = message.properties;
        const { payload } = JSON.parse(message.content);
        logger.debug('Operation for', correlationId, 'reply to', replyTo);
        stream.next({ payload, correlationId, replyTo });
        return;
      },
    },
    (channel) => {
      channel.prefetch = 1;
    }
  );

  const stream = new Subject();
  stream
    .pipe(
      // todo this is the function to prepare http client
      map((msg) => {
        const { agent, base, type, proxy } = msg.payload;
        return {
          client: createClient(type, agent, base, proxy),
          ...msg.payload,
        };
      }),
      mergeMap((ctx) => {
        // todo seems here forgotten the use ctx as parameter and dependency
        // const { market, scraper } = ctx;
        // todo in most of time are init corresponding handler logic, instead of create handler
        // const scrape = require('./process-price');
        // todo expected result of scraped data will send to subscriber after this
        return scrape(ctx);
      })
    )
    .subscribe(async (data) => {
      logger.trace('Scrape Data', data);
      // todo if no data, notify
      // if (data.length === 0) {}
      for (let i = 0; i < data.length; i++) {
        const query = `mutation savePriceReference($input:PriceReferenceInput) {
          savePriceReference(input: $input) {id} }`;
        const variables = {
          input: {
            sourceId: data[i].sourceId,
            type: data[i].type,
            market: data[i].market,
            brandId: data[i].brandId,
            reference: data[i].reference,
            currencyId: data[i].currencyId,
            price: data[i].price,
            tax: data[i].tax,
            amount: data[i].amount,
          },
        };
        let result = await apprClient.request({ query, variables });
        logger.debug('Result', result);
      }
      // console.log(data);
      // todo: to notify scrape result
      // todo format the data to be graphql message and send to appraise graphql endpoint
      // eg data.map(d=>{
      //    ...do format becomes {queue: mutation query, variables: { parameters use in query}}
      //    client.publish('appraise', 'graphql', message, {replyTo, correlationId}); // this is method use client to do and need to handle reply by hand
      //    or
      //    have created GrqphQL client (@cosmos/util), and the call will be client.request('appraise', 'graphql', message)
      //    or
      //    have created messenger (@cosmos/util), then can send like messenger.request('graphql@appraise', message)
      // })
      // client.publish(
      //     'scraper-official-price',
      //     'crawlerLC',
      //     JSON.stringify(data) );
    });
})();
