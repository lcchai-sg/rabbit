const p = require('./product.1005');
const { MongoClient, ObjectId } = require('mongodb');

console.log(p.length);
for (let i=0; i<10; i++) {
  console.log(p[i]);
}
