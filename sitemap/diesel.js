const axios = require('axios');
const cheerio = require('cheerio');
// https://shop.diesel.com/en/mens/watches/
const urls1 = [
  "https://shop.diesel.com/en/mens/watches/#/en/load-more?cgid=diesel-man-footwearandaccessories-timeframes&start=0&sz=36&lastAction=showMore&untilStart=0",
  "https://shop.diesel.com/en/mens/watches/#/en/load-more?cgid=diesel-man-footwearandaccessories-timeframes&start=36&sz=36&lastAction=showMore&untilStart=36",
  "https://shop.diesel.com/en/mens/watches/#/en/load-more?cgid=diesel-man-footwearandaccessories-timeframes&start=36&sz=36&lastAction=showMore&untilStart=72",
];
//
const urls2 = [
  "https://shop.diesel.com/en/mens/watches/?page=1",
  "https://shop.diesel.com/en/mens/watches/?page=2",
  "https://shop.diesel.com/en/mens/watches/?page=3",
]
const base = "https://shop.diesel.com";

const watches = [
  "https://shop.diesel.com/en/smartwatches/dt2018/DT201800QQQ.html",
  "https://shop.diesel.com/en/timeframes/dz1914/DZ191400QQQ.html",
  "https://shop.diesel.com/en/timeframes/dz4522/DZ452200QQQ.html",
  "https://shop.diesel.com/en/timeframes/dz7429/DZ742900QQQ.html",
  "https://shop.diesel.com/en/timeframes/dz7428/DZ742800QQQ.html?",
  "https://shop.diesel.com/en/watches/dz1921/DZ192100QQQ.html",
  "https://shop.diesel.com/en/watches/dz1923/DZ192300QQQ.html",
  "https://shop.diesel.com/en/watches/dz1940/DZ194000QQQ.html",
  "https://shop.diesel.com/en/watches/dz5578/DZ557800QQQ.html",
  "https://shop.diesel.com/en/watches/dz5577/DZ557700QQQ.html",
  "https://shop.diesel.com/en/watches/dz5600/DZ560000QQQ.html",
];

(async () => {
  // const result1 = [];
  // const result2 = [];
  const result = [];

  for (let i = 0; i < urls2.length; i++) {
    const { data } = await axios.get(urls2[i]);
    const $ = cheerio.load(data);
    $('.product-tile').each((idx, el) => {
      const thumbnail = $(el).find('img').attr('data-src');
      const url = base + $(el).find('a').attr('href');
      const name = $(el).find('.product-link').text().trim();
      const price = $(el).find('.value').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ");
      const ref = $(el).find('a').attr('href').split('/');
      const reference = ref[3].toUpperCase();

      result.push({
        url, thumbnail, name, reference, price,
      })
    });
  }


  for (let i = 0; i < result.length; i++) {
    console.log(result[i].url);
    const { data } = await axios.get(result[i].url);
    const d = data.replace(/<br \/>/g, '\r');
    const $ = cheerio.load(d);

    result[i].color = $('.variation-attribute.color').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    const gender = $('.variation-attribute.size').text().replace(/(?:\r\n|\r|\n|\s+)/g, " ").trim();
    result[i].gender = gender.match(/uni/i) ? 'X' : result[i].url.match(/women/i) ? 'F' : 'M';
    const description = $('.product-description').text().split('\n');
    result[i].description = description.filter(r => r !== '' && r !== '- QUICK START GUIDE' && r !== 'NOTE:' && r !== 'WARRANTY')
    // result.description = $('.product-description').text().replace('WARRANTY', '').replace(/(?:\r\n|\r|\n|\s+)/g, " ");
    result[i].materials = $('.product-details').text().trim();

    console.log(result[i])
    console.log()
    console.log()
  }


})();