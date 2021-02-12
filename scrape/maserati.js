const axios = require('axios');
const cheerio = require('cheerio');

const indexing = async context => {
  const { client, entry, base, } = context;
  const source = "official";
  const lang = "en";
  const brand = "Maserati";
  const brandID = 346;
  const result = { source, lang, brand, brandID, collections: ['all'], items: { 'all': [] } };
  try {
    const { data } = await client.get(entry);
    const $ = cheerio.load(data);
    $(".product.end").each((idx, el) => {
      const url = $(el).find("a").attr("href");
      const name = $(el).find(".product-image").attr("title");
      const thumbnail = $(el).find("img").attr("src");
      const price = $(el).find(".special-price").find(".price").text().replace(/\s+/g, '');
      const retail = $(el).find(".old-price").find(".price").text().replace(/\s+/g, '');
      const rprice = $(el).find(".regular-price").find(".price").text().replace(/\s+/g, '');
      result.items['all'].push({
        source, lang, brand, brandID, url, name, thumbnail,
        price: price ? price : rprice,
        retail: retail ? retail : rprice,
      })
    })
    return result;
  } catch (error) {
    console.error('Failed indexing for Maserati with error : ', error);
    return {};
  }
}

const extraction = async context => {
  const { client, entry, base, ...rest } = context;
  const result = { ...rest, url: entry, spec: [], };
  try {
    const { data } = await client.get(entry);
    const $ = cheerio.load(data);
    result.name = $("meta[property='og:title']").attr("content");
    result.description = $("meta[property='og:description']").attr("content");
    result.thumbnail = $("meta[property='og:image']").attr("content");
    const retail = $(".old-price").find(".price").text().replace(/\s+/g, '');
    const price = $(".special-price").find(".price").text().replace(/\s+/g, '');
    const rprice = $(".regular-price").find(".price").text().replace(/\s+/g, '');
    result.price = price ? price : rprice;
    result.retail = retail ? retail : rprice;
    result.reference = $(".product-sku").text();
    const c = $(".description-wrapper").text();
    result.description.split('-').forEach(value => {
      result.spec.push(value);
    })
  } catch (error) {
    console.error('Failed extraction for Maserati with error : ', error);
    console.error('entry : ', entry);
    if (error.response) result.code = error.response.status;
    else result.code = 'UNKNOWN ERROR';
  }
  return result;
}

(async () => {
  // const r = await indexing({
  //   client: axios,
  //   entry: 'https://www.maseratistore.com/us_en/watches.html',
  //   base: 'https://www.maseratistore.com/us_en',
  // });
  // r.items['all'].forEach(w => console.log(w));

  const r = [
    {
      source: 'official',
      lang: 'en',
      brand: 'Maserati',
      brandID: 346,
      url: 'https://www.maseratistore.com/us_en/watches/sfida-watch-r8853140001.html',
      name: 'Sfida Watch (R8853140001)',
      thumbnail: 'https://www.maseratistore.com/media/catalog/product/cache/0/small_image/560x560/0dc2d03fe217f8c83829496872af24a0/9/2/920029230_1_1.jpg',
      price: 'US$160.30',
      retail: 'US$229.00'
    },
    {
      source: 'official',
      lang: 'en',
      brand: 'Maserati',
      brandID: 346,
      url: 'https://www.maseratistore.com/us_en/watches/sfida-watch-r8823140002.html',
      name: 'Sfida Watch (R8823140002)',
      thumbnail: 'https://www.maseratistore.com/media/catalog/product/cache/0/small_image/560x560/0dc2d03fe217f8c83829496872af24a0/9/2/920029228_1_1.jpg',
      price: 'US$312.90',
      retail: 'US$447.00'
    },
    {
      source: 'official',
      lang: 'en',
      brand: 'Maserati',
      brandID: 346,
      url: 'https://www.maseratistore.com/us_en/watches/sfida-watch-grey-gun-pvd-r8873640001.html',
      name: 'Sfida Watch Grey Gun Pvd (R8873640001)',
      thumbnail: 'https://www.maseratistore.com/media/catalog/product/cache/0/small_image/560x560/0dc2d03fe217f8c83829496872af24a0/9/2/920029239_1_1.jpg',
      price: 'US$224.70',
      retail: 'US$321.00'
    },
    {
      source: 'official',
      lang: 'en',
      brand: 'Maserati',
      brandID: 346,
      url: 'https://www.maseratistore.com/us_en/watches/sfida-watch-r8873640003.html',
      name: 'Sfida Watch (R8873640003)',
      thumbnail: 'https://www.maseratistore.com/media/catalog/product/cache/0/small_image/560x560/0dc2d03fe217f8c83829496872af24a0/9/2/920029241_1_1.jpg',
      price: 'US$208.60',
      retail: 'US$298.00'
    },
    {
      source: 'official',
      lang: 'en',
      brand: 'Maserati',
      brandID: 346,
      url: 'https://www.maseratistore.com/us_en/watches/watch-epoca-lady-r8851118501.html',
      name: 'WATCH EPOCA LADY R8851118501',
      thumbnail: 'https://www.maseratistore.com/media/catalog/product/cache/0/small_image/560x560/0dc2d03fe217f8c83829496872af24a0/9/2/920016238_01.jpg',
      price: 'US$299.00',
      retail: 'US$299.00'
    },
    {
      source: 'official',
      lang: 'en',
      brand: 'Maserati',
      brandID: 346,
      url: 'https://www.maseratistore.com/us_en/watches/watch-epoca-lady-r8853118502.html',
      name: 'WATCH EPOCA LADY R8853118502',
      thumbnail: 'https://www.maseratistore.com/media/catalog/product/cache/0/small_image/560x560/0dc2d03fe217f8c83829496872af24a0/9/2/920016239_01.jpg',
      price: 'US$299.00',
      retail: 'US$299.00'
    },
    {
      source: 'official',
      lang: 'en',
      brand: 'Maserati',
      brandID: 346,
      url: 'https://www.maseratistore.com/us_en/watches/watch-epoca-lady-r8853118504.html',
      name: 'WATCH EPOCA LADY R8853118504',
      thumbnail: 'https://www.maseratistore.com/media/catalog/product/cache/0/small_image/560x560/0dc2d03fe217f8c83829496872af24a0/9/2/920016242_01.jpg',
      price: 'US$249.00',
      retail: 'US$249.00'
    },
    {
      source: 'official',
      lang: 'en',
      brand: 'Maserati',
      brandID: 346,
      url: 'https://www.maseratistore.com/us_en/watches/potenza-lady-35mm.html',
      name: 'Potenza Lady 35mm',
      thumbnail: 'https://www.maseratistore.com/media/catalog/product/cache/0/small_image/560x560/0dc2d03fe217f8c83829496872af24a0/9/2/920016246_01_1.jpg',
      price: 'US$299.00',
      retail: 'US$299.00'
    },
    {
      source: 'official',
      lang: 'en',
      brand: 'Maserati',
      brandID: 346,
      url: 'https://www.maseratistore.com/us_en/watches/campione-kids-black-28mm.html',
      name: 'Campione Kids black 28mm',
      thumbnail: 'https://www.maseratistore.com/media/catalog/product/cache/0/small_image/560x560/0dc2d03fe217f8c83829496872af24a0/9/2/920028595_01.jpg',
      price: 'US$74.00',
      retail: 'US$74.00'
    },
    {
      source: 'official',
      lang: 'en',
      brand: 'Maserati',
      brandID: 346,
      url: 'https://www.maseratistore.com/us_en/watches/campione-kids.html',
      name: 'Campione Kids',
      thumbnail: 'https://www.maseratistore.com/media/catalog/product/cache/0/small_image/560x560/0dc2d03fe217f8c83829496872af24a0/9/2/920028596_01.jpg',
      price: 'US$74.00',
      retail: 'US$74.00'
    },
    {
      source: 'official',
      lang: 'en',
      brand: 'Maserati',
      brandID: 346,
      url: 'https://www.maseratistore.com/us_en/watches/campione-kids-red-28mm.html',
      name: 'Campione Kids red 28mm',
      thumbnail: 'https://www.maseratistore.com/media/catalog/product/cache/0/small_image/560x560/0dc2d03fe217f8c83829496872af24a0/9/2/920028597_01.jpg',
      price: 'US$74.00',
      retail: 'US$74.00'
    },
    {
      source: 'official',
      lang: 'en',
      brand: 'Maserati',
      brandID: 346,
      url: 'https://www.maseratistore.com/us_en/watches/campione-kids-white-28mm.html',
      name: 'Campione Kids white 28mm',
      thumbnail: 'https://www.maseratistore.com/media/catalog/product/cache/0/small_image/560x560/0dc2d03fe217f8c83829496872af24a0/9/2/920028600_01.jpg',
      price: 'US$74.00',
      retail: 'US$74.00'
    },
  ];

  const d = [];
  for (let i = 0; i < r.length; i++) {
    const ex = await extraction({
      client: axios,
      entry: r[i].url,
      base: 'https://www.maseratistore.com/us_en',
      ...r[i],
    });
    console.log(ex);
    d.push(ex.description);
  }
  d.forEach(d => console.log(d))
})();