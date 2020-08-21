const axios = require('axios');
const cheerio = require('cheerio');

const indexing = async () => {
  const entry =
    // "https://www.cartier.sg/en-sg/collections/jewellery/categories/rings.viewall.html";
    // "https://www.cartier.sg/en-sg/collections/jewellery/categories/bracelets.viewall.html";
    "https://www.cartier.sg/en-sg/collections/jewellery/categories/necklaces.viewall.html";
  // "https://www.cartier.sg/en-sg/collections/jewellery/categories/earrings.viewall.html";
  const data = (await axios.get(entry)).data;
  const $ = cheerio.load(data);
  const rings = [];

  $('.one-product').each((idx, el) => {
    const url = $(el).find('a').attr('href');
    const d = $(el, '.prod-name').text().trim().split('\n');
    const name = d[0];
    const materials = d[1].trim();
    rings.push({
      url, name, materials
    })
  });

  rings.sort((a, b) => {
    let x = a.name.toLowerCase();
    let y = b.name.toLowerCase();
    if (x < y) return -1; else return 1;
  })

  rings.forEach(val => console.log(val));
}

indexing();