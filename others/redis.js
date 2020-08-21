const Redis = require('ioredis');

(async () => {
  const redisHost = process.env.REDIS_HOST || '127.0.0.1';
  const redis = new Redis(redisHost, { keyPrefix: 'cosmos:' });
  redis.hset('message:synopsis', 'user', 'synopsis')
  redis.hset('message:synopsis', 'pass', 'synopsis')
  redis.hset('message:synopsis', 'host', '127.0.0.1')
  redis.hset('message:synopsis', 'vhost', '/lc')

  const mdb = await redis.hgetall('message:synopsis');
  console.log(mdb)

})();