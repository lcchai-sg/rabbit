const { MongoClient } = require('mongodb');
const amqp = require('amqplib');

const messageQueueConnectionString = "amqp://kswsdxln:ZsZJndMGqhVPo-hxbJ-Tg9Y-Mn18TGCP@vulture.rmq.cloudamqp.com/kswsdxln";

(async () => {
  try {
    let connection = await amqp.connect(messageQueueConnectionString);
    let channel = await connection.createChannel();
    channel.prefetch(1);

    const queue = "synopsis.url";

    const db_url = `mongodb+srv://root:sysadmin@cluster0-jrvjy.mongodb.net/synopsis?retryWrites=true&w=majority`;
    const conn = await MongoClient.connect(db_url);

    await channel.consume(queue, async function (msg) {
      // parse message
      let msgBody = msg.content.toString();
      let data = JSON.parse(msgBody);
      
      console.log("***** processing data *****");
      console.log(msgBody);

      let { brand, brandID, reference, lang, source, collection, productID, related, url, thumbnail, name, price, ...rest } = data;
      console.log(`source ---> ${source}`);
      console.log(`name   ---> ${name}`);
      console.log(`url    ---> ${url}`);

      await conn.db('synopsis')
        .collection('reference_url')
        .findOneAndUpdate(
          {brandID, reference, source, lang, url},
          {
            $setOnInsert: {
              productID,
              brandID,
              lang,
              url,
              brand,
              collection,
              name,
              price,
              reference,
              related,
              thumbnail,
              recordedAt: new Date(),
            },
            $set: {
              ...rest
            },
            $currentDate: {
              lastCheckAt: {$type: 'date'}
            }
          },
          {
            upsert: true
          }
        )
        .then(result => console.log(result))
        .catch(error => console.log(error));
      
      channel.ack(msg);
    });
  } catch(error) {
    console.log("***** error *****");
    console.log(error);
  }
})();
