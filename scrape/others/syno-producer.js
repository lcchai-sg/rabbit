const amqp = require('amqplib/callback_api');

const jobs = require('./syno-jobs');

let msg;

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
    const queue = 'indexing';
    ch.assertQueue(queue, { durable: true });

    jobs.forEach(job => {
      msg = JSON.stringify(job);
      ch.sendToQueue(queue, Buffer.from(msg), { persistent: true });
      console.log(" [x] Sent %s", Buffer.from(msg));
    });
  })
});
