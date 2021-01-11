const axios = require('axios');

const indexing = async (context) => {
  const { client, entry, base, } = context;
  const baseURL = base ? base : "https://www.memorigin.com/mem_1dot1/";
  const source = "official";
  const lang = "en";
  const brand = "Memorigin";
  const brandID = 256;
  const result = { source, lang, brand, brandID, collections: ['all'], items: { 'all': [] }, };
  const entry1 = "https://www.memorigin.com/mem_1dot1/main/item.php?lang=eng&sno=";
  try {
    const { data } = await client.get(entry);
    const j = JSON.parse(data.replace(/'/g, "\""));
    let n = 0;
    const urls = [];
    j.series.forEach(w => {
      const wno = parseInt(w.sno);
      if (n < wno) n = wno;
      const url = entry1 + wno;
      const collection = w.name;
      const name = w.name;
      const thumbnail = baseURL + w.pic_loc;
      const ref = w.pic_loc.split('/');
      const reference = ref[ref.length - 1].replace('.png', '');
      result.items['all'].push({
        source, lang, brand, brandID, url, collection, name, reference,
        thumbnail, price: null,
      });
      urls.push(url);
    })
    for (let i = 1; i <= n; i++) {
      const url = "https://www.memorigin.com/mem_1dot1/main/item.php?lang=eng&sno=" + i;
      if (urls.indexOf(url) < 0)
        result.items['all'].push({
          source, lang, brand, brandID, url, reference: i, price: null,
        })
    }
    return result;
  } catch (error) {
    console.error('Failed indexing for Memorigin with error : ' + error);
    console.error('entry : ', entry);
    return {};
  }
};

const index = async (context) => {
  try {
    const { client, entry, base, } = context;
    const source = "official";
    const lang = "en";
    const brand = "Memorigin";
    const brandID = 256;
    const result = { source, lang, brand, brandID, collections: [], items: {} };

    const { data } = await client.get(entry);
    const j = JSON.parse(data.replace(/'/g, "\""));
    let n = 0;
    j.series.forEach(w => {
      const wno = parseInt(w.sno);
      if (n < wno) n = wno;
    })
    //https://www.memorigin.com/mem_1dot1/main/item.php?lang=eng&sno=58
    //https://www.memorigin.com/mem_1dot1/libs/getSeries.php?
    // n = 26
    const urls = [];
    const entry1 = "https://www.memorigin.com/mem_1dot1/main/item.php?lang=eng&sno=";
    let cnt = 0;
    for (let i = 1; i <= n; i++) {
      const link = entry1 + i;
      // console.log(link)
      const result = {
        source: 'official', lang: 'en', brand: 'Memorigin', brandID: 256,
        url: link, spec: [],
      }
      const { data } = await client.get(link);
      const jd = data.replace(/(?:\r\n|\r|\n|\s+)/g, " ").match(/var text_info = {(.*)}/gi);
      if (jd) {
        const jj = jd[0].replace(/var text_info = /i, '');
        const jjj = jj.split('</div>');
        let seq = 0;
        jjj.forEach((v, idx) => {
          const vv = v.split('</p>');
          if (vv) {
            const coll = vv[0].split("'detail_title'>");
            if (coll && coll.length > 1) {
              spec = [];
              seq++;
              const bar = vv[vv.length - 1].match(/barcode : \w+/ig);
              const bc = bar ? bar[0].split(':')[1].trim() : null;
              result.reference = bc ? bc : 'sno.' + i + '-' + seq;
              result.collection = coll[1];
              vv.forEach(v => {
                if (v.match(/<\/br>|<br\/>/i)) {
                  const td = v.match(/<\/br>/i) ? v.split('</br>') : v.split('<br/>');
                  let sentence1 = '';
                  td.forEach(value => {
                    if (value !== '')
                      if (value.match(/<p/i)) {
                        const data = value.split('>')[1];
                        if (data) spec.push(data);
                      } else {
                        if (sentence1) {
                          spec.push(sentence1 + ' ' + value);
                          sentence1 = '';
                        } else {
                          if ((value.match(/balance wheel|escapement/i) && !value.match(/center of balance wheel/i)) || (value.match(/ rotate/) && !value.match(/one circle/i))) {
                            sentence1 = value;
                          } else {
                            let val = value;
                            if (value.match(/subassembly module and/i) && !value.match(/jewels/i)) {
                              if (value.match(/and \d{2,3}/i)) val = value + ' jewels';
                            }
                            if (val && !val.match(/<a/) && val.toLowerCase() !== 'jewels' && val.toLowerCase() !== '</pre>' && val.toLowerCase() !== '(Pre-order only)')
                              spec.push(val);
                          }
                        }
                      }
                  })
                }
              })
              console.log(link)
              console.log(result.reference)
              console.log(spec)
              if (urls.indexOf(link) < 0) urls.push(link);
              cnt++;
              console.log()
              // console.log('           spec: ', spec)
              // console.log('---------------');
              result.spec.push({ barcode: result.reference, spec })

              console.log(result)
              result.spec.forEach(s => {
                console.log('barcode : ', s.barcode)
                console.log('spec : ', s.spec)
              })
            }
          }
        })
      }
    }
    urls.forEach(u => console.log(u));
    console.log()
    console.log('number of collections: ', urls.length)
    console.log('number of watches: ', cnt)
    return result;
  } catch (error) {
    console.error('Failed indexing for Memorigin with error : ' + error)
    return {};
  }
};

const extraction = async (context) => {
  const { client, entry, base, ...rest } = context;
  const baseURL = base ? base : "https://www.memorigin.com/mem_1dot1";
  const result = { ...rest, url: entry, spec: [], related: [], };
  try {
    const { data } = await client.get(entry);
    const jd = data.replace(/(?:\r\n|\r|\n|\s+)/g, " ").match(/var text_info = {(.*)}/gi);
    const imgs = []; const barcodes = [];
    const img = data.match(/class="img_hide" src='(.*)' /ig);
    img && img.forEach(val => {
      const imgurl = val.split('src=')[1].replace('../', baseURL).replace(/'/g, '').trim();
      imgs.push(imgurl);
    })
    if (jd) {
      const jj = jd[0].replace(/var text_info = /i, '');
      const jjj = jj.split('</div>');
      jjj.forEach((v, idx) => {
        const vv = v.split('</p>');
        if (vv) {
          const coll = vv[0].split("'detail_title'>");
          if (coll && coll.length > 1) {
            const spec = [];
            const bar = vv[vv.length - 1].match(/barcode : \w+/ig);
            const bc = bar ? bar[0].split(':')[1].trim() : null;
            const thumbnail = imgs.length > idx ? imgs[idx] : null;
            const ref = thumbnail ? thumbnail.split('/') : null;
            const refr = ref ? ref[ref.length - 1].replace('.png', '') : null;
            result.reference = bc ? bc : refr;
            result.collection = coll[1];
            vv.forEach((v, idx) => {
              if (v.match(/<\/br>|<br\/>/i)) {
                const td = v.match(/<\/br>/i) ? v.split('</br>') : v.split('<br/>');
                let sentence1 = '';
                td.forEach(value => {
                  if (value === 'Mor Him:') {
                    result.code = 'BUNDLED';
                    return result;
                  }
                  if (value !== '')
                    if (value.match(/<p/i)) {
                      const data = value.split('>')[1];
                      if (data) spec.push(data);
                    } else {
                      if (sentence1) {
                        spec.push(sentence1 + ' ' + value);
                        sentence1 = '';
                      } else {
                        if ((value.match(/balance wheel|escapement/i) && !value.match(/center of balance wheel/i)) || (value.match(/ rotate/) && !value.match(/one circle/i))) {
                          sentence1 = value;
                        } else {
                          let val = value;
                          if (value.match(/subassembly module and/i) && !value.match(/jewels/i)) {
                            if (value.match(/and \d{2,3}/i)) val = value + ' jewels';
                          }
                          if (val && !val.match(/<a/) && val.toLowerCase() !== 'jewels' && val.toLowerCase() !== '</pre>' && val.toLowerCase() !== '(Pre-order only)')
                            spec.push(val);
                        }
                      }
                    }
                })
              }
            })

            if (barcodes.indexOf(result.reference) < 0) {
              result.spec.push({ reference: result.reference, thumbnail, spec });
              barcodes.push(result.reference);
            }
          }
        }
      })
    } else {
      result.code = 'not product';
    }
  } catch (error) {
    console.error('Failed extraction for Memorigin with error : ' + error);
    console.error('entry :', entry);
    if (error.response) result.code = error.response.status;
    else result.code = 'UNKNOWN ERROR';
  }
  return result;
};

(async () => {
  const r = await indexing({
    // entry: "https://www.memorigin.com/mem_1dot1/libs/getSeries.php",
    entry: "https://www.memorigin.com/mem_1dot1/libs/getSeries.php?lang=eng",
    client: axios,
    base: "https://www.memorigin.com/mem_1dot1/",
  });
  // console.log(r);

  // for (let i = 0; i < r.items['all'].length; i++) {
  //   console.log(r.items['all'][i]);
  // }
  // r.items['all'].forEach(w => console.log(w));

  // const r = [
  // "https://www.memorigin.com/mem_1dot1/main/item.php?lang=eng&sno=88",
  // "https://www.memorigin.com/mem_1dot1/main/item.php?lang=eng&sno=18",
  // "https://www.memorigin.com/mem_1dot1/main/item.php?lang=eng&sno=55",
  // ];

  for (let i = 0; i < r.items['all'].length; i++) {
    const ex = await extraction({
      client: axios,
      entry: r.items['all'][i].url,
      base: "https://www.memorigin.com/mem_1dot1/",
      source: "official",
      lang: "en",
      brand: "Memorigin",
      brandID: 256,
    })
    console.log(ex)
    console.log(ex.spec)
  }
})();