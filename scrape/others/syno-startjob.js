const amqp = require('amqplib');

const jobs = require('./syno-jobs');

// RabbitMQ connection string
const messageQueueConnectionString = "amqp://kswsdxln:ZsZJndMGqhVPo-hxbJ-Tg9Y-Mn18TGCP@vulture.rmq.cloudamqp.com/kswsdxln";

async function startJob() {
  try {
    let connection = await amqp.connect(messageQueueConnectionString);
    let channel = await connection.createChannel();

    const exchangeName = "synopsis";
    const routingKey = "indexing";

    jobs.forEach(job => {
      channel.publish(
        exchangeName, 
        routingKey, 
        Buffer.from(JSON.stringify(job)), 
        { persistent: true },
        (error, ok) => {
          if (error) throw error;
        }
      );
      console.log("***** Sent %s", Buffer.from(JSON.stringify(job)));
    });
  } catch (error) {
    console.log("***** error *****");
    throw error;
  }
}

startJob();