const input = require('./crystals');

const getCrystalCoating = input => {
  if (!input) return "";

  if (input.match(/sapphire( |-|_)*(coat|layer|treat)/i)) {
    return 'Sapphire';
  }
  if (((input.match(/non|anti|Anit|Anri|Ant/i) && input.match(/glare|reflex|rflective|relfective|reflctive|eflective|Refective|Refllective|Relective|reflect|glare/i)) || (input.match(/glare/i) && input.match(/proof/i))) && input.match(/interior\/exterior|double|inner side|both side|coating inside and out/i)) {
    return 'Both Side Anti Reflective';
  }
  if (input.match(/non|anti|Anit|Anri|Ant/i) && input.match(/glare|reflex|rflective|relfective|reflctive|eflective|Refective|Refllective|Relective|reflect|glare/i) || (input.match(/glare/i) && input.match(/proof/i))) {
    return 'Anti Reflective';
  }
  // cannot identify
  return "";
}

for (let i = 0; i < input.length; i++) {
  const m = getCrystalCoating(input[i]);
  console.log(m, '>>>>>', input[i]);
}