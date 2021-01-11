const generateBrandID = input => {
  if (!input) return { id: null, name: null };

  if (input.match(/suunto/i)) {
    return { id: 184, name: 'Suunto' };
  }
  if (input.match(/cvstos/i)) {
    return { id: 186, name: 'Cvstos' };
  }
  if (input.match(/ball/i)) {
    return { id: 188, name: 'Ball' };
  }
  if (input.match(/baume et mercier|baumeetmercier|baume-et-mercier|baumemercier|baume-mercier/i)) {
    return { id: 178, name: "Baume et Mercier" };
  }
  if (input.match(/gerald genta|geraldgenta|gerald-genta/i)) {
    return { "id": 176, "name": "Gerald Genta" };
  }
  if (input.match(/sinn/i)) {
    return { "id": 180, "name": "Sinn" };
  }
  if (input.match(/rolex/i)) {
    return { "id": 1, "name": "Rolex" };
  }
  if (input.match(/tudor/i)) {
    return { "id": 2, "name": "Tudor" };
  }
  if (input.match(/aboutvintage|about vintage|about-vintage/i)) {
    return { "id": 152, "name": "About Vintage" };
  }
  if (input.match(/audemarspiguet|audemars piguet|audemars-piguet/i)) {
    return { "id": 18, "name": "Audemars Piguet" };
  }
  if (input.match(/bellross|bell ross|bell-ross|bell&ross|bell & ross|bell and ross|bell-and-ross|bellandross/i)) {
    return { "id": 112, "name": "Bell & Ross" };
  }
  if (input.match(/blancpain/i)) {
    return { "id": 52, "name": "Blancpain" };
  }
  if (input.match(/breguet/i)) {
    return { "id": 132, "name": "Breguet" };
  }
  if (input.match(/breitling/i)) {
    return { "id": 118, "name": "Breitling" };
  }
  if (input.match(/bulgari|bvlgari/i)) {
    return { "id": 32, "name": "Bvlgari" };
  }
  if (input.match(/cartier/i)) {
    return { "id": 28, "name": "Cartier" };
  }
  if (input.match(/casio/i)) {
    return { "id": 76, "name": "Casio" };
  }
  if (input.match(/chanel/i)) {
    return { "id": 70, "name": "Chanel" };
  }
  if (input.match(/chopard/i)) {
    return { "id": 44, "name": "Chopard" };
  }
  if (input.match(/citizen/i)) {
    return { "id": 86, "name": "Citizen" };
  }
  if (input.match(/frédérique constant|frederiqueconstant|frederique constant|frederique-constant/i)) {
    return { "id": 154, "name": "Frédérique Constant" };
  }
  if (input.match(/gagamilano|gaga milano|gaga-milano/i)) {
    return { "id": 96, "name": "Gaga Milano" };
  }
  if (input.match(/girardperregaux|girard perregaux|girard-perregaux/i)) {
    return { "id": 98, "name": "Girard-Perregaux" };
  }
  if (input.match(/Glashütte Original|Glashütte-Original|GlashütteOriginal|glashuette|Glashutte Original|GlashutteOriginal|Glashutte-Original/i)) {
    return { "id": 168, "name": "Glashutte Original" };
  }
  if (input.match(/grand-seiko|grandseiko|grand seiko/i)) {
    return { "id": 84, "name": "Grand Seiko" };
  }
  if (input.match(/gucci/i)) {
    return { "id": 156, "name": "Gucci" };
  }
  if (input.match(/hamilton/i)) {
    return { "id": 62, "name": "Hamilton" };
  }
  if (input.match(/hermes/i)) {
    return { "id": 64, "name": "Hermes" };
  }
  if (input.match(/hublot/i)) {
    return { "id": 46, "name": "Hublot" };
  }
  if (input.match(/iwc/i)) {
    return { "id": 4, "name": "IWC" };
  }
  if (input.match(/jaegerlecoultre|jaeger lecoultre|jaeger-lecoultre/i)) {
    return { "id": 16, "name": "Jaeger LeCoultre" };
  }
  if (input.match(/jaquetdroz|jaquet droz|jaquet-droz/i)) {
    return { "id": 174, "name": "Jaquet Droz" };
  }
  if (input.match(/longines/i)) {
    return { "id": 120, "name": "Longines" };
  }
  if (input.match(/mauricelacroix|maurice lacroix|maurice-lacroix/i)) {
    return { "id": 26, "name": "Maurice Lacroix" };
  }
  if (input.match(/montblanc/i)) {
    return { "id": 5, "name": "Montblanc" };
  }
  if (input.match(/nomos glashütte|nomos-glashütte|nomosglashütte|nomosglashuette|nomos glashuette|nomos-glashuette/i)) {
    return { "id": 134, "name": "Nomos Glashutte" };
  }
  if (input.match(/omega/i)) {
    return { "id": 20, "name": "Omega" };
  }
  if (input.match(/orient/i)) {
    return { "id": 100, "name": "Orient" };
  }
  if (input.match(/oris/i)) {
    return { "id": 164, "name": "Oris" };
  }
  if (input.match(/panerai/i)) {
    return { "id": 58, "name": "Panerai" };
  }
  if (input.match(/parmigiani/i)) {
    return { "id": 158, "name": "Parmigiani Fleurier" };
  }
  if (input.match(/patek/i)) {
    return { "id": 22, "name": "Patek Philippe" };
  }
  if (input.match(/piaget/i)) {
    return { "id": 56, "name": "Piaget" };
  }
  if (input.match(/rado/i)) {
    return { "id": 160, "name": "Rado" };
  }
  if (input.match(/seiko/i)) {
    return { "id": 72, "name": "Seiko" };
  }
  if (input.match(/sevenfriday|seven friday|seven-friday/i)) {
    return { "id": 142, "name": "Sevenfriday" };
  }
  if (input.match(/tagheuer|tag heuer|tag-heuer/i)) {
    return { "id": 54, "name": "TAG Heuer" };
  }
  if (input.match(/tissot/i)) {
    return { "id": 82, "name": "Tissot" };
  }
  if (input.match(/ulysse|ulysse-nardin|ulysse nardin/i)) {
    return { "id": 162, "name": "Ulysse Nardin" };
  }
  if (input.match(/vacheronconstantin|vacheron constantin|vacheron-constantin/i)) {
    return { "id": 3, "name": "Vacheron Constantin" };
  }
  if (input.match(/zenith/i)) {
    return { "id": 80, "name": "Zenith" };
  }
  if (input.match(/mido/i)) {
    return { "id": 172, "name": "Mido" };
  }
  if (input.match(/franck muller|franck-muller|franckmuller/i)) {
    return { "id": 30, "name": "Franck Muller" };
  }
  if (input.match(/louis vuitton|louis-vuitton|louisvuitton/i)) {
    return { "id": 130, "name": "Louis Vuitton" };
  }
  if (input.match(/Hugo Boss|hugo-boss|hugoboss/i)) {
    return { "id": 192, "name": "Hugo Boss" };
  }
  if (input.match(/Michael Kors|michaelkors|michael-kors/i)) {
    return { "id": 190, "name": "Michael Kors" };
  }
  if (input.match(/Guess/i)) {
    return { "id": 250, "name": "Guess" };
  }
  if (input.match(/Marc By Marc Jacobs|MarcByMarcJacobs|Marc-By-Marc-Jacobs/i)) {
    return { "id": 216, "name": "Marc By Marc Jacobs" };
  }
  if (input.match(/Marc Jacobs|MarcJacobs|Marc-Jacobs/i)) {
    return { "id": 214, "name": "Marc Jacobs" };
  }
  if (input.match(/Diesel/i)) {
    return { "id": 244, "name": "Diesel" };
  }
  if (input.match(/Skagen/i)) {
    return { "id": 240, "name": "Skagen" };
  }
  if (input.match(/Tommy Hilfiger|TommyHilfiger|Tommy-Hilfiger/i)) {
    return { "id": 252, "name": "Tommy Hilfiger" };
  }
  if (input.match(/emporio|Emporio Armani|EmporioArmani|Emporio-Armani|Armani/i)) {
    return { "id": 218, "name": "Emporio Armani" };
  }
  if (input.match(/Tutima Glashutte|Tutima-Glashutte|TutimaGlashutte|Tutima/i)) {
    return { "id": 254, "name": "Tutima Glashutte" };
  }

  // no brandID
  if (input.match(/Michael Kors|MichaelKors|Michael-Kors/i)) {
    return { "id": null, "name": "Michael Kors" };
  }
  if (input.match(/a-lange-and-sohne|a-lange-sohne|alange-and-sohne|alange-sohne/i)) {
    return { "id": null, "name": "A. Lange & Sohne" };
  }
  if (input.match(/arnold-and-son|arnold-son|arnoldson/i)) {
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
  if (input.match(/christianDior|christian Dior|christian-Dior|christian|Dior/i)) {
    return { "id": null, "name": "Dior" };
  }
  if (input.match(/h-moser-cie/i)) {
    return { "id": null, "name": "H. Moser & Cie" };
  }
  if (input.match(/HYT/i)) {
    return { "id": null, "name": "HYT" };
  }
  if (input.match(/jacob-co|jacob&co|jacob co|jacob-and-co|jacob & co/i)) {
    return { "id": null, "name": "Jacob & Co." };
  }
  if (input.match(/muhle-glashutte|muhle glashutte|muhleglashutte/i)) {
    return { "id": null, "name": "Mühle Glashütte" };
  }
  if (input.match(/Perrelet/i)) {
    return { "id": null, "name": "Perrelet" };
  }
  if (input.match(/Porsche/i)) {
    return { "id": null, "name": "Porsche" };
  }
  if (input.match(/Roger Dubuis|Roger-Dubuis|RogerDubuis/i)) {
    return { "id": null, "name": "Roger Dubuis" };
  }
  if (input.match(/Romain Jerome|RomainJerome|Romain-Jerome/i)) {
    return { "id": null, "name": "Romain Jerome" };
  }
  if (input.match(/U-Boat|UBoat|U Boat/i)) {
    return { "id": null, "name": "U-Boat" };
  }
  if (input.match(/Bedat/i)) {
    return { "id": null, "name": "Bedat" };
  }
  if (input.match(/Bulova|accutron/i)) {
    return { "id": null, "name": "Bulova" };
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
  if (input.match(/Invicta/i)) {
    return { "id": null, "name": "Invicta" };
  }
  if (input.match(/Luminox/i)) {
    return { "id": null, "name": "Luminox" };
  }
  if (input.match(/Michele/i)) {
    return { "id": null, "name": "Michele" };
  }
  if (input.match(/Movado/i)) {
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
  if (input.match(/Harry Winston|HarryWinston|Harry-Winston/i)) {
    return { "id": null, "name": "Harry Winston" };
  }
  if (input.match(/Juicy Couture|Juicy-Couture|JuicyCouture/i)) {
    return { "id": null, "name": "Juicy Couture" };
  }
  if (input.match(/Philip Stein|PhilipStein|Philip-Stein/i)) {
    return { "id": null, "name": "Philip Stein" };
  }
  if (input.match(/raymond|Raymond Weil|RaymondWeil|Raymond-Weil/i)) {
    return { "id": null, "name": "Raymond Weil" };
  }
  if (input.match(/Ferragamo|Salvatore Ferragamo|SalvatoreFerragamo|Salvatore-Ferragamo/i)) {
    return { "id": null, "name": "Salvatore Ferragamo" };
  }
  if (input.match(/Van Cleef|VanCleef|Van-Cleef/i)) {
    return { "id": null, "name": "Van Cleef" };
  }
  if (input.match(/Victorinox|Victorinox Swiss Army|VictorinoxSwissArmy|Victorinox-Swiss-Army/i)) {
    return { "id": null, "name": "Victorinox Swiss Army" };
  }
  if (input.match(/Adee Kaye|Adee-Kaye|AdeeKaye|Adee-Kay/i)) {
    return { "id": null, "name": "Adee Kaye" };
  }
  if (input.match(/Adidas|Adiddas/i)) {
    return { "id": null, "name": "Adidas" };
  }
  if (input.match(/Aerowatch/i)) {
    return { "id": null, "name": "Aerowatch" };
  }
  if (input.match(/Akribos XXIV|AkribosXXIV|Akribos-XXIV|Akribos/i)) {
    return { "id": null, "name": "Akribos XXIV" };
  }
  if (input.match(/Alpina/i)) {
    return { "id": null, "name": "Alpina" };
  }
  if (input.match(/Anne Klein|AnneKlein|Anne-Klein/i)) {
    return { "id": null, "name": "Anne Klein" };
  }
  if (input.match(/Anonimo/i)) {
    return { "id": null, "name": "Anonimo" };
  }
  if (input.match(/Apple/i)) {
    return { "id": null, "name": "Apple" };
  }
  if (input.match(/Armand Nicolet|ArmandNicolet|Armand-Nicolet/i)) {
    return { "id": null, "name": "Armand Nicolet" };
  }
  if (input.match(/Armani Exchange|ArmaniExchange|Armani-Exchange|Armani-Ex/i)) {
    return { "id": null, "name": "Armani Exchange" };
  }
  if (input.match(/August Steiner|AugustSteiner|August-Steiner/i)) {
    return { "id": null, "name": "August Steiner" };
  }
  if (input.match(/Azzaro/i)) {
    return { "id": null, "name": "Azzaro" };
  }
  if (input.match(/Ben and Sons|BenandSons|Ben-and-Sons/i)) {
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
  if (input.match(/Bruno Magli|BrunoMagli|Bruno-Magli/i)) {
    return { "id": null, "name": "Bruno Magli" };
  }
  if (input.match(/Bull|Bull Titanium|BullTitanium|Bull-Titanium/i)) {
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
  if (input.match(/Calvin Klein|CalvinKlein|Calvin-Klein/i)) {
    return { "id": null, "name": "Calvin Klein" };
  }
  if (input.match(/Caribbean Joe|CaribbeanJoe|Caribbean-Joe/i)) {
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
  if (input.match(/D1 Milano|D1Milano|D1-Milano/i)) {
    return { "id": null, "name": "D1 Milano" };
  }
  if (input.match(/DKNY/i)) {
    return { "id": null, "name": "DKNY" };
  }
  if (input.match(/Daniel Wellington|DanielWellington|Daniel-Wellington/i)) {
    return { "id": null, "name": "Daniel Wellington" };
  }
  if (input.match(/Davidoff/i)) {
    return { "id": null, "name": "Davidoff" };
  }
  if (input.match(/De Grisogono|DeGrisogono|De-Grisogono/i)) {
    return { "id": null, "name": "De Grisogono" };
  }
  if (input.match(/DeWitt/i)) {
    return { "id": null, "name": "DeWitt" };
  }
  if (input.match(/Deep Blue|DeepBlue|Deep-Blue/i)) {
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
  if (input.match(/Elini Barokas|EliniBarokas|Elini-Barokas/i)) {
    return { "id": null, "name": "Elini Barokas" };
  }
  if (input.match(/Ellen Tracy|EllenTracy|Ellen-Tracy/i)) {
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
  if (input.match(/Equipe Tritium|EquipeTritium|Equipe-Tritium/i)) {
    return { "id": null, "name": "Equipe Tritium" };
  }
  if (input.match(/Ernest Borel|ErnestBorel|Ernest-Borel/i)) {
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
  if (input.match(/Ferre Milano|FerreMilano|Ferre-Milano/i)) {
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
  if (input.match(/Gevril|gv2/i)) {
    return { "id": null, "name": "Gevril" };
  }
  if (input.match(/Geoffrey Beene|GeoffreyBeene|Geoffrey-Beene/i)) {
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
  if (input.match(/Guy Laroche/i)) {
    return { "id": null, "name": "Guy Laroche" };
  }
  if (input.match(/HYT/i)) {
    return { "id": null, "name": "HYT" };
  }
  if (input.match(/Haemmer/i)) {
    return { "id": null, "name": "Haemmer" };
  }
  if (input.match(/Harry Potter|Harry-Potter|HarryPotter/i)) {
    return { "id": null, "name": "Harry Potter" };
  }
  if (input.match(/Hautlence/i)) {
    return { "id": null, "name": "Hautlence" };
  }
  if (input.match(/Haurex|Haurex Italy|HaurexItaly|Haurex-Italy/i)) {
    return { "id": null, "name": "Haurex Italy" };
  }
  if (input.match(/Henry London|HenryLondon|Henry-London/i)) {
    return { "id": null, "name": "Henry London" };
  }
  if (input.match(/Heritor/i)) {
    return { "id": null, "name": "Heritor" };
  }
  if (input.match(/Ice-Watch|IceWatch/i)) {
    return { "id": null, "name": "Ice-Watch" };
  }
  if (input.match(/Issey Miyake|IsseyMiyake|Issey-Miyake/i)) {
    return { "id": null, "name": "Issey Miyake" };
  }
  if (input.match(/JBW/i)) {
    return { "id": null, "name": "JBW" };
  }
  if (input.match(/Jacques Lemans|JacquesLemans|Jacques-Lemans/i)) {
    return { "id": null, "name": "Jacques Lemans" };
  }
  if (input.match(/Jaermann and Stubi|JaermannandStubi|Jaermann-and-Stubi|JaermannStubi|Jaermann-Stubi/i)) {
    return { "id": null, "name": "Jaermann and Stubi" };
  }
  if (input.match(/Jessica Simpson|JessicaSimpson|Jessica-Simpson/i)) {
    return { "id": null, "name": "Jessica Simpson" };
  }
  if (input.match(/Jivago/i)) {
    return { "id": null, "name": "Jivago" };
  }
  if (input.match(/Johan Eric|JohanEric|Johan-Eric/i)) {
    return { "id": null, "name": "Johan Eric" };
  }
  if (input.match(/Joshua and Sons|JoshuaandSons|Joshua-and-Sons|JoshuaSons|Joshua-Sons/i)) {
    return { "id": null, "name": "Joshua and Sons" };
  }
  if (input.match(/Junghans/i)) {
    return { "id": null, "name": "Junghans" };
  }
  if (input.match(/Just Cavalli|JustCavalli|Just-Cavalli/i)) {
    return { "id": null, "name": "Just Cavalli" };
  }
  if (input.match(/Kate Spade|KateSpade|Kate-Spade/i)) {
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
  if (input.match(/Lucien Piccard|LucienPiccard|Lucien-Piccard|Lucien/i)) {
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
  if (input.match(/Mathey-Tissot|MatheyTissot|Mathey Tissot/i)) {
    return { "id": null, "name": "Mathey-Tissot" };
  }
  if (input.match(/MeisterSinger/i)) {
    return { "id": null, "name": "MeisterSinger" };
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
  if (input.match(/Mr Jones|Mr. Jones|MrJones|Mr-Jones/i)) {
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
  if (input.match(/Olivia Burton|OliviaBurton|Olivia-Burton/i)) {
    return { "id": null, "name": "Olivia Burton" };
  }
  if (input.match(/Oniss/i)) {
    return { "id": null, "name": "Oniss" };
  }
  if (input.match(/Timex/i)) {
    return { "id": null, "name": "Timex" };
  }
  if (input.match(/A Line|ALine|A-Line|A_Line/i)) {
    return { "id": null, "name": "A_Line" };
  }
  if (input.match(/Paul Picot|PaulPicot|Paul-Picot/i)) {
    return { "id": null, "name": "Paul Picot" };
  }
  if (input.match(/Perrelet/i)) {
    return { "id": null, "name": "Perrelet" };
  }
  if (input.match(/Philip Stein|PhilipStein|Philip-Stein/i)) {
    return { "id": null, "name": "Philip Stein" };
  }
  if (input.match(/Picasso and Co|PicassoandCo|Picasso-and-Co|Picasso-Co|PicassoCo/i)) {
    return { "id": null, "name": "Picasso and Co" };
  }
  if (input.match(/Pulsar/i)) {
    return { "id": null, "name": "Pulsar" };
  }
  if (input.match(/Ralph Lauren|RalphLauren|Ralph-Lauren/i)) {
    return { "id": null, "name": "Ralph Lauren" };
  }
  if (input.match(/Rapport London|RapportLondon|Rapport-London/i)) {
    return { "id": null, "name": "Rapport London" };
  }
  if (input.match(/Rebel/i)) {
    return { "id": null, "name": "Rebel" };
  }
  if (input.match(/Red Line|RedLine|Red-Line/i)) {
    return { "id": null, "name": "Red Line" };
  }
  if (input.match(/Reign/i)) {
    return { "id": null, "name": "Reign" };
  }
  if (input.match(/René Mouri|Rene Mouri|ReneMouri|Rene-Mouri/i)) {
    return { "id": null, "name": "René Mouri" };
  }
  if (input.match(/Revue Thommen|RevueThommen|Revue-Thommen/i)) {
    return { "id": null, "name": "Revue Thommen" };
  }
  if (input.match(/Richard Mille|RichardMille|Richard-Mille/i)) {
    return { "id": null, "name": "Richard Mille" };
  }
  if (input.match(/Roamer/i)) {
    return { "id": null, "name": "Roamer" };
  }
  if (input.match(/Roberto Cavalli|RobertoCavalli|Roberto-Cavalli/i)) {
    return { "id": null, "name": "Roberto Cavalli" };
  }
  if (input.match(/Roger Dubuis|RogerDubuis|Roger-Dubuis/i)) {
    return { "id": null, "name": "Roger Dubuis" };
  }
  if (input.match(/Romain Jerome|RomainJerome|Romain-Jerome/i)) {
    return { "id": null, "name": "Romain Jerome" };
  }
  if (input.match(/S Coifman|SCoifman|S-Coifman/i)) {
    return { "id": null, "name": "S Coifman" };
  }
  if (input.match(/Saint Honore|SaintHonore|Saint-Honore/i)) {
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
  if (input.match(/Swiss Legend|SwissLegend|Swiss-Legend/i)) {
    return { "id": null, "name": "Swiss Legend" };
  }
  if (input.match(/Swiss Military|SwissMilitary|Swiss-Military/i)) {
    return { "id": null, "name": "Swiss Military" };
  }
  if (input.match(/Swiss Alpine|SwissAlpine|Swiss-Alpine/i)) {
    return { "id": null, "name": "Swiss Alpine" };
  }
  if (input.match(/TW Steel|TWSteel|TW-Steel/i)) {
    return { "id": null, "name": "TW Steel" };
  }
  if (input.match(/Technomarine/i)) {
    return { "id": null, "name": "Technomarine" };
  }
  if (input.match(/Thomas Earnshaw|ThomasEarnshaw|Thomas-Earnshaw/i)) {
    return { "id": null, "name": "Thomas Earnshaw" };
  }
  if (input.match(/Tory Burch|ToryBurch|Tory-Burch/i)) {
    return { "id": null, "name": "Tory Burch" };
  }
  if (input.match(/Valentino Garavani|ValentinoGaravani|Valentino-Garavani/i)) {
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

const getBuckle = input => {
  if (!input) return "";

  if (input.match(/(fold)[ -_]?(over)/i) && input.match(/(push)[ -_]?(but[t]on)/i) && input.match(/deploy(ant|ment)/i)) {
    return 'Fold-Over Push Button Deployant Clasp';
  }
  if (input.match(/(Push)[ -_]?(But[t]on)[a-z ]*(Deploy(ant|ment))|(Deploy(ant|ment))[a-z ]*(push)[ -_]?but[t]on/i)) {
    return 'Push Button Deployant Clasp';
  }
  if (input.match(/deploy(ant|ment)/i)) {
    return 'Deployant Clasp';
  }
  if (input.match(/flip/i)) {
    return 'Flip Clasp';
  }
  if (input.match(/butter/i)) {
    return 'Butterfly Clasp';
  }
  if (input.match(/jewel/i)) {
    return 'Jewelry Clasp';
  }
  if (input.match(/safety[ -_]?strap/i)) {
    return 'Safety Strap Clasp';
  }
  if (input.match(/buckle/i)) {
    return 'Buckle';
  }
  // cannot identify
  return input;
}

const getWaterResistance = input => {
  if (!input) return "";

  const m = input.toUpperCase().match(/\d{0,3},?\d{1,3}(.\d{1,2})?[\s]*((bar)|(atm)|(feet)|(meter[s]|metre[s])|(m)|(ft))/gmi);
  let r = "";
  if (m) {
    for (let j = 0; j < m.length && r === ""; j++) {
      if (m[j].match(/\//)) {
        let mm = m[j].split('/');
        for (let k = 0; k < mm.length && r === ""; k++) {
          if (mm[k].match(/bar|atm/i)) {
            let wrm = parseFloat(mm[k].replace('ATM', '').replace('BAR', '').replace(",", "").trim()) * 10;
            r = wrm + ' m';
          } else if (mm[k].match(/meter|metre|m/i)) {
            let wrm = parseFloat(mm[k].replace('METERS', '').replace('METER', '').replace('METRES', '').replace('METRE', '').replace('m.', '').replace('m', '').replace(",", "").trim());
            r = wrm + ' m';
          } else if (mm[k].match(/feet|foot|ft/i)) {
            let wrm = parseFloat(mm[k].replace('FEET', '').replace('FOOT', '').replace('FT', '').replace(",", "").trim());
            r = wrm + ' m';
          }
        }
      } else {
        if (m[j].match(/bar|atm/i)) {
          let wrm = parseFloat(m[j].replace('ATM', '').replace('BAR', '').replace(",", "").trim()) * 10;
          r = wrm + ' m';
        } else if (r === "" && m[j].match(/meter|metre|m/i)) {
          let wrm = parseFloat(m[j].replace('METERS', '').replace('METER', '').replace('METRES', '').replace('METRE', '').replace('M.', '').replace('M', '').replace('.00', '').replace(",", "").trim());
          r = wrm + ' m';
        } else if (r === "" && m[j].match(/feet|foot|ft/i)) {
          let wrm = parseFloat(m[j].replace('FEET', '').replace('FOOT', '').replace('FT', '').replace(",", "").trim());
          wrm = Math.ceil(wrm / 3.3);
          r = wrm + ' m';
        }
      }
    }
  }
  return r;
}

const getColor = input => {
  if (!input) return "";
  if (input.match(/beige/i)) {
    return 'Beige';
  }
  if (input.match(/black|carbon|charcoal/i)) {
    return 'Black';
  }
  if (input.match(/blue|teal|turquoise/i)) {
    return 'Blue';
  }
  if (input.match(/brown|chocolate|maroon|burgundy/i)) {
    return 'Brown';
  }
  if (input.match(/champagne|brass|bronze|wine/i)) {
    return 'Champagne';
  }
  if (input.match(/green/i)) {
    return 'Green';
  }
  if (input.match(/grey|gray/i)) {
    return 'Grey';
  }
  if (input.match(/khaki/i)) {
    return 'Khaki';
  }
  if (input.match(/multi[ -_]?colo[u]r|multi[ -_]?ton/i)) {
    return 'Multi-color';
  }
  if (input.match(/navy/i)) {
    return 'Navy';
  }
  if (input.match(/orange/i)) {
    return 'Orange';
  }
  if (input.match(/(rose|red|pink)[ -_]?gold/i)) {
    return 'Rose Gold';
  }
  if (input.match(/pink/i)) {
    return 'Pink';
  }
  if (input.match(/purple|violet/i)) {
    return 'Purple';
  }
  if (input.match(/red|cherry|rose/i)) {
    return 'Red';
  }
  if (input.match(/silver|platin[i]?um|rhodium|titan[i]?um/i)) {
    return 'Silver';
  }
  if (input.match(/white[ -_]?gold/i)) {
    return 'White Gold';
  }
  if (input.match(/white|/i)) {
    return 'White';
  }
  if (input.match(/(yellow|king)[ -_]gold/i)) {
    return 'Yellow Gold';
  }
  if (input.match(/yellow/i)) {
    return 'Yellow';
  }
  if (input.match(/gold/i)) {
    return 'Gold';
  }
  if (input.match(/mother[ -_]?of[ -_]?pearl/i)) {
    return 'Mother Of Pearl';
  }
  // cannot identify
  return input;
}

const getMaterial = input => {
  if (!input) return "";

  let bm = "";
  let bms = [];
  let goldAssigned = false;

  if ((input.match(/;/) && input.match(/ 2/i)) || input.match(/1\) /i)) {				// strap options, dont handle
    return { bm: "", bms: [], };
  }
  if (input.match(/stainless stee|Stainless[ -_]*Steel/i) || (input.match(/mesh/i) && (!(input.match(/alloy[ -_]*mesh/i))))) {
    bm = bm ? bm : 'Stainless Steel';
    bms.push('Stainless Steel');
  } else if (input.match(/Steel|-tone case/i)) {
    bm = bm ? bm : 'Steel';
    bms.push('Steel');
  }
  if (input.match(/Titanium|Titanum|Tiatnium/i)) {
    bm = bm ? bm : 'Titanium';
    bms.push('Titanium');
  }
  if (input.match(/Platinum|Platinium/i)) {
    bm = bm ? bm : 'Platinum';
    bms.push('Platinum');
  }
  if (input.match(/18[ -_]?(k|kt|ct|karat|carat)[ -_]?(Eve)[ -_]?(rose)|(Eve)[ -_]?(rose)[ -_]?(gold)/i) && (!(input.match(/gold[s]?[ -_]?(((ion)[ -_]?)?plate|ip|grain|tone|pvd|trim)/i)))) {
    bm = bm ? bm : 'Everose Gold';
    bms.push('Everose Gold');
    goldAssigned = true;
  } else if (input.match(/18[ -_]?(k|kt|ct|karat|carat)[ -_]?(rose)|(rose)[ -_]*[\(\s*pink\s*\)]?(gold)/i) && (!(input.match(/gold[s]?[ -_]?(((ion)[ -_]?)?plate|ip|grain|tone|pvd|trim)/i)))) {
    bm = bm ? bm : 'Rose Gold';
    bms.push('Rose Gold');
    goldAssigned = true;
  }
  if (input.match(/18[ -_]?(k|kt|ct|karat|carat)[ -_]?(sedna)|(sedna)[ -_]?(gold)/i) && (!(input.match(/gold[s]?[ -_]?(((ion)[ -_]?)?plate|ip|grain|tone|pvd|trim)/i)))) {
    bm = bm ? bm : 'Sedna Gold';
    bms.push('Sedna Gold');
    goldAssigned = true;
  }
  if (input.match(/18[ -_]?(k|kt|ct|karat|carat)[ -_]?(red)|(red)[ -_]?(gold)/i) && (!(input.match(/gold[s]?[ -_]?(((ion)[ -_]?)?plate|ip|grain|tone|pvd|trim)/i)))) {
    bm = bm ? bm : 'Red Gold';
    bms.push('Red Gold');
    goldAssigned = true;
  }
  if (input.match(/18[ -_]?(k|kt|ct|karat|carat)[ -_]?(king)|(king)[ -_]?(gold)/i) && (!(input.match(/ggold[s]?[ -_]?(((ion)[ -_]?)?plate|ip|grain|tone|pvd|trim)/i)))) {
    bm = bm ? bm : 'King Gold';
    bms.push('King Gold');
    goldAssigned = true;
  }
  if (input.match(/18[ -_]?(k|kt|ct|karat|carat)[ -_]?(pink)|(pink)[ -_]?(gold)/i) && (!(input.match(/gold[s]?[ -_]?(((ion)[ -_]?)?plate|ip|grain|tone|pvd|trim)/i)))) {
    bm = bm ? bm : 'Pink Gold';
    bms.push('Pink Gold');
    goldAssigned = true;
  }
  if (input.match(/18[ -_]?(k|kt|ct|karat|carat)[ -_]?(beige)|(beige)[ -_]?(gold)/i) && (!(input.match(/gold[s]?[ -_]?(((ion)[ -_]?)?plate|ip|grain|tone|pvd|trim)/i)))) {
    bm = bm ? bm : 'Beige Gold';
    bms.push('Beige Gold');
    goldAssigned = true;
  }
  if (input.match(/18[ -_]?(k|kt|ct|karat|carat)[ -_]?(white)|(white)[ -_]?(gold)/i) && (!(input.match(/gold[s]?[ -_]?(((ion)[ -_]?)?plate|ip|grain|tone|pvd|trim)/i)))) {
    bm = bm ? bm : 'White Gold';
    bms.push('White Gold');
    goldAssigned = true;
  }
  if (input.match(/18[ -_]?(k|kt|ct|karat|carat)[ -_]?(yellow)|(yellow)[ -_]?(gold)/i) && (!(input.match(/gold[s]?[ -_]?(((ion)[ -_]?)?plate|ip|grain|tone|pvd|trim)/i)))) {
    bm = bm ? bm : 'Yellow Gold';
    bms.push('Yellow Gold');
    goldAssigned = true;
  }
  if (!goldAssigned && input.match(/Gold/i) && (!(input.match(/gold[s]?[ -_]?(((ion)[ -_]?)?plate|ip|grain|tone|pvd|trim)/i))) && (!(input.match(/resin|rubber|leather/i)))) {
    bm = bm ? bm : 'Gold';
    bms.push('Gold');
  }
  if (input.match(/stingray|leathe|skin|Leather|Lizard|snake|shark|python|Ostrich|Leaher|Leahter|Suede|Horse|nubuck|letaher/i)) {
    bm = bm ? bm : 'Leather';
    bms.push('Leather');
  }
  if (input.match(/Alligarot|Alliagtor|Alligaor|Alligaror|(al(l)?igator)[\s-_]*(leather)?|lligator/i) && (!(input.match(/Alligator Motif/i)))) {
    bm = bm ? bm === 'Leather' ? 'Alligator Leather' : bm : 'Alligator Leather';
    const nbms = bms.filter(v => v !== 'Leather');
    bms = nbms;
    bms.push('Alligator Leather');
  }
  if (input.match(/(croc)(o)?(dile)?[\s-_]*(leather)?/i) && (!(input.match(/Crocoi-Emboss|(cro(c)?c)(o)?(dile)?[\s-_]*(patte|emb[r]?oss|texture)/i)))) {
    bm = bm ? bm === 'Leather' ? 'Crocodile Leather' : bm : 'Crocodile Leather';
    const nbms = bms.filter(v => v !== 'Leather');
    bms = nbms;
    bms.push('Crocodile Leather');
  }
  if (input.match(/(calf)[\s-_]*(skin)?[\s-_]?(leather)?|Calskin|Clafskin|Calkskin|alfskin/i)) {
    bm = bm ? bm === 'Leather' ? 'Calfskin Leather' : bm : 'Calfskin Leather';
    const nbms = bms.filter(v => v !== 'Leather');
    bms = nbms;
    bms.push('Calfskin Leather');
  }
  if (input.match(/Alloy|Aloy|Alloy Mesh/i)) {
    bm = bm ? bm : 'Alloy';
    bms.push('Alloy');
  }
  if (input.match(/Aluminium|Aluminum/i)) {
    bm = bm ? bm : 'Aluminium';
    bms.push('Aluminium');
  }
  if (input.match(/Base[\s-_]*Metal|Base Meta|metal/i)) {
    bm = bm ? bm : 'Base Metal';
    bms.push('Base Metal');
  }
  if (input.match(/Brass/i)) {
    bm = bm ? bm : 'Brass';
    bms.push('Brass');
  }
  if (input.match(/Acetate/i)) {
    bm = bm ? bm : 'Acetate';
    bms.push('Acetate');
  }
  if (input.match(/Acrylic/i)) {
    bm = bm ? bm : 'Acrylic';
    bms.push('Acrylic');
  }
  if (input.match(/Enamel/i)) {
    bm = bm ? bm : 'Enamel';
    bms.push('Enamel');
  }
  if (input.match(/Canvas/i)) {
    bm = bm ? bm : 'Canvas';
    bms.push('Canvas');
  }
  if (input.match(/Crystal/i)) {
    bm = bm ? bm : 'Crystal';
    bms.push('Crystal');
  }
  if (input.match(/Ceramic|Ceranic/i)) {
    bm = bm ? bm : 'Ceramic';
    bms.push('Ceramic');
  }
  if (input.match(/Nato|Textlie|denim|cloth|Frabric|Fabric|Linen|Textile|Farbic|Fabrik/i)) {
    bm = bm ? bm : 'Fabric';
    bms.push('Fabric');
  }
  if (input.match(/Nylon|nilon/i)) {
    bm = bm ? bm : 'Nylon';
    bms.push('Nylon');
  }
  if (input.match(/Plastic/i)) {
    bm = bm ? bm : 'Plastic';
    bms.push('Plastic');
  }
  if (input.match(/Resin/i)) {
    bm = bm ? bm : 'Resin';
    bms.push('Resin');
  }
  if (input.match(/Poly[\s-_]*carbon/i)) {
    bm = bm ? bm : 'Polycarbon';
    bms.push('Polycarbon');
  }
  if (input.match(/Poly[\s-_]*urethane/i)) {
    bm = bm ? bm : 'Polyurethane';
    bms.push('Polyurethane');
  }
  if (input.match(/Quartz/i)) {
    bm = bm ? bm : 'Quartz';
    bms.push('Quartz');
  }
  if (input.match(/Rubber|rubbe|ruuber|twin pro/i)) {
    bm = bm ? bm : 'Rubber';
    bms.push('Rubber');
  }
  if (input.match(/Satin/i) && (!(input.match(/satin[\s-_]*(Look|Brush|Cover|Finish|Over|Polish)/i)))) {
    bm = bm ? bm : 'Satin';
    bms.push('Satin');
  }
  if (input.match(/Slicone|Selicone?|Sil{1,2}icone?|Silcone/i)) {
    bm = bm ? bm : 'Silicone';
    bms.push('Silicone');
  }
  if (input.match(/Sapphire/i)) {
    bm = bm ? bm : 'Sapphire';
    bms.push('Sapphire');
  }
  if (input.match(/Tungsten/i)) {
    bm = bm ? bm : 'Tungsten';
    bms.push('Tungsten');
  }
  if (input.match(/Wood/i)) {
    bm = bm ? bm : 'Wood';
    bms.push('Wood');
  }
  if (input.match(/Silver/i) && (!(input.match(/silver[s -_]?(((ion|ip)[ -_]?)?plate|grain|tone|pvd)/i)))) {
    bm = bm ? bm : 'Silver';
    bms.push('Silver');
  }
  if (input.match(/mother[ -_]?(of)?[ -_]?pearl/i)) {
    bm = bm ? bm : 'Mother of Pearl';
    bms.push('Mother of Pearl');
  }
  if (input.match(/Diamond|Diamon|diamod/i)) {
    bm = bm ? bm : 'Diamond';
    bms.push('Diamond');
  }
  if (input.match(/Fib(er|re)[ -_]?(Glass)/i)) {
    bm = bm ? bm : 'Fiber Glass';
    bms.push('Fiber Glass');
  } else if (input.match(/Fib(er|re)/i)) {
    bm = bm ? bm : 'Fiber';
    bms.push('Fiber');
  } else if (input.match(/Glass/i)) {
    bm = bm ? bm : 'Glass';
    bms.push('Glass');
  }
  if (input.match(/Palladium/i)) {
    bm = bm ? bm : 'Palladium';
    bms.push('Palladium');
  }
  // cannot identify
  if (bms.length === 0) {
    bm = input;
    bms.push(input);
  }
  return { bm, bms };
}

const getCaseShape = input => {
  if (!input) return "";

  if (input.match(/Round/i)) {
    return 'Round';
  }
  if (input.match(/Rectangle/i)) {
    return 'Round';
  }
  if (input.match(/Oval/i)) {
    return 'Oval';
  }
  if (input.match(/Cushion/i)) {
    return 'Cushion';
  }
  if (input.match(/Octagon/i)) {
    return 'Octagon';
  }
  if (input.match(/Square/i)) {
    return 'Square';
  }
  if (input.match(/Unique/i)) {
    return 'Unique';
  }
  if (input.match(/Other/i)) {
    return 'Other';
  }
  // cannot identify
  return input;
}

const getCoating = input => {
  if (!input) return "";

  if (input.match(/PVD/i)) {
    return 'PVD Coating';
  }
  if (input.match(/DLC/i)) {
    return 'DLC Coating';
  }
  // cannot identify
  return input;
}

const getGender = input => {
  if (!input) return "M";     // assume male

  if (input.match(/lady|ladies|woman|women|female/i)) {
    return 'F';
  }
  if (input.match(/men|man|male/i)) {
    return 'M';
  }
  if (input.match(/unisex/i)) {
    return 'X';
  }
  // cannot identify
  return input;
}

const getCrystal = input => {
  if (!input) return "";

  if (input.match(/plexy|plexi|acrylic|Arcylic|Plastic|Pastic|Plactic|Plas/i)) {
    return 'Acrylic';
  }
  if (input.match(/Spphire|Sapphirre|Sapphimax|Sappire|Sappihre|Sapphrie|Sapphite|Sapphie|Saphhire|Saphire|Sappphire|sapphire/i) && (!(input.match(/mineral|K1/i))) && (!(input.match(/sapphire( |-|_)*(coat|layer|treat)/i)))) {
    return 'Sapphire';
  }
  if (input.match(/SAPPHITEK|Sapphitek|Sappitek|Krysterna|Nineral|Mineeral|Min eral|Mimeral|Mienral|poly|fusion|quartz|mineral|glass|flame|k[ -_]*[1!]|hard|crystal|keyster|amber|hesal/i) || input.match(/sapphire[ -_]*(coat|layer|treat)/i)) {
    return 'Mineral';
  }
  // cannot identify
  return input;
}

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
  return input;
}

const getCaseCrown = input => {
  if (!input) return "";

  if (input.match(/non[ ‑-_]*screw/i)) {
    return 'Non-Screw';
  }
  if (input.match(/screw(ed)?[ ‑-_]*in/i) && (!(input.match(/non/i)))) {
    return 'Screw In';
  }
  if (input.match(/screw(ed)?[ ‑-_]*lock/i) && (!(input.match(/non/i)))) {
    return 'Screw Lock';
  }
  if (input.match(/screw(ed)?[ ‑-_]*down/i) && (!(input.match(/non/i)))) {
    return 'Screw Down';
  }
  if (input.match(/water[ ‑-_]?proof|Water[ ‑-_]?resistant/i)) {
    return 'Waterproof';
  }
  if (input.match(/dust[ ‑-_]?proof/i)) {
    return 'Dustproof';
  }
  if (input.match(/Dress[ ‑-_]?Crown/i)) {
    return 'Dress Crown';
  }
  if (input.match(/pull|push/i)) {
    return 'Pull/Push';
  }
  // cannot identify
  return input;
}

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
  return input;
}

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
  return input;
}

const getIndexType = input => {
  if (!input) return "";

  if (input.match(/Arabic[ -_]?(Numerals)?/i)) {
    return "Arabic Numerals";
  }
  if (input.match(/Arrow[ -_]?Marker/i)) {
    return "Arrow Marker";
  }
  if (input.match(/Baton[ -_]?Index/i)) {
    return "Baton Indexes";
  }
  if (input.match(/Breguet[ -_]?Numerals/i)) {
    return "Breguet Numerals";
  }
  if (input.match(/Dagger[ -_]?Index/i)) {
    return "Dagger Indexes";
  }
  if (input.match(/Diamond[ -_]?Markers/i)) {
    return "Diamond Markers";
  }
  if (input.match(/Roman[ -_]?Numerals/i)) {
    return "Roman Numerals";
  }
  if (input.match(/Round[ -_]?Index/i)) {
    return "Round Indexes";
  }
  if (input.match(/Stick[ -_]?Index/i)) {
    return "Stick Indexes";
  }
  // cannot identify
  return input;
}

const getHandStyle = input => {
  if (!input) return "";

  if (input.match(/Alpha/i)) {
    return "Alpha";
  }
  if (input.match(/Arrow/i)) {
    return "Arrow";
  }
  if (input.match(/Barton/i)) {
    return "Barton";
  }
  if (input.match(/Breguet/i)) {
    return "Breguet";
  }
  if (input.match(/Cathedral/i)) {
    return "Cathedral";
  }
  if (input.match(/Dauphine/i)) {
    return "Dauphine";
  }
  if (input.match(/Fleur[ -_]?de[ -_]?Lys/i)) {
    return "Fleur de Lys";
  }
  if (input.match(/Lance/i)) {
    return "Lance";
  }
  if (input.match(/Leaf/i)) {
    return "Leaf";
  }
  if (input.match(/Lollipop/i)) {
    return "Lollipop";
  }
  if (input.match(/Lozenge/i)) {
    return "Lozenge";
  }
  if (input.match(/Mercedes/i)) {
    return "Mercedes";
  }
  if (input.match(/Obelisque/i)) {
    return "Obelisque";
  }
  if (input.match(/Pencil/i)) {
    return "Pencil";
  }
  if (input.match(/Plongeur/i)) {
    return "Plongeur";
  }
  if (input.match(/Skeleton/i)) {
    return "Skeleton";
  }
  if (input.match(/Snowflake/i)) {
    return "Snowflake";
  }
  if (input.match(/Spade/i)) {
    return "Spade";
  }
  if (input.match(/Syringe/i)) {
    return "Syringe";
  }
  if (input.match(/Sword/i)) {
    return "Sword";
  }
  // cannot identify
  return input;
}

const getDialFinish = input => {
  if (!input) return "";

  if (input.match(/California/i)) {
    return "California";
  }
  if (input.match(/Crosshair/i)) {
    return "Crosshair";
  }
  if (input.match(/Enamel/i)) {
    return "Enamel";
  }
  if (input.match(/Cloisonne/i)) {
    return "Cloisonne";
  }
  if (input.match(/Grand[ -_]?Feu/i)) {
    return "Grand Feu";
  }
  if (input.match(/Champleve/i)) {
    return "Champleve";
  }
  if (input.match(/Flinque/i)) {
    return "Flinque";
  }
  if (input.match(/Grisaille/i)) {
    return "Grisaille";
  }
  if (input.match(/Gilt/i)) {
    return "Gilt";
  }
  if (input.match(/Guilloche/i)) {
    return "Guilloche";
  }
  if (input.match(/Linen/i)) {
    return "Linen";
  }
  if (input.match(/Marquetry/i)) {
    return "Marquetry";
  }
  if (input.match(/Meteorite/i)) {
    return "Meteorite";
  }
  if (input.match(/Porcelain/i)) {
    return "Porcelain";
  }
  if (input.match(/Sector/i)) {
    return "Sector";
  }
  if (input.match(/Skeleton/i)) {
    return "Skeleton";
  }
  if (input.match(/Tapisserie/i)) {
    return "Tapisserie";
  }
  if (input.match(/Teaked/i)) {
    return "Teaked";
  }
  // cannot identify
  return input;
}

const getLuminescence = input => {
  if (!input) return "";

  if (input.match(/radium/i)) {
    return 'Radium';
  }
  if (input.match(/Promethium/i)) {
    return 'Promethium';
  }
  if (input.match(/Tritium/i)) {
    return 'Tritium';
  }
  if (input.match(/Luminova/i)) {
    return 'Luminova';
  }
  if (input.match(/Super[ -_]?LumiNova/i)) {
    return 'Super-LumiNova';
  }
  // cannot identify
  return input;
}

const getCalendar = input => {
  if (!input) return "";

  if (input.match(/big[ -_]?date/i)) {
    return 'Big Date';
  }
  if (input.match(/day[ -_]?date/i)) {
    return 'Day Date';
  }
  if (input.match(/triple[ -_]?date/i)) {
    return 'Triple Date';
  }
  if (input.match(/date/i)) {
    return 'Date';
  }
  if (input.match(/Annual[ -_]?Calendar/i)) {
    return 'Annual Calendar';
  }
  if (input.match(/Perpetual[ -_]?Calendar/i)) {
    return 'Date';
  }
  if (input.match(/Moon[ -_]?Phase[ -_]?Calendar/i)) {
    return 'Moon Phase Calendar';
  }
  // cannot identify
  return input;
}

// const getAttr = input => {
//   if (!input) return "";

//   // cannot identify
//   return input;
// }

module.exports = {
  generateBrandID, getBezel, getBuckle, getCalendar, getCaseBack,
  getCaseCrown, getCaseShape, getCoating, getColor, getCrystal, getCrystalCoating,
  getDialFinish, getGender, getHandStyle, getIndexType, getLuminescence,
  getMaterial, getWaterResistance
};