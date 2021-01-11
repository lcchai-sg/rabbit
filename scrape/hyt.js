const axios = require('axios');
const cheerio = require('cheerio');

const extraction = async (context) => {
  const { client, entry, base, ...rest } = context;
  const baseURL = base ? base : "https://www.hytwatches.com";
  const result = { ...rest, url: entry, spec: [], related: [] };
  try {
    const { data } = await client.get(entry)
    const $ = cheerio.load(data);
    result.thumbnail = $(".field--name-field-model-image-day").find("img").attr("src");
    result.name = $(".main-image-section-description-block").text();
    result.collection = $(".main-image-section-description-block").find("h2").text();
    result.description = $(".field--name-field-description").text();
    $(".specifications-block").each((idx, el) => {
      const key = $(el).find(".title").text().trim();
      let list = false;
      $(el).find("li").each((idx, el) => {
        list = true;
        const value = $(el).text();
        result.spec.push({ key, value });
      })
      if (!list) {
        const value = $(el).find(".description").text().replace(/\s+/g, '');
        if (value) result.spec.push({ key, value });
      }
    })
  } catch (error) {
    logger.error('Failed extraction for IWC with error : ' + error);
    logger.error('entry : ', entry);
    if (error.response) result.code = error.response.status;
    else result.code = 'UNKNOWN ERROR';
  }
  return result;
};

(async () => {
  const r = [
    "https://www.hytwatches.com/model/flow-blue-fluid",
    "https://www.hytwatches.com/model/flow-black-fluid",
    "https://www.hytwatches.com/model/h5-blue",
    "https://www.hytwatches.com/model/h5-green",
    "https://www.hytwatches.com/model/h5-red-fluid",
    "https://www.hytwatches.com/model/h5-black",
    "https://www.hytwatches.com/model/soonow-instant-rainbow",
    "https://www.hytwatches.com/model/soonow-drop-three",
    "https://www.hytwatches.com/model/soonow-blue",
    "https://www.hytwatches.com/model/soonow-drop-one",
    "https://www.hytwatches.com/model/soonow-limited-edition",
    "https://www.hytwatches.com/model/soonow-green",
    "https://www.hytwatches.com/model/h20-red-fluid",
    "https://www.hytwatches.com/model/h20-mexico-green",
    "https://www.hytwatches.com/model/h20-mexico-white",
    "https://www.hytwatches.com/model/h20-mexico-red",
    "https://www.hytwatches.com/model/h20-all-black",
    "https://www.hytwatches.com/model/h20-time-fluid",
    "https://www.hytwatches.com/model/h20-time-fluid-black",
    "https://www.hytwatches.com/model/h20-brown",
    "https://www.hytwatches.com/model/h20-all-black-blue",
    "https://www.hytwatches.com/model/h20-all-black-red",
    "https://www.hytwatches.com/model/h20-silver",
    "https://www.hytwatches.com/model/h20-black",
    "https://www.hytwatches.com/model/h10xmrporter",
    "https://www.hytwatches.com/model/h10-black",
    "https://www.hytwatches.com/model/h10-blue",
    "https://www.hytwatches.com/model/h10-red",
    "https://www.hytwatches.com/model/h10-green",
    "https://www.hytwatches.com/model/h0-black-fluid",
    "https://www.hytwatches.com/model/h0-red-khaki",
    "https://www.hytwatches.com/model/h0-black-grey",
    "https://www.hytwatches.com/model/h0-diamonds-black",
    "https://www.hytwatches.com/model/h0-diamonds-red",
    "https://www.hytwatches.com/model/h0-time-precious",
    "https://www.hytwatches.com/model/h0-gold-blue",
    "https://www.hytwatches.com/model/h0-feel-hyt-edition",
    "https://www.hytwatches.com/model/h0-x-eau-rouge-silver",
    "https://www.hytwatches.com/model/h0-x-eau-rouge-anthracite",
    "https://www.hytwatches.com/model/h0-gold",
    "https://www.hytwatches.com/model/h0-blue-night",
    "https://www.hytwatches.com/model/h0-silver",
    "https://www.hytwatches.com/model/h0-black",
    "https://www.hytwatches.com/model/h3-iceberg",
    "https://www.hytwatches.com/model/h3-titanium-and-platinum-2"
  ];
  for (let i = 0; i < r.length; i++) {
    const ex = await extraction({
      client: axios,
      entry: r[i],
      base: "https://www.hytwatches.com",
    })
    console.log(ex.url)
    ex.spec.forEach(s => console.log(s.key + ' | ' + s.value));
  }

})();