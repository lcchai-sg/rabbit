const axios = require('axios');

const os = [
  "https://www.jomashop.com/invicta-subaqua-watch-26722.html",
  "https://www.jomashop.com/chronoswiss-watch-ch-7585-1b-bk.html",
  "https://www.jomashop.com/longines-watch-l2-305-0-83-6.html",
  "https://www.jomashop.com/preowned-1-rolex-gmt-master-ii-coke-black-dial-mens-watch-16710.html",
  "https://www.jomashop.com/oris-classic-date-watch-5617650433181463.html",
  "https://www.jomashop.com/preowned-4-omega-seamaster-black-dial-mens-watch-2254-5.html",
  "https://www.jomashop.com/tommy-hilfiger-deacan-black-dial-mens-watch-1791547.html",
  "https://www.jomashop.com/hugo-boss-ambassador-blue-dial-mens-watch-1513034.html",
  "https://www.jomashop.com/christian-van-sant-somptueuse-limited-edition-green-dial-mens-watch-cv1148.html",
  "https://www.jomashop.com/christian-van-sant-montego-vintage-brown-dial-mens-watch-cv5101.html",
  "https://www.jomashop.com/oceanaut-baltica-special-edition-blue-dial-mens-watch-oc0531.html",
  "https://www.jomashop.com/oceanaut-marletta-white-dial-mens-watch-oc2912.html",
  "https://www.jomashop.com/oceanaut-biarritz-blue-dial-mens-watch-oc6113.html",
  "https://www.jomashop.com/oceanaut-biarritz-brown-dial-mens-watch-oc6116.html",
  "https://www.jomashop.com/seapro-scuba-dragon-diver-limited-edition-1000-meters-black-dial-mens-watch-sp8310s.html",
  "https://www.jomashop.com/preowned-1-girard-perregaux-ferrari-yellow-dial-mens-watch-8020.html",
  "https://www.jomashop.com/oceanaut-barletta-grey-dial-mens-watch-oc1340.html",
  "https://www.jomashop.com/seapro-raceway-black-dial-mens-watch-sp5112.html",
  "https://www.jomashop.com/citizen-ew8973-16y.html",
  "https://www.jomashop.com/longines-watch-l5-255-8-87-0.html",
  "https://www.jomashop.com/preowned-2-paul-picot-butterfly-white-dial-ladies-watch-modern.html",
  "https://www.jomashop.com/christian-van-sant-callista-brown-dial-ladies-watch-cv0416.html",
  "https://www.jomashop.com/jean-paul-gaultier-index-rose-gold-tone-dial-ladies-watch-8504307.html",
  "https://www.jomashop.com/ferrari-scuderia-black-dial-mens-watch-840033.html",
  "https://www.jomashop.com/oceanaut-tide-red-dial-mens-watch-oc0993.html",
  "https://www.jomashop.com/oceanaut-biarritz-blue-dial-mens-watch-oc6117r.html",
  "https://www.jomashop.com/preowned-1-tiffany-dress-white-dial-unisex-watch-dress.html",
  "https://www.jomashop.com/audemars-piguet-watch-67543bc-zz-d204cr-01.html",
  "https://www.jomashop.com/piaget-watch-goa32194.html",
  "https://www.jomashop.com/preowned-5-rolex-gmt-master-ii-black-dial-mens-watch-16713.html",
  "https://www.jomashop.com/ulysse-nardin-watch-8296-122b-8-42.html",
  "https://www.jomashop.com/chopard-watch-172287-5001.html",
  "https://www.jomashop.com/chopard-watch-178494-2001.html",
  "https://www.jomashop.com/hublot-watch-301-ci-2770-nr-jeann.html",
  "https://www.jomashop.com/hublot-watch-510-ox-7180-ox.html",
  "https://www.jomashop.com/jaeger-lecoultre-watch-q1652421.html",
  "https://www.jomashop.com/tudor-pelagos-watch-m25600tn-0001.html",
  "https://www.jomashop.com/seapro-spring-yellow-dial-ladies-watch-sp3210.html",
  "https://www.jomashop.com/seapro-spring-blue-dial-ladies-watch-sp3211.html",
  "https://www.jomashop.com/seapro-scuba-dragon-diver-limited-edition-1000-meters-green-dial-mens-watch-sp8324.html",
  "https://www.jomashop.com/open-box-seiko-watch-srpd09k1.html",
  "https://www.jomashop.com/armani-exchange-quartz-silver-dial-ladies-watch-ax5904.html",
  "https://www.jomashop.com/casio-watch-f91w-1.html",
  "https://www.jomashop.com/dkny-soho-quartz-black-dial-ladies-watch-ny2886.html",
  "https://www.jomashop.com/fossil-carlie-mini-watch-es4433.html",
  "https://www.jomashop.com/seiko-neo-classic-silver-tone-dial-ladies-watch-sur349p1.html",
  "https://www.jomashop.com/skagen-aaren-kulor-watch-skw6510.html",
  "https://www.jomashop.com/jaeger-lecoultre-watch-q1428420.html",
  "https://www.jomashop.com/jaeger-lecoultre-watch-q3001420.html",
  "https://www.jomashop.com/jaeger-lecoultre-303-21-20.html",
  "https://www.jomashop.com/jivago-watch-jv0120.html",
  "https://www.jomashop.com/jivago-watch-jv7133.html",
  "https://www.jomashop.com/preowned-1-rolex-oyster-perpetual-silver-tone-dial-mens-watch-1500.html",
  "https://www.jomashop.com/nove-streamliner-white-dial-mens-watch-a016-01.html",
  "https://www.jomashop.com/ferragamo-quartz-green-dial-mens-watch-sfcv00219.html",
  "https://www.jomashop.com/ferragamo-slim-gent-quartz-mens-watch-sfde01019.html",
  "https://www.jomashop.com/nove-trident-black-dial-mens-watch-e005-02.html"
];

const up = [
];

const un = [
];

(async () => {
  // up = watch, un = not product, os = out of stock 
  const u = os;
  for (let i = 0; i < u.length; i++) {
    const v = u[i].split('/');
    const vv = v[v.length - 1].replace('.html', '');
    const qry = `productDetail($urlKey:String) {
      productDetail:products(filter:{url_key:{eq:$urlKey}}){
        items{
          name_wout_brand
          is_preowned
          brand_name
          model_id
          image{label url}
          upc_code
          item_variation
          moredetails{
            description
            more_details{
              group_id
              group_label
              group_attributes{
                attribute_id
                attribute_label
                attribute_value
              }
            }
          }
          msrp
          price_range{
            minimum_price{
              regular_price{value currency}
              final_price{value currency}
              msrp_price{value currency}
              discount_on_msrp{amount_off percent_off}
              discount{amount_off percent_off}
            }
          }
          ... on GroupedProduct{
            items{
              product{
                brand_name
                name_wout_brand
                is_preowned
                preowned_item_condition_text
                preowned_box
                preowned_papers
                preowned_papers_year
                preowned_condition_description
                msrp
                price_range{
                  minimum_price{
                    regular_price{value currency}
                    final_price{value currency}
                    msrp_price{value currency}
                    discount_on_msrp{amount_off percent_off}
                    discount{amount_off percent_off}
                  }
                }
                moredetails{description}
              }
            }
          }
        }
      }
    }&operationName=productDetail&variables={"urlKey":"${vv}"}
    `;
    const link = "https://www.jomashop.com/graphql?query=query " + qry;
    const { data } = await axios.get(link);
    if (data.data.productDetail.items.length === 0) {
      console.log(u[i], '>>> 404');
    } else {
      console.log(data.data.productDetail.items[0].moredetails)
      const dd = data.data.productDetail.items[0].moredetails.more_details;
      const ddd = dd[dd.length - 1].group_attributes;
      const department = ddd[ddd.length - 2].attribute_value;
      const category = ddd[ddd.length - 1].attribute_value;
      if (department.match(/watch/i) && category.match(/watch/i))
        console.log(u[i], '>>>', department, '>>>', category);
    }
    process.exit(0)
    await new Promise(r => setTimeout(r, 1000));
  }
})();