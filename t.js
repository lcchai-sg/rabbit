let m = new RegExp('push-? ?button-? ?deployant-? ?clasp', 'i');

let c = [
  'push button deployant clasp',
  'Push Button Deployant Clasp',
  'push-button deployant clasp',
  'push-button deployant-clasp',
  'push-button deployant clasp',
  'push-button-deployant-clasp',
  'push button-deployant-clasp',
  'push buton deployant clasp',
  'push button deploynt clasp',
  'gold-tone strap with push button deployant clasp'
]

c.forEach(v => {
  if (v.match(m)) {
    console.log('MATCH >>>', v)
  } else {
    console.log('        NOT MATCH >>>', v)
  }
})