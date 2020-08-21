const amqp = require('amqplib/callback_api');

const queue = 'indexing';
const queueEx = 'extraction';

amqp.connect("amqp://kswsdxln:ZsZJndMGqhVPo-hxbJ-Tg9Y-Mn18TGCP@vulture.rmq.cloudamqp.com/kswsdxln", (error, conn) => {
  if (error) {
    console.log("********** amqp connect error **********");
    throw error;
  };
  conn.createChannel((error, ch) => {
    if (error) {
      console.log("********** amqp channel error **********");
      throw error
    };
    ch.assertQueue(queue, { durable: true });
    ch.assertQueue(queueEx, { durable: true });

    console.log("Waiting for messages in %s", queue);
    ch.consume(queue, (msg) => {
      console.log("Received '%s'", msg.content.toString());

      indexing(JSON.parse(msg.content.toString()), ch);

      setTimeout(function () {
        ch.ack(msg);
      }, 10000);
    });

  })
});

const indexing = ({ dryRun, payload }, ch) => {
  let ctx;
  const { base, strategy, command, context } = payload;
  const { entry, brand, brandID, lang } = context;
  if (!dryRun) {
    ctx = `scrape ${entry} using ${strategy} ${command}`;
    console.log(" [x] Sent %s", Buffer.from(ctx));
    ch.sendToQueue(queueEx, Buffer.from(ctx), { persistent: true });
  }
}