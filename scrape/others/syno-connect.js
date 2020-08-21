const amqp = require('amqplib');

// RabbitMQ connection string
const messageQueueConnectionString = "amqp://kswsdxln:ZsZJndMGqhVPo-hxbJ-Tg9Y-Mn18TGCP@vulture.rmq.cloudamqp.com/kswsdxln";

async function setup() {
  console.log("Setting up RabbitMQ Exchanges/Queues");
  // connect to RabbitMQ Instance
  let connection = await amqp.connect(messageQueueConnectionString);

  // create a channel
  let channel = await connection.createChannel();

  // create exchange
  await channel.assertExchange("synopsis", "direct", { durable: true });

  // create queues
  await channel.assertQueue("synopsis.indexing",    { durable: true });
  await channel.assertQueue("synopsis.extraction",  { durable: true });
  await channel.assertQueue("synopsis.distilling",  { durable: true });
  await channel.assertQueue("synopsis.originator",  { durable: true });
  await channel.assertQueue("synopsis.pricing",     { durable: true });
  await channel.assertQueue("synopsis.collector",   { durable: true });
  await channel.assertQueue("synopsis.product",     { durable: true });
  await channel.assertQueue("synopsis.url",         { durable: true });


  // bind queues
  await channel.bindQueue("synopsis.indexing",    "synopsis", "indexing");
  await channel.bindQueue("synopsis.extraction",  "synopsis", "extraction");
  await channel.bindQueue("synopsis.distilling",  "synopsis", "distilling");
  await channel.bindQueue("synopsis.originator",  "synopsis", "originator");
  await channel.bindQueue("synopsis.pricing",     "synopsis", "pricing");
  await channel.bindQueue("synopsis.collector",   "synopsis", "collector");
  await channel.bindQueue("synopsis.product",     "synopsis", "product");
  await channel.bindQueue("synopsis.url",         "synopsis", "url");


  console.log("Setup DONE");
  process.exit();
}

setup();