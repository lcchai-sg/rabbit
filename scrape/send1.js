const amqp = require('amqplib/callback_api');

// connect RabbitMQ server
amqp.connect('amqp://localhost', function(error0, connection) {
  if (error0) {
    throw error0;
  }
  // create channel
  connection.createChannel(function(error1, channel) {
    if (error1) {
      throw error1;
    }
    let queue = 'hello';
    let msg;
    // create queue
    channel.assertQueue(queue, {
      durable: false
    });

    for (i=50; i<90; i++) {
      msg = "result ******" + i;
      channel.sendToQueue(queue, Buffer.from(msg));
      console.log(" [x] Sent %s", msg);
    }
  });
});

