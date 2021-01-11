const input = require('./bezel');

const getBezel = input => {
  if (!input) return "";

  if (input.match(/Plain/i)) {
    return "Plain";
  }
  if (input.match(/Dive|uni[ -_]?direction/i)) {
    return "Dive";
  }
  if (input.match(/Countdown/i)) {
    return "Countdown";
  }
  if (input.match(/Tachymeter/i)) {
    return "Tachymeter";
  }
  if (input.match(/Telemeter/i)) {
    return "Telemeter";
  }
  if (input.match(/GMT/i)) {
    return "GMT";
  }
  if (input.match(/Compass/i)) {
    return "Compass";
  }
  if (input.match(/Yacht[ -_]?Timer/i)) {
    return "Yacht-Timer";
  }
  if (input.match(/Pulsometer/i)) {
    return "Pulsometer";
  }
  if (input.match(/Slide[ -_]?Rule/i)) {
    return "Slide Rule";
  }
  // cannot identify
  return 'NO';
}

for (let i = 0; i < input.length; i++) {
  const c = getBezel(input[i]);
  console.log(c, '>>>>>', input[i]);
}