const bandM = require('./bandM');
// const bandM = require('./bandM1');

const getMaterials = (input, mainM = true) => {
	let bm = "";
	let bms = [];
	let goldAssigned = false;

	if ((input.match(/;/) && input.match(/ 2/i)) || input.match(/1\) /i)) {				// strap options, dont handle
		return { bm: "", bms: [], };
	}
	if (input.match(/stainless stee|Stainless[ -_]*Steel/i) || (input.match(/mesh/i) && (!(input.match(/alloy[ -_]*mesh/i))))) {
		bm = bm ? bm : 'Stainless Steel';
		bms.push('Stainless Steel')
	} else if (input.match(/Steel/i)) {
		bm = bm ? bm : 'Steel';
		bms.push('Steel')
	}
	if (input.match(/Titanium|Titanum|Tiatnium/i)) {
		bm = bm ? bm : 'Titanium';
		bms.push('Titanium')
	}
	if (input.match(/Platinum|Platinium/i)) {
		bm = bm ? bm : 'Platinum';
		bms.push('Platinum')
	}
	if (input.match(/18(k|kt|ct)[ -_]?(Eve)[ -_]?(rose)|(Eve)[ -_]?(rose)[ -_]?(gold)/i) && (!(input.match(/gold[s]?[ -_]?(((ion)[ -_]?)?plate|ip|grain|tone|pvd|trim)/i)))) {
		bm = bm ? bm : 'Everose Gold';
		bms.push('Everose Gold')
		goldAssigned = true;
	} else if (input.match(/(rose)[ -_]*[\(\s*pink\s*\)]?(gold)/i) && (!(input.match(/gold[s]?[ -_]?(((ion)[ -_]?)?plate|ip|grain|tone|pvd|trim)/i)))) {
		bm = bm ? bm : 'Rose Gold';
		bms.push('Rose Gold')
		goldAssigned = true;
	}
	if (input.match(/18(k|kt|ct)[ -_]?(sedna)|(sedna)[ -_]?(gold)/i) && (!(input.match(/gold[s]?[ -_]?(((ion)[ -_]?)?plate|ip|grain|tone|pvd|trim)/i)))) {
		bm = bm ? bm : 'Sedna Gold';
		bms.push('Sedna Gold')
		goldAssigned = true;
	}
	if (input.match(/18(k|kt|ct)[ -_]?(red)|(red)[ -_]?(gold)/i) && (!(input.match(/gold[s]?[ -_]?(((ion)[ -_]?)?plate|ip|grain|tone|pvd|trim)/i)))) {
		bm = bm ? bm : 'Red Gold';
		bms.push('Red Gold')
		goldAssigned = true;
	}
	if (input.match(/18(k|kt|ct)[ -_]?(king)|(king)[ -_]?(gold)/i) && (!(input.match(/ggold[s]?[ -_]?(((ion)[ -_]?)?plate|ip|grain|tone|pvd|trim)/i)))) {
		bm = bm ? bm : 'King Gold';
		bms.push('King Gold')
		goldAssigned = true;
	}
	if (input.match(/18(k|kt|ct)[ -_]?(pink)|(pink)[ -_]?(gold)/i) && (!(input.match(/gold[s]?[ -_]?(((ion)[ -_]?)?plate|ip|grain|tone|pvd|trim)/i)))) {
		bm = bm ? bm : 'Pink Gold';
		bms.push('Pink Gold')
		goldAssigned = true;
	}
	if (input.match(/18(k|kt|ct)[ -_]?(beige)|(beige)[ -_]?(gold)/i) && (!(input.match(/gold[s]?[ -_]?(((ion)[ -_]?)?plate|ip|grain|tone|pvd|trim)/i)))) {
		bm = bm ? bm : 'Beige Gold';
		bms.push('Beige Gold')
		goldAssigned = true;
	}
	if (input.match(/18(k|kt|ct)[ -_]?(white)|(white)[ -_]?(gold)/i) && (!(input.match(/gold[s]?[ -_]?(((ion)[ -_]?)?plate|ip|grain|tone|pvd|trim)/i)))) {
		bm = bm ? bm : 'White Gold';
		bms.push('White Gold')
		goldAssigned = true;
	}
	if (input.match(/18(k|kt|ct)[ -_]?(yellow)|(yellow)[ -_]?(gold)/i) && (!(input.match(/gold[s]?[ -_]?(((ion)[ -_]?)?plate|ip|grain|tone|pvd|trim)/i)))) {
		bm = bm ? bm : 'Yellow Gold';
		bms.push('Yellow Gold')
		goldAssigned = true;
	}
	if (!goldAssigned && input.match(/Gold/i) && (!(input.match(/gold[s]?[ -_]?(((ion)[ -_]?)?plate|ip|grain|tone|pvd|trim)/i))) && (!(input.match(/resin|rubber|leather/i)))) {
		bm = bm ? bm : 'Gold';
		bms.push('Gold')
	}
	if (input.match(/stingray|leathe|skin|Leather|Lizard|snake|shark|python|Ostrich|Leaher|Leahter|Suede|Horse|nubuck|letaher/i)) {
		bm = bm ? bm : 'Leather';
		bms.push('Leather')
	}
	if (input.match(/Alligarot|Alliagtor|Alligaor|Alligaror|(al(l)?igator)[\s-_]*(leather)?|lligator/i) && (!(input.match(/Alligator Motif/i)))) {
		bm = bm ? bm === 'Leather' ? 'Alligator Leather' : bm : 'Alligator Leather';
		const nbms = bms.filter(v => v !== 'Leather');
		bms = nbms;
		bms.push('Alligator Leather')
	}
	if (input.match(/(croc)(o)?(dile)?[\s-_]*(leather)?/i) && (!(input.match(/Crocoi-Emboss|(cro(c)?c)(o)?(dile)?[\s-_]*(patte|emb[r]?oss|texture)/i)))) {
		bm = bm ? bm === 'Leather' ? 'Crocodile Leather' : bm : 'Crocodile Leather';
		const nbms = bms.filter(v => v !== 'Leather');
		bms = nbms;
		bms.push('Crocodile Leather')
	}
	if (input.match(/(calf)[\s-_]*(skin)?[\s-_]?(leather)?|Calskin|Clafskin|Calkskin|alfskin/i)) {
		bm = bm ? bm === 'Leather' ? 'Calfskin Leather' : bm : 'Calfskin Leather';
		const nbms = bms.filter(v => v !== 'Leather');
		bms = nbms;
		bms.push('Calfskin Leather')
	}
	if (input.match(/Alloy|Aloy|Alloy Mesh/i)) {
		bm = bm ? bm : 'Alloy';
		bms.push('Alloy')
	}
	if (input.match(/Aluminium|Aluminum/i)) {
		bm = bm ? bm : 'Aluminium';
		bms.push('Aluminium')
	}
	if (input.match(/Base[\s-_]*Metal|Base Meta|metal/i)) {
		bm = bm ? bm : 'Base Metal';
		bms.push('Base Metal')
	}
	if (input.match(/Brass/i)) {
		bm = bm ? bm : 'Brass';
		bms.push('Brass')
	}
	if (input.match(/Acetate/i)) {
		bm = bm ? bm : 'Acetate';
		bms.push('Acetate');
	}
	if (input.match(/Acrylic/i)) {
		bm = bm ? bm : 'Acrylic';
		bms.push('Acrylic')
	}
	if (input.match(/Enamel/i)) {
		bm = bm ? bm : 'Enamel';
		bms.push('Enamel')
	}
	if (input.match(/Canvas/i)) {
		bm = bm ? bm : 'Canvas';
		bms.push('Canvas')
	}
	if (input.match(/Crystal/i)) {
		bm = bm ? bm : 'Crystal';
		bms.push('Crystal')
	}
	if (input.match(/Ceramic|Ceranic/i)) {
		bm = bm ? bm : 'Ceramic';
		bms.push('Ceramic')
	}
	if (input.match(/Nato|Textlie|denim|cloth|Frabric|Fabric|Linen|Textile|Farbic|Fabrik/i)) {
		bm = bm ? bm : 'Fabric';
		bms.push('Fabric')
	}
	if (input.match(/Nylon|nilon/i)) {
		bm = bm ? bm : 'Nylon';
		bms.push('Nylon')
	}
	if (input.match(/Plastic/i)) {
		bm = bm ? bm : 'Plastic';
		bms.push('Plastic')
	}
	if (input.match(/Resin/i)) {
		bm = bm ? bm : 'Resin';
		bms.push('Resin')
	}
	if (input.match(/Poly[\s-_]*carbon/i)) {
		bm = bm ? bm : 'Polycarbon';
		bms.push('Polycarbon')
	}
	if (input.match(/Poly[\s-_]*urethane/i)) {
		bm = bm ? bm : 'Polyurethane';
		bms.push('Polyurethane')
	}
	if (input.match(/Rubber|rubbe|ruuber|twin pro/i)) {
		bm = bm ? bm : 'Rubber';
		bms.push('Rubber')
	}
	if (input.match(/Satin/i) && (!(input.match(/satin[\s-_]*(Look|Brush|Cover|Finish|Over|Polish)/i)))) {
		bm = bm ? bm : 'Satin';
		bms.push('Satin')
	}
	if (input.match(/Slicone|Selicone?|Sil{1,2}icone?|Silcone/i)) {
		bm = bm ? bm : 'Silicone';
		bms.push('Silicone')
	}
	if (input.match(/Tungsten/i)) {
		bm = bm ? bm : 'Tungsten';
		bms.push('Tungsten')
	}
	if (input.match(/Wood/i)) {
		bm = bm ? bm : 'Wood';
		bms.push('Wood')
	}
	if (input.match(/Silver/i) && (!(input.match(/silver[s -_]?(((ion|ip)[ -_]?)?plate|grain|tone|pvd)/i)))) {
		bm = bm ? bm : 'Silver';
		bms.push('Silver')
	}
	if (input.match(/mother[ -_]?(of)?[ -_]?pearl/i)) {
		bm = bm ? bm : 'Mother of Pearl';
		bms.push('Mother of Pearl');
	}
	if (input.match(/Diamond|Diamon|diamod/i)) {
		bm = bm ? bm : 'Diamond';
		bms.push('Diamond')
	}
	// if (input.match(/material/i)) {
	// 	bm = bm ? bm : 'material';
	// 	bms.push('material')
	// }
	// if (input.match(/material/i)) {
	// 	bm = bm ? bm : 'material';
	// 	bms.push('material')
	// }

	if (bms.length === 0 && mainM) { //no match
		bm = input;
		bms.push(input);
	}
	return { bm, bms };
};

for (let i = 0; i < bandM.length; i++) {
	// let bandMx;
	// if (bandM[i].match(/ and /i)) {
	// 	bandMx = bandM[i].split('and');
	// } else if (bandM[i].match(/ with /i)) {
	// 	bandMx = bandM[i].split('with');
	// } else if (bandM[i].match(/\//)) {
	// 	bandMx = bandM[i].split('/');
	// } else if (bandM[i].match(/&/)) {
	// 	bandMx = bandM[i].split('&');
	// }

	let M = "";
	let MS = [];

	// if (bandMx && bandMx.length > 0) {
	// 	for (let j = 0; j < bandMx.length; j++) {
	// 		let mainM = false;
	// 		if (j === 0) mainM = true;
	// 		const { bm, bms } = getMaterials(bandMx[j], mainM);
	// 		if (bms.length > 0) {
	// 			M = M ? M : bm;
	// 			bms.forEach(v => {
	// 				if (MS.indexOf(v) < 0) MS.push(v);
	// 			})
	// 		}
	// 	}
	// } else {
	const { bm, bms } = getMaterials(bandM[i]);
	if (bms.length > 0) {
		M = M ? M : bm;
		bms.forEach(v => {
			if (MS.indexOf(v) < 0) MS.push(v);
		})
	}
	// }

	if (MS.length === 0) {
		console.log('zzzzzzzzzzzzzzzzzzzzzz', bandM[i]);
	} else {
		console.log(M, '>>>', bandM[i], '>>>', MS);
	}
}
