const client = require('axios');
const cheerio = require('cheerio');

const indexing = async (context) => {
  try {
    const { entry, base } = context;
    const result = { collections: [], items: {} };
    const cats = [];
    const json = (await client.get(entry)).data;

    for (const i in json) {
      const collections = json[i]['collectionInfoItems'];
      for (const x of collections) {
        const url = x.id;
        const name = x.name;
        result.items[name] = [];
        result.collections.push(name)
        cats.push({ name, url });
      }
    }

    for (const cat of cats) {
      const urlBase = 'https://www.oris.ch/api/en/collection/getcollection/';
      const collectionUrl = urlBase + cat.url;
      const json = (await client.get(collectionUrl)).data;
      for (const i of json['watches']) {
        const watchId = i.id;
        for (const x of i['models']) {
          const thumbnailBase = 'https://www.oris.ch/data/';
          const reference = x.image.split('_')[1];
          const modelId = x.modelId;
          const url = base + watchId + '/' + modelId;
          const thumbnail = thumbnailBase + x.image;
          result.items[cat.name].push({
            url,
            thumbnail,
            collection: cat.name,
            reference
          });
        }
      }
      return result;
    }
    return result;
  } catch (error) {
    console.log('Failed for indexing class of Oris' +
      ' with error : ' + error
    )
    return [];
  }
};

const extraction = async (context) => {
  try {
    const { url: entry, base } = context;
    const result = {
      url: entry,
      spec: [],
      scripts: [],
      related: []
    };
    const pageId = entry.split('/watch/')[1];
    const pageUrl = 'https://www.oris.ch/api/en/Watch/GetWatch/' + pageId;
    const json = (await client.get(pageUrl)).data;
    const selectedId = json['selectedModelId'].toString();
    let modelId = '';

    result.name = json.name;
    result.description = json.description;
    result.gender = 'M';
    result.reference = json.reference;

    for (const x of json.models) {
      modelId = x.id;
      if (modelId.toString() === selectedId) {
        result.retail = x['priceWithCurrency'];
        let index;
        for (index = 0; index < 4; index++) {
          for (const specs of x.features[index].features) {
            const key = specs['featureType'];
            const value = specs['value'];
            result.spec.push({ key, value });
          }
        }
      }
    }
    return result;
  } catch (error) {
    console.log('Failed for extraction class of Oris' +
      ' with error : ' + error
    )
    return [];
  }
};

(async () => {
  const context = {
    entry: "https://www.oris.ch/api/en/home/getcollections",
    base: "https://www.oris.ch/watch/",
  };
  const r = await indexing(context);
  console.log(r)
  if (r && r.items && r.collections) {
    const context = r.items[r.collections[0]][0];
    const e = await extraction(context);
    if (e.spec && e.spec.length > 0) {
      console.log(e)
    } else {
      console.log('extraction failed...')
    }
  } else {
    console.log('indexing failed...')
  }
})();
