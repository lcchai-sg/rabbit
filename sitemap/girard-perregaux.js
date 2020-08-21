var Sitemapper = require('sitemapper');

var site = new Sitemapper({
  url: 'https://www.girard-perregaux.com/en/sitemap.xml',
  timeout: 30000
});

let results = [];
site.fetch()
  .then(data => {
    data.sites.sort().forEach(val => {
      const a = val.split('/');
      if (a.length === 6) {
        const result = {};
        result.url = val;
        result.collection = a[4].toUpperCase();
        const d = a[5].split('-');
        let name = '';
        let start = 0;
        let sp = "";
        let key = "name";
        result[key] = "";
        for (let i = 0; i < d.length; i++) {
          if (key === "reference") {
            result[key] = result[key] + sp + d[i].toUpperCase();
            sp = "-";
          } else {
            if (d[i].length < 5) {
              result[key] = result[key] + sp + d[i].toUpperCase();
              sp = " ";
            } else {  // check first 5 characters to be number
              const r = d[i].substr(0, 5);
              if (isNaN(r)) {
                result[key] = result[key] + sp + d[i].toUpperCase();
                sp = " ";
              } else {
                key = "reference";
                result[key] = sp + d[i].toUpperCase();
                sp = "-";
              }
            }
          }
        }

        // const mm = d.indexOf('mm');
        // if (mm > 0) {
        //   for (let i = 0; i <= mm; i++) {
        //     name = name + sp + d[i].toUpperCase();
        //     sp = " ";
        //   }
        //   start = mm + 1;
        // } else {
        //   for (let i = 0; i < d.length; i++) {
        //     // check first 5 characters numeric
        //     // isNaN does not work
        //     if (isNaN(d[i])) {
        //       name = name + sp + d[i].toUpperCase();
        //       sp = " ";
        //     } else {
        //       start = i;
        //       break;
        //     }
        //   }
        // }
        // let reference = '';
        // sp = "";
        // for (let i = start; i < d.length; i++) {
        //   reference = reference + sp + d[i].toUpperCase();
        //   sp = '-';
        // }
        // results.push({
        //   url: val,
        //   collection,
        //   name,
        //   reference,
        // })
        results.push(result);
      }
    });
    results.forEach(data => console.log(data))
    console.log('number of watches:', results.length)
  })
  .catch(function (error) {
    console.log(error);
  });