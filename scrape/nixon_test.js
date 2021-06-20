const u = require('./nixon_spec');

for (let i = 0; i < u.length; i++) {
    const key = u[i].split('|')[0].trim();
    const value = u[i].split('|')[1].trim();
    if (value.match(/case/i) && !value.match(/the case/i)) {
        console.log(key);
        console.log(value);
        console.log();
    }
}

console.log('done....................');