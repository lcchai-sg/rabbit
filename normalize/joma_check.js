const ref_urls = require('./joma_ref_urls');
const joma_urls = require('./joma_urls');
const joma_urls_not = require('./joma_urls_not');

console.log("<<<<< checking jomas >>>>>")
ref_urls.sort();
ref_urls.forEach(u => {
  if (joma_urls.indexOf(u) < 0 && joma_urls_not.indexOf(u) < 0) {
    console.log("           NOT EXISTS", u);
  } else if (joma_urls_not.indexOf(u) >= 0) {
    console.log("      NOT PRODUCT", u);
  }
})
console.log(">>>>> checking ref_urls <<<<<")
joma_urls.sort();
joma_urls.forEach(u => {
  if (ref_urls.indexOf(u) < 0) {
    console.log("  NOT IN REF_URLS", u);
  }
})

console.log("***** completed *****")