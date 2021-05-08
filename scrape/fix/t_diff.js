const diff = (objA, objB) => {
    Object.keys(objA).forEach(key => {
        if (objB[key]) {
            if (typeof (objA[key]) === typeof (objB[key])) {
                if (typeof (objA[key]) === 'object') {
                    diff(objA[key], objB[key]);
                } else {
                    if (objA[key] !== objB[key]) {
                        console.log(`DIFF VALUE, KEY : ${key}   ${objA[key]}   ${objB[key]}`)
                    }
                }
            } else {
                console.log(`DIFF TYPE, KEY : ${key}   ${objA[key]}   ${objB[key]}`);
            }
        } else {
            console.log(`MISSING ATTRIBUTES, KEY : ${key}     `, objA[key]);
        }
    })
};

const p1 = {
    "brandID": 162,
    "lang": "en",
    "reference": "999/70",
    "source": "official",
    "url": "https://www.ulysse-nardin.com/row_en/999-70.html",
    "assets": "5,06ed948ba5110a",
    "band": {
        "materials": [
            "Alligator Leather"
        ],
        "type": "Strap",
        "material": "Alligator Leather"
    },
    "bezel": {

    },
    "brand": "Ulysse Nardin",
    "bundled": false,
    "caliber": {
        "reference": "UN-99",
        "brand": "Ulysse Nardin",
        "label": "Swiss",
        "type": "Manual"
    },
    "case": {
        "materials": [
            "Platinum"
        ],
        "material": "Platinum",
        "crystal": "Sapphire",
        "diameter": "41 mm \n                                                                                                    Height 13 mm",
        "waterResistance": "30 m"
    },
    "collection": "Classico Collection",
    "description": null,
    "dial": {
        "color": "Other / Astrolabium"
    },
    "dialColor": "Other / Astrolabium",
    "gender": "M",
    "limited": false,
    "movementType": "Manual",
    "name": "Trilogy 41 mm",
    "retail": "$54,000",
    "strategy": "ulysse",
    "thumbnail": "https://www.ulysse-nardin.com/pub/media/catalog/product/cache/cd8a952086d939b4120a1402e9c836e9/9/5/950x950_999-70_Watc.png",
    "warranty": 0,
    "waterResistance": "30 m",
    "additional": [],
    "features": [],
    "functions": [],
    "productID": null,
    "related": [],
    "scripts": []
};

const p2 = {
    "brandID": 162,
    "lang": "en",
    "reference": "999-70",
    "source": "official",
    "url": "https://www.ulysse-nardin.com/row_en/999-70.html",
    "additional": [],
    "band": {
        "type": "Strap",
        "material": "Leather",
        "materials": [
            "Leather"
        ],
        "buckle": "Deployand Clasp"
    },
    "base": "https://www.ulysse-nardin.com/row_en",
    "bezel": {
        "type": "GMT",
        "materials": [
            "Platinum"
        ],
        "material": "Platinum",
    },
    "brand": "Ulysse Nardin",
    "caliber": {
        "reference": "UN-99",
        "brand": "Ulysse Nardin",
        "label": "Swiss Made",
        "type": "Manual"
    },
    "case": {
        "materials": [
            "Platinum"
        ],
        "material": "Platinum",
        "crystal": "Sapphire",
        "diameter": "41mm",
        "thickness": "13 mm",
        "waterResistance": "30 m"
    },
    "collection": "Classico",
    "color": [
        "Grey"
    ],
    "dial": {
        "color": "Astrolabium"
    },
    "dialColor": "Astrolabium",
    "features": ['Diamonds'],
    "functions": ['Hour, Minute, Second Hands', 'GMT'],
    "gender": "M",
    "movementType": "Manual",
    "name": "Trilogy 41mm",
    "price": "$54,000",
    "related": [],
    "retail": "Price on demand",
    "strategy": "ulysse",
    "thumbnail": "https://www.ulysse-nardin.com/pub/media/catalog/product/cache/cd8a952086d939b4120a1402e9c836e9/9/5/950x950_999-70_Watc.png",
    "waterResistance": "30 m",
    "assets": "5,06ed948ba5110a",
    "productID": null
};

diff(p1, p2);
console.log('===============================')
diff(p2, p1);
console.log()