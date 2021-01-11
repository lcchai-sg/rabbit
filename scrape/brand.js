const generateBrandID = input => {
  if (!input) return { id: null, name: null };

  if (input.match(/rolex/i)) {
    return { "id": 1, "name": "Rolex" };
  }
  if (input.match(/tudor/i)) {
    return { "id": 2, "name": "Tudor" };
  }
  if (input.match(/vacheron[ -_]?constantin/i)) {
    return { "id": 3, "name": "Vacheron Constantin" };
  }
  if (input.match(/iwc/i)) {
    return { "id": 4, "name": "IWC" };
  }
  if (input.match(/montblanc/i)) {
    return { "id": 5, "name": "Montblanc" };
  }
  if (input.match(/jaeger[ -_]?lecoultre/i)) {
    return { "id": 16, "name": "Jaeger LeCoultre" };
  }
  if (input.match(/audemars[ -_]?piguet/i)) {
    return { "id": 18, "name": "Audemars Piguet" };
  }
  if (input.match(/omega/i)) {
    return { "id": 20, "name": "Omega" };
  }
  if (input.match(/patek[ -_](Philippe)?/i)) {
    return { "id": 22, "name": "Patek Philippe" };
  }
  if (input.match(/maurice[ -_]?lacroix/i)) {
    return { "id": 26, "name": "Maurice Lacroix" };
  }
  if (input.match(/cartier/i)) {
    return { "id": 28, "name": "Cartier" };
  }
  if (input.match(/franck[ -_]?muller/i)) {
    return { "id": 30, "name": "Franck Muller" };
  }
  if (input.match(/bulgari|bvlgari/i)) {
    return { "id": 32, "name": "Bvlgari" };
  }
  if (input.match(/chopard/i)) {
    return { "id": 44, "name": "Chopard" };
  }
  if (input.match(/hublot/i)) {
    return { "id": 46, "name": "Hublot" };
  }
  if (input.match(/blancpain/i)) {
    return { "id": 52, "name": "Blancpain" };
  }
  if (input.match(/tag[ -_]?heuer/i)) {
    return { "id": 54, "name": "TAG Heuer" };
  }
  if (input.match(/piaget/i)) {
    return { "id": 56, "name": "Piaget" };
  }
  if (input.match(/panerai/i)) {
    return { "id": 58, "name": "Panerai" };
  }
  if (input.match(/hamilton/i)) {
    return { "id": 62, "name": "Hamilton" };
  }
  if (input.match(/hermes/i)) {
    return { "id": 64, "name": "Hermes" };
  }
  if (input.match(/chanel/i)) {
    return { "id": 70, "name": "Chanel" };
  }
  if (input.match(/seiko/i)) {
    return { "id": 72, "name": "Seiko" };
  }
  if (input.match(/casio/i)) {
    return { "id": 76, "name": "Casio" };
  }
  if (input.match(/zenith/i)) {
    return { "id": 80, "name": "Zenith" };
  }
  if (input.match(/tissot/i)) {
    return { "id": 82, "name": "Tissot" };
  }
  if (input.match(/grand[ -_]?seiko/i)) {
    return { "id": 84, "name": "Grand Seiko" };
  }
  if (input.match(/citizen/i)) {
    return { "id": 86, "name": "Citizen" };
  }
  if (input.match(/gaga[ -_]?milano/i)) {
    return { "id": 96, "name": "Gaga Milano" };
  }
  if (input.match(/girard[ -_]?perregaux/i)) {
    return { "id": 98, "name": "Girard-Perregaux" };
  }
  if (input.match(/orient/i)) {
    return { "id": 100, "name": "Orient" };
  }
  if (input.match(/bell ?[-&]* ?ross|bell[ -_]?and[ -_]?ross/i)) {
    return { "id": 112, "name": "Bell & Ross" };
  }
  if (input.match(/breitling/i)) {
    return { "id": 118, "name": "Breitling" };
  }
  if (input.match(/longines/i)) {
    return { "id": 120, "name": "Longines" };
  }
  if (input.match(/louis[ -_]?vuitton/i)) {
    return { "id": 130, "name": "Louis Vuitton" };
  }
  if (input.match(/breguet/i)) {
    return { "id": 132, "name": "Breguet" };
  }
  if (input.match(/nomos|Nomos[ -_]Glash[uü]tte/i)) {
    return { "id": 134, "name": "Nomos Glashutte" };
  }
  if (input.match(/seve[nr][ -_]friday/i)) {
    return { "id": 142, "name": "Sevenfriday" };
  }
  if (input.match(/about[ -_]?vintage/i)) {
    return { "id": 152, "name": "About Vintage" };
  }
  if (input.match(/fr[ée]d[ée]rique[ -_]?constant/i)) {
    return { "id": 154, "name": "Frédérique Constant" };
  }
  if (input.match(/gucci/i)) {
    return { "id": 156, "name": "Gucci" };
  }
  if (input.match(/parmigiani[ -_](Fleurier)?/i)) {
    return { "id": 158, "name": "Parmigiani Fleurier" };
  }
  if (input.match(/rado/i)) {
    return { "id": 160, "name": "Rado" };
  }
  if (input.match(/ulysse|ulysse[ -_]?nardin/i)) {
    return { "id": 162, "name": "Ulysse Nardin" };
  }
  if (input.match(/oris/i)) {
    return { "id": 164, "name": "Oris" };
  }
  if (input.match(/Glash[üu]tte[ -_]?(Original)?/i)) {
    return { "id": 168, "name": "Glashutte Original" };
  }
  if (input.match(/mido/i)) {
    return { "id": 172, "name": "Mido" };
  }
  if (input.match(/jaquet[ -_]?droz/i)) {
    return { "id": 174, "name": "Jaquet Droz" };
  }
  if (input.match(/gerald[ -_]?genta/i)) {
    return { "id": 176, "name": "Gerald Genta" };
  }
  if (input.match(/baume ?(&|-|(et|and))* ?mercier/i)) {
    return { id: 178, name: "Baume et Mercier" };
  }
  if (input.match(/sinn/i)) {
    return { "id": 180, "name": "Sinn" };
  }
  if (input.match(/suunto/i)) {
    return { id: 184, name: 'Suunto' };
  }
  if (input.match(/cvstos/i)) {
    return { id: 186, name: 'Cvstos' };
  }
  if (input.match(/ball/i)) {
    return { id: 188, name: 'Ball' };
  }
  if (input.match(/Michael[ -_]?Kors/i)) {
    return { "id": 190, "name": "Michael Kors" };
  }
  if (input.match(/Hugo[ -_]Boss/i)) {
    return { "id": 192, "name": "Hugo Boss" };
  }
  if (input.match(/Marc[ -_]?Jacobs/i)) {
    return { "id": 214, "name": "Marc Jacobs" };
  }
  if (input.match(/Marc By Marc Jacobs|MarcByMarcJacobs|Marc-By-Marc-Jacobs/i)) {
    return { "id": 216, "name": "Marc By Marc Jacobs" };
  }
  if (input.match(/Emporio[ -_]?(Armani)?|Armani/i)) {
    return { "id": 218, "name": "Emporio Armani" };
  }
  if (input.match(/Skagen/i)) {
    return { "id": 240, "name": "Skagen" };
  }
  if (input.match(/Diesel/i)) {
    return { "id": 244, "name": "Diesel" };
  }
  if (input.match(/Guess/i)) {
    return { "id": 250, "name": "Guess" };
  }
  if (input.match(/Tommy[ -_]?Hilfiger/i)) {
    return { "id": 252, "name": "Tommy Hilfiger" };
  }
  if (input.match(/Tutima[ -_]?(Glashutte)?/i)) {
    return { "id": 254, "name": "Tutima Glashutte" };
  }
  if (input.match(/memorigin/i)) {
    return { "id": 256, "name": "Memorigin" };
  }
  if (input.match(/Bulova|accutron/i)) {
    return { "id": 268, "name": "Bulova" };
  }
  if (input.match(/MeisterSinger/i)) {
    return { "id": 280, "name": "MeisterSinger" };
  }
  if (input.match(/Briston/i)) {
    return { "id": 282, "name": "Briston" };
  }
  if (input.match(/Alpina/i)) {
    return { "id": 288, "name": "Alpina" };
  }
  if (input.match(/m[uü](e)?hle[ -_]?glashu(e)?tte/i)) {
    return { "id": 292, "name": "Mühle Glashütte" };
  }
  if (input.match(/a[. -]*lange[ -_]*(and|&)?[ -_]*(sohne|Söhne)/i)) {
    return { "id": 293, "name": "A. Lange & Sohne" };
  }
  if (input.match(/HYT/i)) {
    return { "id": 310, "name": "HYT" };
  }

  // no brandID
  if (input.match(/avi-?8/i)) {
    return { "id": null, "name": "Avi-8" };
  }
  if (input.match(/arnold & son|arnold-and-son|arnold-son|arnoldson/i)) {
    return { "id": null, "name": "Arnold and Son" };
  }
  if (input.match(/Boucheron/i)) {
    return { "id": null, "name": "Boucheron" };
  }
  if (input.match(/Bovet/i)) {
    return { "id": null, "name": "Bovet" };
  }
  if (input.match(/Chaumet/i)) {
    return { "id": null, "name": "Chaumet" };
  }
  if (input.match(/Corum/i)) {
    return { "id": null, "name": "Corum" };
  }
  if (input.match(/Cyrus/i)) {
    return { "id": null, "name": "Cyrus" };
  }
  if (input.match(/Czapek/i)) {
    return { "id": null, "name": "Czapek" };
  }
  if (input.match(/christian[ -_]?(Dior)?|Dior/i)) {
    return { "id": null, "name": "Dior" };
  }
  if (input.match(/h-moser-cie/i)) {
    return { "id": null, "name": "H. Moser & Cie" };
  }
  if (input.match(/jacob-co|jacob&co|jacob co|jacob-and-co|jacob & co/i)) {
    return { "id": null, "name": "Jacob & Co." };
  }
  if (input.match(/Perrelet/i)) {
    return { "id": null, "name": "Perrelet" };
  }
  if (input.match(/Porsche/i)) {
    return { "id": null, "name": "Porsche" };
  }
  if (input.match(/Roger[ -_]?Dubuis/i)) {
    return { "id": null, "name": "Roger Dubuis" };
  }
  if (input.match(/Romain[ -_]?Jerome/i)) {
    return { "id": null, "name": "Romain Jerome" };
  }
  if (input.match(/U[ -_]?Boat/i)) {
    return { "id": null, "name": "U-Boat" };
  }
  if (input.match(/Bedat/i)) {
    return { "id": null, "name": "Bedat" };
  }
  if (input.match(/Burberry/i)) {
    return { "id": null, "name": "Burberry" };
  }
  if (input.match(/Coach/i)) {
    return { "id": null, "name": "Coach" };
  }
  if (input.match(/Ebel/i)) {
    return { "id": null, "name": "Ebel" };
  }
  if (input.match(/Eterna/i)) {
    return { "id": null, "name": "Eterna" };
  }
  if (input.match(/activa|Invicta/i)) {
    return { "id": null, "name": "Invicta" };
  }
  if (input.match(/Luminox/i)) {
    return { "id": null, "name": "Luminox" };
  }
  if (input.match(/Michele/i)) {
    return { "id": null, "name": "Michele" };
  }
  if (input.match(/ESQ by Movado|Movado/i)) {
    return { "id": null, "name": "Movado" };
  }
  if (input.match(/Swatch/i)) {
    return { "id": null, "name": "Swatch" };
  }
  if (input.match(/versus|Versace/i)) {
    return { "id": null, "name": "Versace" };
  }
  if (input.match(/Carl F. Bucherer|Carl-F-Bucherer|CarlFBucherer/i)) {
    return { "id": null, "name": "Carl F. Bucherer" };
  }
  if (input.match(/Harry[ -_]?Winston/i)) {
    return { "id": null, "name": "Harry Winston" };
  }
  if (input.match(/Juicy[ -_]?Couture/i)) {
    return { "id": null, "name": "Juicy Couture" };
  }
  if (input.match(/Philip[ -_]?Stein/i)) {
    return { "id": null, "name": "Philip Stein" };
  }
  if (input.match(/raymond|Raymond[ -_]?(Weil)?/i)) {
    return { "id": null, "name": "Raymond Weil" };
  }
  if (input.match(/Ferragamo|Salvatore[ -_]?Ferragamo/i)) {
    return { "id": null, "name": "Salvatore Ferragamo" };
  }
  if (input.match(/Van[ -_]?Cleef/i)) {
    return { "id": null, "name": "Van Cleef" };
  }
  if (input.match(/Victorinox|Victorinox Swiss Army|VictorinoxSwissArmy|Victorinox-Swiss-Army/i)) {
    return { "id": null, "name": "Victorinox Swiss Army" };
  }
  if (input.match(/Adee[ -_]?Kaye?/i)) {
    return { "id": null, "name": "Adee Kaye" };
  }
  if (input.match(/Adidas|Adiddas/i)) {
    return { "id": null, "name": "Adidas" };
  }
  if (input.match(/Aerowatch/i)) {
    return { "id": null, "name": "Aerowatch" };
  }
  if (input.match(/Akribos[ -_]?(XXIV)?/i)) {
    return { "id": null, "name": "Akribos XXIV" };
  }
  if (input.match(/Anne[ -_]?Klein/i)) {
    return { "id": null, "name": "Anne Klein" };
  }
  if (input.match(/Anonimo/i)) {
    return { "id": null, "name": "Anonimo" };
  }
  if (input.match(/Apple/i)) {
    return { "id": null, "name": "Apple" };
  }
  if (input.match(/Azimuth/i)) {
    return { "id": null, "name": "Azimuth" };
  }
  if (input.match(/Armand[ -_]?Nicolet/i)) {
    return { "id": null, "name": "Armand Nicolet" };
  }
  if (input.match(/Armani[ -_]?Exchange|Armani-Ex/i)) {
    return { "id": null, "name": "Armani Exchange" };
  }
  if (input.match(/August[ -_]?Steiner/i)) {
    return { "id": null, "name": "August Steiner" };
  }
  if (input.match(/Azzaro/i)) {
    return { "id": null, "name": "Azzaro" };
  }
  if (input.match(/Ben( |(and)|&|-)*Sons/i)) {
    return { "id": null, "name": "Ben and Sons" };
  }
  if (input.match(/Bertha/i)) {
    return { "id": null, "name": "Bertha" };
  }
  if (input.match(/Breed/i)) {
    return { "id": null, "name": "Breed" };
  }
  if (input.match(/Bremont/i)) {
    return { "id": null, "name": "Bremont" };
  }
  if (input.match(/Brooklyn|Brooklyn Watch Co|Brooklyn-Watch-Co|BrooklynWatchCo/i)) {
    return { "id": null, "name": "Brooklyn Watch Co." };
  }
  if (input.match(/Bruno[ -_]?Magli/i)) {
    return { "id": null, "name": "Bruno Magli" };
  }
  if (input.match(/Bull|Bull[ -_]?Titanium/i)) {
    return { "id": null, "name": "Bull Titanium" };
  }
  if (input.match(/Burgi/i)) {
    return { "id": null, "name": "Burgi" };
  }
  if (input.match(/cabochon/i)) {
    return { "id": null, "name": "Cabochon" };
  }
  if (input.match(/Calibre/i)) {
    return { "id": null, "name": "Calibre" };
  }
  if (input.match(/Calvin[ -_]?Klein/i)) {
    return { "id": null, "name": "Calvin Klein" };
  }
  if (input.match(/Caribbean[ -_]?Joe/i)) {
    return { "id": null, "name": "Caribbean Joe" };
  }
  if (input.match(/Certina/i)) {
    return { "id": null, "name": "Certina" };
  }
  if (input.match(/Charmex/i)) {
    return { "id": null, "name": "Charmex" };
  }
  if (input.match(/Charriol/i)) {
    return { "id": null, "name": "Charriol" };
  }
  if (input.match(/Christofle/i)) {
    return { "id": null, "name": "Christofle" };
  }
  if (input.match(/Chronoswiss/i)) {
    return { "id": null, "name": "Chronoswiss" };
  }
  if (input.match(/Cluse/i)) {
    return { "id": null, "name": "Cluse" };
  }
  if (input.match(/Concord/i)) {
    return { "id": null, "name": "Concord" };
  }
  if (input.match(/Crayo/i)) {
    return { "id": null, "name": "Crayo" };
  }
  if (input.match(/Cuervo Y Sobrinos|CuervoYSobrinos|Cuervo-Y-Sobrinos/i)) {
    return { "id": null, "name": "Cuervo Y Sobrinos" };
  }
  if (input.match(/D1[ -_]?Milano/i)) {
    return { "id": null, "name": "D1 Milano" };
  }
  if (input.match(/DKNY/i)) {
    return { "id": null, "name": "DKNY" };
  }
  if (input.match(/Daniel[ -_]?Wellington/i)) {
    return { "id": null, "name": "Daniel Wellington" };
  }
  if (input.match(/Davidoff/i)) {
    return { "id": null, "name": "Davidoff" };
  }
  if (input.match(/De[ -_]?Grisogono/i)) {
    return { "id": null, "name": "De Grisogono" };
  }
  if (input.match(/DeWitt/i)) {
    return { "id": null, "name": "DeWitt" };
  }
  if (input.match(/Deep[ -_]?Blue/i)) {
    return { "id": null, "name": "Deep Blue" };
  }
  if (input.match(/Diadora/i)) {
    return { "id": null, "name": "Diadora" };
  }
  if (input.match(/dolce|Dolce & Gabbana|DolceGabbana|Dolce-Gabbana|Dolce-and-Gabbana/i)) {
    return { "id": null, "name": "Dolce & Gabbana" };
  }
  if (input.match(/Earth/i)) {
    return { "id": null, "name": "Earth" };
  }
  if (input.match(/Eberhard and Co|EberhardandCo|Eberhard-and-Co|Eberhard-Co|EberhardCo|eberhard-chrono-4/i)) {
    return { "id": null, "name": "Eberhard and Co" };
  }
  if (input.match(/Edox/i)) {
    return { "id": null, "name": "Edox" };
  }
  if (input.match(/Elevon/i)) {
    return { "id": null, "name": "Elevon" };
  }
  if (input.match(/Elini[ -_]?Barokas/i)) {
    return { "id": null, "name": "Elini Barokas" };
  }
  if (input.match(/Ellen[ -_]?Tracy/i)) {
    return { "id": null, "name": "Ellen Tracy" };
  }
  if (input.match(/Elysee/i)) {
    return { "id": null, "name": "Elysee" };
  }
  if (input.match(/Empress/i)) {
    return { "id": null, "name": "Empress" };
  }
  if (input.match(/Enicar/i)) {
    return { "id": null, "name": "Enicar" };
  }
  if (input.match(/Equipe/i)) {
    return { "id": null, "name": "Equipe" };
  }
  if (input.match(/Equipe[ -_]?Tritium/i)) {
    return { "id": null, "name": "Equipe Tritium" };
  }
  if (input.match(/Ernest[ -_]?Borel/i)) {
    return { "id": null, "name": "Ernest Borel" };
  }
  if (input.match(/Eterna/i)) {
    return { "id": null, "name": "Eterna" };
  }
  if (input.match(/Fendi/i)) {
    return { "id": null, "name": "Fendi" };
  }
  if (input.match(/Ferrari/i)) {
    return { "id": null, "name": "Ferrari" };
  }
  if (input.match(/Ferre[ -_]?Milano/i)) {
    return { "id": null, "name": "Ferre Milano" };
  }
  if (input.match(/Fiyta/i)) {
    return { "id": null, "name": "Fiyta" };
  }
  if (input.match(/Fortis/i)) {
    return { "id": null, "name": "Fortis" };
  }
  if (input.match(/Fossil/i)) {
    return { "id": null, "name": "Fossil" };
  }
  if (input.match(/Furla/i)) {
    return { "id": null, "name": "Furla" };
  }
  if (input.match(/Avio[ -_]?Milano|Gevril|gv2/i)) {
    return { "id": null, "name": "Gevril" };
  }
  if (input.match(/Geoffrey[ -_]?Beene/i)) {
    return { "id": null, "name": "Geoffrey Beene" };
  }
  if (input.match(/Giorgio Fedon 1919|GiorgioFedon1919|Giorgio-Fedon-1919/i)) {
    return { "id": null, "name": "Giorgio Fedon 1919" };
  }
  if (input.match(/Glycine/i)) {
    return { "id": null, "name": "Glycine" };
  }
  if (input.match(/Graff/i)) {
    return { "id": null, "name": "Graff" };
  }
  if (input.match(/Graham/i)) {
    return { "id": null, "name": "Graham" };
  }
  if (input.match(/Grovana/i)) {
    return { "id": null, "name": "Grovana" };
  }
  if (input.match(/Guy[ -_]?Laroche/i)) {
    return { "id": null, "name": "Guy Laroche" };
  }
  if (input.match(/HYT/i)) {
    return { "id": null, "name": "HYT" };
  }
  if (input.match(/Haemmer/i)) {
    return { "id": null, "name": "Haemmer" };
  }
  if (input.match(/Harry[ -_]?Potter/i)) {
    return { "id": null, "name": "Harry Potter" };
  }
  if (input.match(/Hautlence/i)) {
    return { "id": null, "name": "Hautlence" };
  }
  if (input.match(/Haurex[ -_]?(Italy)?/i)) {
    return { "id": null, "name": "Haurex Italy" };
  }
  if (input.match(/Henry[ -_]?London/i)) {
    return { "id": null, "name": "Henry London" };
  }
  if (input.match(/Heritor/i)) {
    return { "id": null, "name": "Heritor" };
  }
  if (input.match(/Ice[ -_]?Watch/i)) {
    return { "id": null, "name": "Ice-Watch" };
  }
  if (input.match(/Issey[ -_]?Miyake/i)) {
    return { "id": null, "name": "Issey Miyake" };
  }
  if (input.match(/JBW/i)) {
    return { "id": null, "name": "JBW" };
  }
  if (input.match(/Jacques[ -_]?Lemans/i)) {
    return { "id": null, "name": "Jacques Lemans" };
  }
  if (input.match(/Jaermann and Stubi|JaermannandStubi|Jaermann-and-Stubi|JaermannStubi|Jaermann-Stubi/i)) {
    return { "id": null, "name": "Jaermann and Stubi" };
  }
  if (input.match(/Jessica[ -_]?Simpson/i)) {
    return { "id": null, "name": "Jessica Simpson" };
  }
  if (input.match(/Jivago/i)) {
    return { "id": null, "name": "Jivago" };
  }
  if (input.match(/Johan[ -_]?Eric/i)) {
    return { "id": null, "name": "Johan Eric" };
  }
  if (input.match(/Joshua and Sons|JoshuaandSons|Joshua-and-Sons|JoshuaSons|Joshua-Sons/i)) {
    return { "id": null, "name": "Joshua and Sons" };
  }
  if (input.match(/Junghans/i)) {
    return { "id": null, "name": "Junghans" };
  }
  if (input.match(/Just[ -_]?Cavalli/i)) {
    return { "id": null, "name": "Just Cavalli" };
  }
  if (input.match(/Kate[ -_]?Spade/i)) {
    return { "id": null, "name": "Kate Spade" };
  }
  if (input.match(/Komono/i)) {
    return { "id": null, "name": "Komono" };
  }
  if (input.match(/Lacoste|Lacost/i)) {
    return { "id": null, "name": "Lacoste" };
  }
  if (input.match(/Lalique/i)) {
    return { "id": null, "name": "Lalique" };
  }
  if (input.match(/Lamborghini/i)) {
    return { "id": null, "name": "Lamborghini" };
  }
  if (input.match(/Lucien[ -_]?(Piccard)?/i)) {
    return { "id": null, "name": "Lucien Piccard" };
  }
  if (input.match(/Luminox/i)) {
    return { "id": null, "name": "Luminox" };
  }
  if (input.match(/MB&F|MB-F/i)) {
    return { "id": null, "name": "MB&F" };
  }
  if (input.match(/MVMT/i)) {
    return { "id": null, "name": "MVMT" };
  }
  if (input.match(/Madison/i)) {
    return { "id": null, "name": "Madison" };
  }
  if (input.match(/Maserati/i)) {
    return { "id": null, "name": "Maserati" };
  }
  if (input.match(/Mathey[ -_]?Tissot/i)) {
    return { "id": null, "name": "Mathey-Tissot" };
  }
  if (input.match(/Michele/i)) {
    return { "id": null, "name": "Michele" };
  }
  if (input.match(/Milus/i)) {
    return { "id": null, "name": "Milus" };
  }
  if (input.match(/Momo Design|MomoDesign|Momo-Design/i)) {
    return { "id": null, "name": "Momo Design" };
  }
  if (input.match(/Mondaine/i)) {
    return { "id": null, "name": "Mondaine" };
  }
  if (input.match(/Montegrappa/i)) {
    return { "id": null, "name": "Montegrappa" };
  }
  if (input.match(/Morphic/i)) {
    return { "id": null, "name": "Morphic" };
  }
  if (input.match(/Mr[ -.]? ?Jones/i)) {
    return { "id": null, "name": "Mr. Jones" };
  }
  if (input.match(/Nautica/i)) {
    return { "id": null, "name": "Nautica" };
  }
  if (input.match(/Nixon/i)) {
    return { "id": null, "name": "Nixon" };
  }
  if (input.match(/Obaku/i)) {
    return { "id": null, "name": "Obaku" };
  }
  if (input.match(/Oceanaut/i)) {
    return { "id": null, "name": "Oceanaut" };
  }
  if (input.match(/Olivia[ -_]?Burton/i)) {
    return { "id": null, "name": "Olivia Burton" };
  }
  if (input.match(/Oniss/i)) {
    return { "id": null, "name": "Oniss" };
  }
  if (input.match(/Timex/i)) {
    return { "id": null, "name": "Timex" };
  }
  if (input.match(/A[ -_]?Line/i)) {
    return { "id": null, "name": "A_Line" };
  }
  if (input.match(/Paul[ -_]?Picot/i)) {
    return { "id": null, "name": "Paul Picot" };
  }
  if (input.match(/Perrelet/i)) {
    return { "id": null, "name": "Perrelet" };
  }
  if (input.match(/Philip[ -_]?Stein/i)) {
    return { "id": null, "name": "Philip Stein" };
  }
  if (input.match(/Picasso and Co|PicassoandCo|Picasso-and-Co|Picasso-Co|PicassoCo/i)) {
    return { "id": null, "name": "Picasso and Co" };
  }
  if (input.match(/Pulsar/i)) {
    return { "id": null, "name": "Pulsar" };
  }
  if (input.match(/Ralph[ -_]?Lauren/i)) {
    return { "id": null, "name": "Ralph Lauren" };
  }
  if (input.match(/Rapport[ -_]?London/i)) {
    return { "id": null, "name": "Rapport London" };
  }
  if (input.match(/Rebel/i)) {
    return { "id": null, "name": "Rebel" };
  }
  if (input.match(/Red[ -_]?Line/i)) {
    return { "id": null, "name": "Red Line" };
  }
  if (input.match(/Reign/i)) {
    return { "id": null, "name": "Reign" };
  }
  if (input.match(/Ren[ée][ -_]?Mouris?/i)) {
    return { "id": null, "name": "René Mouri" };
  }
  if (input.match(/Revue[ -_]?Thommen/i)) {
    return { "id": null, "name": "Revue Thommen" };
  }
  if (input.match(/Richard[ -_]?Mille/i)) {
    return { "id": null, "name": "Richard Mille" };
  }
  if (input.match(/Roamer/i)) {
    return { "id": null, "name": "Roamer" };
  }
  if (input.match(/Roberto[ -_]?Cavalli/i)) {
    return { "id": null, "name": "Roberto Cavalli" };
  }
  if (input.match(/Roger[ -_]?Dubuis/i)) {
    return { "id": null, "name": "Roger Dubuis" };
  }
  if (input.match(/Romain[ -_]?Jerome/i)) {
    return { "id": null, "name": "Romain Jerome" };
  }
  if (input.match(/S[ -_]?Coifman/i)) {
    return { "id": null, "name": "S Coifman" };
  }
  if (input.match(/Saint[ -_]?Honore/i)) {
    return { "id": null, "name": "Saint Honore" };
  }
  if (input.match(/Shield/i)) {
    return { "id": null, "name": "Shield" };
  }
  if (input.match(/Shinola/i)) {
    return { "id": null, "name": "Shinola" };
  }
  if (input.match(/Simplify/i)) {
    return { "id": null, "name": "Simplify" };
  }
  if (input.match(/Snyper/i)) {
    return { "id": null, "name": "Snyper" };
  }
  if (input.match(/Sophie and Freda|SophieandFreda|Sophie-and-Freda|SophieFreda|Sophie-Freda/i)) {
    return { "id": null, "name": "Sophie and Freda" };
  }
  if (input.match(/Steinhausen/i)) {
    return { "id": null, "name": "Steinhausen" };
  }
  if (input.match(/Swarovski/i)) {
    return { "id": null, "name": "Swarovski" };
  }
  if (input.match(/Swiss[ -_]?Legend/i)) {
    return { "id": null, "name": "Swiss Legend" };
  }
  if (input.match(/Swiss[ -_]?Military/i)) {
    return { "id": null, "name": "Swiss Military" };
  }
  if (input.match(/Swiss[ -_]?Alpine/i)) {
    return { "id": null, "name": "Swiss Alpine" };
  }
  if (input.match(/TW[ -_]?Steel/i)) {
    return { "id": null, "name": "TW Steel" };
  }
  if (input.match(/Technomarine/i)) {
    return { "id": null, "name": "Technomarine" };
  }
  if (input.match(/Thomas[ -_]?Earnshaw/i)) {
    return { "id": null, "name": "Thomas Earnshaw" };
  }
  if (input.match(/Tory[ -_]?Burch/i)) {
    return { "id": null, "name": "Tory Burch" };
  }
  if (input.match(/Valentino[ -_]?(Garavani)?/i)) {
    return { "id": null, "name": "Valentino Garavani" };
  }
  if (input.match(/Ventura/i)) {
    return { "id": null, "name": "Ventura" };
  }
  if (input.match(/Vulcain/i)) {
    return { "id": null, "name": "Vulcain" };
  }
  if (input.match(/Waldhoff/i)) {
    return { "id": null, "name": "Waldhoff" };
  }
  if (input.match(/William L 1985|WilliamL1985|William-L-1985/i)) {
    return { "id": null, "name": "William L 1985" };
  }
  if (input.match(/Wolf/i)) {
    return { "id": null, "name": "Wolf" };
  }
  if (input.match(/Zeno/i)) {
    return { "id": null, "name": "Zeno" };
  }
  if (input.match(/Zodiac/i)) {
    return { "id": null, "name": "Zodiac" };
  }
  if (input.match(/Amour/i)) {
    return { "id": null, "name": "Amour" };
  }
  if (input.match(/Bausele/i)) {
    return { "id": null, "name": "Bausele" };
  }
  if (input.match(/Boum/i)) {
    return { "id": null, "name": "Boum" };
  }
  if (input.match(/Brera[ -_]?rologi/i)) {
    return { "id": null, "name": "Brera Orologi" };
  }
  if (input.match(/Chronotech/i)) {
    return { "id": null, "name": "Chronotech" };
  }
  if (input.match(/D[. -]?Factory/i)) {
    return { "id": null, "name": "D.Factory" };
  }
  if (input.match(/Danish[ -_]?Design/i)) {
    return { "id": null, "name": "Danish Design" };
  }
  if (input.match(/David[ -_]?Yurman/i)) {
    return { "id": null, "name": "David Yurman" };
  }
  if (input.match(/Delaneau/i)) {
    return { "id": null, "name": "Delaneau" };
  }
  if (input.match(/Dubey ?[&-] ?Schaldenbrand/i)) {
    return { "id": null, "name": "Dubey & Schaldenbrand" };
  }
  if (input.match(/Ed[ -_]?Hardy/i)) {
    return { "id": null, "name": "Ed Hardy" };
  }
  if (input.match(/Fitbit/i)) {
    return { "id": null, "name": "Fitbit" };
  }
  if (input.match(/Franc[ -_]?Vila/i)) {
    return { "id": null, "name": "Franc Vila" };
  }
  if (input.match(/Generic/i)) {
    return { "id": null, "name": "Generic" };
  }
  if (input.match(/Glam[ -_]?Rock/i)) {
    return { "id": null, "name": "Glam Rock" };
  }
  if (input.match(/IKE[ -_]?Milano/i)) {
    return { "id": null, "name": "IKE Milano" };
  }
  if (input.match(/Jean[ -_]?Richard/i)) {
    return { "id": null, "name": "Jean Richard" };
  }
  if (input.match(/Jet[ -_]?Set/i)) {
    return { "id": null, "name": "Jet Set" };
  }
  if (input.match(/Jill[ -_]?Stuart/i)) {
    return { "id": null, "name": "Jill Stuart" };
  }
  if (input.match(/Lancaster/i)) {
    return { "id": null, "name": "Lancaster" };
  }
  if (input.match(/Mos/i)) {
    return { "id": null, "name": "Mos" };
  }
  if (input.match(/Mulco/i)) {
    return { "id": null, "name": "Mulco" };
  }
  if (input.match(/Nike/i)) {
    return { "id": null, "name": "Nike" };
  }
  if (input.match(/Polar/i)) {
    return { "id": null, "name": "Polar" };
  }
  if (input.match(/Police/i)) {
    return { "id": null, "name": "Police" };
  }
  if (input.match(/Puma/i)) {
    return { "id": null, "name": "Puma" };
  }
  if (input.match(/Spinnaker/i)) {
    return { "id": null, "name": "Spinnaker" };
  }
  if (input.match(/Tiffany & Co./i)) {
    return { "id": null, "name": "Tiffany & Co." };
  }
  if (input.match(/Timeforce/i)) {
    return { "id": null, "name": "Timeforce" };
  }
  if (input.match(/Vestal/i)) {
    return { "id": null, "name": "Vestal" };
  }
  if (input.match(/Wenger/i)) {
    return { "id": null, "name": "Wenger" };
  }
  // if (input.match(/placeholder/i)) {
  //   return { "id": null, "name": "placeholder" };
  // }
  // if (input.match(/placeholder/i)) {
  //   return { "id": null, "name": "placeholder" };
  // }
  // if (input.match(/placeholder/i)) {
  //   return { "id": null, "name": "placeholder" };
  // }
  // if (input.match(/placeholder/i)) {
  //   return { "id": null, "name": "placeholder" };
  // }
  // if (input.match(/placeholder/i)) {
  //   return { "id": null, "name": "placeholder" };
  // }
  // if (input.match(/placeholder/i)) {
  //   return { "id": null, "name": "placeholder" };
  // }
  // if (input.match(/placeholder/i)) {
  //   return { "id": null, "name": "placeholder" };
  // }
  // unknown brand
  return { id: null, name: null };
}

module.exports = generateBrandID;