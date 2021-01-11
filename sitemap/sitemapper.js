var Sitemapper = require('sitemapper');
const axios = require('axios');

const getBrandName = input => {
  if (!input) return null;
  console.log(input)

  if (input.match(/suunto/i)) {
    return 'Suunto';
  }
  if (input.match(/cvstos/i)) {
    return 'Cvstos';
  }
  if (input.match(/ball/i)) {
    return 'Ball';
  }
  if (input.match(/baume et mercier|baumeetmercier|baume-et-mercier|baumemercier|baume-mercier/i)) {
    return 'Baume et Mercier';
  }
  if (input.match(/gerald genta|geraldgenta|gerald-genta/i)) {
    return 'Gerald Genta';
  }
  if (input.match(/sinn/i)) {
    return 'Sinn';
  }
  if (input.match(/rolex/i)) {
    return 'Rolex';
  }
  if (input.match(/tudor/i)) {
    return 'Tudor';
  }
  if (input.match(/aboutvintage|about vintage|about-vintage/i)) {
    return 'About Vintage';
  }
  if (input.match(/audemarspiguet|audemars piguet|audemars-piguet/i)) {
    return 'Audemars Piguet';
  }
  if (input.match(/bellross|bell ross|bell-ross|bell&ross|bell & ross/i)) {
    return 'Bell & Ross';
  }
  if (input.match(/blancpain/i)) {
    return 'Blancpain';
  }
  if (input.match(/breguet/i)) {
    return 'Breguet';
  }
  if (input.match(/breitling/i)) {
    return 'Breitling';
  }
  if (input.match(/bulgari|bvlgari/i)) {
    return 'Bvlgari';
  }
  if (input.match(/cartier/i)) {
    return 'Cartier';
  }
  if (input.match(/casio/i)) {
    return 'Casio';
  }
  if (input.match(/chanel/i)) {
    return 'Chanel';
  }
  if (input.match(/chopard/i)) {
    return 'Chopard';
  }
  if (input.match(/citizen/i)) {
    return 'Citizen';
  }
  if (input.match(/frédérique constant|frederiqueconstant|frederique constant|frederique-constant/i)) {
    return 'Frédérique Constant';
  }
  if (input.match(/gagamilano|gaga milano|gaga-milano/i)) {
    return 'Gaga Milano';
  }
  if (input.match(/girardperregaux|girard perregaux|girard-perregaux/i)) {
    return 'Girard Perregaux';
  }
  if (input.match(/glashuette/i)) {
    return 'Glashuette';
  }
  if (input.match(/grand-seiko|grandseiko|grand seiko/i)) {
    return 'Grand Seiko';
  }
  if (input.match(/gucci/i)) {
    return 'Gucci';
  }
  if (input.match(/hamilton/i)) {
    return 'Hamilton';
  }
  if (input.match(/hermes/i)) {
    return 'Hermes';
  }
  if (input.match(/hublot/i)) {
    return 'Hublot';
  }
  if (input.match(/iwc/i)) {
    return 'IWC';
  }
  if (input.match(/jaegerlecoultre|jaeger lecoultre|jaeger-lecoultre/i)) {
    return 'Jaeger Lecoultre';
  }
  if (input.match(/jaquetdroz|jaquet droz|jaquet-droz/i)) {
    return 'Jaquet Droz';
  }
  if (input.match(/longines/i)) {
    return 'Longines';
  }
  if (input.match(/mauricelacroix|maurice lacroix|maurice-lacroix/i)) {
    return 'Maurice Lacroix';
  }
  if (input.match(/montblanc/i)) {
    return 'Montblanc';
  }
  if (input.match(/nomos glashütte|nomosglashuette|nomos glashuette|nomos-glashuette/i)) {
    return 'Nomos Glashütte';
  }
  if (input.match(/omega/i)) {
    return 'Omega';
  }
  if (input.match(/orient/i)) {
    return 'Orient';
  }
  if (input.match(/oris/i)) {
    return 'Oris';
  }
  if (input.match(/panerai/i)) {
    return 'Panerai';
  }
  if (input.match(/parmigiani/i)) {
    return 'Parmigiani';
  }
  if (input.match(/patek/i)) {
    return 'Patek Philippe';
  }
  if (input.match(/piaget/i)) {
    return 'Piaget';
  }
  if (input.match(/rado/i)) {
    return 'Rado';
  }
  if (input.match(/seiko/i)) {
    return 'Seiko';
  }
  if (input.match(/sevenfriday|seven friday|seven-friday/i)) {
    return 'Sevenfriday';
  }
  if (input.match(/tagheuer|tag heuer|tag-heuer/i)) {
    return 'Tag Heuer';
  }
  if (input.match(/tissot/i)) {
    return 'Tissot';
  }
  if (input.match(/ulysse|ulysse-nardin|ulysse nardin/i)) {
    return 'Ulysse Nardin';
  }
  if (input.match(/vacheronconstantin|vacheron constantin|vacheron-constantin/i)) {
    return 'Vacheron Constantin';
  }
  if (input.match(/zenith/i)) {
    return 'Zenith';
  }
  if (input.match(/mido/i)) {
    return 'Mido';
  }
  if (input.match(/franck muller|franck-muller|franckmuller/i)) {
    return 'Franck Muller';
  }
  if (input.match(/louis vuitton|louis-vuitton|louisvuitton/i)) {
    return 'Louis Vuitton';
  }
  return null;
}

(async () => {
  // console.log(new Date())
  var sitemap = new Sitemapper({
    // url: 'https://www.jomashop.com/sitemap.xml',
    // url: 'https://watchesofmayfair.com/sitemap.xml',
    url: 'https://www.watchmaxx.com/sitemap.xml',
    // url: 'https://www.prestigetime.com/sitemap.xml',
    // url: "https://www.suunto.com/globalassets/Sitemaps/sitemap_en.xml",
    // url: "https://www.suunto.com/globalassets/Sitemaps/sitemap_en_2.xml",
    // url: "https://www.suunto.com/globalassets/Sitemaps/sitemap_en_3.xml",
    // url: "https://www.suunto.com/globalassets/Sitemaps/sitemap_en_us.xml",
    timeout: 108000000 //15 seconds
  });

  try {
    let data = await sitemap.fetch();
    data.sites.sort().forEach(val => console.log(val))
    // data.sites.sort().forEach(val => {
    // prestigetime
    // let payload = { source: 'prestigetime', lang: "en", collections: ['all'], items: { 'all': [], } };
    // let cnt = 0;
    // for (let i = 0; i < data.sites.length; i++) {
    //   const val = data.sites[i];
    //   if ((val.match(/\/blog\//i) ||
    //     val.match(/.php/i) ||
    //     val.match(/on-sale/i) ||
    //     val.match(/watches.html/i) ||
    //     val.match(/leather/i) ||
    //     val.match(/policies/i) ||
    //     val.match(/brand/i) ||
    //     val.match(/orbita/i) ||
    //     (val.match(/strap/i) && !(val.match(/rolex/i)))
    //   )) {
    // do nothing, skip the record
    // } else {
    //   const d = (await axios.get(val)).data;
    //   if (d.match(/watch details/i)) {
    //     console.log(val, 'product')
    //   } else {
    //     console.log(val, 'NOT product')
    //   }
    //     let brand = getBrandName(val);
    //     let collection = '';
    //     let v = val.split('/');
    //     if (val.match(/item/i)) {
    //       // https://www.prestigetime.com/item/<brand>/<collection>/<name?reference>.html
    //       collection = v[v.length - 2];
    //       // https://www.prestigetime.com/<brand><collection?name?reference>.html
    //     }
    //     payload.items['all'].push({
    //       url: data.sites[i],
    //       name: v[v.length - 1].replace('.html', '').replace('-', ' '),
    //       brand,
    //       collection,
    //       reference: v[v.length - 1].replace('.html', '').replace('-', '.'),
    //       price: null,
    //     });
    //     cnt++;
    //     if (cnt % 500 === 0) {
    //       result.push({ payload });
    //       payload = { source: 'prestigetime', lang: "en", collections: ['all'], items: { 'all': [], } };
    //       payload.items['all'] = [];
    //     }
    //   }
    // }
    // if (payload.items['all'].length > 0) {
    //   result.push({ payload });
    // }
    // console.log(result)
    // jomapshop
    // if (val.match(/watch/i)) {
    //   let w = val.split('-watch-');
    //   if (watches.indexOf(w[0]) < 0) {
    //     watches.push(w[0]);
    //   }
    // }
    // watchesofmayfair
    // if (!(val.match(/accessories|jewellery/i))) {
    //   const l = val.split('/');
    //   console.log(val, l.length)
    // }
    // console.log(val);
    // watchmaxx
    // if (val.match(/-watch-/i)) {
    //   watches.push(val);
    // } else {
    //   others.push(val);
    // }
    // });
    // watches.forEach(url => console.log(url))
    // console.log(others)
    // watches.forEach(w => console.log(w));
    // }
    // }
  } catch (error) {
    console.log('sitemapper failed with error ' + error)
  }
})();
