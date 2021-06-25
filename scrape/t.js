const axios = require('axios');
const fetch = require("cross-fetch");

const entry = [
    "https://www.hublot.com/en-jp/api/watches?root_name=Watches&root_uri_name=/en/watches&country_edition=JP",
    "https://www.hublot.com/en-jp/api/watches?root_name=Watches&root_uri_name=/en/watches&country_edition=JP&country=JP&ajax=1",
    "https://www.hublot.com/en-hk/api/watches?root_name=Watches&root_uri_name=/en/watches&country_edition=HK&country=HK&ajax=1",
    "https://www.hublot.com/en-us/api/watches?root_name=Watches&root_uri_name=/en/watches&country_edition=US",
    "https://www.hublot.com/en-ca/api/watches?root_name=Watches&root_uri_name=/en/watches&country_edition=CA",
    "https://www.hublot.com/en-tw/api/watches?root_name=Watches&root_uri_name=/en/watches&country_edition=TW",
    "https://www.hublot.com/en-de/api/watches?root_name=Watches&root_uri_name=/en/watches&country_edition=DE",
    "https://www.hublot.com/en-gr/api/watches?root_name=Watches&root_uri_name=/en/watches&country_edition=GR",
    "https://www.hublot.com/en-fr/api/watches?root_name=Watches&root_uri_name=/en/watches&country_edition=FR",
    "https://www.hublot.com/en-it/api/watches?root_name=Watches&root_uri_name=/en/watches&country_edition=IT",
    "https://www.hublot.com/en-gb/api/watches?root_name=Watches&root_uri_name=/en/watches&country_edition=GB", ,
];

(async () => {
    {
        console.log(new Date())
        console.log(entry[0]);
        const { data } = await axios.get(entry[0], { timeout: 60000 });
        console.log(data);
    }
    {
        console.log(new Date());
        console.log(entry[0]);
        const { data } = await axios.get(entry[0]);
        console.log(data);
        console.log(new Date());
    }
    // {
    //     const res = await fetch(entry[0]);
    //     const data = await res.json();
    //     console.log(data)
    // }
})();