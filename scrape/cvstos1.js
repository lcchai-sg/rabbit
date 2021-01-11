const axios = require('axios');
const { PdfReader } = require('pdfreader');
const Fs = require('fs')
const pdf = './pdf/temp.pdf';

const downloadPdf = async url => {
  const writer = Fs.createWriteStream(pdf)
  const response = await axios.get(url, { responseType: 'stream' });
  response.data.pipe(writer)

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve)
    writer.on('error', reject)
  })
}

const getSpec = async pdf => {
  let buffer = Fs.readFileSync(pdf);
  const reader = new PdfReader();
  let txtArr = []; let prev; let page; let txt = '';
  const result = await new Promise((resolve, reject) => {
    reader.parseBuffer(buffer, (err, item) => {
      if (err) reject(err);
      else if (!item) {
        resolve(txtArr);
      } else if (item.page) {
        page = item.page;
      } else if (item.text) {
        if (prev !== item.y) {
          prev = item.y;
          if (txt) txtArr.push(txt);
          txt = 'P' + page + '...' + item.text;
        } else {
          txt = txt + item.text;
        }
      }
    });
  });
  return result;
}

(async () => {
  const spec = [];
  const url = 'https://www.cvstos.com/sites/default/files/Tourbillon%20Eric%20Kuster.pdf';
  // await downloadPdf(url)
  // const r = await getSpec(pdf);
  // console.log(r);
  await downloadPdf(url)
    .then(r => getSpec(pdf))
    .then(re => {
      re.forEach(value => {
        spec.push({ key: 'PDF', value })
      })
    })
    .catch(e => console.log(e));
  console.log('spec.....', spec)
})();
