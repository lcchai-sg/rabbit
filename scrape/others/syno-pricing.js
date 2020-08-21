const amqp = require('amqplib');

// RabbitMQ connection string
const messageQueueConnectionString = "amqp://kswsdxln:ZsZJndMGqhVPo-hxbJ-Tg9Y-Mn18TGCP@vulture.rmq.cloudamqp.com/kswsdxln";

async function startJob() {
  try {
    let connection = await amqp.connect(messageQueueConnectionString);
    let channel = await connection.createChannel();
    //await channel.prefetch(1);

    const exchangeName = "synopsis";
    const queue = "synopsis.pricing"
    // const routingKey = "originator";

    channel.consume(queue, async function (msg) {
      // parse message
      let msgBody = msg.content.toString();
      let data = JSON.parse(msgBody);
      const { base, strategy, command, context } = data;
      const { entry, brand, brandID, lang } = context;
      console.log("***** consuming from pricing Q *****");
      console.log(`base --> ${base}`);
      console.log(`strategy --> ${strategy}`);
      console.log(`command --> ${command}`);
      console.log(`entry --> ${entry}`);
      console.log(`brand --> ${brand}`);
      console.log(`brandID --> ${brandID}`);
      console.log(`lang --> ${lang}`);

      setTimeout(function () {
        channel.ack(msg);
      }, 10000);

      // console.log("***** publishing to originator Q *****");
      // console.log(`***** sent ${JSON.stringify(payload)}`);

      // channel.publish(
      //   exchangeName, 
      //   routingKey, 
      //   Buffer.from(JSON.stringify(payload)), 
      //   { persistent: true },
      //   (error, ok) => {
      //     if (error) throw error;
      //   }
      // );
    });
  } catch (error) {
    console.log("***** error *****");
    throw error;
  }
}

startJob();