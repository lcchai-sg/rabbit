const cheerio = require('cheerio');
const axios = require('axios');

const extraction = async (context) => {
  let { client, entry, ...rest } = context;
  const result = { ...rest, url: entry, spec: [], related: [], };
  try {
    const link = entry.replace(".html", ".model.json");
    const { data } = await client.get(link);
    const j = JSON.parse(JSON.stringify(data));
    if (j['pageProperties'] && j['pageProperties']['modelpage'] && j['pageProperties']['modelpage']['rmc']) {
      result.collection = j['pageProperties']['modelpage']['familyName'];
      result.name = j['pageProperties']['metaData']['og:title'];
      const description = j[':items']['root'][':items']['responsivegrid'][':items']['modelpagetextblock']['title'];
      result.description = description + j[':items']['root'][':items']['responsivegrid'][':items']['modelpagetextblock']['text'];
      const reference = j['pageProperties']['modelpage']['rmc'];
      result.reference = reference.toUpperCase();
      result.thumbnail = j['pageProperties']['metaData']['og:image'];
      {
        const link = 'https://www.rolex.com/content/api/rolex/model-price.US.' + reference + '.en.json';
        const { data } = await client.get(link);
        const j = JSON.parse(JSON.stringify(data));
        result.retail = j['formattedPrice'];
      }
      if (entry.match(/lady/i)) result.gender = 'F';
      else result.gender = 'M';
      let spec = j[':items']['root'][':items']['responsivegrid'][':items']['expand'][':items']['root'][':items']['expandlist'][':items']['root'][':items']['modelpagespecgrid']['columns'];
      spec.forEach(s => {
        const cat = s.firstTitle.toLowerCase();
        s.items.forEach(i => {
          result.spec.push({
            cat, key: i.title.toLowerCase(), value: i.text,
          })
        })
      })
    } else result.code = 'not product';
  } catch (error) {
    console.error('Failed extraction for Rolex with error : ' + error);
    console.error('entry : ', entry);
    if (error.response) result.code = error.response.status;
    else result.code = 'UNKNOWN ERROR';
  }
  return result;
};

(async () => {
  const r = [
    "https://www.rolex.com/watches/datejust/m279381rbr-0013.html",
    "https://www.rolex.com/watches/datejust/m279160-0016.html",
    "https://www.rolex.com/watches/datejust/m279174-0013.html",
    "https://www.rolex.com/watches/datejust/m279383rbr-0004.html",
    "https://www.rolex.com/watches/datejust/m279174-0003.html",
    "https://www.rolex.com/watches/datejust/m279163-0023.html",
    "https://www.rolex.com/watches/datejust/m279135rbr-0021.html",
    "https://www.rolex.com/watches/oyster-perpetual/m114300-0004.html",
    "https://www.rolex.com/watches/oyster-perpetual/m176200-0016.html",
    "https://www.rolex.com/watches/oyster-perpetual/m177200-0016.html",
    "https://www.rolex.com/watches/oyster-perpetual/m114200-0021.html",
    "https://www.rolex.com/watches/oyster-perpetual/m116000-0012.html",
    "https://www.rolex.com/watches/oyster-perpetual/m177200-0015.html",
    "https://www.rolex.com/watches/oyster-perpetual/m177200-0018.html",
    "https://www.rolex.com/watches/oyster-perpetual/m114300-0005.html",
    "https://www.rolex.com/watches/oyster-perpetual/m114300-0003.html",
    "https://www.rolex.com/watches/oyster-perpetual/m114200-0023.html",
    "https://www.rolex.com/watches/oyster-perpetual/m114200-0020.html",
    "https://www.rolex.com/watches/oyster-perpetual/m116000-0013.html",
    "https://www.rolex.com/watches/pearlmaster/m81318-0005.html",
    "https://www.rolex.com/watches/pearlmaster/m86285-0004.html",
    "https://www.rolex.com/watches/pearlmaster/m81298-0005.html",
    "https://www.rolex.com/watches/pearlmaster/m81159-0015.html",
    "https://www.rolex.com/watches/pearlmaster/m86289-0001.html",
    "https://www.rolex.com/watches/pearlmaster/m81285-0017.html",
    "https://www.rolex.com/watches/pearlmaster/m86289-0006.html",
    "https://www.rolex.com/watches/pearlmaster/m86285-0001.html",
    "https://www.rolex.com/watches/sky-dweller/m326135-0006.html",
    "https://www.rolex.com/watches/sky-dweller/m326138-0010.html",
    "https://www.rolex.com/watches/sky-dweller/m326135-0008.html",
    "https://www.rolex.com/watches/sky-dweller/m326138-0006.html",
    "https://www.rolex.com/watches/submariner/m116613lb-0005.html",
    "https://www.rolex.com/watches/submariner/m114060-0002.html",
    "https://www.rolex.com/watches/submariner/m116610ln-0001.html",
    "https://www.rolex.com/watches/submariner/m116610lv-0002.html",
    "https://www.rolex.com/watches/submariner/m116613ln-0001.html",
    "https://www.rolex.com/watches/submariner/m116619lb-0001.html",
    "https://www.rolex.com/watches/submariner/m116618lb-0003.html",
    "https://www.rolex.com/watches/submariner/m116618ln-0001.html",
  ];

  for (let i = 0; i < r.length; i++) {
    const ex = await extraction({
      client: axios,
      entry: r[i],
    })
    console.log(ex);
  }
})();