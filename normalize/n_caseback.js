const input = require('./caseback.js');

const getCaseBack = input => {
  if (!input) return "";

  if (input.match(/screw(ed)?[ -_]?down/i)) {
    return 'Screw Down';
  }
  if (input.match(/screw(s|ed)?/i)) {
    return 'Screws';
  }
  if (input.match(/Snap/i)) {
    return 'Snap';
  }
  if (input.match(/Skeleton/i)) {
    return 'Skeleton';
  }
  // cannot identify
  return 'NO';
}

for (let i = 0; i < input.length; i++) {
  const c = getCaseBack(input[i]);
  console.log(c, '>>>>>', input[i]);
}