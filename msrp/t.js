function pad(value, length) {
    return (value.toString().length < length) ? pad(value + " ", length) : value;
}

const b = [
    { name: "Carven", id: 290 },
    { name: "Muehle Glashutte", id: 292 },
    { name: "A. Lange & Söhne", id: 293 },
    { name: "HYT", id: 310 },
];

console.log(pad(b[0].name, 60) + b[0].id)
console.log(pad(b[1].name, 60) + b[1].id)
console.log(pad(b[2].name, 60) + b[2].id)
console.log(pad(b[3].name, 60) + b[3].id)
