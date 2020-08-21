const axios = require('axios');
const cheerio = require('cheerio');

const indexing = async () => {
  const base = "https://www.sinn.de";
  const entry = "https://www.sinn.de/en/";
  const data = (await axios.get(entry)).data;
  const $ = cheerio.load(data);
  const result = {
    brandID: 180, brand: 'Sinn', lang: 'en', source: 'official',
    collections: [], items: {}
  };

  const cats = [];
  $('#Kollektion a').each((idx, el) => {
    const url = $(el).attr("href");
    if (!(url.match(/New_Watches/) || url.match(/Straps_Accessories/) || url.match(/Cockpit_Clocks/))) {
      let collection = url.split('/')[2].replace('.htm', '').split('_').join(' ');
      result.collections.push(collection);
      result.items[collection] = [];
      cats.push({
        collection, url: base + url,
      });
    }
  });

  for (const cat of cats) {
    console.log(cat.url);
    const data = (await axios.get(cat.url)).data;
    const $ = cheerio.load(data);
    $(".Bild").each((idx, el) => {
      const url = base + $(el).find("a").attr("href");
      const name = $(el).find('.Modell').text().trim();
      result.items[cat.collection].push({
        name,
        url,
        collection: cat.collection,
      });
    });
  }

  return result;
}

const extraction = async (context) => {
  const { entry, lang, brand, brandID, collection, } = context;
  const base = "https://www.sinn.de";
  const result = {
    source: 'official',
    url: entry,
    collection,
    brand,
    brandID,
    lang,
    scripts: [],
    spec: [],
    related: [],
    caliber: {},
  }
  // #ModellName - reference number?
  // #BeschreibungText1 - special characteristics
  // #BeschreibungText2 - description
  // #BeschreibungText3 - technical data
  const data = (await axios.get(entry)).data;
  const $ = cheerio.load(data);
  result.reference = $('#ModellName').find("th").text();
  let name = $('#MitteHauptStart').text();
  let n = name.split('\n');
  if (n.length > 0) result.name = n.slice(1, 3).join(' ');
  result.thumbnail = base + $('#Bildbrowser_Pic0').attr('src');
  let noDesc = true;
  // check if description exist
  $('.Mobile').each((idx, el) => {
    const field = $(el).text();
    if (field === 'Description') noDesc = false;
  })
  let techData = '';
  if (noDesc) {
    techData = $('#BeschreibungText2').text().trim();
  } else {
    result.description = $('#BeschreibungText2').text().trim();
    techData = $('#BeschreibungText3').text().trim();
  }
  // const special = $('#BeschreibungText1').text().trim();
  // const aSpecial = special.split('\n');
  // for (let i = 0; i < aSpecial.length; i++) {
  //   if (aSpecial[i] === '' || aSpecial[i] === ' ') break;
  //   result.spec.push({
  //     key: "special",
  //     value: aSpecial[i],
  //   });
  // }
  const aTechData = techData.split('\n');
  let key = "U";
  for (let i = 0; i < aTechData.length; i++) {
    if (aTechData[i]) {
      switch (aTechData[i]) {
        case "Mechanical Movement":
          key = "caliber";
          break;
        case "Case":
          key = "case";
          break;
        case "Functions":
          key = "functions";
          break;
        case "Dimensions and Weight":
          key = "dimensions";
          break;
        case "Dial and Hands":
          key = "dial";
          break;
        case "Warranty":
          key = "warranty";
          break;
        case "SINN Technologies":
          key = "technology";
          break;
        case "Quartz Movement":
          key = "caliber";
          break;
        case '':
        case ' ':
          key = "U";
          break;
        default:
          if (key === "U") {
            console.log(entry);
            console.log('cannot identify =>', aTechData[i]);
          }
          break;
      }
      if (aTechData[i] !== "Case" &&
        aTechData[i] !== "SINN Technologies" &&
        aTechData[i] !== "Functions" &&
        aTechData[i] !== "Dimensions and Weight" &&
        aTechData[i] !== "Dial and Hands" &&
        aTechData[i] !== "Warranty" &&
        key !== "U"
      ) {
        result.spec.push({
          key, value: aTechData[i],
        })
      }
    }
  }
  console.log(result)
}

(async () => {
  const ri = await indexing();
  // for (const cat of ri.collections) {
  //   for (const item of ri.items[cat]) {
  //     console.log(item.name, item.url)
  //   }
  // }
  const { brand, brandID, lang, source, } = ri;
  for (const cat of ri.collections) {
    for (const item of ri.items[cat]) {
      const { url: entry, collection, } = item;
      let context = {
        entry, brand, brandID, lang, source, collection,
      }
      await extraction(context);
    }
  }

  // no description
  // await extraction({
  //   entry: 'https://www.sinn.de/en/Modell/1736_Edition_FAZ.htm',
  //   brand: "Sinn",
  //   brandID: 180,
  //   lang: "en",
  //   source: "official",
  //   collection: "",
  // })
})();

// const context = {
//   entry:
//     "https://www.sinn.de/en/Modell/103_St.htm",
//   // "https://www.sinn.de/en/Modell/104_St_Sa_A.htm",
//   // "https://www.sinn.de/en/Modell/206_ARKTIS_II.htm",
//   // "https://www.sinn.de/en/Modell/6000.htm",
//   // "https://www.sinn.de/en/Modell/1736_Classic.htm",
//   // "https://www.sinn.de/en/Modell/243_Ti_A.htm",
//   brand: "Sinn",
//   brandID: 180,
//   lang: "en",
// };

// extraction(context);

