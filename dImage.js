const axios = require('axios');
const FormData = require('form-data');
const { MongoClient } = require('mongodb');

(async () => {
  const mdb = {
    user: 'root',
    pass: 'sysadmin',
    host: '127.0.0.1',
    port: 27017,
    name: 'synopsis'
  }
  const db_url = `mongodb://${mdb.user}:${mdb.pass}@${mdb.host}:${mdb.port}/${mdb.name}`;
  const conn = await MongoClient.connect(db_url);

  const data = [
    {
      "brandID": 70,
      "lang": "en",
      "reference": "H5700",
      "source": "official",
      "additional": [
        "Case White highly resistant ceramic and steel case",
        "Crown Steel screw-down crown with white highly resistant ceramic cabochon",
        "Caliber Caliber 12.1"
      ],
      "band": {
        "color": "White",
        "material": "stainless steel",
        "type": "Bracelet",
        "buckle": "Buckle"
      },
      "bezel": {
        "material": "Steel unidirectional rotating bezel"
      },
      "caliber": {
        "brand": "Chanel",
        "label": "France",
        "type": "AUTOMATIQUE CALIBRE 12.1"
      },
      "case": {
        "width": "38 mm",
        "thickness": "12,6 mm",
        "material": "stainless steel"
      },
      "collection": null,
      "description": "White highly resistant ceramic and steel",
      "dial": {
        "color": "White-lacquered dial"
      },
      "gender": "F",
      "pair": null,
      "price": "$5,700",
      "productID": null,
      "related": [],
      "url": "https://www.chanel.com/us/watches/p/H5700/j12-watch/",
      "waterResistance": "200 m",
      "brand": "chanel"
    },
    {
      "brandID": 70,
      "lang": "en",
      "reference": "H5697",
      "source": "official",
      "additional": [
        "Case Black highly resistant ceramic and steel case",
        "Crown Steel screw-down crown with black highly resistant ceramic cabochon",
        "Caliber Caliber 12.1"
      ],
      "band": {
        "color": "Black",
        "material": "stainless steel",
        "type": "Bracelet",
        "buckle": "Buckle"
      },
      "bezel": {
        "material": "Steel unidirectional rotating bezel"
      },
      "caliber": {
        "brand": "Chanel",
        "label": "France",
        "type": "AUTOMATIQUE CALIBRE 12.1"
      },
      "case": {
        "width": "38 mm",
        "thickness": "12,6 mm",
        "material": "stainless steel"
      },
      "collection": null,
      "description": "Black highly resistant ceramic and steel",
      "dial": {
        "color": "Black-lacquered dial"
      },
      "gender": "F",
      "pair": null,
      "price": "$5,700",
      "productID": null,
      "related": [],
      "url": "https://www.chanel.com/us/watches/p/H5697/j12-watch/",
      "waterResistance": "200 m",
      "brand": "chanel"
    },
    {
      "brandID": 154,
      "lang": "en",
      "reference": "FC-225ST5B5",
      "source": "official",
      "additional": [],
      "band": {
        "type": "Strap",
        "material": "Leather",
        "color": "Brown"
      },
      "bezel": {},
      "brand": "frederiqueconstant",
      "caliber": {
        "reference": "FC-225 caliber",
        "type": "Quartz",
        "brand": "Frederique Constant",
        "label": "Japan"
      },
      "case": {
        "material": "yellow gold",
        "width": "Diameter of 40 mm",
        "crystal": "Sapphire"
      },
      "collection": "classics",
      "description": null,
      "dial": {
        "color": "Gold",
        "finish": "Applied"
      },
      "gender": "M",
      "pair": null,
      "price": "€ 695",
      "productID": null,
      "related": [
        "FC-225GT5B6",
        "FC-225ST5B5",
        "FC-259NT5B6",
        "FC-259ST5B6"
      ],
      "url": "https://frederiqueconstant.com/watch-finder/classics/quartz-fc-225st5b5/",
      "name": "  Classics Quartz  FC-225ST5B5  "
    },
    {
      "brandID": 1,
      "lang": "en",
      "source": null,
      "url": "https://www.rolex.com/watches/cosmograph-daytona/m116515ln-0041.html",
      "additional": [
        {
          "Model case": "Oyster, 40 mm, Everose gold"
        },
        {
          "Oyster architecture": "Monobloc middle case, screw-down case back and winding crown"
        },
        {
          "Winding crown": "Screw-down, Triplock triple waterproofness system"
        },
        {
          "Movement": "Perpetual, mechanical chronograph, self-winding"
        },
        {
          "Precision": "-2/+2 sec/day, after casing"
        },
        {
          "Oscillator": "Paramagnetic blue Parachrom hairspring"
        },
        {
          "Winding": "Bidirectional self-winding via Perpetual rotor"
        },
        {
          "": "Superlative Chronometer (COSC + Rolex certification after casing)"
        }
      ],
      "band": {
        "type": "Oysterflex",
        "material": "Flexible metal blades overmoulded with high-performance elastomer",
        "buckle": "Folding Oysterlock safety clasp with Easylink 5 mm comfort extension link",
        "color": "Blue"
      },
      "bezel": {
        "type": "Black monobloc Cerachrom bezel in ceramic with engraved tachymetric scale"
      },
      "brand": "rolex",
      "caliber": {
        "brand": "Rolex",
        "label": "Swiss",
        "type": "Automatic",
        "reference": "4130, Manufacture Rolex",
        "reserve": "72 hours"
      },
      "case": {
        "shape": "Round",
        "back": "Screw down",
        "width": "40 mm",
        "material": "18 ct Everose gold",
        "crystal": "Sapphire"
      },
      "collection": "Cosmograph Daytona",
      "description": "To preserve the beauty of its pink gold watches, Rolex created and patented an exclusive 18 ct pink gold alloy cast in its own foundry: Everose gold. Introduced in 2005, 18 ct Everose is used on all Rolex models in pink gold.The central sweep seconds hand allows an accurate reading of 1/8 second, while the two counters on the dial display the lapsed time in hours and minutes. Drivers can accurately map out their track times and tactics without fail.The new Cosmograph Daytona is fitted with an Oysterflex bracelet, developed and patented by Rolex.  At its core lies a superelastic metal blade overmoulded with high-performance black elastomer, a material that is particularly resistant to environmental effects and very durable. The Oysterflex bracelet is also fitted with an Oysterlock safety clasp and is equipped with the Rolex patented Easylink rapid extension system that allows the wearer to increase the bracelet length by approximately 5 mm, for additional comfort in any circumstance.The Cosmograph Daytona is equipped with calibre 4130, a self-winding mechanical chronograph movement developed and manufactured by Rolex. Its architecture incorporates far fewer components than a standard chronograph, thereby enhancing the movement’s reliability. Like all Rolex Perpetual movements, the 4130 is a certified Swiss chronometer, a designation reserved for high-precision watches that have successfully passed the Swiss Official Chronometer Testing Institute (COSC) tests. The chronograph movement features a Parachrom hairspring, offering greater resistance to shocks and to temperature variations.",
      "dial": {
        "indexType": "Chronograph",
        "color": "Chocolate, black",
        "finish": "luminescence"
      },
      "features": [
        "Centre hour, minute and seconds hands, small seconds hand at 6 o'clock",
        "Chronograph (centre hand) accurate to within 1/8 of a second, 30-minute counter at 3 o'clock and 12-hour counter at 9 o'clock",
        "Stop seconds for precise time setting"
      ],
      "gender": "X",
      "name": "Cosmograph Daytona",
      "price": "S$39,920",
      "productID": null,
      "reference": "116515LN",
      "related": [],
      "waterResistance": "100 metres / 330 feet",
      "retail": "S$39,920",
      "scripts": [],
      "thumbnail": "https://images.rolex.com/2019/catalogue/images/upright-bba-with-shadow/m116515ln-0041.png?impolicy=upright-grid-card&imwidth=585"
    },
    {
      "brandID": 1,
      "lang": "en",
      "source": null,
      "url": "https://www.rolex.com/watches/cosmograph-daytona/m116500ln-0001.html",
      "additional": [
        {
          "Model case": "Oyster, 40 mm, Oystersteel"
        },
        {
          "Oyster architecture": "Monobloc middle case, screw-down case back and winding crown"
        },
        {
          "Winding crown": "Screw-down, Triplock triple waterproofness system"
        },
        {
          "Movement": "Perpetual, mechanical chronograph, self-winding"
        },
        {
          "Precision": "-2/+2 sec/day, after casing"
        },
        {
          "Oscillator": "Paramagnetic blue Parachrom hairspring"
        },
        {
          "Winding": "Bidirectional self-winding via Perpetual rotor"
        },
        {
          "": "Superlative Chronometer (COSC + Rolex certification after casing)"
        }
      ],
      "band": {
        "type": "Oyster, flat three-piece links",
        "material": "Oystersteel",
        "buckle": "Folding Oysterlock safety clasp with Easylink 5 mm comfort extension link",
        "color": "Blue"
      },
      "bezel": {
        "type": "Black monobloc Cerachrom bezel in ceramic with engraved tachymetric scale"
      },
      "brand": "rolex",
      "caliber": {
        "brand": "Rolex",
        "label": "Swiss",
        "type": "Automatic",
        "reference": "4130, Manufacture Rolex",
        "reserve": "72 hours"
      },
      "case": {
        "shape": "Round",
        "back": "Screw down",
        "width": "40 mm",
        "material": "Oystersteel",
        "crystal": "Sapphire"
      },
      "collection": "Cosmograph Daytona",
      "description": "Rolex uses Oystersteel for its steel watch cases. Specially developed by the brand, Oystersteel belongs to the 904L steel family, alloys most commonly used in high-technology and in the aerospace and chemical industries, where maximum resistance to corrosion is essential. Oystersteel is extremely resistant, offers an exceptional finish once polished and maintains its beauty even in the harshest environments.The central sweep seconds hand allows an accurate reading of 1/8 second, while the two counters on the dial display the lapsed time in hours and minutes. Drivers can accurately map out their track times and tactics without fail.The design, development and production of Rolex bracelets and clasps, as well as the stringent tests they face, involve advanced high technology. And, as with all the components of the watch, aesthetic controls by the human eye guarantee impeccable beauty.  The Oyster bracelet is a perfect alchemy of form and function. First introduced in the late 1930s, this particularly robust and comfortable metal bracelet with its broad, flat three-piece links remains the most universal bracelet in the Oyster collection.The Cosmograph Daytona is equipped with calibre 4130, a self-winding mechanical chronograph movement developed and manufactured by Rolex. Its architecture incorporates far fewer components than a standard chronograph, thereby enhancing the movement’s reliability. Like all Rolex Perpetual movements, the 4130 is a certified Swiss chronometer, a designation reserved for high-precision watches that have successfully passed the Swiss Official Chronometer Testing Institute (COSC) tests. The chronograph movement features a Parachrom hairspring, offering greater resistance to shocks and to temperature variations.",
      "dial": {
        "indexType": "Chronograph",
        "color": "White",
        "finish": "luminescence"
      },
      "features": [
        "Centre hour, minute and seconds hands, small seconds hand at 6 o'clock",
        "Chronograph (centre hand) accurate to within 1/8 of a second, 30-minute counter at 3 o'clock and 12-hour counter at 9 o'clock",
        "Stop seconds for precise time setting"
      ],
      "gender": "X",
      "name": "Cosmograph Daytona",
      "price": "S$17,640",
      "productID": null,
      "reference": "116500LN",
      "related": [],
      "waterResistance": "100 metres / 330 feet",
      "retail": "S$17,640",
      "scripts": [],
      "thumbnail": "https://images.rolex.com/2019/catalogue/images/upright-bba-with-shadow/m116500ln-0001.png?impolicy=upright-grid-card&imwidth=585"
    }
  ];

  for (let i = 0; i < data.length; i++) {
    const { reference, brandID, productID, lang, source, url, ...rest } = data[i];
    console.log(reference, url)
    // check if image has been uploaded (reference_product.assets)
    const rp = await conn.db(mdb.name)
      .collection('reference_product')
      .findOne({ brandID, reference, url, source, lang });
    if (!rp || !rp.assets) {
      const { thumbnail } = rest;
      console.log('thumbnail ===> ', thumbnail)
      if (thumbnail) {
        console.log('scrape image...')
        // scrape image
        const image = (await axios.get(thumbnail, { responseType: 'stream' })).data;
        // upload to seaweed
        const form = new FormData();
        form.append('payload', image);
        const headers = form.getHeaders()
        const fid = (await axios.post('http://localhost:8200/v2/asset/0/0', form, { headers })).data;
        rest.assets = [fid];
        console.log(reference, fid)
      } else {
        console.log('Distillation Exception: No thumbnail found')
        console.log(brandID, reference, url)
      }
    }
    await conn.db(mdb.name)
      .collection('reference_product')
      .findOneAndUpdate(
        { brandID, reference, url, source, lang },
        {
          $setOnInsert: {
            brandID,
            reference,
            source,
            lang,
            recordedAt: new Date()
          },
          $set: {
            productID,
            ...rest
          },
          $currentDate: {
            lastCheckAt: { $type: 'date' }
          }
        },
        {
          upsert: true
        }
      );
  }
})();
