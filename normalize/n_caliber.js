const input = require('./caliber');

const getCaliber = input => {
  if (!input) return "";

  if (input.match(/automati[c|k]|self[ -_]?(wind|wound)/i)) {
    return 'Automatic';
  }
  if (input.match(/manual|hand[ -_]?(wind|wound)/i)) {
    return 'Manual';
  }
  if (input.match(/kinetic/i)) {
    return 'Kinetic';
  }
  if (input.match(/processor|smart[ -_]?watch/i)) {
    return 'Smart Watch';
  }
  if (input.match(/solar|eco[ -_]?drive/i)) {
    return 'Eco-Drive';
  }
  if (input.match(/spring[ -_]?drive/i)) {
    return 'Spring Drive';
  }
  if (input.match(/quartz|quarz/i)) {
    return 'Quartz';
  }
  // cannot identify
  return input;
}

for (let i = 0; i < input.length; i++) {
  const d = getCaliber(input[i]);
  console.log(d, '>>>>>', input[i]);
}