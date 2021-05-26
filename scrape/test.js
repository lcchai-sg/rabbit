const needle = require('needle');
const fetch = require('node-fetch');

fetch('https://usa.tommy.com/static/sitemap.xml')
    .then(res => {
        console.log(res)
    })
    .catch(err => {
        console.log(err);
    });


