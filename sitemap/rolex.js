const sitemap = require('sitemapper');
const axios = require('axios');

const extraction = async (context) => {
  try {
    let { client, entry, source, lang, brand, brandID, collection, name, reference, thumbnail } = context;
    if (!source) source = 'official';
    if (!lang) lang = 'en';
    const result = {
      source,
      lang,
      brand,
      brandID,
      url: entry,
      collection,
      name,
      reference,
      thumbnail,
      spec: [],
      scripts: [],
      related: [],
    };
    const link = entry.replace(".html", ".model.json");
    const { data } = await axios.get(link);
    const j = JSON.parse(JSON.stringify(data));
    result.collection = j['pageProperties']['modelpage']['familyName'];
    result.name = j['pageProperties']['metaData']['og:title'];
    let description = j[':items']['root'][':items']['responsivegrid'][':items']['modelpagetextblock']['title'];
    result.description = description + '\n' + j[':items']['root'][':items']['responsivegrid'][':items']['modelpagetextblock']['text'];
    reference = j['pageProperties']['modelpage']['rmc'];
    result.reference = reference.toUpperCase();
    result.thumbnail = j['pageProperties']['metaData']['og:image'];
    {
      const link = 'https://www.rolex.com/content/api/rolex/model-price.US.' + reference + '.en.json';
      const { data } = await axios.get(link);
      const j = JSON.parse(JSON.stringify(data));
      result.price = j['formattedPrice'];
    }
    let spec = j[':items']['root'][':items']['responsivegrid'][':items']['expand'][':items']['root'][':items']['expandlist'][':items']['root'][':items']['modelpagespecgrid']['columns'];
    spec.forEach(s => {
      const cat = s.firstTitle.toLowerCase();
      s.items.forEach(i => {
        result.spec.push({
          cat, key: i.title.toLowerCase(), value: i.text,
        })
      })
    })
    return result;
  } catch (error) {
    console.log('Failed extraction for Rolex with error : ' + error);
    return {};
  }
};

(async () => {
  // const sm = new sitemap({
  //   url: "https://www.rolex.com/en/sitemap.xml",
  //   timeout: 300000,
  // });

  // const m = await sm.fetch();
  // m.sites.sort();
  // m.sites.forEach(v => {
  //   if (v.match(/\/watches\//i)) {
  //     let m = v.split('/');
  //     if (m.length === 6 && (!(v.match(/all-/i)))) {
  //       const reference = m[m.length - 1].split('-')[0];
  //       const collection = m[m.length - 2];
  //       const name = collection + '-' + reference;
  //       console.log(v, collection, name, reference);
  //     }
  //   }
  // });

  const u = [
    "https://www.rolex.com/watches/lady-datejust/m279165-0024.html",
    "https://www.rolex.com/watches/sea-dweller/m126603-0001.html",
    "https://www.rolex.com/watches/explorer/m214270-0003.html",
    "https://www.rolex.com/watches/sky-dweller/m326238-0007.html",
    "https://www.rolex.com/watches/milgauss/m116400gv-0002.html",
    "https://www.rolex.com/watches/cellini/m50515-0010.html",
    "https://www.rolex.com/watches/pearlmaster/m86409rbr-0001.html",
    "https://www.rolex.com/watches/air-king/m116900-0001.html",
    "https://www.rolex.com/watches/oyster-perpetual/m277200-0004.html",
    "https://www.rolex.com/watches/cosmograph-daytona/m116515ln-0018.html",
  ];

  for (let i = 0; i < u.length; i++) {
    const r = await extraction({
      source: "official",
      lang: "en",
      brand: "Rolex",
      brandID: 1,
      entry: u[i],
    });
    console.log(r);
    console.log();
  }
})();