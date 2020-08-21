const axios = require('axios');
const cheerio = require('cheerio');
const data = require('./joma10');

(async function () {
  const messageQueueConnectionString = "amqp://kswsdxln:ZsZJndMGqhVPo-hxbJ-Tg9Y-Mn18TGCP@vulture.rmq.cloudamqp.com/kswsdxln";
  let connection = await amqp.connect(messageQueueConnectionString);
  let channel = await connection.createChannel();

  const exchangeName = "synopsis";
  const routingKey = "image01";

  for (let i = 0; i < data.length; i++) {
    console.log(data.length, i, data[i].url);
    try {
      const d = (await axios.get(data[i].url)).data;
      const $ = cheerio.load(d)
      // const thumbnail = $('.MagicZoom').attr('src');
      const thumbnail = $('.MagicZoom').find('img').attr('src');
      if (thumbnail) {
        // await axios.get(thumbnail, { responseType: 'stream' })
        //   .then(async res => {
        //     data[i].thumbnail = thumbnail;
        //     const image = res.data;
        //     const form = new FormData();
        //     form.append('payload', image);
        //     const headers = form.getHeaders();
        //     await axios.post('https://synopsis.cosmos.ieplsg.com/v2/asset/0/0', form, { headers })
        //       .then(async res => {
        //         assets = res.data;
        //         data[i].thumbnail = thumbnail;
        //         data[i].assets = assets;
        //         console.log('posting...', data[i]);
        //         await messenger.request("imaging", data[i]);
        //       })
        //       .catch(err => {
        //         logger.error("Error posting assets to Seaweed with error " + err);
        //       });
        //   })
        //   .catch(err => {
        //     console.log('imaging error ', err);
        //   })

        data[i].thumbnail = thumbnail;
        data[i].assets = thumbnail;
      }
      console.log('posting...', data[i]);
      channel.publish(
        exchangeName,
        routingKey,
        Buffer.from(JSON.stringify(job)),
        (error, ok) => {
          if (error) throw error;
        }
      );
    } catch (error) {
      console.log('get image error', error);
    }
    await new Promise(r => setTimeout(r, 5000));
  }
})();
