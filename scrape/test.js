const rp = require('request-promise');

const entry = "https://www.midowatches.com/us/watches.html";
rp(entry)
    .then(res => {
        console.log('response : ', res);
    })
    .catch(err => {
        console.log('error : ', err);
    });
console.log();
console.log('done.');
process.exit(0);
