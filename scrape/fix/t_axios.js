const axios = require('axios');

(async () => {
    let url = "https://www.prestigetime.com/item/Glashutte-Original/Pavonina-Quartz/1-03-02-12-12-35.html";
    const { data, status, statusText, headers, config } = await axios.get(url);
    // const { data, status, statusText, headers, config } = await axios.get(url, { responseType: 'stream' });
    console.log('status : ', status);
    console.log('statusText : ', statusText);
    console.log('headers : ', headers);
    console.log('config : ', config);
    console.log();
    url = "https://synopsis.cosmos.ieplsg.com/files/4,036992f004e32e";
    const { data: d1, status: s1, statusText: st1, headers: h1, config: c1 } = await axios.get(url, { responseType: 'stream' });
    console.log('status : ', s1);
    console.log('statusText : ', st1);
    console.log('headers : ', h1);
    console.log('config : ', c1);
    url = "https://www.jomashop.com/armani-exchange-chronograph-quartz-black-dial-mens-watch-ax1818.html";
    // const { data: d2, status: s2, statusText: st2, headers: h2, config: c2 } = await axios.get(url, { responseType: 'stream' });
    const { data: d2, status: s2, statusText: st2, headers: h2, config: c2 } = await axios.get(url);
    console.log('status : ', s2);
    console.log('statusText : ', st2);
    console.log('headers : ', h2);
    console.log('config : ', c2);

    console.log();
    console.log('done.');
})();