const amqp = require('amqplib/callback_api');
const delay = ms => new Promise(res => setTimeout(res, ms));

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
    let queue = 'indexing';
    let msg;
    // create queue
    channel.assertQueue(queue, {
      durable: true
    });

    setTimeout(() => {
      msg = JSON.stringify({
        "id":"1",
        "source":"official",
        "url":"https://aboutvintage.com/collections/all/products/1815-chronograph-steel-blue-sunray-special-edition",
        "thumbnail":"https://cdn.shopify.com/s/files/1/2409/0711/products/G98ph94QlGDxLbRwEk41_AV_1815_bluedial_silver_1500px_400x.png?v=1565010596",
        "collection":"Men",
        "lang":"en",
        "name":"1815 Chronograph, Steel / Blue Sunray",
        "gender":"M",
        "retail":"$335.00"
      });
      channel.sendToQueue(queue, Buffer.from(msg), { persistent: true });
      console.log(" [x] Sent %s", Buffer.from(msg));
    }, 10000);
    setTimeout(() => {
      msg = JSON.stringify({
        "id":"2",
        "source":"official",
        "url":"https://aboutvintage.com/collections/all/products/1815-chronograph-rose-gold",
        "thumbnail":"https://cdn.shopify.com/s/files/1/2409/0711/products/37iIKbDJSqiiJtGU5JTE_AV_1815_ROSE_1500px_12e58702-a6d3-446f-a382-c1421dee84c8_400x.png?v=1563200937",
        "collection":"Men",
        "lang":"en",
        "name":"1815 Chronograph, Rose Gold / White",
        "gender":"M",
        "retail":"$355.00"
      });
      channel.sendToQueue(queue, Buffer.from(msg), { persistent: true });
      console.log(" [x] Sent %s", Buffer.from(msg));
    }, 10000);
    setTimeout(() => {
      msg = JSON.stringify({
        "id":"3",
        "source":"official",
        "url":"https://aboutvintage.com/collections/all/products/1844-chronograph-steel-black",
        "thumbnail":"https://cdn.shopify.com/s/files/1/2409/0711/products/i5xHIYV8SJ6J4en4M7nc_AV_1844_BLACKDIAL_BLACK_1500px_400x.png?v=1563348341",
        "collection":"Men",
        "lang":"en",
        "name":"1844 Chronograph, Steel / Black",
        "gender":"M",
        "retail":"$335.00"
      });
      channel.sendToQueue(queue, Buffer.from(msg), { persistent: true });
      console.log(" [x] Sent %s", Buffer.from(msg));
    }, 10000);
    setTimeout(() => {
      msg = JSON.stringify({
        "id":"4",
        "source":"official",
        "url":"https://aboutvintage.com/collections/all/products/1815-chronograph-steel-white",
        "thumbnail":"https://cdn.shopify.com/s/files/1/2409/0711/products/0PLaQXyySd2Q39xiQ2nn_AV_1815_BROWN_1500px_400x.png?v=1563181755",
        "collection":"Men",
        "lang":"en",
        "name":"1815 Chronograph, Steel / White",
        "gender":"M",
        "retail":"$335.00"
      });
      channel.sendToQueue(queue, Buffer.from(msg), { persistent: true });
      console.log(" [x] Sent %s", Buffer.from(msg));
    }, 10000);
    setTimeout(() => {
      msg = JSON.stringify({
        "id":"5",
        "source":"official",
        "url":"https://aboutvintage.com/collections/all/products/1815-chronograph-steel-green-sunray-special-edition","thumbnail":"https://cdn.shopify.com/s/files/1/2409/0711/products/NUJVjakSpm5igttfhIUz_AV_1815_greendial_silver_1500px_400x.png?v=1564220043",
        "collection":"Men",
        "lang":"en",
        "name":"1815 Chronograph, Steel / Green Sunray",
        "gender":"M",
        "retail":"$335.00"
      });
      channel.sendToQueue(queue, Buffer.from(msg), { persistent: true });
      console.log(" [x] Sent %s", Buffer.from(msg));
    }, 10000);
    setTimeout(() => {
      msg = JSON.stringify({
        "id":"6",
        "source":"official",
        "url":"https://aboutvintage.com/collections/all/products/1820-automatic-pure-steel",
        "thumbnail":"https://cdn.shopify.com/s/files/1/2409/0711/products/AV_1820_STEEL_brown_1500px_newtime_400x.png?v=1574979237",
        "collection":"Men",
        "lang":"en",
        "name":"1820 Automatic, Steel / White",
        "gender":"M",
        "retail":"$515.00"
      });
      channel.sendToQueue(queue, Buffer.from(msg), { persistent: true });
      console.log(" [x] Sent %s", Buffer.from(msg));
    }, 10000);
    setTimeout(() => {
      msg = JSON.stringify({
        "id":"7",
        "source":"official",
        "url":"https://aboutvintage.com/collections/all/products/1820-automatic-two-toned",
        "thumbnail":"https://cdn.shopify.com/s/files/1/2409/0711/products/8notzlYTNKE0pvaHLOXf_AV_1820_TWO_1500px_be7429ae-c1ec-49fb-bef2-ec44c80f35ba_400x.png?v=1563177505",
        "collection":"Men",
        "lang":"en",
        "name":"1820 Automatic, Steel / Two Toned",
        "gender":"M",
        "retail":"$515.00"
      });
      channel.sendToQueue(queue, Buffer.from(msg), { persistent: true });
      console.log(" [x] Sent %s", Buffer.from(msg));
    }, 10000);
    setTimeout(() => {
      msg = JSON.stringify({
        "id":"8",
        "source":"official",
        "url":"https://aboutvintage.com/collections/all/products/1820-automatic-rose-gold",
        "thumbnail":"https://cdn.shopify.com/s/files/1/2409/0711/products/mEOmDZTJT8GxXFQdCJs4_AV_1820_ROSE_1500px_34d87128-c6bb-4f66-8167-1b74718378b4_400x.png?v=1563177117",
        "collection":"Men",
        "lang":"en",
        "name":"1820 Automatic, Rose Gold / White",
        "gender":"M",
        "retail":"$535.00"
      });
      channel.sendToQueue(queue, Buffer.from(msg), { persistent: true });
      console.log(" [x] Sent %s", Buffer.from(msg));
    }, 10000);
    setTimeout(() => {
      msg = JSON.stringify({
        "id":"9",
        "source":"official",
        "url":"https://aboutvintage.com/collections/all/products/1971-automatic-steel-white-limited-edition",
        "thumbnail":"https://cdn.shopify.com/s/files/1/2409/0711/products/COP30VWdSteIAiai161z_AV_1971_SILVER_1500px_400x.png?v=1563181341",
        "collection":"Men",
        "lang":"en",
        "name":"1971 Automatic, Steel / White - Swiss Made",
        "gender":"M",
        "retail":"$945.00"
      });
      channel.sendToQueue(queue, Buffer.from(msg), { persistent: true });
      console.log(" [x] Sent %s", Buffer.from(msg));
    }, 10000);
    setTimeout(() => {
      msg = JSON.stringify({
        "id":"10",
        "source":"official",
        "url":"https://aboutvintage.com/collections/all/products/1971-automatic-gold-white-limited-edition",
        "thumbnail":"https://cdn.shopify.com/s/files/1/2409/0711/products/76EiDXkgR4KQoK2MtMD6_AV_1971_GOLD_1500px_400x.png?v=1563179341",
        "collection":"Men",
        "lang":"en",
        "name":"1971 Automatic, Gold / White - Swiss Made",
        "gender":"M",
        "retail":"$999.00"
      });
      channel.sendToQueue(queue, Buffer.from(msg), { persistent: true });
      console.log(" [x] Sent %s", Buffer.from(msg));
    }, 10000);
    setTimeout(() => {
      msg = JSON.stringify({
        "id":"11",
        "source":"official",
        "url":"https://aboutvintage.com/collections/all/products/1971-automatic-rose-gold-white-limited-edition",
        "thumbnail":"https://cdn.shopify.com/s/files/1/2409/0711/products/C9HTsNGTmeZ60qQwEKxs_AV_1971_ROSE_1500px_400x.png?v=1564653485",
        "collection":"Men",
        "lang":"en",
        "name":"1971 Automatic, Rose Gold / White - Swiss Made",
        "gender":"M",
        "retail":"$999.00"
      });
      channel.sendToQueue(queue, Buffer.from(msg), { persistent: true });
      console.log(" [x] Sent %s", Buffer.from(msg));
    }, 10000);
    setTimeout(() => {
      msg = JSON.stringify({
        "id":"12",
        "source":"official",
        "url":"https://aboutvintage.com/collections/all/products/1971-automatic-steel-black-limited-edition",
        "thumbnail":"https://cdn.shopify.com/s/files/1/2409/0711/products/DPgJC0hNTDmkiKCzD0Mf_AV-1971_blackdial_S_1500px_400x.png?v=1563181063",
        "collection":"Men",
        "lang":"en",
        "name":"1971 Automatic, Steel / Black - Swiss Made",
        "gender":"M",
        "retail":"$945.00"
      });
      channel.sendToQueue(queue, Buffer.from(msg), { persistent: true });
      console.log(" [x] Sent %s", Buffer.from(msg));
    }, 10000);
    setTimeout(() => {
      msg = JSON.stringify({
        "id":"13",
        "source":"official",
        "url":"https://aboutvintage.com/collections/all/products/1971-automatic-gold-black-limited-edition",
        "thumbnail":"https://cdn.shopify.com/s/files/1/2409/0711/products/HZMXuYPR3mH8gnfl47a3_AV-1971_blackdial_G_1500px_400x.png?v=1563177886",
        "collection":"Men",
        "lang":"en",
        "name":"1971 Automatic, Gold / Black - Swiss Made",
        "gender":"M",
        "retail":"$999.00"
      });
      channel.sendToQueue(queue, Buffer.from(msg), { persistent: true });
      console.log(" [x] Sent %s", Buffer.from(msg));
    }, 10000);
    setTimeout(() => {
      msg = JSON.stringify({
        "id":"14",
        "source":"official",
        "url":"https://aboutvintage.com/collections/all/products/1971-automatic-rose-gold-black-limited-edition",
        "thumbnail":"https://cdn.shopify.com/s/files/1/2409/0711/products/ohqlc88SbuKke1wg6Dpy_AV-1971_blackdial_R_1500px_400x.png?v=1574980805",
        "collection":"Men",
        "lang":"en",
        "name":"1971 Automatic, Rose Gold / Black - Swiss Made",
        "gender":"M",
        "retail":"$999.00"
      });
      channel.sendToQueue(queue, Buffer.from(msg), { persistent: true });
      console.log(" [x] Sent %s", Buffer.from(msg));
    }, 10000);
    setTimeout(() => {
      msg = JSON.stringify({
        "id":"15",
        "source":"official",
        "url":"https://aboutvintage.com/collections/all/products/1971-automatic-steel-night-blue-sunray-limited-edition",
        "thumbnail":"https://cdn.shopify.com/s/files/1/2409/0711/products/AV-1971_bluedial_SE_1500px_400x.png?v=1564653527",
        "collection":"Men",
        "lang":"en",
        "name":"1971 Automatic, Steel / Night Blue - Swiss Made",
        "gender":"M",
        "retail":"$945.00"
      });
      channel.sendToQueue(queue, Buffer.from(msg), { persistent: true });
      console.log(" [x] Sent %s", Buffer.from(msg));
    }, 10000);
    setTimeout(() => {
      msg = JSON.stringify({
        "id":"16",
        "source":"official",
        "url":"https://aboutvintage.com/collections/all/products/1971-automatic-gold-night-blue-sunray-limited-edition",
        "thumbnail":"https://cdn.shopify.com/s/files/1/2409/0711/products/AV-1971_bluedial_SE_1500px_G_400x.png?v=1564656601",
        "collection":"Men",
        "lang":"en",
        "name":"1971 Automatic, Gold / Night Blue - Swiss Made",
        "gender":"M",
        "retail":"$999.00"
      });
      channel.sendToQueue(queue, Buffer.from(msg), { persistent: true });
      console.log(" [x] Sent %s", Buffer.from(msg));
    }, 10000);
    setTimeout(() => {
      msg = JSON.stringify({
        "id":"17",
        "source":"official",
        "url":"https://aboutvintage.com/collections/all/products/1971-automatic-rose-gold-night-blue-sunray-limited-edition",
        "thumbnail":"https://cdn.shopify.com/s/files/1/2409/0711/products/AV-1971_bluedial_SE_1500px_RG_400x.png?v=1563180869",
        "collection":"Men",
        "lang":"en",
        "name":"1971 Automatic, Rose Gold / Night Blue - Swiss Made",
        "gender":"M",
        "retail":"$999.00"
      });
      channel.sendToQueue(queue, Buffer.from(msg), { persistent: true });
      console.log(" [x] Sent %s", Buffer.from(msg));
    }, 10000);
    setTimeout(() => {
      msg = JSON.stringify({
        "id":"18",
        "source":"official",
        "url":"https://aboutvintage.com/collections/all/products/1969-vintage-steel-white-36-39mm",
        "thumbnail":"https://cdn.shopify.com/s/files/1/2409/0711/products/OZJijhsLSYaZ8YvqCeOT_AV_1969_39mm_whitedial_silver_1500px_s_400x.png?v=1563348348",
        "collection":"Men",
        "lang":"en",
        "name":"1969 Vintage, Steel / White",
        "gender":"M",
        "retail":"$229.00"
      });
      channel.sendToQueue(queue, Buffer.from(msg), { persistent: true });
      console.log(" [x] Sent %s", Buffer.from(msg));
    }, 10000);
    setTimeout(() => {
      msg = JSON.stringify({
        "id":"19",
        "source":"official",
        "url":"https://aboutvintage.com/collections/all/products/1969-vintage-gold-white-36-39mm",
        "thumbnail":"https://cdn.shopify.com/s/files/1/2409/0711/products/K1mVll2RTSLhXM5rdy7m_AV_1969_39mm_whitedial_gold_1500px_400x.png?v=1563800588",
        "collection":"Men",
        "lang":"en",
        "name":"1969 Vintage, Gold / White",
        "gender":"M",
        "retail":"$249.00"
      });
      channel.sendToQueue(queue, Buffer.from(msg), { persistent: true });
      console.log(" [x] Sent %s", Buffer.from(msg));
    }, 10000);
    setTimeout(() => {
      msg = JSON.stringify({
        "id":"20",
        "source":"official",
        "url":"https://aboutvintage.com/collections/all/products/1969-vintage-rose-gold-white-36-39mm",
        "thumbnail":"https://cdn.shopify.com/s/files/1/2409/0711/products/nBenwQ7SISZ0S0hxyWFm_AV_1969_39mm_whitedial_rose_1500px_s_400x.png?v=1563563262",
        "collection":"Men",
        "lang":"en",
        "name":"1969 Vintage, Rose Gold / White",
        "gender":"M",
        "retail":"$249.00"
      });
      channel.sendToQueue(queue, Buffer.from(msg), { persistent: true });
      console.log(" [x] Sent %s", Buffer.from(msg));
    }, 10000);
    setTimeout(() => {
      msg = JSON.stringify({
        "id":"21",
        "source":"official",
        "url":"https://aboutvintage.com/collections/all/products/1969-vintage-steel-black-36-39mm",
        "thumbnail":"https://cdn.shopify.com/s/files/1/2409/0711/products/O6uGqVeTbWqbaC11mYJb_AV_1969_39mm_blackdial_silver_1500px_s_400x.png?v=1565010597",
        "collection":"Men",
        "lang":"en",
        "name":"1969 Vintage, Steel / Black",
        "gender":"M",
        "retail":"$229.00"
      });
      channel.sendToQueue(queue, Buffer.from(msg), { persistent: true });
      console.log(" [x] Sent %s", Buffer.from(msg));
    }, 10000);
    setTimeout(() => {
      msg = JSON.stringify({
        "id":"22",
        "source":"official",
        "url":"https://aboutvintage.com/collections/all/products/1969-vintage-rose-gold-black-36-39mm",
        "thumbnail":"https://cdn.shopify.com/s/files/1/2409/0711/products/MaqFzwbTbeGm8JeF8K8K_AV_1969_39mm_blackdial_rose_1500px_s_400x.png?v=1563182252",
        "collection":"Men",
        "lang":"en",
        "name":"1969 Vintage, Rose Gold / Black",
        "gender":"M",
        "retail":"$249.00"
      });
      channel.sendToQueue(queue, Buffer.from(msg), { persistent: true });
      console.log(" [x] Sent %s", Buffer.from(msg));
    }, 10000);
    setTimeout(() => {
      msg = JSON.stringify({
        "id":"23",
        "source":"official",
        "url":"https://aboutvintage.com/collections/all/products/1969-vintage-steel-midnight-blue-special-edition-36-39mm",
        "thumbnail":"https://cdn.shopify.com/s/files/1/2409/0711/products/ugfZzxbQPGDmk3nIHEzW_AV_1969_Brown_WebRes_400x.png?v=1574980332",
        "collection":"Men",
        "lang":"en",
        "name":"1969 Vintage, Steel / Midnight Blue - Special Edition",
        "gender":"M",
        "retail":"$229.00"
      });
      channel.sendToQueue(queue, Buffer.from(msg), { persistent: true });
      console.log(" [x] Sent %s", Buffer.from(msg));
    }, 10000);
    setTimeout(() => {
      msg = JSON.stringify({
        "id":"24",
        "source":"official",
        "url":"https://aboutvintage.com/collections/all/products/1969-vintage-gold-midnight-blue-special-edition-36-39mm",
        "thumbnail":"https://cdn.shopify.com/s/files/1/2409/0711/products/7Cg1sTj0TjC8h4Xa1b2Q_AV_1969_Brown_WebRes_400x.png?v=1563182892",
        "collection":"Men",
        "lang":"en",
        "name":"1969 Vintage, Gold / Midnight Blue - Special Edition",
        "gender":"M",
        "retail":"$249.00"
      });
      channel.sendToQueue(queue, Buffer.from(msg), { persistent: true });
      console.log(" [x] Sent %s", Buffer.from(msg));
    }, 10000);
    setTimeout(() => {
      msg = JSON.stringify({
        "id":"25",
        "source":"official",
        "url":"https://aboutvintage.com/collections/all/products/1988-moonphase",
        "thumbnail":"https://cdn.shopify.com/s/files/1/2409/0711/products/av-1988-moonphase-fc-steel-twotoned-blue_400x.png?v=1547050068",
        "collection":"Men",
        "lang":"en",
        "name":"1988 Moonphase - Limited Edition",
        "gender":"M",
        "retail":"$3,349.00"
      });
      channel.sendToQueue(queue, Buffer.from(msg), { persistent: true });
      console.log(" [x] Sent %s", Buffer.from(msg));
    }, 10000);
    setTimeout(() => {
      msg = JSON.stringify({
        "id":"26",
        "source":"official",
        "url":"https://aboutvintage.com/collections/all/products/gift-card-1",
        "thumbnail":"https://cdn.shopify.com/s/files/1/2409/0711/products/gift_card_1500x1500_400x.png?v=1527695378",
        "collection":"Men",
        "lang":"en",
        "name":"Gift Card",
        "gender":"M",
        "retail":"from $100.00"
      });
      channel.sendToQueue(queue, Buffer.from(msg), { persistent: true });
      console.log(" [x] Sent %s", Buffer.from(msg));
    }, 10000);
    setTimeout(() => {
      msg = JSON.stringify({
        "id":"27",
        "source":"official",
        "url":"https://aboutvintage.com/collections/all/products/black-leather-strap",
        "thumbnail":"https://cdn.shopify.com/s/files/1/2409/0711/products/M3BlzjocSvO8noIhpnkg_AV_strap_black_silver_400x.png?v=1544068482",
        "collection":"Men",
        "lang":"en",
        "name":"Pin Buckle - Black Leather",
        "gender":"M",
        "retail":"$49.00"
      });
      channel.sendToQueue(queue, Buffer.from(msg), { persistent: true });
      console.log(" [x] Sent %s", Buffer.from(msg));
    }, 10000);
    setTimeout(() => {
      msg = JSON.stringify({
        "id":"28",
        "source":"official",
        "url":"https://aboutvintage.com/collections/all/products/black-croco-grain-strap",
        "thumbnail":"https://cdn.shopify.com/s/files/1/2409/0711/products/vNw9kmfpQLbdIJNNYJIw_AV_strap_black_croco_silver_400x.png?v=1544040730",
        "collection":"Men",
        "lang":"en",
        "name":"Pin Buckle - Black Croco",
        "gender":"M",
        "retail":"$49.00"
      });
      channel.sendToQueue(queue, Buffer.from(msg), { persistent: true });
      console.log(" [x] Sent %s", Buffer.from(msg));
    }, 10000);
    setTimeout(() => {
      msg = JSON.stringify({
        "id":"29",
        "source":"official",
        "url":"https://aboutvintage.com/collections/all/products/brown-croco-grain-strap",
        "thumbnail":"https://cdn.shopify.com/s/files/1/2409/0711/products/BgZW7mLrQd6BFNVakjc4_AV_strap_brown_croco_silver_400x.png?v=1544040787",
        "collection":"Men",
        "lang":"en",
        "name":"Pin Buckle - Brown Croco",
        "gender":"M",
        "retail":"$49.00"
      });
      channel.sendToQueue(queue, Buffer.from(msg), { persistent: true });
      console.log(" [x] Sent %s", Buffer.from(msg));
    }, 10000);
    setTimeout(() => {
      msg = JSON.stringify({
        "id":"30",
        "source":"official",
        "url":"https://aboutvintage.com/collections/all/products/brown-leather-strap",
        "thumbnail":"https://cdn.shopify.com/s/files/1/2409/0711/products/AV_strap_lightbrown_silver_400x.png?v=1544452752",
        "collection":"Men",
        "lang":"en",
        "name":"Pin Buckle - Brown Leather",
        "gender":"M",
        "retail":"$49.00"
      });
      channel.sendToQueue(queue, Buffer.from(msg), { persistent: true });
      console.log(" [x] Sent %s", Buffer.from(msg));
    }, 10000);
    setTimeout(() => {
      msg = JSON.stringify({
        "id":"31",
        "source":"official",
        "url":"https://aboutvintage.com/collections/all/products/dark-brown-leather-strap",
        "thumbnail":"https://cdn.shopify.com/s/files/1/2409/0711/products/n5aJDJkKQoOJAL4LucIC_AV_strap_darkbrown_silver_400x.png?v=1544040794",
        "collection":"Men",
        "lang":"en",
        "name":"Pin Buckle - Dark Brown Leather",
        "gender":"M",
        "retail":"$49.00"
      });
      channel.sendToQueue(queue, Buffer.from(msg), { persistent: true });
      console.log(" [x] Sent %s", Buffer.from(msg));
    }, 10000);
    setTimeout(() => {
      msg = JSON.stringify({
        "id":"32",
        "source":"official",
        "url":"https://aboutvintage.com/collections/all/products/pin-buckle-sand-suede",
        "thumbnail":"https://cdn.shopify.com/s/files/1/2409/0711/products/P3EgA6VbTy2Jg7pCf6RR_AV_strap_beigesuede_silver_400x.png?v=1544040558",
        "collection":"Men",
        "lang":"en",
        "name":"Pin Buckle -  Sand Suede",
        "gender":"M",
        "retail":"$49.00"
      });
      channel.sendToQueue(queue, Buffer.from(msg), { persistent: true });
      console.log(" [x] Sent %s", Buffer.from(msg));
    }, 10000);
    setTimeout(() => {
      msg = JSON.stringify({
        "id":"33",
        "source":"official",
        "url":"https://aboutvintage.com/collections/all/products/pin-buckle-dark-green",
        "thumbnail":"https://cdn.shopify.com/s/files/1/2409/0711/products/1F2LGz2fS8Kf2YEO6DA2_AV_strap_darkgreen_silver_400x.png?v=1544040470",
        "collection":"Men",
        "lang":"en",
        "name":"Pin Buckle -  Dark Green",
        "gender":"M",
        "retail":"$49.00"
      });
      channel.sendToQueue(queue, Buffer.from(msg), { persistent: true });
      console.log(" [x] Sent %s", Buffer.from(msg));
    }, 10000);
    setTimeout(() => {
      msg = JSON.stringify({
        "id":"34",
        "source":"official",
        "url":"https://aboutvintage.com/collections/all/products/pin-buckle-dark-blue-suede",
        "thumbnail":"https://cdn.shopify.com/s/files/1/2409/0711/products/eC5wo3irTceC7tvzoS5P_AV_strap_bluesuede_silver_400x.png?v=1544040353",
        "collection":"Men",
        "lang":"en",
        "name":"Pin Buckle -  Dark Blue Suede",
        "gender":"M",
        "retail":"$49.00"
      });
      channel.sendToQueue(queue, Buffer.from(msg), { persistent: true });
      console.log(" [x] Sent %s", Buffer.from(msg));
    }, 10000);
    setTimeout(() => {
      msg = JSON.stringify({
        "id":"35",
        "source":"official",
        "url":"https://aboutvintage.com/collections/all/products/pin-buckle-dark-blue",
        "thumbnail":"https://cdn.shopify.com/s/files/1/2409/0711/products/YjVNq0JpS2Tg4FsZezwq_AV_strap_darkblue_Silver_WebRes_400x.png?v=1544042670",
        "collection":"Men",
        "lang":"en",
        "name":"Pin Buckle -  Dark Blue",
        "gender":"M",
        "retail":"$49.00"
      });
      channel.sendToQueue(queue, Buffer.from(msg), { persistent: true });
      console.log(" [x] Sent %s", Buffer.from(msg));
    }, 10000);
  });
});

