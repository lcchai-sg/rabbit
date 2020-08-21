require('dotenv').config();
const AWS = require('aws-sdk');
const axios = require('axios');

const { BUCKET_NAME, AWS_ACCESS_KEY, AWS_SECRET_ACCESS_KEY } = process.env;

const s3 = new AWS.S3({
  accessKeyId: AWS_ACCESS_KEY,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  region: "ap-southeast-1"
});

const bucketName = 'pixel.images';

const UploadFromUrlToS3 = async (url, destPath) => {
  return new Promise(async (resolve, reject) => {
    const image = await axios.get(url, { responseType: "stream" });
    const objectParams = {
      Bucket: bucketName,
      ContentType: image.headers['content-type'],
      ContentLength: image.headers['content-length'],
      Key: destPath,
      Body: image.data
    };
    resolve(s3.putObject(objectParams).promise());
  });
}

UploadFromUrlToS3(
  'https://images.unsplash.com/photo-1501854140801-50d01698950b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjI0MX0&auto=format&fit=crop&w=1740&q=80',
  'photo-1501854140801-50d01698950b.jpeg')
  .then(function () { console.log('image was saved...'); })
  .catch(function (err) { console.log('image was not saved!', err); });