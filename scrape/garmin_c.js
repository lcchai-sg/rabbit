const axios = require('axios');

(async () => {
  const uniq = []; const dup = []; const prod = [];
  const ids = [
    '10002', '10660', '10662', '10664', '10668', '10921', '11040',
  ];
  for (let i = 0; i < ids.length; i++) {
    //https://buy.garmin.com/categoryServices/en-US/US/categories/13060/products?currentPage=1&itemsPerPage=50
    const entry = "https://buy.garmin.com/categoryServices/en-US/US/categories/" + ids[i] + "/products?currentPage=1&itemsPerPage=50";
    console.log(entry);
    const { data } = await axios.get(entry);
    for (let j = 0; j < data.products.length; j++) {
      const p = data.products[j];
      if (uniq.indexOf(p.url) < 0) {
        uniq.push(p.url);
        prod.push({
          id: p.id, name: p.name, collid: ids[i],
          description: p.description && p.description.longText ?
            p.description && p.description.longText :
            p.description && p.description.shortText ?
              p.description && p.description.shortText : null,
          url: p.url,
        })
      } else dup.push({ id: ids[i], url: p.url });
    }
    await new Promise(r => setTimeout(r, 5000));
  }

  prod.sort().forEach(u => console.log(u.collid + ' | ' + u.url));
  console.log()
  console.log('products : ', prod.length);
  console.log()
  // dup.sort().forEach(u => console.log(u));
  // console.log()
  // console.log()
  console.log('done.')
})();