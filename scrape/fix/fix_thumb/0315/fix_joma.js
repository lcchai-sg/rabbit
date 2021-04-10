const { MongoClient } = require('mongodb');
const axios = require('axios');
const u = require('./u_joma');
const fs = require('fs');

const qryURL = url => {
    const v = url.split('/');
    const vv = v[v.length - 1].replace('.html', '');
    if (vv) {
        const qry = `https://www.jomashop.com/graphql?query=query productDetail($urlKey:String,$onServer:Boolean!){productDetail:products(filter:{url_key:{eq:$urlKey}}){items{__typename id sku name name_wout_brand on_hand_priority_text on_hand_priority is_preowned brand_name brand_url manufacturer url_key stock_status out_of_stock_template out_of_stock_template_text price_promo_text promotext_code promotext_type promotext_value shipping_availability is_shipping_free_message shipping_question_mark_note model_id image{label url __typename}upc_code item_variation media_gallery{... on ProductImage{label role url sizes{image_id url __typename}url_nocache __typename}__typename}breadcrumbs{path categories{name url_key __typename}__typename}review_details{review_summary review_count __typename}rating_configurations{rating_attributes __typename}short_description{html __typename}description{html __typename}moredetails{description more_details{group_id group_label group_attributes{attribute_id attribute_label attribute_value __typename}__typename}__typename}msrp price_range{minimum_price{regular_price{value currency __typename}final_price{value currency __typename}price_promo_text msrp_price{value currency __typename}discount_on_msrp{amount_off percent_off __typename}discount{amount_off percent_off __typename}__typename}__typename}categories{breadcrumbs{category_id category_name __typename}__typename}... on GroupedProduct{items{qty position product{id sku stock_status name brand_name name_wout_brand manufacturer manufacturer_text is_shipping_free_message shipping_availability url_key is_preowned preowned_item_condition preowned_item_condition_text preowned_box preowned_papers preowned_papers_year preowned_condition_description on_hand_priority_text on_hand_priority shipping_question_mark_note model_id msrp price_range{minimum_price{regular_price{value currency __typename}final_price{value currency __typename}price_promo_text msrp_price{value currency __typename}discount_on_msrp{amount_off percent_off __typename}discount{amount_off percent_off __typename}__typename}__typename}media_gallery{... on ProductImage{label role url sizes{image_id url __typename}url_nocache __typename}__typename}moredetails{description __typename}__typename}__typename}__typename}... on ConfigurableProduct{configurable_options{attribute_code attribute_id id label values{default_label label store_label use_default_value value_index swatch_data{type value... on ImageSwatchData{thumbnail __typename}__typename}__typename}__typename}variants{attributes{code value_index label __typename}product{id brand_name brand_url brand_size manufacturer shipping_availability is_shipping_free_message shipping_question_mark_note name_wout_brand msrp price_promo_text promotext_code promotext_type promotext_value is_preowned model_id on_hand_priority_text on_hand_priority price_range{minimum_price{regular_price{value currency __typename}final_price{value currency __typename}price_promo_text msrp_price{value currency __typename}discount_on_msrp{amount_off percent_off __typename}discount{amount_off percent_off __typename}__typename}__typename}media_gallery{... on ProductImage{label role url sizes{image_id url __typename}url_nocache __typename}__typename}sku stock_status moredetails{description __typename}__typename}__typename}__typename}... on GiftCardProduct{allow_open_amount open_amount_min open_amount_max giftcard_type is_redeemable lifetime allow_message message_max_length giftcard_amounts{value_id website_id website_value attribute_id value __typename}__typename}meta_title@include(if:$onServer)meta_keyword@include(if:$onServer)meta_description@include(if:$onServer)canonical_url@include(if:$onServer)}__typename}}&operationName=productDetail&variables={"urlKey":"${vv}","onServer":true}`;
        return qry;
        // return "https://www.jomashop.com/graphql?query=query " + qry;
    }
    return '';
};

(async () => {
    const mdb = {
        host: '127.0.0.1',
        port: 27017,
        user: 'synopsis',
        pass: 'synopsis',
        name: 'synopsis',
        coll: 'p_reference_product',
    };

    const db_url = `mongodb://${mdb.user}:${mdb.pass}@${mdb.host}:${mdb.port}/${mdb.name}`;
    const conn = await MongoClient.connect(db_url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    const db = conn.db(mdb.name);
    for (let i = 0; i < u.length; i++) {
        console.log(u.length, i, u[i]);
        const p = await db.collection(mdb.coll).find({ url: u[i], thumbnail: { $ne: null } }).sort({ lastCheckAt: -1 }).toArray();
        if (p && p.length > 0 && p[0]) {
            const out = `${u[i]} ||| ${p[0].thumbnail}\n`
            fs.appendFile('fix_joma.out', out, (err) => { if (err) throw err; });
        } else {
            console.log(`          to extract thumbnail`);
            await new Promise(r => setTimeout(r, 3000));
            const url = u[i].match(/è/) ? u[i].replace(/è/g, 'e') : u[i];
            let qry = qryURL(url);
            if (!qry) {
                const out = `${u[i]} ||| not product\n`;
                fs.appendFile('fix_joma.out', out, (err) => { if (err) throw err; });
            } else {
                try {
                    const { data } = await axios.get(qry);
                    if (data.data.productDetail.items.length === 0) {
                        const out = `${u[i]} ||| 404\n`;
                        fs.appendFile('fix_joma.out', out, (err) => { if (err) throw err; });
                    } else {
                        let d = data.data.productDetail.items[0];
                        let md = d.moredetails.more_details;
                        let ld = md[md.length - 1].group_attributes;
                        let department = '';
                        let category = '';
                        for (const a of ld) {
                            if (a.attribute_label === 'Department') department = a.attribute_value;
                            if (a.attribute_label === 'Category') category = a.attribute_value;
                        }
                        if (!(department.match(/watches/i)) || !(category.match(/watches|smart watch/i))) {
                            const out = `${u[i]} ||| not product\n`;
                            fs.appendFile('fix_joma.out', out, (err) => { if (err) throw err; });
                        } else {
                            const img = d.image && d.image.sizes ? d.image.sizes : [];
                            let imgFound = false;
                            for (let i = 0; i < img.length && !imgFound; i++) {
                                if (img[i].image_id === "product_base_image") {
                                    const out = `${u[i]} ||| ${img[i].url}\n`;
                                    fs.appendFile('fix_joma.out', out, (err) => { if (err) throw err; });
                                    imgFound = true;
                                }
                            }
                        }
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        }
    }
    console.log();
    console.log('done.');
    process.exit(0);
})();