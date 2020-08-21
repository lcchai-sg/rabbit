const { MessageStation } = require("@cosmos/utils");
const Redis = require('ioredis');

(async function () {
  const redisHost = process.env.REDIS_HOST || '127.0.0.1';
  const redis = new Redis(redisHost, { keyPrefix: 'cosmos:' });
  const station = await MessageStation.connect(await redis.hgetall('message:synopsis'));
  const client = await station.createClient({
    exchange: "scraper",
    exType: 'topic',
    route: 'scrape.data.raw',
    queue: 'scraper-info',
    timeout: 150000,
    handler: async message => {
      const { correlationId } = message.properties;
      const payload = JSON.parse(message.content);
      console.log(correlationId, payload);
    }
  })
})();
