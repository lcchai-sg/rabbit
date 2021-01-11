const input = require('./crowns.js');

const getCaseCrown = input => {
  if (!input) return "";

  if (input.match(/screw[ -_]down/i)) {
    return 'Screw Down';
  }
  if (input.match(/Screws/i)) {
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
  const c = getCaseCrown(input[i]);
  console.log(c, '>>>>>', input[i]);
}