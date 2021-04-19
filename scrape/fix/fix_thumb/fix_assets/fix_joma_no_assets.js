const fs = require('fs');
const axios = require('axios');
const u = require('./u_joma_no_assets');

const qryURL = url => {
    const v = url.split('/');
    const vv = v[v.length - 1].replace('.html', '');
    if (vv) {
        const qry = `productDetail( $urlKey : String ) {
        productDetail:products( filter: { url_key: { eq: $urlKey } } ) {
            items {
                name_wout_brand
                is_preowned
                brand_name
                model_id
                image { label url sizes{ image_id url } }
                upc_code
                item_variation
                moredetails {
                    description
                    more_details {
                        group_id
                        group_label
                        group_attributes {
                            attribute_id
                            attribute_label
                            attribute_value
                        }
                    }
                }
                msrp
                price_range {
                    minimum_price {
                        regular_price { value currency }
                        final_price { value currency }
                        msrp_price { value currency }
                        discount_on_msrp { amount_off percent_off }
                        discount { amount_off percent_off }
                    }
                }
            }
        }
    }&operationName=productDetail&variables={"urlKey":"${vv}"}
    `;
        return "https://www.jomashop.com/graphql?query=query " + qry;
    }
    return '';
};

(async () => {
    const fp = '/Users/lcchai/Work/assets/joma/';
    for (let i = 0; i < u.length; i++) {
        console.log(u.length, i, u[i]);
        const url = u[i].match(/è/) ? u[i].replace(/è/g, 'e') : u[i];
        let qry = qryURL(url);
        if (!qry) {
            const out = `${u[i]} ||| not product\n`;
            console.log(`     NOT PRODUCT : ${u[i]}`);
            fs.appendFile('joma_no_assets.err', out + '\n', (err) => { if (err) throw err; });
        } else {
            await new Promise(r => setTimeout(r, 5000));
            const { data } = await axios.get(qry);
            if (data.data.productDetail.items.length === 0) {
                const out = `${u[i]} ||| 404\n`;
                console.log(`     404 : ${u[i]}`);
                fs.appendFile('joma_no_assets.err', out, (err) => { if (err) throw err; });
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
                    console.log(`     NOT PRODUCT : ${u[i]}`);
                    fs.appendFile('joma_no_assets.err', out + '\n', (err) => { if (err) throw err; });
                } else {
                    const img = d.image && d.image.sizes ? d.image.sizes : [];
                    let th = '';
                    for (let i = 0; i < img.length && th === ''; i++) {
                        if (img[i].image_id === "product_base_image") {
                            th = img[i].url;
                        }
                    }
                    if (th && !th.match(/placeholder|coming|unavailable/i)) {
                        th = th.split('?')[0];
                        const uu = th.split('/');
                        const fn = uu[uu.length - 1].split('?')[0];
                        const fname = fp + fn;
                        const resp = await axios.get(th, { responseType: 'stream' });
                        resp.data.pipe(fs.createWriteStream(fname));
                        const out = `${u[i]} ||| ${th} ||| ${fname}`;
                        console.log('     ', out);
                        fs.appendFile('joma_no_assets.out', out + '\n', (err) => { if (err) throw err; });
                    } else {
                        const out = `${u[i]} ||| no thumbnail\n`;
                        console.log(`     NOT THUMBNAIL : ${u[i]}`);
                        fs.appendFile('joma_no_assets.err', out, (err) => { if (err) throw err; });
                    }
                }
            }
        }
    }
})()