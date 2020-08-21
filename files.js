const fs = require('fs');
const path = require('path');

const dir = '/Users/lcchai/Work/test/rabbit';
const files = fs.readdirSync(dir);

for (file of files) {
  const fullpath = path.join(dir, file);
  const stat = fs.lstatSync(path.join(dir, file));
  console.log(fullpath, stat.size);
}
