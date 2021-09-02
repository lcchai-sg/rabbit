const axios = require('axios');
const usa1 = "https://www.hublot.com/en-us/api/watches?country_edition=US&collection=1597";
// const usa2 = "https://www.hublot.com/en-us/api/watches?root_name=Watches&root_uri_name=/en/watches&country_edition=US&country=US&ajax=1";
const usa2 = require('./hublot_usa');

(async () => {
    {
        const { data } = await axios.get(usa1);
        console.log('usa1 : ', data.length);
    }
    // {
    //     const { data } = await axios.get(usa2);
    //     console.log('usa 2 : ', data.length);
    // }
    console.log('usa2 : ', usa2.length);
})()