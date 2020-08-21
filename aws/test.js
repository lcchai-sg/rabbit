require('dotenv').config();
const AWS = require('aws-sdk');
const axios = require('axios');

const { BUCKET_NAME, AWS_ACCESS_KEY, AWS_SECRET_ACCESS_KEY, REGION } = process.env;

const s3 = new AWS.S3({
  accessKeyId: AWS_ACCESS_KEY,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  region: REGION,
});

const UploadFromUrlToS3 = async (url) => {
  const image = await axios.get(url, { responseType: "stream" });
  let ext = '';
  switch (image.headers['content-type']) {
    case 'image/jpeg':
      ext = '.jpeg'
      break;
    case 'image/png':
      ext = '.png'
      break;
    case 'image/gif':
      ext = '.gif';
      break;
    default:
      console.log(`unknown type -> ${image.headers['content-type']}`);
      break;
  }
  let filename = url.split('/').pop().split('#')[0].split('?')[0].split('.')[0];
  const destPath = filename + ext;
  console.log(`destPath ---> ${destPath}`)
  const objectParams = {
    Bucket: BUCKET_NAME,
    ContentType: image.headers['content-type'],
    ContentLength: image.headers['content-length'],
    Key: destPath,
    Body: image.data
  };
  s3.putObject(objectParams).promise();
}

(async () => {
  try {
    await UploadFromUrlToS3('https://images.unsplash.com/photo-1501854140801-50d01698950b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjI0MX0&auto=format&fit=crop&w=1740&q=80');

    await UploadFromUrlToS3('https://content.rolex.com/dam/2019/upright-bba-with-shadow/m126333-0010.png');

    await UploadFromUrlToS3('https://content.rolex.com/dam/2019/upright-bba-with-shadow/m126301-0009.png?imwidth=840');

    await UploadFromUrlToS3('https://thumbs.gfycat.com/HomelyFineFlea-size_restricted.gif');
    // await UploadFromUrlToS3(
    //   'https://images.unsplash.com/photo-1551898634-c856c0577fde?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2800&q=80',
    //   'full/pixel-00002111.jpeg');
    // console.log(`uploaded... pixel-00002111.jpeg`)

    // await UploadFromUrlToS3(
    //   'https://images.unsplash.com/photo-1505033575518-a36ea2ef75ae?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=666&q=80',
    //   'full/pixel-00003111.jpeg');
    // console.log(`uploaded... pixel-00003111.jpeg`)

    // await UploadFromUrlToS3(
    //   'https://images.unsplash.com/photo-1491234909075-13ce70f047b5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80',
    //   'full/pixel-00004111.jpeg');
    // console.log(`uploaded... pixel-00004111.jpeg`)

    // await UploadFromUrlToS3(
    //   'https://images.unsplash.com/photo-1495924979005-79104481a52f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80',
    //   'full/pixel-00005111.jpeg');
    // console.log(`uploaded... pixel-00005111.jpeg`)
  } catch (error) {
    console.log(error)
  }
})();

