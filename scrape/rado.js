const axios = require('axios');
const cheerio = require('cheerio');
const r = [
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'HyperChrome',
        url: 'https://www.rado.com/hyperchrome-automatic-diamonds-high-tech-ceramic-other-36mm-r32260712.html',
        name: 'HyperChrome Automatic Diamonds',
        reference: 'R32260712',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_hyperchrome_580_0260_3_071_1.png?impolicy=magento_media',
        retail: 'CHF2900.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'HyperChrome',
        url: 'https://www.rado.com/hyperchrome-automatic-diamonds-plasma-high-tech-ceramic-brown-36mm-r32052302.html',
        name: 'HyperChrome Automatic Diamonds',
        reference: 'R32052302',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_hyperchrome_580_6052_3_030_1.png?impolicy=magento_media',
        retail: 'CHF4500.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'HyperChrome',
        url: 'https://www.rado.com/hyperchrome-automatic-diamonds-plasma-high-tech-ceramic-light-36mm-r32052012.html',
        name: 'HyperChrome Automatic Diamonds',
        reference: 'R32052012',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_hyperchrome_580_6052_3_001_1.png?impolicy=magento_media',
        retail: 'CHF4500.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'HyperChrome',
        url: 'https://www.rado.com/hyperchrome-automatic-diamonds-plasma-high-tech-ceramic-grey-36mm-r32051102.html',
        name: 'HyperChrome Automatic Diamonds',
        reference: 'R32051102',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_hyperchrome_580_6051_3_010_1.png?impolicy=magento_media',
        retail: 'CHF4500.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'HyperChrome',
        url: 'https://www.rado.com/hyperchrome-stainless-steel-light-44-9-mm-r32502103.html',
        name: 'HyperChrome',
        reference: 'R32502103',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_hyperchrome_073_0502_3_010_1.png?impolicy=magento_media',
        retail: 'CHF1200.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'HyperChrome',
        url: 'https://www.rado.com/hyperchrome-diamonds-high-tech-ceramic-brown-36mm-r32124302.html',
        name: 'HyperChrome Diamonds',
        reference: 'R32124302',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_hyperchrome_129_0124_3_030_1.png?impolicy=magento_media',
        retail: 'CHF3900.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'HyperChrome',
        url: 'https://www.rado.com/hyperchrome-diamonds-high-tech-ceramic-light-36mm-r32126902.html',
        name: 'HyperChrome Diamonds',
        reference: 'R32126902',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_hyperchrome_129_0126_3_090_1.png?impolicy=magento_media',
        retail: 'CHF4000.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'HyperChrome',
        url: 'https://www.rado.com/hyperchrome-stainless-steel-black-44-9-mm-r32502153.html',
        name: 'HyperChrome',
        reference: 'R32502153',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_hyperchrome_073_0502_3_015_1.png?impolicy=magento_media',
        retail: 'CHF1100.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'HyperChrome',
        url: 'https://www.rado.com/hyperchrome-stainless-steel-blue-44-9-mm-r32502203.html',
        name: 'HyperChrome',
        reference: 'R32502203',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_hyperchrome_073_0502_3_020_1.png?impolicy=magento_media',
        retail: 'CHF1100.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'HyperChrome',
        url: 'https://www.rado.com/hyperchrome-stainless-steel-green-44-9-mm-r32502313.html',
        name: 'HyperChrome',
        reference: 'R32502313',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_hyperchrome_073_0502_3_031_1.png?impolicy=magento_media',
        retail: 'CHF1100.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'HyperChrome',
        url: 'https://www.rado.com/hyperchrome-diamonds-high-tech-ceramic-black-36mm-r32123152.html',
        name: 'HyperChrome Diamonds',
        reference: 'R32123152',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_hyperchrome_129_0123_3_015_1.png?impolicy=magento_media',
        retail: 'CHF3900.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'HyperChrome',
        url: 'https://www.rado.com/hyperchrome-diamonds-plasma-high-tech-ceramic-grey-36mm-r32125102.html',
        name: 'HyperChrome Diamonds',
        reference: 'R32125102',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_hyperchrome_129_0125_3_010_1.png?impolicy=magento_media',
        retail: 'CHF4100.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'HyperChrome',
        url: 'https://www.rado.com/hyperchrome-ash-barty-high-tech-ceramic-light-36mm-r32311902.html',
        name: 'HyperChrome Ash Barty',
        reference: 'R32311902',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_hyperchrome_129_0311_3_090_1.png?impolicy=magento_media',
        retail: 'CHF4000.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'HyperChrome',
        url: 'https://www.rado.com/hyperchrome-chronograph-stainless-steel-black-44-9-mm-r32259153.html',
        name: 'HyperChrome  Chronograph',
        reference: 'R32259153',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_hyperchrome_312_0259_3_015_1.png?impolicy=magento_media',
        retail: 'CHF1500.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'HyperChrome',
        url: 'https://www.rado.com/hyperchrome-chronograph-stainless-steel-grey-44-9-mm-r32259163.html',
        name: 'HyperChrome Chronograph',
        reference: 'R32259163',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_hyperchrome_312_0259_3_016_1.png?impolicy=magento_media',
        retail: 'CHF1500.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'HyperChrome',
        url: 'https://www.rado.com/hyperchrome-chronograph-stainless-steel-blue-44-9-mm-r32259203.html',
        name: 'HyperChrome Chronograph',
        reference: 'R32259203',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_hyperchrome_312_0259_3_020_1.png?impolicy=magento_media',
        retail: 'CHF1500.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'HyperChrome',
        url: 'https://www.rado.com/hyperchrome-chronograph-stainless-steel-green-44-9-mm-r32259313.html',
        name: 'HyperChrome Chronograph',
        reference: 'R32259313',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_hyperchrome_312_0259_3_031_1.png?impolicy=magento_media',
        retail: 'CHF1500.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'HyperChrome',
        url: 'https://www.rado.com/hyperchrome-automatic-diamonds-high-tech-ceramic-black-36mm-r32482722.html',
        name: 'HyperChrome Automatic Diamonds',
        reference: 'R32482722',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_hyperchrome_580_0482_3_072_1.png?impolicy=magento_media',
        retail: 'CHF7500.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'HyperChrome',
        url: 'https://www.rado.com/hyperchrome-automatic-diamonds-plasma-high-tech-ceramic-black-36mm-r32523722.html',
        name: 'HyperChrome Automatic Diamonds',
        reference: 'R32523722',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_hyperchrome_580_0523_3_072_1.png?impolicy=magento_media',
        retail: 'CHF7700.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'HyperChrome',
        url: 'https://www.rado.com/hyperchrome-automatic-plasma-high-tech-ceramic-green-36mm-r32041312.html',
        name: 'HyperChrome Automatic',
        reference: 'R32041312',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_hyperchrome_580_6041_3_031_1.png?impolicy=magento_media',
        retail: 'CHF2600.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'HyperChrome',
        url: 'https://www.rado.com/hyperchrome-1314-plasma-high-tech-ceramic-blue-36mm-r32041702.html',
        name: 'HyperChrome 1314',
        reference: 'R32041702',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_hyperchrome_580_6041_3_070_1.png?impolicy=magento_media',
        retail: 'CHF3000.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'HyperChrome',
        url: 'https://www.rado.com/hyperchrome-1314-plasma-high-tech-ceramic-grey-36mm-r32043702.html',
        name: 'HyperChrome 1314',
        reference: 'R32043702',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_hyperchrome_580_6043_3_070_1.png?impolicy=magento_media',
        retail: 'CHF3000.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'HyperChrome',
        url: 'https://www.rado.com/hyperchrome-automatic-high-tech-ceramic-black-36mm-r32044162.html',
        name: 'HyperChrome Automatic',
        reference: 'R32044162',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_hyperchrome_580_6044_3_016_1.png?impolicy=magento_media',
        retail: 'CHF2400.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'HyperChrome',
        url: 'https://www.rado.com/hyperchrome-automatic-chronograph-stainless-steel-light-44mm-r32042103.html',
        name: 'HyperChrome Automatic Chronograph',
        reference: 'R32042103',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_hyperchrome_603_6042_3_010_1.png?impolicy=magento_media',
        retail: 'CHF2500.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'HyperChrome',
        url: 'https://www.rado.com/hyperchrome-automatic-chronograph-stainless-steel-black-44mm-r32042153.html',
        name: 'HyperChrome Automatic Chronograph',
        reference: 'R32042153',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_hyperchrome_603_6042_3_015_1.png?impolicy=magento_media',
        retail: 'CHF2500.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'HyperChrome',
        url: 'https://www.rado.com/hyperchrome-automatic-chronograph-stainless-steel-blue-44mm-r32042203.html',
        name: 'HyperChrome Automatic Chronograph',
        reference: 'R32042203',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_hyperchrome_603_6042_3_020_1.png?impolicy=magento_media',
        retail: 'CHF2500.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'HyperChrome',
        url: 'https://www.rado.com/hyperchrome-automatic-chronograph-stainless-steel-black-44mm-r32042155.html',
        name: 'HyperChrome Automatic Chronograph',
        reference: 'R32042155',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_hyperchrome_603_6042_3_115_1.png?impolicy=magento_media',
        retail: 'CHF2400.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'HyperChrome',
        url: 'https://www.rado.com/hyperchrome-automatic-chronograph-stainless-steel-blue-44mm-r32042205.html',
        name: 'HyperChrome Automatic Chronograph',
        reference: 'R32042205',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_hyperchrome_603_6042_3_120_1.png?impolicy=magento_media',
        retail: 'CHF2400.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'HyperChrome',
        url: 'https://www.rado.com/hyperchrome-automatic-chronograph-stainless-steel-brown-44mm-r32042305.html',
        name: 'HyperChrome Automatic Chronograph',
        reference: 'R32042305',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_hyperchrome_603_6042_3_130_1.png?impolicy=magento_media',
        retail: 'CHF2400.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'HyperChrome',
        url: 'https://www.rado.com/hyperchrome-automatic-chronograph-match-point-limited-edition-plasma-high-tech-ceramic-blue-45mm-r32022102.html',
        name: 'HyperChrome Automatic Chronograph Match Point Limited Edition',
        reference: 'R32022102',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_hyperchrome_650_0022_3_010_1.png?impolicy=magento_media',
        retail: 'CHF4700.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'HyperChrome',
        url: 'https://www.rado.com/hyperchrome-tennis-automatic-chronograph-plasma-high-tech-ceramic-green-45mm-r32022312.html',
        name: 'HyperChrome Tennis Automatic Chronograph',
        reference: 'R32022312',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_hyperchrome_650_0022_3_031_1.png?impolicy=magento_media',
        retail: 'CHF4700.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'HyperChrome',
        url: 'https://www.rado.com/hyperchrome-tennis-automatic-chronograph-plasma-high-tech-ceramic-blue-45mm-r32022105.html',
        name: 'HyperChrome Tennis Automatic Chronograph',
        reference: 'R32022105',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_hyperchrome_650_0022_3_110_1.png?impolicy=magento_media',
        retail: 'CHF4400.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'HyperChrome',
        url: 'https://www.rado.com/hyperchrome-tennis-automatic-chronograph-plasma-high-tech-ceramic-brown-45mm-r32022305.html',
        name: 'HyperChrome Tennis Automatic Chronograph',
        reference: 'R32022305',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_hyperchrome_650_0022_3_130_1.png?impolicy=magento_media',
        retail: 'CHF4400.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'HyperChrome',
        url: 'https://www.rado.com/hyperchrome-automatic-chronograph-plasma-high-tech-ceramic-light-45mm-r32108102.html',
        name: 'HyperChrome Automatic Chronograph',
        reference: 'R32108102',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_hyperchrome_650_0108_3_010_1.png?impolicy=magento_media',
        retail: 'CHF4700.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'HyperChrome',
        url: 'https://www.rado.com/hyperchrome-automatic-chronograph-high-tech-ceramic-black-45mm-r32111162.html',
        name: 'HyperChrome Automatic Chronograph',
        reference: 'R32111162',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_hyperchrome_650_0111_3_016_1.png?impolicy=magento_media',
        retail: 'CHF4550.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'HyperChrome',
        url: 'https://www.rado.com/hyperchrome-automatic-chronograph-plasma-high-tech-ceramic-grey-45mm-r32118102.html',
        name: 'HyperChrome Automatic Chronograph',
        reference: 'R32118102',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_hyperchrome_650_0118_3_010_1.png?impolicy=magento_media',
        retail: 'CHF4700.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'HyperChrome',
        url: 'https://www.rado.com/hyperchrome-automatic-chronograph-plasma-high-tech-ceramic-blue-45mm-r32120202.html',
        name: 'HyperChrome Automatic Chronograph',
        reference: 'R32120202',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_hyperchrome_650_0120_3_020_1.png?impolicy=magento_media',
        retail: 'CHF4700.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'HyperChrome',
        url: 'https://www.rado.com/hyperchrome-automatic-chronograph-plasma-high-tech-ceramic-blue-45mm-r32120205.html',
        name: 'HyperChrome Automatic Chronograph',
        reference: 'R32120205',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_hyperchrome_650_0120_3_120_1.png?impolicy=magento_media',
        retail: 'CHF4300.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'HyperChrome',
        url: 'https://www.rado.com/hyperchrome-automatic-chronograph-high-tech-ceramic-black-45mm-r32121152.html',
        name: 'HyperChrome Automatic Chronograph',
        reference: 'R32121152',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_hyperchrome_650_0121_3_015.png?impolicy=magento_media',
        retail: 'CHF4550.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'HyperChrome',
        url: 'https://www.rado.com/hyperchrome-automatic-chronograph-high-tech-ceramic-black-45mm-r32121155.html',
        name: 'HyperChrome Automatic Chronograph',
        reference: 'R32121155',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_hyperchrome_650_0121_3_115_1.png?impolicy=magento_media',
        retail: 'CHF4200.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'HyperChrome',
        url: 'https://www.rado.com/hyperchrome-automatic-chronograph-high-tech-ceramic-black-45mm-r32168155.html',
        name: 'HyperChrome Automatic Chronograph',
        reference: 'R32168155',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_hyperchrome_650_0168_3_115.png?impolicy=magento_media',
        retail: 'CHF4900.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'HyperChrome',
        url: 'https://www.rado.com/hyperchrome-automatic-chronograph-high-tech-ceramic-black-45mm-r32503165.html',
        name: 'HyperChrome Automatic Chronograph',
        reference: 'R32503165',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_hyperchrome_650_0503_3_116_1.png?impolicy=magento_media',
        retail: 'CHF4300.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'HyperChrome',
        url: 'https://www.rado.com/hyperchrome-match-point-automatic-chronograph-high-tech-ceramic-other-45mm-r32525202.html',
        name: 'HyperChrome Match Point Automatic Chronograph',
        reference: 'R32525202',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_hyperchrome_650_0525_3_020_2.png?impolicy=magento_media',
        retail: 'CHF4550.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'HyperChrome',
        url: 'https://www.rado.com/hyperchrome-automatic-open-heart-plasma-high-tech-ceramic-grey-42mm-r32021102.html',
        name: 'HyperChrome Automatic Open Heart',
        reference: 'R32021102',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_hyperchrome_734_0021_3_010_1.png?impolicy=magento_media',
        retail: 'CHF2800.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'HyperChrome',
        url: 'https://www.rado.com/hyperchrome-automatic-open-heart-high-tech-ceramic-brown-42mm-r32028302.html',
        name: 'HyperChrome Automatic Open Heart',
        reference: 'R32028302',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_hyperchrome_734_0028_3_030_1.png?impolicy=magento_media',
        retail: 'CHF2800.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'HyperChrome',
        url: 'https://www.rado.com/hyperchrome-automatic-open-heart-diamonds-high-tech-ceramic-black-42mm-r32029152.html',
        name: 'HyperChrome Automatic Open Heart Diamonds',
        reference: 'R32029152',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_hyperchrome_734_0029_3_015_1.png?impolicy=magento_media',
        retail: 'CHF4500.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'HyperChrome',
        url: 'https://www.rado.com/hyperchrome-automatic-high-tech-ceramic-black-42mm-r32252162.html',
        name: 'HyperChrome Automatic',
        reference: 'R32252162',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_hyperchrome_763_0252_3_016_1.png?impolicy=magento_media',
        retail: 'CHF2400.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'HyperChrome',
        url: 'https://www.rado.com/hyperchrome-automatic-plasma-high-tech-ceramic-blue-42mm-r32254202.html',
        name: 'HyperChrome Automatic',
        reference: 'R32254202',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_hyperchrome_763_0254_3_020_1.png?impolicy=magento_media',
        retail: 'CHF2600.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'HyperChrome',
        url: 'https://www.rado.com/hyperchrome-automatic-plasma-high-tech-ceramic-grey-42mm-r32254302.html',
        name: 'HyperChrome Automatic',
        reference: 'R32254302',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_hyperchrome_763_0254_3_030_1.png?impolicy=magento_media',
        retail: 'CHF2600.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'HyperChrome',
        url: 'https://www.rado.com/hyperchrome-automatic-plasma-high-tech-ceramic-green-42mm-r32254312.html',
        name: 'HyperChrome Automatic',
        reference: 'R32254312',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_hyperchrome_763_0254_3_031_1.png?impolicy=magento_media',
        retail: 'CHF2600.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'HyperChrome',
        url: 'https://www.rado.com/hyperchrome-automatic-plasma-high-tech-ceramic-light-42mm-r32256012.html',
        name: 'HyperChrome Automatic',
        reference: 'R32256012',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_hyperchrome_763_0256_3_001_1.png?impolicy=magento_media',
        retail: 'CHF2600.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'HyperChrome',
        url: 'https://www.rado.com/hyperchrome-1314-plasma-high-tech-ceramic-grey-42mm-r32256702.html',
        name: 'HyperChrome 1314',
        reference: 'R32256702',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_hyperchrome_763_0256_3_070_1.png?impolicy=magento_media',
        retail: 'CHF3000.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'HyperChrome',
        url: 'https://www.rado.com/hyperchrome-automatic-utc-stainless-steel-light-44mm-r32050103.html',
        name: 'HyperChrome Automatic UTC',
        reference: 'R32050103',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_hyperchrome_771_6050_3_010_1.png?impolicy=magento_media',
        retail: 'CHF1700.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'HyperChrome',
        url: 'https://www.rado.com/hyperchrome-automatic-utc-stainless-steel-black-44mm-r32050153.html',
        name: 'HyperChrome Automatic UTC',
        reference: 'R32050153',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_hyperchrome_771_6050_3_015_1.png?impolicy=magento_media',
        retail: 'CHF1700.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'HyperChrome',
        url: 'https://www.rado.com/hyperchrome-automatic-utc-stainless-steel-blue-44mm-r32050203.html',
        name: 'HyperChrome Automatic UTC',
        reference: 'R32050203',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_hyperchrome_771_6050_3_020_1.png?impolicy=magento_media',
        retail: 'CHF1700.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'HyperChrome',
        url: 'https://www.rado.com/hyperchrome-ultra-light-other-43mm-r32035255.html',
        name: 'HyperChrome Ultra Light',
        reference: 'R32035255',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_hyperchromeul_766_6035_3_125_1.png?impolicy=magento_media',
        retail: 'CHF3000.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'HyperChrome',
        url: 'https://www.rado.com/hyperchrome-automatic-chronograph-plasma-high-tech-ceramic-light-45mm-r32120697.html',
        name: 'HyperChrome Automatic Chronograph',
        reference: 'R32120697',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_hyperchrome_650_0120_3_769.png?impolicy=magento_media',
        retail: 'CHF6000.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'HyperChrome',
        url: 'https://www.rado.com/hyperchrome-automatic-chronograph-plasma-high-tech-ceramic-other-45mm-r32120698.html',
        name: 'HyperChrome Automatic Chronograph',
        reference: 'R32120698',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_hyperchrome_650_0120_3_869.png?impolicy=magento_media',
        retail: 'CHF6000.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'HyperChrome Classic',
        url: 'https://www.rado.com/hyperchrome-classic-automatic-diamonds-stainless-steel-grey-35mm-r33102703.html',
        name: 'HyperChrome Classic Automatic Diamonds',
        reference: 'R33102703',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_golden_horse_561_6102_3_070_1.png?impolicy=magento_media',
        retail: 'CHF2600.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'HyperChrome Classic',
        url: 'https://www.rado.com/hyperchrome-classic-automatic-diamonds-stainless-steel-blue-42mm-r33101713.html',
        name: 'HyperChrome Classic Automatic Diamonds',
        reference: 'R33101713',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_golden_horse_763_6101_3_071_1.png?impolicy=magento_media',
        retail: 'CHF2500.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'HyperChrome Classic',
        url: 'https://www.rado.com/hyperchrome-classic-automatic-diamonds-stainless-steel-blue-35mm-r33103713.html',
        name: 'HyperChrome Classic Automatic Diamonds',
        reference: 'R33103713',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_golden_horse_561_6103_3_071_1.png?impolicy=magento_media',
        retail: 'CHF2500.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'HyperChrome Classic',
        url: 'https://www.rado.com/hyperchrome-classic-diamonds-stainless-steel-light-35mm-r33099918.html',
        name: 'HyperChrome Classic Diamonds',
        reference: 'R33099918',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_golden_horse_082_6099_3_591_1.png?impolicy=magento_media',
        retail: 'CHF2750.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'HyperChrome Classic',
        url: 'https://www.rado.com/hyperchrome-classic-stainless-steel-light-35mm-r33104918.html',
        name: 'HyperChrome Classic',
        reference: 'R33104918',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_golden_horse_082_6104_3_591_cuir_rouge_1.png?impolicy=magento_media',
        retail: 'CHF1750.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'HyperChrome Classic',
        url: 'https://www.rado.com/hyperchrome-classic-automatic-stainless-steel-grey-35mm-r33102103.html',
        name: 'HyperChrome Classic Automatic',
        reference: 'R33102103',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_hyperchrome_classic_561_6102_3_010_1.png?impolicy=magento_media',
        retail: 'CHF2100.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'HyperChrome Classic',
        url: 'https://www.rado.com/hyperchrome-classic-automatic-diamonds-stainless-steel-light-35mm-r33102903.html',
        name: 'HyperChrome Classic Automatic Diamonds',
        reference: 'R33102903',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_hyperchrome_classic_561_6102_3_090_1.png?impolicy=magento_media',
        retail: 'CHF2600.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'HyperChrome Classic',
        url: 'https://www.rado.com/hyperchrome-classic-automatic-diamonds-stainless-steel-light-35mm-r33102905.html',
        name: 'HyperChrome Classic Automatic Diamonds',
        reference: 'R33102905',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_hyperchrome_classic_561_6102_3_190_1.png?impolicy=magento_media',
        retail: 'CHF2500.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'HyperChrome Classic',
        url: 'https://www.rado.com/hyperchrome-classic-automatic-stainless-steel-blue-35mm-r33103204.html',
        name: 'HyperChrome Classic Automatic',
        reference: 'R33103204',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_hyperchrome_classic_561_6103_3_020_1.png?impolicy=magento_media',
        retail: 'CHF2000.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'HyperChrome Classic',
        url: 'https://www.rado.com/hyperchrome-classic-automatic-stainless-steel-green-35mm-r33103314.html',
        name: 'HyperChrome Classic Automatic',
        reference: 'R33103314',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_hyperchrome_classic_561_6103_3_031_1.png?impolicy=magento_media',
        retail: 'CHF2000.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'HyperChrome Classic',
        url: 'https://www.rado.com/hyperchrome-classic-automatic-stainless-steel-blue-35mm-r33103203.html',
        name: 'HyperChrome Classic Automatic',
        reference: 'R33103203',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_hyperchrome_classic_561_6103_3_220_1.png?impolicy=magento_media',
        retail: 'CHF2000.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'HyperChrome Classic',
        url: 'https://www.rado.com/hyperchrome-classic-automatic-stainless-steel-light-42mm-r33100013.html',
        name: 'HyperChrome Classic Automatic',
        reference: 'R33100013',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_hyperchrome_classic_763_6100_3_001_1.png?impolicy=magento_media',
        retail: 'CHF2100.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'HyperChrome Classic',
        url: 'https://www.rado.com/hyperchrome-classic-automatic-stainless-steel-grey-42mm-r33100103.html',
        name: 'HyperChrome Classic Automatic',
        reference: 'R33100103',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_hyperchrome_classic_763_6100_3_010_1.png?impolicy=magento_media',
        retail: 'CHF2100.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'HyperChrome Classic',
        url: 'https://www.rado.com/hyperchrome-classic-automatic-stainless-steel-light-42mm-r33100015.html',
        name: 'HyperChrome Classic Automatic',
        reference: 'R33100015',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_hyperchrome_classic_763_6100_3_101_1.png?impolicy=magento_media',
        retail: 'CHF2000.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'HyperChrome Classic',
        url: 'https://www.rado.com/hyperchrome-classic-automatic-stainless-steel-blue-42mm-r33101204.html',
        name: 'HyperChrome Classic Automatic',
        reference: 'R33101204',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_hyperchrome_classic_763_6101_3_020_1.png?impolicy=magento_media',
        retail: 'CHF2000.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'HyperChrome Classic',
        url: 'https://www.rado.com/hyperchrome-classic-automatic-stainless-steel-green-42mm-r33101314.html',
        name: 'HyperChrome Classic Automatic',
        reference: 'R33101314',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_hyperchrome_classic_763_6101_3_031_1.png?impolicy=magento_media',
        retail: 'CHF2000.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'HyperChrome Classic',
        url: 'https://www.rado.com/hyperchrome-classic-automatic-stainless-steel-grey-42mm-r33101105.html',
        name: 'HyperChrome Classic Automatic',
        reference: 'R33101105',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_hyperchrome_classic_763_6101_3_110_1.png?impolicy=magento_media',
        retail: 'CHF1900.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'HyperChrome Classic',
        url: 'https://www.rado.com/hyperchrome-classic-automatic-stainless-steel-blue-42mm-r33101203.html',
        name: 'HyperChrome Classic Automatic',
        reference: 'R33101203',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_golden_horse_763_6101_3_220_1.png?impolicy=magento_media',
        retail: 'CHF2000.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'HyperChrome Classic',
        url: 'https://www.rado.com/hyperchrome-classic-automatic-diamonds-stainless-steel-grey-42mm-r33100703.html',
        name: 'HyperChrome Classic Automatic Diamonds',
        reference: 'R33100703',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_golden_horse_763_6100_3_070_1.png?impolicy=magento_media',
        retail: 'CHF2600.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'HyperChrome Classic',
        url: 'https://www.rado.com/golden-horse-automatic-stainless-steel-black-37mm-r33930153.html',
        name: 'Golden Horse Automatic',
        reference: 'R33930153',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_golden_horse_763_3930_4_015_1.png?impolicy=magento_media',
        retail: 'CHF1800.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'HyperChrome Classic',
        url: 'https://www.rado.com/golden-horse-automatic-stainless-steel-blue-37mm-r33930203.html',
        name: 'Golden Horse Automatic',
        reference: 'R33930203',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_golden_horse_763_3930_4_020_1.png?impolicy=magento_media',
        retail: 'CHF1800.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'HyperChrome Classic',
        url: 'https://www.rado.com/golden-horse-automatic-stainless-steel-green-37mm-r33930313.html',
        name: 'Golden Horse Automatic',
        reference: 'R33930313',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_golden_horse_763_3930_4_031_1.png?impolicy=magento_media',
        retail: 'CHF1800.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'HyperChrome Classic',
        url: 'https://www.rado.com/golden-horse-automatic-stainless-steel-other-37mm-r33930355.html',
        name: 'Golden Horse Automatic',
        reference: 'R33930355',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_golden_horse_763_3930_4_135_1.png?impolicy=magento_media',
        retail: 'CHF1700.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'DiaMaster',
        url: 'https://www.rado.com/diamaster-prajun-plasma-high-tech-ceramic-light-35mm-r14058905.html',
        name: 'DiaMaster Prajun',
        reference: 'R14058905',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_diamaster_734_6058_3_490_cuir_1.png?impolicy=magento_media',
        retail: 'CHF3000.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'DiaMaster',
        url: 'https://www.rado.com/diamaster-thinline-automatic-ceramostm-brown-40-3-mm-r14068306.html',
        name: 'DiaMaster Thinline Automatic',
        reference: 'R14068306',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_diamaster_766_6068_3_430_1.png?impolicy=magento_media',
        retail: 'CHF2200.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'DiaMaster',
        url: 'https://www.rado.com/diamaster-diamonds-plasma-high-tech-ceramic-other-35mm-r14055905.html',
        name: 'DiaMaster Diamonds',
        reference: 'R14055905',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_diamaster_084_6055_3_490_1.png?impolicy=magento_media',
        retail: 'CHF2000.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'DiaMaster',
        url: 'https://www.rado.com/diamaster-thinline-automatic-ceramostm-light-40-7-mm-r14067036.html',
        name: 'DiaMaster Thinline Automatic',
        reference: 'R14067036',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_diamaster_766_6067_3_403_1.png?impolicy=magento_media',
        retail: 'CHF2200.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'DiaMaster',
        url: 'https://www.rado.com/diamaster-diamonds-plasma-high-tech-ceramic-other-35mm-r14055925.html',
        name: 'DiaMaster Diamonds',
        reference: 'R14055925',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_diamaster_084_6055_3_492_1.png?impolicy=magento_media',
        retail: 'CHF2000.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'DiaMaster',
        url: 'https://www.rado.com/diamaster-thinline-automatic-ceramostm-grey-40-7-mm-r14067156.html',
        name: 'DiaMaster Thinline Automatic',
        reference: 'R14067156',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_diamasterthinline_766_6067_3_415_1.png?impolicy=magento_media',
        retail: 'CHF2200.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'DiaMaster',
        url: 'https://www.rado.com/diamaster-diamonds-plasma-high-tech-ceramic-other-35mm-r14055935.html',
        name: 'DiaMaster Diamonds',
        reference: 'R14055935',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_diamaster_084_6055_3_493_1.png?impolicy=magento_media',
        retail: 'CHF2000.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'DiaMaster',
        url: 'https://www.rado.com/diamaster-thinline-automatic-ceramostm-light-40-3-mm-r14068016.html',
        name: 'DiaMaster Thinline Automatic',
        reference: 'R14068016',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_diamaster_766_6068_3_401_1.png?impolicy=magento_media',
        retail: 'CHF2200.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'DiaMaster',
        url: 'https://www.rado.com/diamaster-diamonds-plasma-high-tech-ceramic-grey-33mm-r14064715.html',
        name: 'DiaMaster Diamonds',
        reference: 'R14064715',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_diamaster_218_0064_3_471_1.png?impolicy=magento_media',
        retail: 'CHF2500.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'DiaMaster',
        url: 'https://www.rado.com/diamaster-thinline-automatic-ceramostm-light-40-3-mm-r14068026.html',
        name: 'DiaMaster Thinline Automatic',
        reference: 'R14068026',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_diamasterthinline_766_6068_3_402_1.png?impolicy=magento_media',
        retail: 'CHF2200.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'DiaMaster',
        url: 'https://www.rado.com/diamaster-diamonds-plasma-high-tech-ceramic-blue-33mm-r14064725.html',
        name: 'DiaMaster Diamonds',
        reference: 'R14064725',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_diamaster_218_0064_3_472_1.png?impolicy=magento_media',
        retail: 'CHF1900.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'DiaMaster',
        url: 'https://www.rado.com/diamaster-thinline-automatic-ceramostm-black-40-3-mm-r14068166.html',
        name: 'DiaMaster Thinline Automatic',
        reference: 'R14068166',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_diamasterthinline_766_6068_3_416_1.png?impolicy=magento_media',
        retail: 'CHF2200.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'DiaMaster',
        url: 'https://www.rado.com/diamaster-diamonds-plasma-high-tech-ceramic-brown-33mm-r14064735.html',
        name: 'DiaMaster Diamonds',
        reference: 'R14064735',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_diamaster_218_0064_3_473_1.png?impolicy=magento_media',
        retail: 'CHF1900.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'DiaMaster',
        url: 'https://www.rado.com/diamaster-thinline-automatic-ceramostm-blue-40-3-mm-r14068206.html',
        name: 'DiaMaster Thinline Automatic',
        reference: 'R14068206',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_diamasterthinline_766_6068_3_420_1.png?impolicy=magento_media',
        retail: 'CHF2200.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'DiaMaster',
        url: 'https://www.rado.com/diamaster-diamonds-plasma-high-tech-ceramic-light-33mm-r14064945.html',
        name: 'DiaMaster Diamonds',
        reference: 'R14064945',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_diamaster_218_0064_3_494_1.png?impolicy=magento_media',
        retail: 'CHF1950.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'DiaMaster',
        url: 'https://www.rado.com/diamaster-automatic-power-reserve-high-tech-ceramic-black-43mm-r14137156.html',
        name: 'DiaMaster Automatic Power Reserve',
        reference: 'R14137156',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_diamaster_772_0137_3_415_1.png?impolicy=magento_media',
        retail: 'CHF2100.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'DiaMaster',
        url: 'https://www.rado.com/diamaster-thinline-ceramostm-other-37-8-mm-r14071916.html',
        name: 'DiaMaster Thinline',
        reference: 'R14071916',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_diamaster_420_6071_3_491_1.png?impolicy=magento_media',
        retail: 'CHF2500.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'DiaMaster',
        url: 'https://www.rado.com/diamaster-thinline-ceramostm-other-37-8-mm-r14071926.html',
        name: 'DiaMaster Thinline',
        reference: 'R14071926',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_diamaster_420_6071_3_492_1.png?impolicy=magento_media',
        retail: 'CHF2500.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'DiaMaster',
        url: 'https://www.rado.com/diamaster-automatic-power-reserve-high-tech-ceramic-light-43mm-r14140026.html',
        name: 'DiaMaster Automatic Power Reserve',
        reference: 'R14140026',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_diamaster_772_0140_3_402_1.png?impolicy=magento_media',
        retail: 'CHF2200.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'DiaMaster',
        url: 'https://www.rado.com/diamaster-thinline-ceramostm-light-37-8-mm-r14071936.html',
        name: 'DiaMaster Thinline',
        reference: 'R14071936',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_diamaster_420_6071_3_493_1.png?impolicy=magento_media',
        retail: 'CHF2500.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'DiaMaster',
        url: 'https://www.rado.com/diamaster-automatic-petite-seconde-plasma-high-tech-ceramic-light-43mm-r14053016.html',
        name: 'DiaMaster Automatic Petite Seconde',
        reference: 'R14053016',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_diamaster_773_6053_3_401_1.png?impolicy=magento_media',
        retail: 'CHF2500.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'DiaMaster',
        url: 'https://www.rado.com/diamaster-automatic-open-heart-diamonds-plasma-high-tech-ceramic-light-35mm-r14056935.html',
        name: 'DiaMaster Automatic Open Heart Diamonds',
        reference: 'R14056935',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_diamaster_734_6056_3_493_1.png?impolicy=magento_media',
        retail: 'CHF2700.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'DiaMaster',
        url: 'https://www.rado.com/diamaster-automatic-petite-seconde-plasma-high-tech-ceramic-grey-43mm-r14053106.html',
        name: 'DiaMaster Automatic Petite Seconde',
        reference: 'R14053106',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_diamaster_773_6053_3_410_1.png?impolicy=magento_media',
        retail: 'CHF2500.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'DiaMaster',
        url: 'https://www.rado.com/diamaster-automatic-open-heart-diamonds-plasma-high-tech-ceramic-light-35mm-r14056945.html',
        name: 'DiaMaster Automatic Open Heart Diamonds',
        reference: 'R14056945',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_diamaster_734_6056_3_494_1.png?impolicy=magento_media',
        retail: 'CHF2700.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'DiaMaster',
        url: 'https://www.rado.com/diamaster-automatic-petite-seconde-plasma-high-tech-ceramic-blue-43mm-r14053206.html',
        name: 'DiaMaster Automatic Petite Seconde',
        reference: 'R14053206',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_diamaster_773_6053_3_420_1.png?impolicy=magento_media',
        retail: 'CHF2500.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'DiaMaster',
        url: 'https://www.rado.com/diamaster-automatic-open-heart-diamonds-plasma-high-tech-ceramic-black-35mm-r14056955.html',
        name: 'DiaMaster Automatic Open Heart Diamonds',
        reference: 'R14056955',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_diamaster_734_6056_3_495_1.png?impolicy=magento_media',
        retail: 'CHF2700.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'DiaMaster',
        url: 'https://www.rado.com/diamaster-automatic-power-reserve-plasma-high-tech-ceramic-blue-43mm-r14138206.html',
        name: 'DiaMaster Automatic Power Reserve',
        reference: 'R14138206',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_diamaster_772_0138_3_420_1.png?impolicy=magento_media',
        retail: 'CHF2200.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Coupole Classic',
        url: 'https://www.rado.com/coupole-classic-diamonds-stainless-steel-blue-34mm-r22882903.html',
        name: 'Coupole Classic Diamonds',
        reference: 'R22882903',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_coupole_084_3882_4_090_1.png?impolicy=magento_media',
        retail: 'CHF2400.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Coupole Classic',
        url: 'https://www.rado.com/coupole-classic-open-heart-automatic-black-41mm-r22895165.html',
        name: 'Coupole Classic Open Heart Automatic',
        reference: 'R22895165',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_coupole_734_3895_2_116_1.png?impolicy=magento_media',
        retail: 'CHF1550.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Coupole Classic',
        url: 'https://www.rado.com/coupole-classic-diamonds-stainless-steel-light-34mm-r22882923.html',
        name: 'Coupole Classic Diamonds',
        reference: 'R22882923',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_coupole_084_3882_4_292_1.png?impolicy=magento_media',
        retail: 'CHF2500.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Coupole Classic',
        url: 'https://www.rado.com/coupole-classic-open-heart-automatic-blue-41mm-r22895215.html',
        name: 'Coupole Classic Open Heart Automatic',
        reference: 'R22895215',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_coupole_734_3895_2_121_1.png?impolicy=magento_media',
        retail: 'CHF1550.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Coupole Classic',
        url: 'https://www.rado.com/coupole-classic-diamonds-stainless-steel-light-34mm-r22883923.html',
        name: 'Coupole Classic Diamonds',
        reference: 'R22883923',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_coupole_084_3883_4_092_1.png?impolicy=magento_media',
        retail: 'CHF1600.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Coupole Classic',
        url: 'https://www.rado.com/coupole-classic-automatic-stainless-steel-light-37-7-mm-r22860015.html',
        name: 'Coupole Classic Automatic',
        reference: 'R22860015',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_coupole_763_3860_4_101_1.png?impolicy=magento_media',
        retail: 'CHF1150.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Coupole Classic',
        url: 'https://www.rado.com/coupole-classic-stainless-steel-light-34mm-r22883943.html',
        name: 'Coupole Classic',
        reference: 'R22883943',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_coupole_084_3883_4_094_1.png?impolicy=magento_media',
        retail: 'CHF1300.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Coupole Classic',
        url: 'https://www.rado.com/coupole-classic-automatic-stainless-steel-light-37-7-mm-r22860025.html',
        name: 'Coupole Classic Automatic',
        reference: 'R22860025',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_coupole_763_3860_4_102_1.png?impolicy=magento_media',
        retail: 'CHF1150.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Coupole Classic',
        url: 'https://www.rado.com/coupole-classic-diamonds-stainless-steel-light-34mm-r22883953.html',
        name: 'Coupole Classic Diamonds',
        reference: 'R22883953',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_coupole_084_3883_4_095_1.png?impolicy=magento_media',
        retail: 'CHF2100.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Coupole Classic',
        url: 'https://www.rado.com/coupole-classic-automatic-stainless-steel-light-37-7-mm-r22860045.html',
        name: 'Coupole Classic Automatic',
        reference: 'R22860045',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_coupole_763_3860_4_104_1.png?impolicy=magento_media',
        retail: 'CHF1150.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Coupole Classic',
        url: 'https://www.rado.com/coupole-classic-stainless-steel-blue-34mm-r22883915.html',
        name: 'Coupole Classic',
        reference: 'R22883915',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_coupole_084_3883_4_191_1.png?impolicy=magento_media',
        retail: 'CHF1150.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Coupole Classic',
        url: 'https://www.rado.com/coupole-classic-automatic-stainless-steel-blue-37-7-mm-r22860205.html',
        name: 'Coupole Classic Automatic',
        reference: 'R22860205',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_coupole_763_3860_4_120_1.png?impolicy=magento_media',
        retail: 'CHF1150.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Coupole Classic',
        url: 'https://www.rado.com/coupole-classic-diamonds-stainless-steel-light-34mm-r22884923.html',
        name: 'Coupole Classic Diamonds',
        reference: 'R22884923',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_coupole_084_3884_2_092_1.png?impolicy=magento_media',
        retail: 'CHF2600.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Coupole Classic',
        url: 'https://www.rado.com/coupole-classic-automatic-stainless-steel-light-37-7-mm-r22860023.html',
        name: 'Coupole Classic Automatic',
        reference: 'R22860023',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_coupole_763_3860_4_202_1.png?impolicy=magento_media',
        retail: 'CHF1250.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Coupole Classic',
        url: 'https://www.rado.com/coupole-classic-diamonds-stainless-steel-light-34mm-r22884963.html',
        name: 'Coupole Classic Diamonds',
        reference: 'R22884963',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_coupole_084_3884_2_096_1.png?impolicy=magento_media',
        retail: 'CHF2450.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Coupole Classic',
        url: 'https://www.rado.com/coupole-classic-automatic-stainless-steel-light-37-7-mm-r22860043.html',
        name: 'Coupole Classic Automatic',
        reference: 'R22860043',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_coupole_763_3860_4_204_1.png?impolicy=magento_media',
        retail: 'CHF1250.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Coupole Classic',
        url: 'https://www.rado.com/coupole-classic-automatic-stainless-steel-black-37-7-mm-r22860153.html',
        name: 'Coupole Classic Automatic',
        reference: 'R22860153',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_coupole_763_3860_4_215_1.png?impolicy=magento_media',
        retail: 'CHF1250.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Coupole Classic',
        url: 'https://www.rado.com/coupole-classic-diamonds-stainless-steel-blue-34mm-r22884935.html',
        name: 'Coupole Classic Diamonds',
        reference: 'R22884935',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_coupole_084_3884_2_193_1.png?impolicy=magento_media',
        retail: 'CHF2200.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Coupole Classic',
        url: 'https://www.rado.com/coupole-classic-stainless-steel-light-34mm-r22885945.html',
        name: 'Coupole Classic',
        reference: 'R22885945',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_coupole_084_3885_2_194_1.png?impolicy=magento_media',
        retail: 'CHF1200.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Coupole Classic',
        url: 'https://www.rado.com/coupole-classic-automatic-stainless-steel-light-37-7-mm-r22860024.html',
        name: 'Coupole Classic Automatic',
        reference: 'R22860024',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_coupole_763_3860_4_302_1.png?impolicy=magento_media',
        retail: 'CHF1250.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Coupole Classic',
        url: 'https://www.rado.com/coupole-classic-chronograph-stainless-steel-light-42mm-r22910103.html',
        name: 'Coupole Classic Chronograph',
        reference: 'R22910103',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_coupole_289_3910_4_010_1.png?impolicy=magento_media',
        retail: 'CHF1450.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Coupole Classic',
        url: 'https://www.rado.com/coupole-classic-automatic-stainless-steel-light-37-7-mm-r22860044.html',
        name: 'Coupole Classic Automatic',
        reference: 'R22860044',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_coupole_763_3860_4_304_1.png?impolicy=magento_media',
        retail: 'CHF1250.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Coupole Classic',
        url: 'https://www.rado.com/coupole-classic-chronograph-stainless-steel-light-42mm-r22910123.html',
        name: 'Coupole Classic Chronograph',
        reference: 'R22910123',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_coupole_289_3910_4_012_1.png?impolicy=magento_media',
        retail: 'CHF1500.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Coupole Classic',
        url: 'https://www.rado.com/coupole-classic-automatic-stainless-steel-light-37-7-mm-r22860074.html',
        name: 'Coupole Classic Automatic',
        reference: 'R22860074',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_coupole_763_3860_4_307_1.png?impolicy=magento_media',
        retail: 'CHF1250.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Coupole Classic',
        url: 'https://www.rado.com/coupole-classic-chronograph-stainless-steel-black-42mm-r22910153.html',
        name: 'Coupole Classic Chronograph',
        reference: 'R22910153',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_coupole_289_3910_4_015_1.png?impolicy=magento_media',
        retail: 'CHF1450.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Coupole Classic',
        url: 'https://www.rado.com/coupole-classic-automatic-stainless-steel-black-37-7-mm-r22860154.html',
        name: 'Coupole Classic Automatic',
        reference: 'R22860154',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_coupole_763_3860_4_315_1.png?impolicy=magento_media',
        retail: 'CHF1250.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Coupole Classic',
        url: 'https://www.rado.com/coupole-classic-chronograph-stainless-steel-light-42mm-r22910115.html',
        name: 'Coupole Classic Chronograph',
        reference: 'R22910115',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_coupole_289_3910_4_111_1.png?impolicy=magento_media',
        retail: 'CHF1350.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Coupole Classic',
        url: 'https://www.rado.com/coupole-classic-automatic-stainless-steel-blue-37-7-mm-r22860204.html',
        name: 'Coupole Classic Automatic',
        reference: 'R22860204',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_coupole_763_3860_4_320_1.png?impolicy=magento_media',
        retail: 'CHF1250.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Coupole Classic',
        url: 'https://www.rado.com/coupole-classic-chronograph-light-42mm-r22911125.html',
        name: 'Coupole Classic Chronograph',
        reference: 'R22911125',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_coupole_289_3911_2_112_1.png?impolicy=magento_media',
        retail: 'CHF1400.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Coupole Classic',
        url: 'https://www.rado.com/coupole-classic-automatic-stainless-steel-light-37-7-mm-r22860027.html',
        name: 'Coupole Classic Automatic',
        reference: 'R22860027',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_coupole_763_3860_4_402_1.png?impolicy=magento_media',
        retail: 'CHF1350.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Coupole Classic',
        url: 'https://www.rado.com/coupole-classic-chronograph-black-42mm-r22911165.html',
        name: 'Coupole Classic Chronograph',
        reference: 'R22911165',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_coupole_289_3911_2_116_1.png?impolicy=magento_media',
        retail: 'CHF1400.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Coupole Classic',
        url: 'https://www.rado.com/coupole-classic-automatic-stainless-steel-light-37-7-mm-r22860067.html',
        name: 'Coupole Classic Automatic',
        reference: 'R22860067',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_coupole_763_3860_4_406_1.png?impolicy=magento_media',
        retail: 'CHF1350.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Coupole Classic',
        url: 'https://www.rado.com/coupole-classic-chronograph-other-42mm-r22911205.html',
        name: 'Coupole Classic Chronograph',
        reference: 'R22911205',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_coupole_289_3911_2_120_1.png?impolicy=magento_media',
        retail: 'CHF1400.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Coupole Classic',
        url: 'https://www.rado.com/coupole-classic-automatic-stainless-steel-light-31-8-mm-r22862024.html',
        name: 'Coupole Classic Automatic',
        reference: 'R22862024',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_coupole_561_3862_4_302_1.png?impolicy=magento_media',
        retail: 'CHF1250.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Coupole Classic',
        url: 'https://www.rado.com/coupole-classic-automatic-black-37-7-mm-r22861165.html',
        name: 'Coupole Classic Automatic',
        reference: 'R22861165',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_coupole_763_3861_2_116_1.png?impolicy=magento_media',
        retail: 'CHF1200.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Coupole Classic',
        url: 'https://www.rado.com/coupole-classic-automatic-stainless-steel-light-31-8-mm-r22862044.html',
        name: 'Coupole Classic Automatic',
        reference: 'R22862044',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_coupole_561_3862_4_304_1.png?impolicy=magento_media',
        retail: 'CHF1250.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Coupole Classic',
        url: 'https://www.rado.com/coupole-classic-automatic-diamonds-black-37-7-mm-r22861755.html',
        name: 'Coupole Classic Automatic Diamonds',
        reference: 'R22861755',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_coupole_763_3861_2_175_1.png?impolicy=magento_media',
        retail: 'CHF1650.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Coupole Classic',
        url: 'https://www.rado.com/coupole-classic-automatic-stainless-steel-light-31-8-mm-r22862074.html',
        name: 'Coupole Classic Automatic',
        reference: 'R22862074',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_coupole_561_3862_4_307_1.png?impolicy=magento_media',
        retail: 'CHF1250.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Coupole Classic',
        url: 'https://www.rado.com/coupole-classic-automatic-diamonds-light-37-7-mm-r22861765.html',
        name: 'Coupole Classic Automatic Diamonds',
        reference: 'R22861765',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_coupole_763_3861_2_176_1.png?impolicy=magento_media',
        retail: 'CHF1650.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Coupole Classic',
        url: 'https://www.rado.com/coupole-classic-automatic-stainless-steel-black-31-8-mm-r22862154.html',
        name: 'Coupole Classic Automatic',
        reference: 'R22862154',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_coupole_561_3862_4_315_1.png?impolicy=magento_media',
        retail: 'CHF1250.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Coupole Classic',
        url: 'https://www.rado.com/coupole-classic-automatic-stainless-steel-light-41mm-r22876022.html',
        name: 'Coupole Classic Automatic',
        reference: 'R22876022',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_coupole_763_3876_4_002_1.png?impolicy=magento_media',
        retail: 'CHF1650.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Coupole Classic',
        url: 'https://www.rado.com/coupole-classic-automatic-stainless-steel-blue-31-8-mm-r22862204.html',
        name: 'Coupole Classic Automatic',
        reference: 'R22862204',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_coupole_561_3862_4_320_1.png?impolicy=magento_media',
        retail: 'CHF1250.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Coupole Classic',
        url: 'https://www.rado.com/coupole-classic-automatic-stainless-steel-light-31-8-mm-r22862027.html',
        name: 'Coupole Classic Automatic',
        reference: 'R22862027',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_coupole_561_3862_4_402_1.png?impolicy=magento_media',
        retail: 'CHF1350.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Coupole Classic',
        url: 'https://www.rado.com/coupole-classic-automatic-stainless-steel-light-41mm-r22876013.html',
        name: 'Coupole Classic Automatic',
        reference: 'R22876013',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_coupole_763_3876_4_201_1.png?impolicy=magento_media',
        retail: 'CHF1350.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Coupole Classic',
        url: 'https://www.rado.com/coupole-classic-automatic-stainless-steel-light-31-8-mm-r22862067.html',
        name: 'Coupole Classic Automatic',
        reference: 'R22862067',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_coupole_561_3862_4_406_1.png?impolicy=magento_media',
        retail: 'CHF1350.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Coupole Classic',
        url: 'https://www.rado.com/coupole-classic-automatic-stainless-steel-blue-41mm-r22876203.html',
        name: 'Coupole Classic Automatic',
        reference: 'R22876203',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_coupole_763_3876_4_220_1.png?impolicy=magento_media',
        retail: 'CHF1350.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Coupole Classic',
        url: 'https://www.rado.com/coupole-classic-automatic-light-31-8-mm-r22865115.html',
        name: 'Coupole Classic Automatic',
        reference: 'R22865115',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_coupole_561_3865_2_111_1.png?impolicy=magento_media',
        retail: 'CHF1200.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Coupole Classic',
        url: 'https://www.rado.com/coupole-classic-automatic-light-41mm-r22877025.html',
        name: 'Coupole Classic Automatic',
        reference: 'R22877025',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_coupole_763_3877_2_102_1.png?impolicy=magento_media',
        retail: 'CHF1300.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Coupole Classic',
        url: 'https://www.rado.com/coupole-classic-automatic-diamonds-black-31-8-mm-r22865755.html',
        name: 'Coupole Classic Automatic Diamonds',
        reference: 'R22865755',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_coupole_561_3865_2_175_1.png?impolicy=magento_media',
        retail: 'CHF1650.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Coupole Classic',
        url: 'https://www.rado.com/coupole-classic-automatic-black-41mm-r22877165.html',
        name: 'Coupole Classic Automatic',
        reference: 'R22877165',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_coupole_763_3877_2_116_1.png?impolicy=magento_media',
        retail: 'CHF1300.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Coupole Classic',
        url: 'https://www.rado.com/coupole-classic-automatic-diamonds-light-31-8-mm-r22865765.html',
        name: 'Coupole Classic Automatic Diamonds',
        reference: 'R22865765',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_coupole_561_3865_2_176_1.png?impolicy=magento_media',
        retail: 'CHF1650.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Coupole Classic',
        url: 'https://www.rado.com/coupole-classic-automatic-light-37-7-mm-r22861115.html',
        name: 'Coupole Classic Automatic',
        reference: 'R22861115',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_coupole_763_3861_2_111_1.png?impolicy=magento_media',
        retail: 'CHF1200.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Coupole Classic',
        url: 'https://www.rado.com/coupole-classic-automatic-stainless-steel-light-41mm-r22878015.html',
        name: 'Coupole Classic Automatic',
        reference: 'R22878015',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_coupole_772_3878_4_101_1.png?impolicy=magento_media',
        retail: 'CHF1600.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Coupole Classic',
        url: 'https://www.rado.com/coupole-classic-open-heart-automatic-black-r22894155.html',
        name: 'Coupole Classic Open Heart Automatic',
        reference: 'R22894155',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_coupole_734_3894_4_115_1.png?impolicy=magento_media',
        retail: 'CHF1500.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Coupole Classic',
        url: 'https://www.rado.com/coupole-classic-automatic-light-41mm-r22879025.html',
        name: 'Coupole Classic Automatic',
        reference: 'R22879025',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_coupole_772_3879_2_102_1.png?impolicy=magento_media',
        retail: 'CHF1650.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Coupole Classic',
        url: 'https://www.rado.com/coupole-classic-open-heart-automatic-light-r22894023.html',
        name: 'Coupole Classic Open Heart Automatic',
        reference: 'R22894023',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_coupole_734_3894_4_302_1.png?impolicy=magento_media',
        retail: 'CHF1700.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Coupole Classic',
        url: 'https://www.rado.com/coupole-classic-automatic-black-41mm-r22879165.html',
        name: 'Coupole Classic Automatic',
        reference: 'R22879165',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_coupole_772_3879_2_116_1.png?impolicy=magento_media',
        retail: 'CHF1650.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Coupole Classic',
        url: 'https://www.rado.com/coupole-classic-open-heart-automatic-black-r22894153.html',
        name: 'Coupole Classic Open Heart Automatic',
        reference: 'R22894153',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_coupole_734_3894_4_315_1.png?impolicy=magento_media',
        retail: 'CHF1600.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Coupole Classic',
        url: 'https://www.rado.com/coupole-classic-automatic-other-41mm-r22879205.html',
        name: 'Coupole Classic Automatic',
        reference: 'R22879205',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_coupole_772_3879_2_120_1.png?impolicy=magento_media',
        retail: 'CHF1650.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Coupole Classic',
        url: 'https://www.rado.com/coupole-classic-open-heart-automatic-black-r22894163.html',
        name: 'Coupole Classic Open Heart Automatic',
        reference: 'R22894163',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_coupole_734_3894_4_316_1.png?impolicy=magento_media',
        retail: 'CHF1700.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Coupole Classic',
        url: 'https://www.rado.com/coupole-classic-automatic-cosc-stainless-steel-light-41mm-r22880013.html',
        name: 'Coupole Classic Automatic COSC',
        reference: 'R22880013',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_coupole_773_3880_4_001_1.png?impolicy=magento_media',
        retail: 'CHF1900.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Coupole Classic',
        url: 'https://www.rado.com/coupole-classic-open-heart-automatic-blue-r22894203.html',
        name: 'Coupole Classic Open Heart Automatic',
        reference: 'R22894203',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_coupole_734_3894_4_320_1.png?impolicy=magento_media',
        retail: 'CHF1600.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Coupole Classic',
        url: 'https://www.rado.com/coupole-classic-automatic-stainless-steel-light-41mm-r22876015.html',
        name: 'Coupole Classic Automatic',
        reference: 'R22876015',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_coupole_763_3876_4_101_1.png?impolicy=magento_media',
        retail: 'CHF1250.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Coupole Classic',
        url: 'https://www.rado.com/coupole-classic-automatic-cosc-stainless-steel-black-41mm-r22880103.html',
        name: 'Coupole Classic Automatic COSC',
        reference: 'R22880103',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_coupole_773_3880_4_010_1.png?impolicy=magento_media',
        retail: 'CHF1900.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Coupole Classic',
        url: 'https://www.rado.com/coupole-classic-open-heart-automatic-light-41mm-r22895025.html',
        name: 'Coupole Classic Open Heart Automatic',
        reference: 'R22895025',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_coupole_734_3895_2_102_1.png?impolicy=magento_media',
        retail: 'CHF1550.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Coupole Classic',
        url: 'https://www.rado.com/coupole-classic-automatic-cosc-stainless-steel-blue-41mm-r22880205.html',
        name: 'Coupole Classic Automatic COSC',
        reference: 'R22880205',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_coupole_773_3880_4_120_1.png?impolicy=magento_media',
        retail: 'CHF1850.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Coupole Classic',
        url: 'https://www.rado.com/coupole-classic-automatic-cosc-light-41mm-r22881025.html',
        name: 'Coupole Classic Automatic COSC',
        reference: 'R22881025',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_coupole_773_3881_2_102_1.png?impolicy=magento_media',
        retail: 'CHF1900.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Coupole Classic',
        url: 'https://www.rado.com/coupole-classic-automatic-cosc-black-41mm-r22881165.html',
        name: 'Coupole Classic Automatic COSC',
        reference: 'R22881165',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_coupole_773_3881_2_116_1.png?impolicy=magento_media',
        retail: 'CHF1900.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Coupole Classic',
        url: 'https://www.rado.com/coupole-classic-diamonds-light-27mm-r22896924.html',
        name: 'Coupole Classic Diamonds',
        reference: 'R22896924',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_coupole_963_3896_2_292_1.png?impolicy=magento_media',
        retail: 'CHF2500.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Coupole Classic',
        url: 'https://www.rado.com/coupole-classic-diamonds-stainless-steel-other-27mm-r22897903.html',
        name: 'Coupole Classic Diamonds',
        reference: 'R22897903',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_coupole_963_3897_4_090_1.png?impolicy=magento_media',
        retail: 'CHF1400.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Coupole Classic',
        url: 'https://www.rado.com/coupole-classic-diamonds-stainless-steel-light-27mm-r22897923.html',
        name: 'Coupole Classic Diamonds',
        reference: 'R22897923',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_coupole_963_3897_4_092_1.png?impolicy=magento_media',
        retail: 'CHF1500.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Coupole Classic',
        url: 'https://www.rado.com/coupole-classic-stainless-steel-light-27mm-r22897933.html',
        name: 'Coupole Classic',
        reference: 'R22897933',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_coupole_963_3897_4_093_1.png?impolicy=magento_media',
        retail: 'CHF1050.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Coupole Classic',
        url: 'https://www.rado.com/coupole-classic-stainless-steel-light-27mm-r22897943.html',
        name: 'Coupole Classic',
        reference: 'R22897943',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_coupole_963_3897_4_094_1.png?impolicy=magento_media',
        retail: 'CHF950.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Coupole Classic',
        url: 'https://www.rado.com/coupole-classic-stainless-steel-blue-27mm-r22897915.html',
        name: 'Coupole Classic',
        reference: 'R22897915',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_coupole_963_3897_4_191_1.png?impolicy=magento_media',
        retail: 'CHF900.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Coupole Classic',
        url: 'https://www.rado.com/coupole-classic-moonphase-stainless-steel-blue-34mm-r22883913.html',
        name: 'Coupole Classic Moonphase',
        reference: 'R22883913',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_coupole_084_3883_4_291.png?impolicy=magento_media',
        retail: 'CHF1250.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Coupole Classic',
        url: 'https://www.rado.com/coupole-classic-automatic-stainless-steel-light-31-8-mm-r22862075.html',
        name: 'Coupole Classic Automatic',
        reference: 'R22862075',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_coupole_561_3862_4_107.png?impolicy=magento_media',
        retail: 'CHF1150.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Coupole Classic',
        url: 'https://www.rado.com/coupole-classic-automatic-stainless-steel-light-37-7-mm-r22860075.html',
        name: 'Coupole Classic Automatic',
        reference: 'R22860075',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_coupole_763_3860_4_107.png?impolicy=magento_media',
        retail: 'CHF1150.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Coupole Classic',
        url: 'https://www.rado.com/coupole-classic-automatic-stainless-steel-black-37-7-mm-r22860165.html',
        name: 'Coupole Classic Automatic',
        reference: 'R22860165',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_coupole_763_3860_4_116.png?impolicy=magento_media',
        retail: 'CHF1150.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Coupole Classic',
        url: 'https://www.rado.com/coupole-classic-automatic-stainless-steel-black-37-7-mm-r22860163.html',
        name: 'Coupole Classic Automatic',
        reference: 'R22860163',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_coupole_763_3860_4_316.png?impolicy=magento_media',
        retail: 'CHF1350.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Coupole Classic',
        url: 'https://www.rado.com/coupole-classic-stainless-steel-blue-27mm-r22897913.html',
        name: 'Coupole Classic',
        reference: 'R22897913',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_coupole_963_3897_4_091.png?impolicy=magento_media',
        retail: 'CHF950.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Ceramica',
        url: 'https://www.rado.com/ceramica-diamonds-high-tech-ceramic-black-30mm-r21700702.html',
        name: 'Ceramica Diamonds - R21700702',
        reference: 'R21700702',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_ceramica_212_0700_3_070.png?impolicy=magento_media',
        retail: 'CHF2350.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Ceramica',
        url: 'https://www.rado.com/ceramica-diamonds-high-tech-ceramic-black-30mm-r21700722.html',
        name: 'Ceramica Diamonds - R21700722',
        reference: 'R21700722',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_ceramica_212_0700_3_072.png?impolicy=magento_media',
        retail: 'CHF2350.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Ceramica',
        url: 'https://www.rado.com/ceramica-diamonds-high-tech-ceramic-black-22-9-mm-r21702702.html',
        name: 'Ceramica Diamonds',
        reference: 'R21702702',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_ceramica_420_0702_3_070_1.png?impolicy=magento_media',
        retail: 'CHF2350.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Ceramica',
        url: 'https://www.rado.com/ceramica-diamonds-high-tech-ceramic-black-22-9-mm-r21702722.html',
        name: 'Ceramica Diamonds',
        reference: 'R21702722',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_ceramica_420_0702_3_072_1.png?impolicy=magento_media',
        retail: 'CHF2350.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Ceramica',
        url: 'https://www.rado.com/ceramica-diamonds-high-tech-ceramic-black-22-9-mm-r21702732.html',
        name: 'Ceramica Diamonds',
        reference: 'R21702732',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_ceramica_420_0702_3_073_1.png?impolicy=magento_media',
        retail: 'CHF2950.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Ceramica',
        url: 'https://www.rado.com/ceramica-automatic-diamonds-high-tech-ceramic-black-30mm-r21807702.html',
        name: 'Ceramica Automatic Diamonds',
        reference: 'R21807702',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_ceramica_561_0807_3_070_1.png?impolicy=magento_media',
        retail: 'CHF2950.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Ceramica',
        url: 'https://www.rado.com/ceramica-high-tech-ceramic-black-30mm-r21700172.html',
        name: 'Ceramica',
        reference: 'R21700172',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_ceramica_212_0700_3_017_1.png?impolicy=magento_media',
        retail: 'CHF2150.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Ceramica',
        url: 'https://www.rado.com/ceramica-high-tech-ceramic-black-30mm-r21700182.html',
        name: 'Ceramica',
        reference: 'R21700182',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_ceramica_212_0700_3_018_1.png?impolicy=magento_media',
        retail: 'CHF2150.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Ceramica',
        url: 'https://www.rado.com/ceramica-high-tech-ceramic-black-22-9-mm-r21702172.html',
        name: 'Ceramica - R21702172',
        reference: 'R21702172',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_ceramica_420_0702_3_017.png?impolicy=magento_media',
        retail: 'CHF2150.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Ceramica',
        url: 'https://www.rado.com/ceramica-high-tech-ceramic-black-22-9-mm-r21702182.html',
        name: 'Ceramica - R21702182',
        reference: 'R21702182',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_ceramica_420_0702_3_018.png?impolicy=magento_media',
        retail: 'CHF2150.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Ceramica',
        url: 'https://www.rado.com/ceramica-automatic-high-tech-ceramic-black-30mm-r21807182.html',
        name: 'Ceramica Automatic',
        reference: 'R21807182',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_ceramica_561_0807_3_018_1.png?impolicy=magento_media',
        retail: 'CHF2500.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Ceramica',
        url: 'https://www.rado.com/ceramica-automatic-high-tech-ceramic-black-30mm-r21808152.html',
        name: 'Ceramica Automatic',
        reference: 'R21808152',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_ceramica_561_0808_3_015_1.png?impolicy=magento_media',
        retail: 'CHF2500.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Integral',
        url: 'https://www.rado.com/integral-high-tech-ceramic-black-22-7-mm-r20194162.html',
        name: 'Integral',
        reference: 'R20194162',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_integral_153_0194_3_016_1.png?impolicy=magento_media',
        retail: 'CHF1900.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Integral',
        url: 'https://www.rado.com/integral-diamonds-high-tech-ceramic-brown-22-7-mm-r20199722.html',
        name: 'Integral Diamonds',
        reference: 'R20199722',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_integral_153_0199_3_072_1.png?impolicy=magento_media',
        retail: 'CHF2300.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Integral',
        url: 'https://www.rado.com/integral-diamonds-high-tech-ceramic-brown-22-7-mm-r20201712.html',
        name: 'Integral Diamonds',
        reference: 'R20201712',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_integral_153_0201_3_071_1.png?impolicy=magento_media',
        retail: 'CHF2200.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Integral',
        url: 'https://www.rado.com/integral-diamonds-high-tech-ceramic-black-22-7-mm-r20612712.html',
        name: 'Integral Diamonds',
        reference: 'R20612712',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_integral_153_0194_3_071_1.png?impolicy=magento_media',
        retail: 'CHF2200.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Integral',
        url: 'https://www.rado.com/integral-high-tech-ceramic-black-22-7-mm-r20613162.html',
        name: 'Integral',
        reference: 'R20613162',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_integral_153_0613_3_016_1.png?impolicy=magento_media',
        retail: 'CHF1800.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Integral',
        url: 'https://www.rado.com/integral-diamonds-high-tech-ceramic-black-22-7-mm-r20613712.html',
        name: 'Integral Diamonds',
        reference: 'R20613712',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_integral_153_0613_3_071_1.png?impolicy=magento_media',
        retail: 'CHF2100.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Integral',
        url: 'https://www.rado.com/integral-high-tech-ceramic-black-22-7-mm-r20845162.html',
        name: 'Integral',
        reference: 'R20845162',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_integral_153_0845_3_016_1.png?impolicy=magento_media',
        retail: 'CHF1900.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Integral',
        url: 'https://www.rado.com/integral-diamonds-high-tech-ceramic-black-22-7-mm-r20845712.html',
        name: 'Integral Diamonds',
        reference: 'R20845712',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_integral_153_0845_3_071_1.png?impolicy=magento_media',
        retail: 'CHF2200.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Integral',
        url: 'https://www.rado.com/integral-high-tech-ceramic-black-31mm-r20204162.html',
        name: 'Integral',
        reference: 'R20204162',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_integral_212_0204_3_016_1.png?impolicy=magento_media',
        retail: 'CHF2000.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Integral',
        url: 'https://www.rado.com/integral-diamonds-high-tech-ceramic-black-31mm-r20204712.html',
        name: 'Integral Diamonds',
        reference: 'R20204712',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_integral_212_0204_3_071_1.png?impolicy=magento_media',
        retail: 'CHF2300.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Integral',
        url: 'https://www.rado.com/integral-high-tech-ceramic-black-31mm-r20206162.html',
        name: 'Integral',
        reference: 'R20206162',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_integral_212_0206_3_016_1.png?impolicy=magento_media',
        retail: 'CHF1900.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Integral',
        url: 'https://www.rado.com/integral-diamonds-high-tech-ceramic-black-31mm-r20206712.html',
        name: 'Integral Diamonds',
        reference: 'R20206712',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_integral_212_0206_3_071_1.png?impolicy=magento_media',
        retail: 'CHF2200.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Integral',
        url: 'https://www.rado.com/integral-diamonds-high-tech-ceramic-brown-31mm-r20219712.html',
        name: 'Integral Diamonds',
        reference: 'R20219712',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_integral_212_0219_3_071_1.png?impolicy=magento_media',
        retail: 'CHF2300.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Integral',
        url: 'https://www.rado.com/integral-diamonds-high-tech-ceramic-brown-31mm-r20219722.html',
        name: 'Integral Diamonds',
        reference: 'R20219722',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_integral_212_0219_3_072_1.png?impolicy=magento_media',
        retail: 'CHF2400.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Integral',
        url: 'https://www.rado.com/integral-high-tech-ceramic-black-31mm-r20227162.html',
        name: 'Integral',
        reference: 'R20227162',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_integral_212_0227_3_016_1.png?impolicy=magento_media',
        retail: 'CHF2000.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Integral',
        url: 'https://www.rado.com/integral-diamonds-high-tech-ceramic-black-31mm-r20207712.html',
        name: 'Integral Diamonds',
        reference: 'R20207712',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_integral_212_0227_3_071_1.png?impolicy=magento_media',
        retail: 'CHF2300.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Integral',
        url: 'https://www.rado.com/integral-diamonds-light-22-7-mm-r20141712.html',
        name: 'Integral Diamonds',
        reference: 'R20141712',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_integral_153_6141_3_071.png?impolicy=magento_media',
        retail: 'CHF2200.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Integral',
        url: 'https://www.rado.com/integral-diamonds-light-31mm-r20140712.html',
        name: 'Integral Diamonds',
        reference: 'R20140712',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_integral_212_6140_3_071.png?impolicy=magento_media',
        retail: 'CHF2300.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Florence',
        url: 'https://www.rado.com/florence-diamonds-black-38mm-r48889714.html',
        name: 'Florence Diamonds',
        reference: 'R48889714',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_florence_073_3889_2_071_1.png?impolicy=magento_media',
        retail: 'CHF1000.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Florence',
        url: 'https://www.rado.com/florence-diamonds-brown-38mm-r48889743.html',
        name: 'Florence Diamonds',
        reference: 'R48889743',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_florence_073_3889_2_074_1.png?impolicy=magento_media',
        retail: 'CHF1300.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Florence',
        url: 'https://www.rado.com/florence-diamonds-black-28mm-r48893714.html',
        name: 'Florence Diamonds',
        reference: 'R48893714',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_florence_079_3893_2_071_1.png?impolicy=magento_media',
        retail: 'CHF1000.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Florence',
        url: 'https://www.rado.com/florence-diamonds-brown-28mm-r48893743.html',
        name: 'Florence Diamonds',
        reference: 'R48893743',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_florence_079_3893_2_074_1.png?impolicy=magento_media',
        retail: 'CHF1300.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Florence',
        url: 'https://www.rado.com/florence-black-28mm-r48871153.html',
        name: 'Florence',
        reference: 'R48871153',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_florence_111_3871_2_015_1.png?impolicy=magento_media',
        retail: 'CHF800.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Florence',
        url: 'https://www.rado.com/florence-black-28mm-r48871173.html',
        name: 'Florence',
        reference: 'R48871173',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_florence_111_3871_2_017_1.png?impolicy=magento_media',
        retail: 'CHF850.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Florence',
        url: 'https://www.rado.com/florence-diamonds-black-28mm-r48871713.html',
        name: 'Florence Diamonds',
        reference: 'R48871713',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_florence_111_3871_2_071_1.png?impolicy=magento_media',
        retail: 'CHF950.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Florence',
        url: 'https://www.rado.com/florence-diamonds-black-28mm-r48871714.html',
        name: 'Florence  Diamonds',
        reference: 'R48871714',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_florence_111_3871_2_171_1.png?impolicy=magento_media',
        retail: 'CHF1000.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Florence',
        url: 'https://www.rado.com/florence-black-28mm-r48871155.html',
        name: 'Florence',
        reference: 'R48871155',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_florence_111_3871_2_215_1.png?impolicy=magento_media',
        retail: 'CHF750.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Florence',
        url: 'https://www.rado.com/florence-black-28mm-r48872163.html',
        name: 'Florence',
        reference: 'R48872163',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_florence_111_3872_2_016_1.png?impolicy=magento_media',
        retail: 'CHF800.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Florence',
        url: 'https://www.rado.com/florence-other-28mm-r48872253.html',
        name: 'Florence',
        reference: 'R48872253',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_florence_111_3872_2_025_1.png?impolicy=magento_media',
        retail: 'CHF800.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Florence',
        url: 'https://www.rado.com/florence-other-28mm-r48872263.html',
        name: 'Florence',
        reference: 'R48872263',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_florence_111_3872_2_026_1.png?impolicy=magento_media',
        retail: 'CHF950.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Florence',
        url: 'https://www.rado.com/florence-diamonds-light-28mm-r48872723.html',
        name: 'Florence Diamonds',
        reference: 'R48872723',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_florence_111_3872_2_072_1.png?impolicy=magento_media',
        retail: 'CHF950.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Florence',
        url: 'https://www.rado.com/florence-stainless-steel-light-28mm-r48874013.html',
        name: 'Florence',
        reference: 'R48874013',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_florence_111_3874_4_001_1.png?impolicy=magento_media',
        retail: 'CHF750.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Florence',
        url: 'https://www.rado.com/florence-stainless-steel-black-28mm-r48874153.html',
        name: 'Florence',
        reference: 'R48874153',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_florence_111_3874_4_015_1.png?impolicy=magento_media',
        retail: 'CHF800.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Florence',
        url: 'https://www.rado.com/florence-stainless-steel-other-28mm-r48874313.html',
        name: 'Florence',
        reference: 'R48874313',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_florence_111_3874_4_031_1.png?impolicy=magento_media',
        retail: 'CHF750.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Florence',
        url: 'https://www.rado.com/florence-light-28mm-r48873103.html',
        name: 'Florence',
        reference: 'R48873103',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_florence_111_3873_2_010_1.png?impolicy=magento_media',
        retail: 'CHF850.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Florence',
        url: 'https://www.rado.com/florence-black-28mm-r48873173.html',
        name: 'Florence',
        reference: 'R48873173',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_florence_111_3873_2_017_1.png?impolicy=magento_media',
        retail: 'CHF950.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Florence',
        url: 'https://www.rado.com/florence-black-28mm-r48873183.html',
        name: 'Florence',
        reference: 'R48873183',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_florence_111_3873_2_018_1.png?impolicy=magento_media',
        retail: 'CHF1000.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Florence',
        url: 'https://www.rado.com/florence-diamonds-light-28mm-r48873733.html',
        name: 'Florence Diamonds',
        reference: 'R48873733',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_florence_111_3873_2_073_1.png?impolicy=magento_media',
        retail: 'CHF950.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Florence',
        url: 'https://www.rado.com/florence-diamonds-light-28mm-r48873734.html',
        name: 'Florence Diamonds',
        reference: 'R48873734',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_florence_111_3873_2_173_1.png?impolicy=magento_media',
        retail: 'CHF1000.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Florence',
        url: 'https://www.rado.com/florence-diamonds-stainless-steel-black-28mm-r48908713.html',
        name: 'Florence Diamonds',
        reference: 'R48908713',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_florence_111_3908_4_071_1.png?impolicy=magento_media',
        retail: 'CHF900.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Florence',
        url: 'https://www.rado.com/florence-black-38mm-r48867153.html',
        name: 'Florence',
        reference: 'R48867153',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_florence_115_3867_2_015_1.png?impolicy=magento_media',
        retail: 'CHF800.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Florence',
        url: 'https://www.rado.com/r48867173-black-38mm-r48867173.html',
        name: 'R48867173',
        reference: 'R48867173',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/4/r48867173_s.png?impolicy=magento_media',
        retail: 'CHF850.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Florence',
        url: 'https://www.rado.com/florence-diamonds-black-38mm-r48867713.html',
        name: 'Florence Diamonds',
        reference: 'R48867713',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_florence_115_3867_2_071_1.png?impolicy=magento_media',
        retail: 'CHF950.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Florence',
        url: 'https://www.rado.com/florence-diamonds-black-38mm-r48867714.html',
        name: 'Florence  Diamonds',
        reference: 'R48867714',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_florence_115_3867_2_171_1.png?impolicy=magento_media',
        retail: 'CHF1000.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Florence',
        url: 'https://www.rado.com/florence-black-38mm-r48867155.html',
        name: 'Florence',
        reference: 'R48867155',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_florence_115_3867_2_215_1.png?impolicy=magento_media',
        retail: 'CHF750.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Florence',
        url: 'https://www.rado.com/florence-black-38mm-r48868163.html',
        name: 'Florence',
        reference: 'R48868163',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_florence_115_3868_2_016_1.png?impolicy=magento_media',
        retail: 'CHF800.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Florence',
        url: 'https://www.rado.com/florence-other-38mm-r48868253.html',
        name: 'Florence',
        reference: 'R48868253',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_florence_115_3868_2_025_1.png?impolicy=magento_media',
        retail: 'CHF800.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Florence',
        url: 'https://www.rado.com/florence-other-38mm-r48868263.html',
        name: 'Florence',
        reference: 'R48868263',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_florence_115_3868_2_026_1.png?impolicy=magento_media',
        retail: 'CHF950.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Florence',
        url: 'https://www.rado.com/florence-diamonds-light-38mm-r48868723.html',
        name: 'Florence Diamonds',
        reference: 'R48868723',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_florence_115_3868_2_072_1.png?impolicy=magento_media',
        retail: 'CHF950.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Florence',
        url: 'https://www.rado.com/florence-stainless-steel-light-38mm-r48870013.html',
        name: 'Florence',
        reference: 'R48870013',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_florence_115_3870_4_001_1.png?impolicy=magento_media',
        retail: 'CHF750.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Florence',
        url: 'https://www.rado.com/florence-stainless-steel-black-38mm-r48870153.html',
        name: 'Florence',
        reference: 'R48870153',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_florence_115_3870_4_015_1.png?impolicy=magento_media',
        retail: 'CHF800.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Florence',
        url: 'https://www.rado.com/florence-stainless-steel-other-38mm-r48870313.html',
        name: 'Florence',
        reference: 'R48870313',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_florence_115_3870_4_031_1.png?impolicy=magento_media',
        retail: 'CHF750.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Florence',
        url: 'https://www.rado.com/florence-light-38mm-r48869103.html',
        name: 'Florence',
        reference: 'R48869103',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_florence_115_3869_2_010_1.png?impolicy=magento_media',
        retail: 'CHF850.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Florence',
        url: 'https://www.rado.com/florence-black-38mm-r48869173.html',
        name: 'Florence',
        reference: 'R48869173',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_florence_115_3869_2_017_1.png?impolicy=magento_media',
        retail: 'CHF950.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Florence',
        url: 'https://www.rado.com/florence-black-38mm-r48869183.html',
        name: 'Florence',
        reference: 'R48869183',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_florence_115_3869_2_018_1.png?impolicy=magento_media',
        retail: 'CHF1000.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Florence',
        url: 'https://www.rado.com/florence-diamonds-light-38mm-r48869733.html',
        name: 'Florence Diamonds',
        reference: 'R48869733',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_florence_115_3869_2_073_1.png?impolicy=magento_media',
        retail: 'CHF950.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Florence',
        url: 'https://www.rado.com/florence-diamonds-light-38mm-r48869734.html',
        name: 'Florence Diamonds',
        reference: 'R48869734',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_florence_115_3869_2_173_1.png?impolicy=magento_media',
        retail: 'CHF1000.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Florence',
        url: 'https://www.rado.com/florence-diamonds-stainless-steel-black-38mm-r48907713.html',
        name: 'Florence Diamonds',
        reference: 'R48907713',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_florence_115_3907_4_071_1.png?impolicy=magento_media',
        retail: 'CHF900.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Florence',
        url: 'https://www.rado.com/florence-automatic-stainless-steel-light-28mm-r48899103.html',
        name: 'Florence Automatic',
        reference: 'R48899103',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_florence_561_3899_4_010_1.png?impolicy=magento_media',
        retail: 'CHF1100.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Florence',
        url: 'https://www.rado.com/florence-automatic-stainless-steel-light-28mm-r48899123.html',
        name: 'Florence Automatic',
        reference: 'R48899123',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_florence_561_3899_4_012_1.png?impolicy=magento_media',
        retail: 'CHF1100.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Florence',
        url: 'https://www.rado.com/florence-automatic-stainless-steel-blue-28mm-r48899203.html',
        name: 'Florence Automatic',
        reference: 'R48899203',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_florence_561_3899_4_020_1.png?impolicy=magento_media',
        retail: 'CHF1100.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Florence',
        url: 'https://www.rado.com/florence-automatic-light-28mm-r48900113.html',
        name: 'Florence Automatic',
        reference: 'R48900113',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_florence_561_3900_2_011_1.png?impolicy=magento_media',
        retail: 'CHF1100.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Florence',
        url: 'https://www.rado.com/florence-automatic-diamonds-light-28mm-r48900733.html',
        name: 'Florence Automatic Diamonds',
        reference: 'R48900733',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_florence_561_3900_2_073_1.png?impolicy=magento_media',
        retail: 'CHF1250.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Florence',
        url: 'https://www.rado.com/florence-automatic-stainless-steel-light-38mm-r48901103.html',
        name: 'Florence Automatic',
        reference: 'R48901103',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_florence_763_3901_4_010_1.png?impolicy=magento_media',
        retail: 'CHF1100.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Florence',
        url: 'https://www.rado.com/florence-automatic-stainless-steel-light-38mm-r48901123.html',
        name: 'Florence Automatic',
        reference: 'R48901123',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_florence_763_3901_4_012_1.png?impolicy=magento_media',
        retail: 'CHF1100.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Florence',
        url: 'https://www.rado.com/florence-automatic-stainless-steel-blue-38mm-r48901203.html',
        name: 'Florence Automatic',
        reference: 'R48901203',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_florence_763_3901_4_020_1.png?impolicy=magento_media',
        retail: 'CHF1100.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Florence',
        url: 'https://www.rado.com/florence-automatic-light-38mm-r48902113.html',
        name: 'Florence Automatic',
        reference: 'R48902113',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_florence_763_3902_2_011_1.png?impolicy=magento_media',
        retail: 'CHF1100.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'Florence',
        url: 'https://www.rado.com/florence-automatic-diamonds-light-38mm-r48902733.html',
        name: 'Florence Automatic Diamonds',
        reference: 'R48902733',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_florence_763_3902_2_073_1.png?impolicy=magento_media',
        retail: 'CHF1250.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'DiaStar Original',
        url: 'https://www.rado.com/the-original-automatic-hardmetal-grey-35mm-r12063013.html',
        name: 'The Original Automatic',
        reference: 'R12063013',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_the_original_734_6063_3_001_1.png?impolicy=magento_media',
        retail: 'CHF1400.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'DiaStar Original',
        url: 'https://www.rado.com/the-original-automatic-cvd-coated-hardmetal-other-35mm-r12413033.html',
        name: 'The Original Automatic',
        reference: 'R12413033',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/1/r12413033_s.png?impolicy=magento_media',
        retail: 'CHF1095.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'DiaStar Original',
        url: 'https://www.rado.com/the-original-automatic-pvd-coated-hardmetal-other-35mm-r12064253.html',
        name: 'The Original Automatic',
        reference: 'R12064253',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_the_original_734_6064_3_025_1.png?impolicy=magento_media',
        retail: 'CHF1500.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'DiaStar Original',
        url: 'https://www.rado.com/the-original-automatic-cvd-coated-hardmetal-other-35mm-r12413073.html',
        name: 'The Original Automatic',
        reference: 'R12413073',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_original_764_0413_3_007_1.png?impolicy=magento_media',
        retail: 'CHF1095.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'DiaStar Original',
        url: 'https://www.rado.com/the-original-automatic-pvd-coated-hardmetal-other-35mm-r12065403.html',
        name: 'The Original Automatic',
        reference: 'R12065403',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_the_original_734_6065_3_040_1.png?impolicy=magento_media',
        retail: 'CHF1500.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'DiaStar Original',
        url: 'https://www.rado.com/the-original-automatic-cvd-coated-hardmetal-other-35mm-r12413193.html',
        name: 'The Original Automatic',
        reference: 'R12413193',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_original_764_0413_3_019_1.png?impolicy=magento_media',
        retail: 'CHF1080.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'DiaStar Original',
        url: 'https://www.rado.com/the-original-cvd-coated-hardmetal-other-27-3-mm-r12306303.html',
        name: 'The Original',
        reference: 'R12306303',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_the_original_111_0306_3_030_1.png?impolicy=magento_media',
        retail: 'CHF820.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'DiaStar Original',
        url: 'https://www.rado.com/the-original-automatic-cvd-coated-hardmetal-other-35mm-r12413243.html',
        name: 'The Original Automatic',
        reference: 'R12413243',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_original_764_0413_3_024_1.png?impolicy=magento_media',
        retail: 'CHF1200.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'DiaStar Original',
        url: 'https://www.rado.com/the-original-cvd-coated-hardmetal-black-27-3-mm-r12306313.html',
        name: 'The Original',
        reference: 'R12306313',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_the_original_111_0306_3_031_1.png?impolicy=magento_media',
        retail: 'CHF820.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'DiaStar Original',
        url: 'https://www.rado.com/the-original-automatic-cvd-coated-hardmetal-other-35mm-r12413313.html',
        name: 'The Original Automatic',
        reference: 'R12413313',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_original_764_0413_3_031_1.png?impolicy=magento_media',
        retail: 'CHF1095.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'DiaStar Original',
        url: 'https://www.rado.com/the-original-hardmetal-other-27-3-mm-r12307304.html',
        name: 'The Original',
        reference: 'R12307304',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_the_original_111_0307_3_130_1.png?impolicy=magento_media',
        retail: 'CHF810.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'DiaStar Original',
        url: 'https://www.rado.com/the-original-automatic-cvd-coated-hardmetal-other-35mm-r12413323.html',
        name: 'The Original Automatic',
        reference: 'R12413323',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_original_764_0413_3_032_1.png?impolicy=magento_media',
        retail: 'CHF1095.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'DiaStar Original',
        url: 'https://www.rado.com/the-original-cvd-coated-hardmetal-other-35-1-mm-r12304303.html',
        name: 'The Original',
        reference: 'R12304303',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_the_original_114_0304_3_030_1.png?impolicy=magento_media',
        retail: 'CHF820.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'DiaStar Original',
        url: 'https://www.rado.com/the-original-automatic-cvd-coated-hardmetal-other-35mm-r12413343.html',
        name: 'The Original Automatic',
        reference: 'R12413343',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_original_764_0413_3_034_1.png?impolicy=magento_media',
        retail: 'CHF1005.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'DiaStar Original',
        url: 'https://www.rado.com/the-original-cvd-coated-hardmetal-black-35-1-mm-r12304313.html',
        name: 'The Original',
        reference: 'R12304313',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_the_original_114_0304_3_031_1.png?impolicy=magento_media',
        retail: 'CHF820.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'DiaStar Original',
        url: 'https://www.rado.com/the-original-automatic-cvd-coated-hardmetal-other-35mm-r12413493.html',
        name: 'The Original Automatic',
        reference: 'R12413493',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_original_764_0413_3_049_1.png?impolicy=magento_media',
        retail: 'CHF945.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'DiaStar Original',
        url: 'https://www.rado.com/the-original-hardmetal-other-35-1-mm-r12305304.html',
        name: 'The Original',
        reference: 'R12305304',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_the_original_114_0305_3_130_1.png?impolicy=magento_media',
        retail: 'CHF810.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'DiaStar Original',
        url: 'https://www.rado.com/the-original-automatic-cvd-coated-hardmetal-other-35mm-r12413503.html',
        name: 'The Original Automatic',
        reference: 'R12413503',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_the_original_764_0413_3_050_1.png?impolicy=magento_media',
        retail: 'CHF1150.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'DiaStar Original',
        url: 'https://www.rado.com/the-original-hardmetal-light-35-1-mm-r12391103.html',
        name: 'The Original',
        reference: 'R12391103',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_original_114_0391_3_010_1.png?impolicy=magento_media',
        retail: 'CHF510.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'DiaStar Original',
        url: 'https://www.rado.com/the-original-automatic-cvd-coated-hardmetal-blue-35mm-r12413523.html',
        name: 'The Original Automatic',
        reference: 'R12413523',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_the_original_764_0413_3_052_1.png?impolicy=magento_media',
        retail: 'CHF1150.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'DiaStar Original',
        url: 'https://www.rado.com/the-original-hardmetal-black-35-1-mm-r12391153.html',
        name: 'The Original',
        reference: 'R12391153',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/1/r12391153_s.png?impolicy=magento_media',
        retail: 'CHF510.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'DiaStar Original',
        url: 'https://www.rado.com/the-original-automatic-cvd-coated-hardmetal-green-35mm-r12413533.html',
        name: 'The Original Automatic',
        reference: 'R12413533',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_the_original_764_0413_3_053_1.png?impolicy=magento_media',
        retail: 'CHF1150.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'DiaStar Original',
        url: 'https://www.rado.com/the-original-hardmetal-other-35-1-mm-r12391633.html',
        name: 'The Original',
        reference: 'R12391633',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_original_114_0391_3_063_1.png?impolicy=magento_media',
        retail: 'CHF600.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'DiaStar Original',
        url: 'https://www.rado.com/the-original-automatic-cvd-coated-hardmetal-other-35mm-r12413573.html',
        name: 'The Original Automatic',
        reference: 'R12413573',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_the_original_764_0413_3_057_1.png?impolicy=magento_media',
        retail: 'CHF1150.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'DiaStar Original',
        url: 'https://www.rado.com/the-original-cvd-coated-hardmetal-other-35-1-mm-r12393633.html',
        name: 'The Original',
        reference: 'R12393633',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_original_114_0393_3_063_1.png?impolicy=magento_media',
        retail: 'CHF780.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'DiaStar Original',
        url: 'https://www.rado.com/the-original-automatic-hardmetal-other-27-3-mm-r12403633.html',
        name: 'The Original Automatic',
        reference: 'R12403633',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_original_557_0403_3_063_1.png?impolicy=magento_media',
        retail: 'CHF960.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'DiaStar Original',
        url: 'https://www.rado.com/the-original-automatic-cvd-coated-hardmetal-black-35mm-r12413613.html',
        name: 'The Original Automatic',
        reference: 'R12413613',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/1/r12413613_s.png?impolicy=magento_media',
        retail: 'CHF945.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'DiaStar Original',
        url: 'https://www.rado.com/the-original-automatic-cvd-coated-hardmetal-other-27-3-mm-r12416073.html',
        name: 'The Original Automatic',
        reference: 'R12416073',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_original_557_0416_3_007_1.png?impolicy=magento_media',
        retail: 'CHF1095.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'DiaStar Original',
        url: 'https://www.rado.com/the-original-automatic-cvd-coated-hardmetal-black-35mm-r12413623.html',
        name: 'The Original Automatic',
        reference: 'R12413623',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_the_original_764_0413_3_062_1.png?impolicy=magento_media',
        retail: 'CHF1150.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'DiaStar Original',
        url: 'https://www.rado.com/the-original-automatic-cvd-coated-hardmetal-black-27-3-mm-r12416163.html',
        name: 'The Original Automatic',
        reference: 'R12416163',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_the_original_557_0416_3_016_1.png?impolicy=magento_media',
        retail: 'CHF1150.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'DiaStar Original',
        url: 'https://www.rado.com/the-original-automatic-cvd-coated-hardmetal-other-35mm-r12413633.html',
        name: 'The Original Automatic',
        reference: 'R12413633',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_the_original_764_0413_3_063_1.png?impolicy=magento_media',
        retail: 'CHF1150.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'DiaStar Original',
        url: 'https://www.rado.com/the-original-automatic-cvd-coated-hardmetal-other-27-3-mm-r12416193.html',
        name: 'The Original Automatic',
        reference: 'R12416193',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_original_557_0416_3_019_1.png?impolicy=magento_media',
        retail: 'CHF1080.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'DiaStar Original',
        url: 'https://www.rado.com/the-original-automatic-cvd-coated-hardmetal-light-35mm-r12413653.html',
        name: 'The Original Automatic',
        reference: 'R12413653',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_the_original_764_0413_3_065_1.png?impolicy=magento_media',
        retail: 'CHF1150.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'DiaStar Original',
        url: 'https://www.rado.com/the-original-automatic-cvd-coated-hardmetal-other-27-3-mm-r12416393.html',
        name: 'The Original Automatic',
        reference: 'R12416393',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_original_557_0416_3_039_1.png?impolicy=magento_media',
        retail: 'CHF1095.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'DiaStar Original',
        url: 'https://www.rado.com/the-original-automatic-diamonds-cvd-coated-hardmetal-other-35mm-r12413703.html',
        name: 'The Original Automatic Diamonds',
        reference: 'R12413703',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_the_original_764_0413_3_070_1.png?impolicy=magento_media',
        retail: 'CHF2100.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'DiaStar Original',
        url: 'https://www.rado.com/the-original-automatic-cvd-coated-hardmetal-other-27-3-mm-r12416503.html',
        name: 'The Original Automatic',
        reference: 'R12416503',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_the_original_557_0416_3_050_1.png?impolicy=magento_media',
        retail: 'CHF1150.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'DiaStar Original',
        url: 'https://www.rado.com/the-original-automatic-diamonds-cvd-coated-hardmetal-other-35mm-r12413773.html',
        name: 'The Original Automatic Diamonds',
        reference: 'R12413773',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_the_original_764_0413_3_077_1.png?impolicy=magento_media',
        retail: 'CHF1200.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'DiaStar Original',
        url: 'https://www.rado.com/the-original-automatic-cvd-coated-hardmetal-blue-27-3-mm-r12416523.html',
        name: 'The Original Automatic',
        reference: 'R12416523',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_the_original_557_0416_3_052_1.png?impolicy=magento_media',
        retail: 'CHF1150.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'DiaStar Original',
        url: 'https://www.rado.com/the-original-automatic-diamonds-cvd-coated-hardmetal-light-35mm-r12413783.html',
        name: 'The Original Automatic Diamonds',
        reference: 'R12413783',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_the_original_764_0413_3_078_1.png?impolicy=magento_media',
        retail: 'CHF1200.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'DiaStar Original',
        url: 'https://www.rado.com/the-original-automatic-cvd-coated-hardmetal-green-27-3-mm-r12416533.html',
        name: 'The Original Automatic',
        reference: 'R12416533',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_the_original_557_0416_3_053_1.png?impolicy=magento_media',
        retail: 'CHF1150.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'DiaStar Original',
        url: 'https://www.rado.com/the-original-automatic-cvd-coated-hardmetal-other-35mm-r12413803.html',
        name: 'The Original Automatic',
        reference: 'R12413803',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_original_764_0413_3_080_1.png?impolicy=magento_media',
        retail: 'CHF1020.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'DiaStar Original',
        url: 'https://www.rado.com/the-original-automatic-cvd-coated-hardmetal-other-27-3-mm-r12416573.html',
        name: 'The Original Automatic',
        reference: 'R12416573',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_the_original_557_0416_3_057_1.png?impolicy=magento_media',
        retail: 'CHF1150.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'DiaStar Original',
        url: 'https://www.rado.com/the-original-automatic-cvd-coated-hardmetal-other-35mm-r12413034.html',
        name: 'The Original Automatic',
        reference: 'R12413034',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/1/r12413034_s.png?impolicy=magento_media',
        retail: 'CHF1290.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'DiaStar Original',
        url: 'https://www.rado.com/the-original-automatic-cvd-coated-hardmetal-black-27-3-mm-r12416613.html',
        name: 'The Original Automatic',
        reference: 'R12416613',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/1/r12416613_s.png?impolicy=magento_media',
        retail: 'CHF945.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'DiaStar Original',
        url: 'https://www.rado.com/the-original-automatic-cvd-coated-hardmetal-other-35mm-r12413314.html',
        name: 'The Original Automatic',
        reference: 'R12413314',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/1/r12413314_s.png?impolicy=magento_media',
        retail: 'CHF1290.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'DiaStar Original',
        url: 'https://www.rado.com/the-original-automatic-cvd-coated-hardmetal-other-27-3-mm-r12416633.html',
        name: 'The Original Automatic',
        reference: 'R12416633',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_original_557_0416_3_063_1.png?impolicy=magento_media',
        retail: 'CHF945.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'DiaStar Original',
        url: 'https://www.rado.com/the-original-automatic-cvd-coated-hardmetal-other-35mm-r12413324.html',
        name: 'The Original Automatic',
        reference: 'R12413324',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/1/r12413324_s.png?impolicy=magento_media',
        retail: 'CHF1290.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'DiaStar Original',
        url: 'https://www.rado.com/the-original-automatic-cvd-coated-hardmetal-light-27-3-mm-r12416653.html',
        name: 'The Original Automatic',
        reference: 'R12416653',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_the_original_557_0416_3_065_1.png?impolicy=magento_media',
        retail: 'CHF1150.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'DiaStar Original',
        url: 'https://www.rado.com/the-original-automatic-cvd-coated-hardmetal-other-35mm-r12413494.html',
        name: 'The Original Automatic',
        reference: 'R12413494',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/1/r12413494_s.png?impolicy=magento_media',
        retail: 'CHF1140.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'DiaStar Original',
        url: 'https://www.rado.com/the-original-automatic-cvd-coated-hardmetal-other-27-3-mm-r12416673.html',
        name: 'The Original Automatic',
        reference: 'R12416673',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_the_original_557_0416_3_067_1.png?impolicy=magento_media',
        retail: 'CHF1150.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'DiaStar Original',
        url: 'https://www.rado.com/the-original-automatic-cvd-coated-hardmetal-black-35mm-r12413584.html',
        name: 'The Original Automatic',
        reference: 'R12413584',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_original_764_0413_3_158_1.png?impolicy=magento_media',
        retail: 'CHF1095.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'DiaStar Original',
        url: 'https://www.rado.com/the-original-automatic-diamonds-cvd-coated-hardmetal-other-27-3-mm-r12416773.html',
        name: 'The Original Automatic Diamonds',
        reference: 'R12416773',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_the_original_557_0416_3_077_1.png?impolicy=magento_media',
        retail: 'CHF1200.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'DiaStar Original',
        url: 'https://www.rado.com/the-original-automatic-cvd-coated-hardmetal-black-35mm-r12413614.html',
        name: 'The Original Automatic',
        reference: 'R12413614',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/1/r12413614_s.png?impolicy=magento_media',
        retail: 'CHF960.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'DiaStar Original',
        url: 'https://www.rado.com/the-original-automatic-cvd-coated-hardmetal-other-27-3-mm-r12416803.html',
        name: 'The Original Automatic',
        reference: 'R12416803',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_original_557_0416_3_080_1.png?impolicy=magento_media',
        retail: 'CHF1020.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'DiaStar Original',
        url: 'https://www.rado.com/the-original-automatic-cvd-coated-hardmetal-other-35mm-r12413804.html',
        name: 'The Original Automatic',
        reference: 'R12413804',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/1/r12413804_s.png?impolicy=magento_media',
        retail: 'CHF1400.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'DiaStar Original',
        url: 'https://www.rado.com/the-original-automatic-cvd-coated-hardmetal-other-27-3-mm-r12416034.html',
        name: 'The Original Automatic',
        reference: 'R12416034',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/1/r12416034_s.png?impolicy=magento_media',
        retail: 'CHF1290.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'DiaStar Original',
        url: 'https://www.rado.com/the-original-automatic-cvd-coated-hardmetal-other-27-3-mm-r12416394.html',
        name: 'The Original Automatic',
        reference: 'R12416394',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/1/r12416394_s.png?impolicy=magento_media',
        retail: 'CHF1290.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'DiaStar Original',
        url: 'https://www.rado.com/the-original-automatic-cvd-coated-hardmetal-black-27-3-mm-r12416514.html',
        name: 'The Original Automatic',
        reference: 'R12416514',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_original_557_0416_3_151_1.png?impolicy=magento_media',
        retail: 'CHF1095.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'DiaStar Original',
        url: 'https://www.rado.com/the-original-automatic-cvd-coated-hardmetal-other-27-3-mm-r12416634.html',
        name: 'The Original Automatic',
        reference: 'R12416634',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/1/r12416634_s.png?impolicy=magento_media',
        retail: 'CHF1140.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'DiaStar Original',
        url: 'https://www.rado.com/the-original-automatic-hardmetal-black-35mm-r12408613.html',
        name: 'The Original Automatic',
        reference: 'R12408613',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_original_764_0408_3_061_1.png?impolicy=magento_media',
        retail: 'CHF915.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'DiaStar Original',
        url: 'https://www.rado.com/the-original-automatic-hardmetal-black-35mm-r12408623.html',
        name: 'The Original Automatic',
        reference: 'R12408623',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_the_original_764_0408_3_062_1.png?impolicy=magento_media',
        retail: 'CHF1050.000000'
    },
    {
        source: 'official',
        lang: 'en',
        brand: 'Rado',
        brandID: 160,
        collection: 'DiaStar Original',
        url: 'https://www.rado.com/the-original-automatic-hardmetal-other-35mm-r12408633.html',
        name: 'The Original Automatic',
        reference: 'R12408633',
        thumbnail: 'https://www.rado.com/media/catalog/product/cache/a73d956d7adc002f0f855a6453bfe9cc/r/g/rgb_cat_original_764_0408_3_063_1.png?impolicy=magento_media',
        retail: 'CHF950.000000'
    }
];

const indexing = async context => {
    const { client, entry, base, interval } = context;
    const source = "official";
    const lang = "en";
    const brand = "Rado";
    const brandID = 160;
    const result = { source, lang, brand, brandID, collections: [], items: {} }
    try {
        const { data } = await client.get(entry);
        const $ = cheerio.load(data);
        const cats = [];
        $(".category-featured").find("featured").each((idx, el) => {
            const name = $(el).find(".featured-text").find("h2").text().replace(/\s+/g, " ").trim();
            const url = $(el).find("a").attr("href");
            cats.push({ name, url });
        })
        $(".category-other").find(".item-text").each((idx, el) => {
            const name = $(el).find("h2").text().replace(/\s+/g, " ").trim();
            const url = $(el).find("a").attr("href");
            cats.push({ name, url });
        })
        console.log(cats);
        for (const c of cats) {
            let link = c.url;
            do {
                console.log(link);
                if (result.collections.indexOf(c.name) < 0) {
                    result.collections.push(c.name);
                    result.items[c.name] = [];
                }
                await new Promise(r => setTimeout(r, 5000));
                const { data } = await client.get(link);
                const $ = cheerio.load(data);
                $(".product-item").each((idx, el) => {
                    const url = $(el).find("a").attr("href");
                    const thumbnail = $(el).find("a").find("img").attr("src");
                    $(el).find("input").each((idx1, el1) => {
                        const d = $(el1).attr("data-product-data");
                        if (d) {
                            const dd = JSON.parse(d);
                            const name = dd.name;
                            const reference = dd.sku;
                            const retail = "CHF" + dd.price;
                            result.items[c.name].push({
                                source, lang, brand, brandID, collection: c.name, url,
                                name, reference, thumbnail, retail,
                            })
                        }
                    })
                })
                link = $(".pages-item-next").first().find("a").attr("href");
            } while (link);
        }
        return result;
    } catch (error) {
        console.error('Failed indexing for Rado with error : ' + error);
        return {};
    }
}

const extraction = async (context) => {
    const { client, entry, ...rest } = context;
    const result = { ...rest, url: entry, spec: [], related: [], };
    result.source = "official";
    result.lang = "en";
    result.brand = "Rado";
    result.brandID = 160;
    try {
        console.log(entry);
        const res = await client.get(entry);
        const cUrl = res.request.res.responseUrl;
        if (cUrl != entry) {
            result.code = 404;
            return;
        }
        const { data } = res;
        const $ = cheerio.load(data);
        result.name = $('meta[property="og:title"]').attr('content');
        result.thumbnail = $('meta[property="og:image"]').attr('content');
        result.description = $('meta[property="og:description"]').attr('content');
        result.reference = $(".product-info-main").find("div").first().text();
        result.price = $(".product-info-price").find(".price").text();
        // $(".additional-attributes-wrapper").find("div").each((idx, el) => {
        //     const key = $(el).find("h2").text();
        //     $(el).find("li").each((idx, el) => {
        //         const value = $(el).text().replace(/\s+/g, " ");
        //         if (value) result.spec.push({ key, value });
        //     })
        // })
        $(".additional-attributes-wrapper").find("li").each((idx, el) => {
            const d = $(el).text().replace(/\s+/g, " ");
            const dd = d.split(":");
            if (dd && dd.length > 1) result.spec.push({ key: dd[0].trim(), value: dd[1].trim() })
        })
    } catch (error) {
        console.error('Failed extraction for Rado with error : ' + error);
        if (error.response) result.code = error.response.status;
        else result.code = 'UNKNOWN ERROR';
    }
    return result;
};

const allindex = async context => {
    const { client } = context;
    const urls = [
        "https://www.rado.com/men-watches/discover/all-watches.html",
        "https://www.rado.com/women-watches.html",
        "https://www.rado.com/ceramic-watches.html",
    ];
    const uniq = [];
    for (const u of urls) {
        let link = u;
        await new Promise(r => setTimeout(r, 5000));
        const { data } = await client.get(link);
        const $ = cheerio.load(data);
        const ttl = parseInt($(".toolbar-number").last().text());
        const np = Math.ceil(ttl / 12);
        console.log(`np : ${np}`);
        for (let i = 1; i <= np; i++) {
            const link = u + "?page=" + i;
            console.log(link);
            await new Promise(r => setTimeout(r, 5000));
            try {
                const { data } = await client.get(link);
                const $ = cheerio.load(data);
                $(".product-item").each((idx, el) => {
                    const url = $(el).find("a").attr("href");
                    if (uniq.indexOf(url) < 0) uniq.push(url);
                })
            } catch (error) {
                console.log(error);
            }
        }
    }
    console.log(`uniq : ${uniq.length}`);
    uniq.forEach(w => { console.log(w); });
}

(async () => {
    // const r = await indexing({
    //     client: axios,
    //     entry: "https://www.rado.com/collections.html",
    //     base: "https://www.rado.com",
    // })
    // let cnt = 0;
    // r && r.collections.forEach(c => {
    //     r.items[c].forEach(w => {
    //         console.log(w);
    //         cnt++;
    //     })
    // })
    // await allindex({ client: axios });
    // console.log(`total : ${cnt}`);

    // const spec = [];
    // for (let i = 0; i < r.length; i++) {
    //     const ex = await extraction({
    //         client: axios,
    //         entry: r[i].url,
    //     })
    //     ex.spec.forEach(s => {
    //         const sp = s.key + "||" + s.value;
    //         if (spec.indexOf(sp) < 0) spec.push(sp);
    //     })
    //     await new Promise(r => setTimeout(r, 10000));
    // }
    // spec.sort().forEach(s => { console.log(s); });

    const r = [
        "https://www.rado.com/en_us/hyperchrome-stainless-steel-grey-44-9-mm-r32502163.html",
        "https://www.rado.com/en_us/hyperchrome-stainless-steel-light-44-9-mm-r32502103.html",
        "https://www.rado.com/en_us/hyperchrome-1314-plasma-high-tech-ceramic-grey-42mm-r32256702.html",
        "https://www.rado.com/en_us/r32502155-xxl-watch-hyperchrome-q-black-stainless-steel-black-44-9-mm-r32502155.html",
        "https://www.rado.com/en_us/hyperchrome-classic-automatic-stainless-steel-blue-42mm-r33101204.html",
        "https://www.rado.com/en_us/coupole-classic-diamonds-stainless-steel-light-34mm-r22884923.html",
        "https://www.rado.com/en_us/coupole-classic-automatic-power-reserve-stainless-steel-black-41mm-r22878163.html",
        "https://www.rado.com/en_us/coupole-classic-automatic-power-reserve-stainless-steel-light-41mm-r22878045.html",
        "https://www.rado.com/en_us/coupole-classic-automatic-power-reserve-blue-41mm-r22879215.html",
        "https://www.rado.com/en_us/coupole-classic-automatic-power-reserve-light-41mm-r22879315.html",
        "https://www.rado.com/en_us/coupole-classic-automatic-power-reserve-stainless-steel-light-41mm-r22878313.html",
        "https://www.rado.com/en_us/ceramica-diamonds-high-tech-ceramic-black-22-9-mm-r21702732.html",
        "https://www.rado.com/en_us/ceramica-automatic-high-tech-ceramic-black-30mm-r21808152.html",
        "https://www.rado.com/en_us/florence-black-28mm-r48871173.html",
        "https://www.rado.com/en_us/florence-black-28mm-r48873173.html",
        "https://www.rado.com/en_us/florence-diamonds-light-28mm-r48873734.html",
        "https://www.rado.com/en_us/the-original-automatic-cvd-coated-hardmetal-other-35mm-r12413633.html",
    ];
    for (const u of r) {
        const ex = await extraction({
            client: axios,
            entry: u,
        });
        console.log(ex);
        await new Promise(r => setTimeout(r, 2000));
    }
    console.log();
    console.log('done............................');
})()