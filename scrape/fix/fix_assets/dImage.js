const fs = require('fs');
const axios = require('axios');

//============================================================
//   Function: Download Image
// ============================================================

const download_image = (url, image_path) =>
    axios({
        url,
        responseType: 'stream',
    }).then(
        response =>
            new Promise((resolve, reject) => {
                response.data
                    .pipe(fs.createWriteStream(image_path))
                    .on('finish', () => resolve())
                    .on('error', e => reject(e));
            }),
    );

// ============================================================
//   Download Images in Order
// ============================================================

(async () => {
    let example_image_1 = await download_image('https://piaget.rokka.io/product-1/7d2187deecf9a31ae50a36bfde6819a60228a36f.jpg', '/Users/lcchai/Work/assets/official/piaget/7d2187deecf9a31ae50a36bfde6819a60228a36f.jpg');

    console.log(example_image_1);
    // console.log(example_image_1.error); // ''

    let example_image_2 = await download_image('https://piaget.rokka.io/product-1/b46ddf67740ea11c11892306b8aa5e6f007ee6de.jpg', '/Users/lcchai/Work/assets/official/piaget/b46ddf67740ea11c11892306b8aa5e6f007ee6de.jpg');

    console.log(example_image_2);
    // console.log(example_image_2.status); // false
    // console.log(example_image_2.error); // 'Error: Request failed with status code 404'

    let example_image_3 = await download_image('https://piaget.rokka.io/product-1/fd9845bb2fdff25538798721a0603cc9d13b3b9b.jpg', '/Users/lcchai/Work/assets/official/piaget/fd9845bb2fdff25538798721a0603cc9d13b3b9b.jpg');

    console.log(example_image_3);
    // console.log(example_image_3.status); // true
    // console.log(example_image_3.error); // ''
})();