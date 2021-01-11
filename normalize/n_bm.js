// const getMaterials = input => {
//   let bm = "";
//   let bms = [];

//   if (bandM[i].match(/1\)/)) {				// strap options, dont handle
//     return { bm: "", bms: [], };
//   }
//   if (bandM[i].match(/Acetate/i)) {
//     bm = bm ? bm : 'Acetate';
//     bms.push('Acetate');
//   }
//   if (bandM[i].match(/Acrylic/i)) {
//     bm = bm ? bm : 'Acrylic';
//     bms.push('Acrylic')
//   }
//   if (bandM[i].match(/Leather|Lizard|snake|shark|python|Ostrich|Leaher|Leahter|Suede|Horse|nubuck|letaher/i)) {
//     bm = bm ? bm : 'Leather';
//     bms.push('Leather')
//   }
//   if (bandM[i].match(/(al(l)?igator)[\s-_]*(leather)?|lligator/i)) {
//     bm = bm ? bm === 'Leather' ? 'Alligator Leather' : bm : 'Alligator Leather';
//     const nbms = bms.filter(v => v !== 'Leather');
//     bms = nbms;
//     bms.push('Alligator Leather')
//   }
//   if (bandM[i].match(/(croc)(o)?(dile)?[\s-_]*(leather)?/i) && (!(bandM[i].match(/(cro(c)?c)(o)?(dile)?[\s-_]*(patte|emb[r]?oss|texture)/i)))) {
//     bm = bm ? bm === 'Leather' ? 'Crocodile Leather' : bm : 'Crocodile Leather';
//     const nbms = bms.filter(v => v !== 'Leather');
//     bms = nbms;
//     bms.push('Crocodile Leather')
//   }
//   if (bandM[i].match(/(calf)[\s-_]*(skin)?[\s-_]?(leather)?|Calskin|Clafskin|Calkskin/i)) {
//     bm = bm ? bm === 'Leather' ? 'Calfskin Leather' : bm : 'Calfskin Leather';
//     const nbms = bms.filter(v => v !== 'Leather');
//     bms = nbms;
//     bms.push('Calfskin Leather')
//   }
//   if (bandM[i].match(/Alloy|Aloy/i)) {
//     bm = bm ? bm : 'Alloy';
//     bms.push('Alloy')
//   }
//   if (bandM[i].match(/Aluminium|Aluminum/i)) {
//     bm = bm ? bm : 'Aluminium';
//     bms.push('Aluminium')
//   }
//   if (bandM[i].match(/Base[\s-_]*Metal/i)) {
//     bm = bm ? bm : 'Base Metal';
//     bms.push('Base Metal')
//   }
//   if (bandM[i].match(/Brass/i)) {
//     bm = bm ? bm : 'Brass';
//     bms.push('Brass')
//   }
//   if (bandM[i].match(/Canvas/i)) {
//     bm = bm ? bm : 'Canvas';
//     bms.push('Canvas')
//   }
//   if (bandM[i].match(/Ceramic|Ceranic/i)) {
//     bm = bm ? bm : 'Ceramic';
//     bms.push('Ceramic')
//   }
//   if (bandM[i].match(/Diamond|Diamon/i)) {
//     bm = bm ? bm : 'Diamond';
//     bms.push('Diamond')
//   }
//   if (bandM[i].match(/(Eve)[\s-_]?(rose)[\s-_]?(gold)/i)) {
//     bm = bm ? bm : 'Everose Gold';
//     bms.push('Everose Gold)')
//   } else if (bandM[i].match(/(rose)[\s-_]?(gold)/i)) {
//     bm = bm ? bm : 'Rose Gold';
//     bms.push('Rose Gold')
//   }
//   if (bandM[i].match(/Frabric|Fabric|Linen|Textile|Farbic|Fabrik/i)) {
//     bm = bm ? bm : 'Fabric';
//     bms.push('Fabric')
//   }
//   if (bandM[i].match(/Nylon/i)) {
//     bm = bm ? bm : 'Nylon';
//     bms.push('Nylon')
//   }
//   if (bandM[i].match(/Plastic/i)) {
//     bm = bm ? bm : 'Plastic';
//     bms.push('Plastic')
//   }
//   if (bandM[i].match(/Platinum|Platinium/i)) {
//     bm = bm ? bm : 'Platinum';
//     bms.push('Platinum')
//   }
//   if (bandM[i].match(/Pink[\s-_]*Gold/i)) {
//     bm = bm ? bm : 'Pink Gold';
//     bms.push('Pink Gold')
//   }
//   if (bandM[i].match(/Resin/i)) {
//     bm = bm ? bm : 'Resin';
//     bms.push('Resin')
//   }
//   if (bandM[i].match(/Poly[\s-_]*carbon/i)) {
//     bm = bm ? bm : 'Polycarbon';
//     bms.push('Polycarbon')
//   }
//   if (bandM[i].match(/Poly[\s-_]*urethane/i)) {
//     bm = bm ? bm : 'Polyurethane';
//     bms.push('Polyurethane')
//   }
//   if (bandM[i].match(/Rubber|rubbe|ruuber/i)) {
//     bm = bm ? bm : 'Rubber';
//     bms.push('Rubber')
//   }
//   if (bandM[i].match(/Satin/i) && (!(bandM[i].match(/satin[\s-_]*(Brush|Cover|Finish|Over|Polish)/i)))) {
//     bm = bm ? bm : 'Satin';
//     bms.push('Satin')
//   }
//   if (bandM[i].match(/Sil{1,2}icone?|Silcone/i)) {
//     bm = bm ? bm : 'Silicone';
//     bms.push('Silicone')
//   }
//   if (bandM[i].match(/Stainless[\s-_]*Steel/i)) {
//     bm = bm ? bm : 'Stainless Steel';
//     bms.push('Stainless Steel')
//   } else if (bandM[i].match(/Steel/i)) {
//     bm = bm ? bm : 'Steel';
//     bms.push('Steel')
//   }
//   if (bandM[i].match(/Titanium|Titanum|Tiatnium/i)) {
//     bm = bm ? bm : 'Titanium';
//     bms.push('Titanium')
//   }
//   if (bandM[i].match(/Tungsten/i)) {
//     bm = bm ? bm : 'Tungsten';
//     bms.push('Tungsten')
//   }
//   if (bandM[i].match(/Wood/i)) {
//     bm = bm ? bm : 'Wood';
//     bms.push('Wood')
//   }
//   if (bandM[i].match(/White[\s-_]*Gold/i)) {
//     bm = bm ? bm : 'White Gold';
//     bms.push('White Gold')
//   }
//   if (bandM[i].match(/Yellow[\s-_]*Gold/i)) {
//     bm = bm ? bm : 'Yellow Gold';
//     bms.push('Yellow Gold')
//   }
//   // if (bandM[i].match(/material/i)) {
//   // 	bm = bm ? bm : 'material';
//   // 	bms.push('material')
//   // }
//   // if (bandM[i].match(/material/i)) {
//   // 	bm = bm ? bm : 'material';
//   // 	bms.push('material')
//   // }

//   if (bms.length === 0) { //no match
//     bm = input;
//     bms.push(input);
//   }
//   return { bm, bms };
// };

const getMaterials = input => {
  return input;
}

const bandM = [
  " steel",
  "\"Batik Blues\" Print Frabric",
  "\"Black Palms\" Print Fabric",
  "\"Brogue Charcoal\" Leather",
  "\"Bumblebee\" Print Canvas",
  "\"Denim\" Gummy Alligator",
  "\"Flemish Baroque\" Print Frabric",
  "\"Macchiato\" Leather",
  "\"Mint\" Green Acetate",
  "\"Nightflakes\" Print Frabric",
  "\"Rubber Touch\"",
  "\"Ruler\" Rubber",
  "\"Soft Touch\" Black Alligator",
  "\"Spring Peach\" Leather",
  "\"Tropicalia\" Print Frabric",
  "'Satin-look' Leather",
  "( Calfskin ) Leather",
  "( Crocodile) Leather",
  "(\"Hornback\" Alligator) Leather",
  "(Aero Classic) Rubber",
  "(Aged Calfskin) Leather handmade in Italy",
  "(Aged) Leather",
];


for (let i = 0; i < bandM.length; i++) {
  let bandMi;
  if (bandM[i].match(/and/i)) {
    bandMi = bandM[i].split('and');
  } else if (bandM[i].match(/with/i)) {
    bandMi = bandM[i].split('with');
  } else if (bandM[i].match(/\//)) {
    bandMi = bandM[i].split('/');
  }

  // let bandM = "";
  // let bandMS = [];

  // if (bandMi && bandMi.length > 0) {
  //   for (let j = 0; j < bandMi.length; j++) {
  //     const { bm, bms } = getMaterials(bandMi[j]);
  //     if (bms.length > 0) {
  //       bandM = bandM ? bandM : bm;
  //       bms.forEach(v => {
  //         if (bandMS.indexOf(v) < 0) bandMS.push(v);
  //       })
  //     }
  //   }
  // } else {
  //   const { bm, bms } = getMaterials(bandM[i]);
  //   if (bms.length > 0) {
  //     bandM = bandM ? bandM : bm;
  //     bms.forEach(v => {
  //       if (bandMS.indexOf(v) < 0) bandMS.push(v);
  //     })
  //   }
  // }

  // if (bandMS.length === 0) {
  //   console.log('zzzzzzzzzzzzzzzzzzzzzz', bandM[i]);
  // } else {
  //   console.log(bandM, '>>>', bandM[i], '>>>', bandMS);
  // }
  console.log(bandM[i])
}
