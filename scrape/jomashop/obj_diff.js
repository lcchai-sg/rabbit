const rdiff = require('recursive-diff');

const a = {
  "lang": "en",
  "reference": "1396BMBK",
  "source": "jomashop",
  "GTIN": {
    "ws": "086702528646",
    "twc": "086702528646"
  },
  "additional": [
    { "Case Color": "Gold-tone" },
    { "Band Width": "13 mm" },
    { "Bezel Color": "Gold-tone" },
    { "Warranty": "Lifetime Manufacturer Warranty" },
    { "Additional Info": "In general, withstands splashes or brief immersion in water, but not suitable for swimming" },
    { "Internal ID": "ANK-1396BMBK" },
    { "Department": "Watches" },
    { "Category": "Watches" }
  ],
  "band": {
    "type": "Strap",
    "materials": ["Calfskin Leather"],
    "color": "Black",
    "buckle": "Buckle",
    "material": "Calfskin Leather"
  },
  "bezel": {
    "type": "Fixed",
    "materials": ["Base Metal"],
    "material": "Base Metal"
  },
  "brand": "Anne Klein",
  "brandID": null,
  "caliber": { "type": "Quartz" },
  "case": {
    "materials": ["Base Metal"],
    "shape": "Round",
    "crystal": "Mineral",
    "crown": "Pull/Push",
    "back": "Solid",
    "size": "34 mm",
    "waterResistance": "30 meters / 100 feet",
    "thickness": "9 mm",
    "material": "Base Metal"
  },
  "collection": null,
  "description": "Gold-tone metal case with a black (calfskin) leather strap with screw-accented lugs. Fixed gold-tone metal bezel. Black dial with gold-tone hands and alternating Roman numeral and crystal-tipped index hour markers. Dial Type: Analog. Quartz movement. Scratch resistant mineral crystal. Pull / push crown. Solid case back. Round case shape. Case size: 34 mm. Case thickness: 9 mm. Band width: 13 mm. Tang clasp. Water resistant at 30 meters / 100 feet. Functions: hour, minute, second. Additional Info: in general, withstands splashes or brief immersion in water, but not suitable for swimming. Casual watch style. Anne Klein Black Dial Black Leather Ladies Watch 1396BMBK.",
  "dial": {
    "type": "Analog",
    "color": "Black",
    "indexType": "Alternating Roman Numeral and Crystal-tipped Index",
    "handStyle": "Gold-tone"
  },
  "features": [
    "Gold",
    "Leather",
    "Stainless Steel"
  ],
  "gender": "F",
  "pair": null,
  "price": 35.99,
  "productID": null,
  "related": [],
  "retail": 65,
  "thumbnail": "https://cdn2.jomashop.com/media/catalog/product/cache/65d460f9c8951b4690c4015df062b5ba/a/n/anne-klein-black-dial-ladies-watch-1396bmbk--.jpg",
  "url": "https://www.jomashop.com/anne-klein-watch-1396bmbk.html",
  "waterResistance": "30 m",
  "name": "Black Dial Black Leather Ladies Watch 1396BMBK",
  "assets": "5,0385b9177996ed",
  "bundled": false,
  "feature": ["Gold, Leather"],
  "limited": false,
  "upc": "086702528646",
  "warranty": 0,
  "movementType": "Quartz",
  "style": "Casual",
  "waterResistance01": "30 meters / 100 feet",
  "currency": "USD",
  "dialColor": "Black",
  "function": ["Hour, Minute, Second"],
  "strategy": "jomashop"
};

const b = {
  "lang": "en",
  "reference": "1396BMBK",
  "source": "jomashop",
  "additional": [
    { "Crown": "Pull / Push" },
    { "Functions": "Hour, Minute, Second" },
    { "Style": "Casual Watches" },
    { "Warranty": "With Manufacturer's Guarantee" },
    { "Additional Info": "In general, withstands splashes or brief immersion in water, but not suitable for swimming" },
    { "Internal ID": "ANK-1396BMBK" },
    { "Department": "Watches" },
    { "Category": "Watches" }
  ],
  "assets": "7,a4c8692299aa",
  "band": {
    "type": "Strap",
    "materials": ["Calfskin Leather"],
    "color": "Black",
    "buckle": "Buckle",
    "material": "Calfskin Leather",
    "lugWidth": "13 mm"
  },
  "bezel": {
    "type": "Fixed",
    "color": "Gold"
  },
  "brand": "Anne Klein",
  "bundled": false,
  "caliber": {
    "type": "Quartz",
    "brand": "Anne Klein"
  },
  "case": {
    "materials": ["Stainless Steel"],
    "shape": "Round",
    "crystal": "Mineral",
    "back": "Solid",
    "diameter": "34 mm",
    "width": "34 mm",
    "waterResistance": "30 meters / 100 feet",
    "thickness": "9 mm",
    "material": "Stainless Steel"
  },
  "collection": "Anne Klein Black Dial Ladies Watch 1396BMBK",
  "description": "Description\nGold-tone stainless steel case with a black calfskin leather with screw-accented lugs strap. Fixed gold-tone bezel. Black dial with gold-tone hands and Roman numeral and index / crystal hour markers. Dial Type: Analog. Quartz movement. Scratch resistant mineral crystal. Pull / push crown. Solid case back. Round case shape, case size: 34 mm, case thickness: 9 mm. Band width: 13 mm. Tang clasp. Water resistant at 30 meters / 100 feet. Functions: hour, minute, second. Additional Info: in general, withstands splashes or brief immersion in water, but not suitable for swimming. Casual watch style. Anne Klein Black Dial Ladies Watch 1396BMBK.",
  "dial": {
    "type": "Analog",
    "color": "Black",
    "indexType": "Roman Numeral and Index / Crystal",
    "handStyle": "Gold-tone"
  },
  "feature": [
    "Gold",
    "Leather",
    "Stainless Steel"
  ],
  "gender": "F",
  "limited": false,
  "name": "Black Dial Ladies Watch",
  "price": "$35.33",
  "retail": "$65.00",
  "upc": "086702528646",
  "url": "https://www.jomashop.com/anne-klein-watch-1396bmbk.html",
  "warranty": 0,
  "waterResistance": "30 m",
  "movementType": "Quartz",
  "style": "Casual",
  "waterResistance01": "30 meters / 100 feet",
  "brandID": null
};

const c = {
  ...b, ...a,
  additional: [...b.additional, ...a.additional],
  band: { ...b.band, ...a.band, },
  bezel: { ...b.bezel, ...a.bezel, },
  caliber: { ...b.caliber, ...a.caliber, },
  case: { ...b.case, ...a.case, },
  dial: { ...b.dial, ...a.dial, },
};
c["band"]["materials"] = a["band"]["materials"] ? [...a["band"]["materials"]] : [];
if (b["band"]["materials"]) c["band"]["materials"].forEach(v => { if (c["band"]["materials"].indexOf(v) < 0) c["band"]["materials"].push(v) })
c["bezel"]["materials"] = a["bezel"]["materials"] ? [...a["bezel"]["materials"]] : [];
if (b["bezel"]["materials"]) b["bezel"]["materials"].forEach(v => { if (c["bezel"]["materials"].indexOf(v) < 0) c["bezel"]["materials"].push(v) })
c["case"]["materials"] = a["case"]["materials"] ? [...a["case"]["materials"]] : [];
if (b["case"]["materials"]) b["case"]["materials"].forEach(v => { if (c["case"]["materials"].indexOf(v) < 0) c["case"]["materials"].push(v) })
c.features = a.features ? [...a.features] : [];
if (b.features) b.features.forEach(v => { if (c.features.indexOf(v) < 0) c.features.push(v) })
c.functions = a.functions ? [...a.functions] : [];
if (b.functions) b.functions.forEach(v => { if (c.functions.indexOf(v) < 0) c.functions.push(v) })
c.related = a.related ? [...a.related] : [];
if (b.related) b.related.forEach(v => { if (c.related.indexOf(v) < 0) c.related.push(v) })
console.log(c)
