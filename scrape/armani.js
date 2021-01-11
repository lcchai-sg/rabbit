const client = require('axios');
const cheerio = require('cheerio');

const indexing = async context => {
  const urls = [
    "https://www.armani.com/sg/armanicom/emporio-armani/women/all-watches",
    "https://www.armani.com/sg/armanicom/emporio-armani/men/all-watches",
  ];
  //https://www.armani.com/sg/armanicom/emporio-armani/women/all-watches
  const entry = "https://www.armani.com/sg/armanicom/emporio-armani/men/all-watches";
  const result = [];
  for (const entry of urls) {
    const { data } = await client.get(entry);
    const $ = cheerio.load(data);
    const np = $('.pagination-counter').text().trim().split(' ');
    const npages = parseInt(np[np.length - 1]);
    for (let i = 1; i <= npages; i++) {
      const link = entry + '?page=' + i;
      console.log(link);
      const { data } = await client.get(link);
      const $ = cheerio.load(data);
      $('article ').each((idx, el) => {
        const url = $(el).find('a').attr('href');
        let thumbnail = $(el).find('img').attr('src');
        if (!(thumbnail.match(/http/))) {
          thumbnail = $(el).find('img').attr('data-origin');
        }
        const name = $(el).find('.item-info-title').text().trim();
        const reference = $(el).attr('data-ytos-item');
        const price = $(el).find('.price').text().replace(/(?:\n|\s+)/g, '').trim();
        result.push({ url, name, reference, price, thumbnail, })
      })
    }
  }
  return result;
}

const extraction = async (context) => {
  const { client, entry, ...rest } = context;
  const result = { ...rest, url: entry, spec: [], related: [], }
  const data = (await client.get(entry)).data;
  const $ = cheerio.load(data);
  result.collection = (entry.match(/women/i)) ? 'women' : 'men';
  result.gender = (entry.match(/women/i)) ? 'F' : 'M';
  $('script[type="application/ld+json"]').each((idx, el) => {
    const j = JSON.parse($(el).contents().toString());
    if (j.length) {
      const jj = j[0];
      result.name = jj.name;
      if (jj.image) result.thumbnail = jj.image[0];
      if (jj.offers) result.price = jj.offers[0].priceCurrency + ' ' + jj.offers[0].price;
    }
  })
  result.description = $('.EditorialDescription').text().trim();
  result.reference = $('.item-model-code').find('.value').text().trim();
  let key = $('.compositionInfo').find('.label').text().trim();
  let value = $('.compositionInfo').find('.text').text().trim();
  result.spec.push({ key, value });
  $('.detailsInfo').find('li').each((idx, el) => {
    const key = 'detailsInfo';
    const value = $(el).text().trim();
    result.spec.push({ key, value });
  })
  return result;
};

(async () => {
  // const r = await indexing();
  // console.log(r);
  // console.log()
  // console.log(r.length);

  const r = [
    {
      url: 'https://www.armani.com/sg/armanicom/emporio-armani/_cod50241451ve.html#dept=wtchs',
      name: 'Steel Strap Watch',
      reference: '50241451VE',
      price: 'US$300',
      thumbnail: 'https://www.armani.com/50/50241451VE_13_f.jpg'
    },
    {
      url: 'https://www.armani.com/sg/armanicom/emporio-armani/_cod50236382xn.html#dept=wtchs',
      name: 'Steel Strap Watch',
      reference: '50236382XN',
      price: 'US$435',
      thumbnail: 'https://www.armani.com/50/50236382XN_13_f.jpg'
    },
    {
      url: 'https://www.armani.com/sg/armanicom/emporio-armani/three-hand-stainless-steel-watch_cod50241452wk.html#dept=wtchs',
      name: 'Three-Hand Stainless Steel Watch',
      reference: '50241452WK',
      price: 'US$300',
      thumbnail: 'https://www.armani.com/50/50241452WK_13_f.jpg'
    },
    {
      url: 'https://www.armani.com/sg/armanicom/emporio-armani/men-s-swiss-made-esedra-automatic-three-hand-watch_cod50198097cr.html#dept=wtchs',
      name: "Men's Swiss Made Esedra Automatic Three-Hand Watch",
      reference: '50198097CR',
      price: 'US$1,090',
      thumbnail: 'https://www.armani.com/50/50198097CR_13_f.jpg'
    }
  ];
  // const values = [];
  for (let i = 0; i < r.length; i++) {
    const ex = await extraction({
      ...r[i],
      entry: r[i].url,
      client,
    });
    // ex.spec && ex.spec.forEach(v => {
    //   if (values.indexOf(v.value) < 0) values.push(v.value);
    // })
    console.log(ex);
  }
  // values.sort();
  // const cases = []; const dial = []; const band = []; const glass = [];
  // const others = [];
  // values.forEach(v => {
  //   if (v.match(/case|atm|mm|diameter|thick|height|size|water/i)) cases.push(v);
  //   else if (v.match(/band|strap|bracelet|bangle/i)) band.push(v);
  //   else if (v.match(/dial/i)) dial.push(v);
  //   else if (v.match(/glass|crystal/i)) glass.push(v);
  //   else others.push(v);
  // })
  // console.log('case.....'); cases.forEach(v => console.log(v)); console.log();
  // console.log('band.....'); band.forEach(v => console.log(v)); console.log();
  // console.log('dial.....'); dial.forEach(v => console.log(v)); console.log();
  // console.log('glass.....'); glass.forEach(v => console.log(v)); console.log();
  // console.log('others.....'); others.forEach(v => console.log(v)); console.log();
  // console.log('***** done *****');
})();