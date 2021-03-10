const axios = require('axios');

(async () => {
  for (let i = 12692; i < 20000; i++) {
    console.log(i);
    try {
      const entry = "https://buy.garmin.com/categoryServices/en-US/US/categories/" + i + "/products";
      const { data } = await axios.get(entry);
      const j = data;
      if (j.meta && j.meta.totalProductCount && j.meta.totalProductCount > 0)
        console.log('           ', i, j.meta.totalProductCount);
    } catch (error) {
      console.log(error)
      await new Promise(r => setTimeout(r, 10000));
    }
    await new Promise(r => setTimeout(r, 1000));
  }
})();