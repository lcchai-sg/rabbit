const client = require('axios');
const cheerio = require('cheerio');

const indexing = async (context) => {
  try {
    const { entry, base } = context;
    const result = { collections: [], items: {} };
    const catUrls = [];
    const $ = cheerio.load((await client.get(entry)).data);

    $('#watchfinder-brands ul.wf-Filter_SpringBoards li').each((idx, el) => {
      const name = $(el).find('.wf-Filter_SpringBoardName').text();
      result.collections.push(name);
      result.items[name] = [];
    });

    const amount = $('.wf-Filter_ResultNum').text();
    let link = base + amount;

    await client.get(link)
      .then(function (response) {
        let results = response.data.results;
        let category, cat;

        results.forEach(data => {
          if (data.main_category_id == 2) {
            category = "Astron";
            cat = "astron";
          } else if (data.main_category_id == 5) {
            category = "Presage";
            cat = "presage";
          } else if (data.main_category_id == 6) {
            category = "Prospex";
            cat = "prospex";
          } else if (data.main_category_id == 7) {
            category = "Seiko Premier";
            cat = "seikopremier";
          } else if (data.main_category_id == 17401) {
            category = "5 Sports"
            cat = "5sports";
          }

          result.items[category].push({
            url: base + cat + "/" + data.title.toLowerCase(),
            thumbnail: base + data.thumbnail.url_key + "_medium.png",
            collection: category,
            name: data.title,
            reference: data.slug,
          })
        });
      })
      .catch(function (error) {
        console.log('Failed for indexing class of Seiko' +
          ' with error : ' + error
        )
        return [];
      })
    return result;
  } catch (error) {
    console.log('Failed for indexing class of Seiko' +
      ' with error : ' + error
    )
    return [];
  }
};

const extraction = async (context) => {
  try {
    const { url: entry } = context;
    const result = {
      url: entry,
      scripts: [],
      spec: [],
      related: [],
    };
    const $ = cheerio.load((await client.get(entry)).data);
    const reference = $('h1.pr-Product_Name').text().trim();
    const collection = $('.pr-Product_Main .pr-Product_Collection a').text().trim();
    let gender;
    let gender_data = $('.pr-Product_Main .pr-Product_LabelMens').text().trim();

    if (gender_data == "Men’s") {
      gender = 'M';
    } else if (gender_data == "Women’s") {
      gender = 'F';
    }

    result.name = $('.pr-Product_Main .pr-Product_Name ').text().trim();
    result.reference = reference;
    result.collection = collection;
    result.gender = gender;

    $('.pr-Spec_Group:nth-child(1) .pr-Spec_Item').each((idx, el) => {
      const key = $(el).find('h4.pr-Spec_HeadingLv2').text().trim();
      const value = $(el).find('.pr-Spec_Text p').text().trim();
      result.spec.push({
        "key": key,
        "value": value
      })
    });

    $('.pr-Spec_Group:nth-child(2) .pr-Spec_Item').each((idx, el) => {
      const key = $(el).find('h4.pr-Spec_HeadingLv2').text().trim();
      const value = $(el).find('.pr-Spec_Text p').text().trim();
      result.spec.push({
        "key": key,
        "value": value
      })
    });

    const waterResistanceKey = $('.pr-Spec_Group:nth-child(3) .pr-Spec_Item:nth-child(1)').find('h4.pr-Spec_HeadingLv2').text();
    const waterResistanceValue = $('.pr-Spec_Group:nth-child(3) .pr-Spec_Item:nth-child(1)').find('p').text();
    result.spec.push({
      "key": waterResistanceKey,
      "value": waterResistanceValue
    })

    const caseSize = $('.pr-Spec_Group:nth-child(3) .pr-Spec_Item:nth-child(2)').find('.pr-Spec_Text').text();
    const arr = caseSize.trim().split(" ");
    for (var i = 0; i < arr.length; i += 1) {
      result.spec.push({
        "key": arr[i].replace(/:/g, ""),
        "value": arr[i += 1] + " " + arr[i += 1],
      })
    }

    const otherSpecKey = $('.pr-Spec_Group:nth-child(3) .pr-Spec_Item:nth-child(3)').find('h4.pr-Spec_HeadingLv2').text();
    const otherSpecValue = [];
    $('.pr-Spec_Group:nth-child(3) ul.pr-Spec_GroupInside li').each((idx, el) => {
      const text = $(el).text().trim();
      otherSpecValue.push(text)
    });
    result.spec.push({
      "key": otherSpecKey,
      "value": otherSpecValue
    })

    const feature = [];
    $('.pr-Spec_Group:nth-child(4) ul.pr-Spec_GroupInside li').each((idx, el) => {
      const text = $(el).text().trim();
      feature.push(text)
    });
    result.feature = feature;

    $('.blk-ProductList_Item').each((idx, el) => {
      const ref = $(el).find('a .blk-ProductList_Name').text();
      result.related.push(ref)
    });
    return result;
  }
  catch (error) {
    console.log('Failed for extraction class of Seiko' +
      ' with error : ' + error
    )
    return [];
  }
};

(async () => {
  const context = {
    entry: "https://www.seiko-watch.co.jp/collections/en",
    base: "https://www.seiko-watch.co.jp/",
    // entry: "https://www.seikowatches.com/global-en/products",
    // base: "https://www.seikowatches.com/",
  };
  const r = await indexing(context);
  console.log(r)
  if (r && r.items && r.collections) {
    // const context = r.items[r.collections[0]][0];
    const context = {
      url: "https://www.seikowatches.com/global-en/products/astron/ssh051j1",
      base: "https://www.seikowatches.com/",
    }
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

