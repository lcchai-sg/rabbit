const axios = require('axios');

(async () => {
  const base = "https://synopsis.cosmos.ieplsg.com/files/4,08de7a3ae8a5c4";
  // const entry1 = "https://synopsis.cosmos.ieplsg.com/files/4,08de76c5d7aa75";
  // const entry2 = "https://synopsis.cosmos.ieplsg.com/files/6,08de7093071bc8";
  const { data: b } = await axios.get(base);
  // const { data: e1 } = await axios.get(entry1);
  // const { data: e2 } = await axios.get(entry2);
  // if (b === e1) console.log('base same as e1'); else console.log('base NOT SAME as e1');
  // if (b === e2) console.log('base same as e2'); else console.log('base NOT SAME as e2');

  // const entry3 = "http://cdn.shopify.com/s/files/1/0264/6605/8287/products/FC-200MCD14_1200x.png?v=1593680889";
  // const entry4 = "https://synopsis.cosmos.ieplsg.com/files/6,06a64ce857c705";

  // const { data: e3 } = await axios.get(entry3);
  // const { data: e4 } = await axios.get(entry4);
  // if (e3 === e4) console.log('e3 === e4'); else console.log("e3 !== e4 ");

  // const en10 = "https://res.cloudinary.com/dp9dnliwc/image/upload/c_mfit,h_1200,w_1200/f_auto/q_auto/wmmedia/watch_images/large/959001900401r782_1524760289.jpg";
  // const en11 = "https://synopsis.cosmos.ieplsg.com/files/6,032e6ec1a018dc";
  // const {data: e10} = await axios.get(en10);
  // const {data: e11} = await axios.get(en11);
  // if (e10 === e10) console.log('e10 === e11'); else console.log("e10 !== e11 ");

  const en12 = "https://cdn2.jomashop.com/media/catalog/product/cache/bd69c9f438c854e0d2d88b4657bdd9c3/p/r/pre-owned-panerai-radiomir-california-3-days-black-dial-men_s-watch-pam00424.jpg";
  const {data: e12} = await axios.get(en12);
  if (e12 === b) console.log('e12 === b'); else console.log("e12 !== b");

  console.log('done.')
  process.exit(0);
})();