interface DataMapper<K, V> {
    map(input: K): V
}

export class generateBrandID implements DataMapper<string, any> {
    map(input: string): any {
        if (!input) return { "id": null, "name": null };

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
        if (input.match(/jaeger[ -_]?le[ -_]?coultre/i)) {
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
        if (input.match(/seiko/i) && !input.match(/grand[ -_]seiko/i)) {
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
        if (input.match(/gaga?[ -_]?milano/i)) {
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
        if (input.match(/nomos|Nomos[ -_]?Glash[uü]tte/i)) {
            return { "id": 134, "name": "Nomos Glashutte" };
        }
        if (input.match(/seve[nr][ -_]?friday/i)) {
            return { "id": 142, "name": "Sevenfriday" };
        }
        if (input.match(/about[ -_]?vintage/i)) {
            return { "id": 152, "name": "About Vintage" };
        }
        if (input.match(/fr[ée]d[ée]rique[ -_]?constant/i)) {
            return { "id": 154, "name": "Frederique Constant" };
        }
        if (input.match(/gucci/i)) {
            return { "id": 156, "name": "Gucci" };
        }
        if (input.match(/parmigiani[ -_]?(Fleurier)?/i)) {
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
        if (input.match(/Glash[üu]e?tte[ -_]?(Original)?/i) && !input.match(/nomos|tutima|m[uü](e)?hle/i)) {
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
        if (input.match(/baume|baume ?(&|-|(et|and))* ?mercier/i)) {
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
        if (input.match(/\bball\b/i)) {
            return { id: 188, name: 'Ball' };
        }
        if (input.match(/Michael[ -_]?Kors/i)) {
            return { "id": 190, "name": "Michael Kors" };
        }
        if (input.match(/Hugo[ -_]?Boss/i)) {
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
            return { "id": 292, "name": "Muhle Glashutte" };
        }
        if (input.match(/lange-and-sohne|a[. -]*lange[ -_]*(and|&)?[ -_]*(sohne|Söhne)/i)) {
            return { "id": 293, "name": "A. Lange & Sohne" };
        }
        if (input.match(/HYT/i)) {
            return { "id": 310, "name": "HYT" };
        }
        if (input.match(/Bremont/i)) {
            return { "id": 342, "name": "Bremont" };
        }
        if (input.match(/Burberry/i)) {
            return { "id": 344, "name": "Burberry" };
        }
        if (input.match(/Maserati/i)) {
            return { "id": 346, "name": "Maserati" };
        }
        if (input.match(/Fossil/i)) {
            return { "id": 350, "name": "Fossil" };
        }
        if (input.match(/GARMIN/i)) {
            return { "id": 352, "name": "Garmin" };
        }
        if (input.match(/jaguar/i)) {
            return { "id": 362, "name": "jaguar" };
        }
        if (input.match(/Festina/i)) {
            return { "id": 364, "name": "Festina" };
        }

        // no brandID
        if (input.match(/3h[ -_]?Italia/i)) {
            return { "id": null, "name": "3H Italia" };
        }
        if (input.match(/AB[ -_]?Aeterno/i)) {
            return { "id": null, "name": "AB Aeterno" };
        }
        if (input.match(/avi-?8/i)) {
            return { "id": null, "name": "Avi-8" };
        }
        if (input.match(/arnold & son|arnold-and-son|arnold-son|arnoldson/i)) {
            return { "id": null, "name": "Arnold and Son" };
        }
        if (input.match(/breda/i)) {
            return { "id": null, "name": "Breda" };
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
        if (input.match(/Romaine?[ -_]?Jerome/i)) {
            return { "id": null, "name": "Romain Jerome" };
        }
        if (input.match(/U[ -_]?Boat/i)) {
            return { "id": null, "name": "U-Boat" };
        }
        if (input.match(/Bedat/i)) {
            return { "id": null, "name": "Bedat" };
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
        if (input.match(/\besq-|ESQ by Movado|Movado/i)) {
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
        if (input.match(/BWC|Brooklyn|Brooklyn Watch Co|Brooklyn-Watch-Co|BrooklynWatchCo/i)) {
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
        if (input.match(/\bCK\b|Calvin[ -_]?Klein/i)) {
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
        if (input.match(/Air[ -_]?Blue/i)) {
            return { "id": null, "name": "Air Blue" };
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
        if (input.match(/Brera[ -_]?Orologi/i)) {
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
        if (input.match(/Fit[ -_]?bit/i)) {
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
        if (input.match(/tiffany|Tiffany & Co./i)) {
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
        if (input.match(/Devon/i)) {
            return { "id": null, "name": "Devon" };
        }
        if (input.match(/Lorenz/i)) {
            return { "id": null, "name": "Lorenz" };
        }
        if (input.match(/sekonda/i)) {
            return { "id": null, "name": "Sekonda" };
        }
        if (input.match(/MONTEGRAPPA|montegrapa/i)) {
            return { "id": null, "name": "Montegrappa" };
        }
        if (input.match(/Breil/i)) {
            return { "id": null, "name": "Breil" };
        }
        if (input.match(/Meccaniche[ -_]?Veneziane/i)) {
            return { "id": null, "name": "Meccaniche Veneziane" };
        }
        if (input.match(/esprit/i)) {
            return { "id": null, "name": "Esprit" };
        }
        if (input.match(/GOOD[ -_]?YEAR/i)) {
            return { "id": null, "name": "Good Year" };
        }
        if (input.match(/grand[ -_]?gene?ve/i)) {
            return { "id": null, "name": "Grand Geneve" };
        }
        if (input.match(/Heinrichssohn/i)) {
            return { "id": null, "name": "Heinrichssohn" };
        }
        if (input.match(/Liu[ -_]?Jo/i)) {
            return { "id": null, "name": "Liu Jo" };
        }
        if (input.match(/cccp/i)) {
            return { "id": null, "name": "CCCP" };
        }
        if (input.match(/rue-du-rhone|88-rue-du-rhone/i)) {
            return { "id": null, "name": "88 Rue Du Rhone" };
        }
        if (input.match(/APPETIME/i)) {
            return { "id": null, "name": "Appetime" };
        }
        if (input.match(/AQUA[ -_]?MASTER/i)) {
            return { "id": null, "name": "Aqua Master" };
        }
        if (input.match(/ASICS/i)) {
            return { "id": null, "name": "Asics" };
        }
        if (input.match(/bomberg/i)) {
            return { "id": null, "name": "Bomberg" };
        }
        if (input.match(/CARUCCI/i)) {
            return { "id": null, "name": "Carucci" };
        }
        if (input.match(/CHRISTOPHE CLARET/i)) {
            return { "id": null, "name": "Christophe Claret" };
        }
        if (input.match(/Chrnoswiss/i)) {
            return { "id": null, "name": "Chrnoswiss" };
        }
        if (input.match(/CJ[ -_]?LASSO/i)) {
            return { "id": null, "name": "CJ Lasso" };
        }
        if (input.match(/CLAUDE[ -_]?BERNARD/i)) {
            return { "id": null, "name": "Claude Bernard" };
        }
        if (input.match(/CONVERSE/i)) {
            return { "id": null, "name": "Converse" };
        }
        if (input.match(/CROTON/i)) {
            return { "id": null, "name": "Croton" };
        }
        if (input.match(/giovine/i)) {
            return { "id": null, "name": "Giovine" };
        }
        if (input.match(/giorgio[ -_]?fedon[ -_]?(1919)?/i)) {
            return { "id": null, "name": "Giorgio Fedon 1919" };
        }
        if (input.match(/GIULIO[ -_]?ROMANO/i)) {
            return { "id": null, "name": "Giulio Romano" };
        }
        if (input.match(/HIP[ -_]?HOP/i)) {
            return { "id": null, "name": "Hip Hop" };
        }
        if (input.match(/HARDING/i)) {
            return { "id": null, "name": "Harding" };
        }
        if (input.match(/HENRY DUNAY/i)) {
            return { "id": null, "name": "Henry Dunay" };
        }
        if (input.match(/J[ -_]?SPRINGS/i)) {
            return { "id": null, "name": "J Springs" };
        }
        if (input.match(/JEAN[ -_]?PAUL[ -_]?GAULTIER/i)) {
            return { "id": null, "name": "Jean Paul Gaultier" };
        }
        if (input.match(/KENNETH[ -_]?COLE/i)) {
            return { "id": null, "name": "Kenneth Cole" };
        }
        if (input.match(/KIENZLE/i)) {
            return { "id": null, "name": "Kienzle" };
        }
        if (input.match(/KR3W/i)) {
            return { "id": null, "name": "KR3W" };
        }
        if (input.match(/LEGEND/i)) {
            return { "id": null, "name": "Legend" };
        }
        if (input.match(/LOCMAN/i)) {
            return { "id": null, "name": "Locman" };
        }
        if (input.match(/MOMO[ -_]?(DESIGN)?/i)) {
            return { "id": null, "name": "MOMO DESIGN" };
        }
        if (input.match(/PERRY[ -_]?ELLIS/i)) {
            return { "id": null, "name": "Perry Ellis" };
        }
        if (input.match(/(RENE|REN)[ -_]?MOURIS/i)) {
            return { "id": null, "name": "Rene Mouris" };
        }
        if (input.match(/ROBERTO[ -_]?BIANCI/i)) {
            return { "id": null, "name": "Roberto Bianci" };
        }
        if (input.match(/RUDIGER/i)) {
            return { "id": null, "name": "Rudiger" };
        }
        if (input.match(/SEAPRO/i)) {
            return { "id": null, "name": "Seapro" };
        }
        if (input.match(/STRUMENTO[ -_]?MARINO/i)) {
            return { "id": null, "name": "Strumento Marino" };
        }
        if (input.match(/STUHRLING[ -_]?ORIGINAL/i)) {
            return { "id": null, "name": "Stuhrling Original" };
        }
        if (input.match(/TENDENCE/i)) {
            return { "id": null, "name": "Tendence" };
        }
        if (input.match(/TOMTOM/i)) {
            return { "id": null, "name": "TomTom" };
        }
        if (input.match(/TORGOEN/i)) {
            return { "id": null, "name": "Torgoen" };
        }
        if (input.match(/TOY[ -_]?WATCH/i)) {
            return { "id": null, "name": "Toy Watch" };
        }
        if (input.match(/VUARNET/i)) {
            return { "id": null, "name": "Vuarnet" };
        }
        if (input.match(/666[ -_]?Barcelona/i)) {
            return { "id": null, "name": "666 Barcelona" };
        }
        if (input.match(/F[. -_]?P[. -_]?Journe/i)) {
            return { "id": null, "name": "F.P.Journe" };
        }
        if (input.match(/AQUA[ -_]?MASTER/i)) {
            return { "id": null, "name": "Aqua Master" };
        }
        if (input.match(/CARAVELLE/i)) {
            return { "id": null, "name": "Caravelle" };
        }
        if (input.match(/CHARLES[ -_]?WINSTON/i)) {
            return { "id": null, "name": "Charles Winston" };
        }
        if (input.match(/CHRISTOPHE[ -_]?CLARET/i)) {
            return { "id": null, "name": "Christophe Claret" };
        }
        if (input.match(/Braccialini/i)) {
            return { "id": null, "name": "Braccialini" };
        }
        if (input.match(/CHRONOVISOR/i)) {
            return { "id": null, "name": "Chronovisor" };
        }
        if (input.match(/CLERC/i)) {
            return { "id": null, "name": "Clerc" };
        }
        if (input.match(/GIORGIO[ -_]?FEDON[ -_]?1919/i)) {
            return { "id": null, "name": "Giorgio Fedon 1919" };
        }
        if (input.match(/GIUSEPPE[ -_]?ZANOTTI/i)) {
            return { "id": null, "name": "Giuseppe Zanotti" };
        }
        if (input.match(/HENRY[ -_]?DUNAY/i)) {
            return { "id": null, "name": "Henry Dunay" };
        }
        if (input.match(/lp-italy|LUCIEN[ -_]PICCARD/i)) {
            return { "id": null, "name": "Lucien Piccard" };
        }
        if (input.match(/MICHELE/i)) {
            return { "id": null, "name": "Michele" };
        }
        if (input.match(/NINA[ -_]?RICCI/i)) {
            return { "id": null, "name": "Nina Ricci" };
        }
        if (input.match(/NOVE/i)) {
            return { "id": null, "name": "Nove" };
        }
        if (input.match(/TIFFANY[ -_&]*(CO)?.?/i)) {
            return { "id": null, "name": "Tiffany & Co." };
        }
        if (input.match(/DANIEL[ -_]?ROTH/i)) {
            return { "id": null, "name": "Daniel Roth" };
        }
        if (input.match(/\bTX-/i)) {
            return { "id": null, "name": "TX" };
        }
        if (input.match(/WASHINGTON[ -_]?SQUARE/i)) {
            return { "id": null, "name": "Washington Square" };
        }
        if (input.match(/WITTNAUER/i)) {
            return { "id": null, "name": "Wittnauer" };
        }
        if (input.match(/ARABIANS/i)) {
            return { "id": null, "name": "Arabians" };
        }
        if (input.match(/BERING/i)) {
            return { "id": null, "name": "Bering" };
        }
        if (input.match(/BMW/i)) {
            return { "id": null, "name": "BMW" };
        }
        if (input.match(/BOBROFF/i)) {
            return { "id": null, "name": "Bobroff" };
        }
        if (input.match(/Catena/i)) {
            return { "id": null, "name": "Catena" };
        }
        if (input.match(/Cath[ -_]?Kidston/i)) {
            return { "id": null, "name": "Cath Kidston" };
        }
        if (input.match(/Cauny/i)) {
            return { "id": null, "name": "Cauny" };
        }
        if (input.match(/Chronostar/i)) {
            return { "id": null, "name": "Chronostar" };
        }
        if (input.match(/Calypso/i)) {
            return { "id": null, "name": "Calypso" };
        }
        if (input.match(/Carlo[ -_]?Cantinaro/i)) {
            return { "id": null, "name": "Carlo Cantinaro" };
        }
        if (input.match(/Cerruti[ -_]?1881/i)) {
            return { "id": null, "name": "Cerruti 1881" };
        }
        if (input.match(/CO88/i)) {
            return { "id": null, "name": "CO88" };
        }
        if (input.match(/daisy[ -_]?dixon/i)) {
            return { "id": null, "name": "Daisy Dixon" };
        }
        if (input.match(/DEVOTA[ &-_]*LOMBA/i)) {
            return { "id": null, "name": "Devota & Lomba" };
        }
        if (input.match(/ENRICO[ -_]?COVERI/i)) {
            return { "id": null, "name": "Enrico Coveri" };
        }
        if (input.match(/Gant[ -_]?Houston/i)) {
            return { "id": null, "name": "Gant Houston" };
        }
        if (input.match(/Grand[ -_]?Gen[èe]ve/i)) {
            return { "id": null, "name": "Grand Geneve" };
        }
        if (input.match(/HEINRICHSSOHN/i)) {
            return { "id": null, "name": "Heinrichssohn" };
        }
        if (input.match(/Hoops/i)) {
            return { "id": null, "name": "Hoops" };
        }
        if (input.match(/INDIAN[ -_]?MOTORCYCLE/i)) {
            return { "id": null, "name": "Indian Motorcycle" };
        }
        if (input.match(/Ingersoll/i)) {
            return { "id": null, "name": "Ingersoll" };
        }
        if (input.match(/IWOOD/i)) {
            return { "id": null, "name": "Iwood" };
        }
        if (input.match(/Jack[ -_&(and)]*Co.?/i)) {
            return { "id": null, "name": "Jack & Co." };
        }
        if (input.match(/JUSTINA/i)) {
            return { "id": null, "name": "Justina" };
        }
        if (input.match(/frank[ -_]?1967/i)) {
            return { "id": null, "name": "Frank 1967" };
        }
        if (input.match(/Laura[ -_]?Biagiotti/i)) {
            return { "id": null, "name": "Laura Biagiotti" };
        }
        if (input.match(/LIGHT[ -_]?TIME/i)) {
            return { "id": null, "name": "Light Time" };
        }
        if (input.match(/Lorus/i)) {
            return { "id": null, "name": "Lorus" };
        }
        if (input.match(/Lotus/i)) {
            return { "id": null, "name": "Lotus" };
        }
        if (input.match(/Marc[ -_]?Ecko/i)) {
            return { "id": null, "name": "Marc Ecko" };
        }
        if (input.match(/Marco[ -_]?Mavilla/i)) {
            return { "id": null, "name": "Marco Mavilla" };
        }
        if (input.match(/Marco[ -_]?Milano/i)) {
            return { "id": null, "name": "Marco Milano" };
        }
        if (input.match(/Mark[ -_]?Maddox/i)) {
            return { "id": null, "name": "Mark Maddox" };
        }
        if (input.match(/Mattiolo/i)) {
            return { "id": null, "name": "Mattiolo" };
        }
        if (input.match(/Meccaniche[ -_]?Veloci/i)) {
            return { "id": null, "name": "Meccaniche Veloci" };
        }
        if (input.match(/Mondia/i)) {
            return { "id": null, "name": "Mondia" };
        }
        if (input.match(/Oxygen/i)) {
            return { "id": null, "name": "Oxygen" };
        }
        if (input.match(/Q[-_&]?Q/i)) {
            return { "id": null, "name": "Q&Q" };
        }
        if (input.match(/Radiant/i)) {
            return { "id": null, "name": "Radiant" };
        }
        if (input.match(/Romanson/i)) {
            return { "id": null, "name": "Romanson" };
        }
        if (input.match(/Rosefield/i)) {
            return { "id": null, "name": "Rosefield" };
        }
        if (input.match(/Sector/i)) {
            return { "id": null, "name": "Sector" };
        }
        if (input.match(/Smile[ -_]?Solar/i)) {
            return { "id": null, "name": "Smile Solar" };
        }
        if (input.match(/Sognatore/i)) {
            return { "id": null, "name": "Sognatore" };
        }
        if (input.match(/Stroili/i)) {
            return { "id": null, "name": "Stroili" };
        }
        if (input.match(/Superdry/i)) {
            return { "id": null, "name": "Superdry" };
        }
        if (input.match(/Temptation/i)) {
            return { "id": null, "name": "Temptation" };
        }
        if (input.match(/Thom[ -_]?Olson/i)) {
            return { "id": null, "name": "Thom Olson" };
        }
        if (input.match(/Timberland/i)) {
            return { "id": null, "name": "Timberland" };
        }
        if (input.match(/Time[ -_]?Force/i)) {
            return { "id": null, "name": "Time Force" };
        }
        if (input.match(/Tous/i)) {
            return { "id": null, "name": "Tous" };
        }
        if (input.match(/Trussardi/i)) {
            return { "id": null, "name": "Trussardi" };
        }
        if (input.match(/Vespa[ -_]?Watches/i)) {
            return { "id": null, "name": "Vespa Watches" };
        }
        if (input.match(/Viceroy/i)) {
            return { "id": null, "name": "Viceroy" };
        }
        if (input.match(/Watchmaker[ -_]?Milano/i)) {
            return { "id": null, "name": "Watchmaker Milano" };
        }
        if (input.match(/Welder/i)) {
            return { "id": null, "name": "Welder" };
        }
        if (input.match(/Yonger[ &-_(and)]Bresson/i)) {
            return { "id": null, "name": "Yonger & Bresson" };
        }
        if (input.match(/Accurist/i)) {
            return { "id": null, "name": "Accurist" };
        }
        if (input.match(/Andreas[ -_]?Osten/i)) {
            return { "id": null, "name": "Andreas Osten" };
        }
        if (input.match(/Bruno[ -_]?Sohnle/i)) {
            return { "id": null, "name": "Bruno Sohnle" };
        }
        if (input.match(/Ben[ -_]?Sherman/i)) {
            return { "id": null, "name": "Ben Sherman" };
        }
        if (input.match(/Charlotte[ -_]?Raffaelli/i)) {
            return { "id": null, "name": "Charlotte Raffaelli" };
        }
        if (input.match(/Continental/i)) {
            return { "id": null, "name": "Continental" };
        }
        if (input.match(/Davosa/i)) {
            return { "id": null, "name": "Davosa" };
        }
        if (input.match(/Dreyfuss/i)) {
            return { "id": null, "name": "Dreyfuss Co" };
        }
        if (input.match(/Depth[ -_]?Charge/i)) {
            return { "id": null, "name": "Depth Charge" };
        }
        if (input.match(/Emile[ -_]?Chouriet/i)) {
            return { "id": null, "name": "Emile Chouriet" };
        }
        if (input.match(/Elliot[ -_]?Brown/i)) {
            return { "id": null, "name": "Elliot Brown" };
        }
        if (input.match(/EverSwiss/i)) {
            return { "id": null, "name": "EverSwiss" };
        }
        if (input.match(/Eone/i)) {
            return { "id": null, "name": "Eone" };
        }
        if (input.match(/Flik[ -_]?Flak/i)) {
            return { "id": null, "name": "Flik Flak" };
        }
        if (input.match(/Gc/i)) {
            return { "id": null, "name": "Gc" };
        }
        if (input.match(/Hype/i)) {
            return { "id": null, "name": "Hype" };
        }
        if (input.match(/Iron[ -_]?Annie/i)) {
            return { "id": null, "name": "Iron Annie" };
        }
        if (input.match(/Jean[ -_]?Pierre/i)) {
            return { "id": null, "name": "Jean Pierre" };
        }
        if (input.match(/Joules/i)) {
            return { "id": null, "name": "Joules" };
        }
        if (input.match(/Larsson[ -_]?(And)?[ -_]?Jennings/i)) {
            return { "id": null, "name": "Larsson And Jennings" };
        }
        if (input.match(/Limit/i)) {
            return { "id": null, "name": "Limit" };
        }
        if (input.match(/Lipsy/i)) {
            return { "id": null, "name": "Lipsy" };
        }
        if (input.match(/Locksley[ -_]?London/i)) {
            return { "id": null, "name": "Locksley London" };
        }
        if (input.match(/LLARSEN/i)) {
            return { "id": null, "name": "LLARSEN" };
        }
        if (input.match(/Louis[ -_]?Erard/i)) {
            return { "id": null, "name": "Louis Erard" };
        }
        if (input.match(/Michel[ -_]?Herbelin/i)) {
            return { "id": null, "name": "Michel Herbelin" };
        }
        if (input.match(/Missguided/i)) {
            return { "id": null, "name": "Missguided" };
        }
        if (input.match(/Radley/i)) {
            return { "id": null, "name": "Radley" };
        }
        if (input.match(/Rebecca[ -_]?Minkoff/i)) {
            return { "id": null, "name": "Rebecca Minkoff" };
        }
        if (input.match(/Rotary/i)) {
            return { "id": null, "name": "Rotary" };
        }
        if (input.match(/Scuderia[ -_]?Ferrari/i)) {
            return { "id": null, "name": "Scuderia Ferrari" };
        }
        if (input.match(/Seksy/i)) {
            return { "id": null, "name": "Seksy" };
        }
        if (input.match(/STORM/i)) {
            return { "id": null, "name": "STORM" };
        }
        if (input.match(/Swiss[ -_]?Military[ -_]?Hanowa/i)) {
            return { "id": null, "name": "Swiss Military Hanowa" };
        }
        if (input.match(/Slipstream/i)) {
            return { "id": null, "name": "Slipstream" };
        }
        if (input.match(/Ted[ -_]?Baker/i)) {
            return { "id": null, "name": "Ted Baker" };
        }
        if (input.match(/THOMAS[ -_]?SABO/i)) {
            return { "id": null, "name": "THOMAS SABO" };
        }
        if (input.match(/Vivienne[ -_]?Westwood/i)) {
            return { "id": null, "name": "Vivienne Westwood" };
        }
        // if (input.match(/Versus[ -_]Versace/i)) {
        //     return { "id": null, "name": "Versus Versace" };
        // }
        if (input.match(/Zeppelin/i)) {
            return { "id": null, "name": "Zeppelin" };
        }
        // if (input.match(/placeholder/i)) {
        //     return { "id": null, "name": "placeholder" };
        // }
        // if (input.match(/placeholder/i)) {
        //     return { "id": null, "name": "placeholder" };
        // }
        // if (input.match(/placeholder/i)) {
        //     return { "id": null, "name": "placeholder" };
        // }
        // if (input.match(/placeholder/i)) {
        //     return { "id": null, "name": "placeholder" };
        // }
        // if (input.match(/placeholder/i)) {
        //     return { "id": null, "name": "placeholder" };
        // }
        // if (input.match(/placeholder/i)) {
        //     return { "id": null, "name": "placeholder" };
        // }
        // if (input.match(/placeholder/i)) {
        //     return { "id": null, "name": "placeholder" };
        // }
        // if (input.match(/placeholder/i)) {
        //     return { "id": null, "name": "placeholder" };
        // }
        // if (input.match(/placeholder/i)) {
        //     return { "id": null, "name": "placeholder" };
        // }
        // if (input.match(/placeholder/i)) {
        //     return { "id": null, "name": "placeholder" };
        // }
        // if (input.match(/placeholder/i)) {
        //     return { "id": null, "name": "placeholder" };
        // }
        // if (input.match(/placeholder/i)) {
        //     return { "id": null, "name": "placeholder" };
        // }
        // if (input.match(/placeholder/i)) {
        //     return { "id": null, "name": "placeholder" };
        // }
        // if (input.match(/placeholder/i)) {
        //     return { "id": null, "name": "placeholder" };
        // }
        // if (input.match(/placeholder/i)) {
        //     return { "id": null, "name": "placeholder" };
        // }
        // if (input.match(/placeholder/i)) {
        //     return { "id": null, "name": "placeholder" };
        // }
        // if (input.match(/placeholder/i)) {
        //     return { "id": null, "name": "placeholder" };
        // }
        // if (input.match(/placeholder/i)) {
        //     return { "id": null, "name": "placeholder" };
        // }
        // if (input.match(/placeholder/i)) {
        //     return { "id": null, "name": "placeholder" };
        // }
        // if (input.match(/placeholder/i)) {
        //     return { "id": null, "name": "placeholder" };
        // }
        // if (input.match(/placeholder/i)) {
        //     return { "id": null, "name": "placeholder" };
        // }
        // if (input.match(/placeholder/i)) {
        //     return { "id": null, "name": "placeholder" };
        // }
        // if (input.match(/placeholder/i)) {
        //     return { "id": null, "name": "placeholder" };
        // }
        // if (input.match(/placeholder/i)) {
        //     return { "id": null, "name": "placeholder" };
        // }
        // if (input.match(/placeholder/i)) {
        //     return { "id": null, "name": "placeholder" };
        // }
        // if (input.match(/placeholder/i)) {
        //     return { "id": null, "name": "placeholder" };
        // }
        // if (input.match(/placeholder/i)) {
        //     return { "id": null, "name": "placeholder" };
        // }
        // if (input.match(/placeholder/i)) {
        //     return { "id": null, "name": "placeholder" };
        // }
        // if (input.match(/placeholder/i)) {
        //     return { "id": null, "name": "placeholder" };
        // }
        // if (input.match(/placeholder/i)) {
        //     return { "id": null, "name": "placeholder" };
        // }
        // if (input.match(/placeholder/i)) {
        //     return { "id": null, "name": "placeholder" };
        // }
        // if (input.match(/placeholder/i)) {
        //     return { "id": null, "name": "placeholder" };
        // }
        // if (input.match(/placeholder/i)) {
        //     return { "id": null, "name": "placeholder" };
        // }
        // if (input.match(/placeholder/i)) {
        //     return { "id": null, "name": "placeholder" };
        // }
        // if (input.match(/placeholder/i)) {
        //     return { "id": null, "name": "placeholder" };
        // }
        // unknown brand
        return { id: null, name: null };
    }
}

export class getBuckle implements DataMapper<string, any> {
    map(input: string): any {
        if (!input) return "";

        if (input.match(/push|safe|secur/i)) {
            return 'Fold-Over Push Button Deployant Clasp';
        }
        if (input.match(/push/i)) {
            return 'Push Button Deployant Clasp';
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
        if (input.match(/safety[ -_]?strap|slip through|hidden|conceal/i)) {
            return 'Safety Strap Clasp';
        }
        if (input.match(/deploy|fold|oyster|clasp/i)) {
            return 'Deployant Clasp';
        }
        if (input.match(/tang|buckle|pin|ardillon/i)) {
            return 'Buckle';
        }
        // cannot identify
        return "";
    }
}

export class getWaterResistance implements DataMapper<string, any> {
    map(input: string): any {
        if (!input) return "";
        if (input.match(/(not|non)[ -_]?water/i)) {
            return "0 m";
        }
        // if (input.match(/splash[ -_](resist|proof)/i)) {
        //     return "Splash resistant";
        // }

        const m = input.toUpperCase().match(/\d{0,3},?\d{1,3}(.\d{1,2})?[\s]*((bar)|(atm)|(feet)|(meter[s]|metre[s])|(m)|(ft))/gmi);
        let r = "0 m";
        if (m) {
            for (let j = 0; j < m.length && r === "0 m"; j++) {
                if (m[j].match(/\//)) {
                    let mm = m[j].split('/');
                    for (let k = 0; k < mm.length && r === "0 m"; k++) {
                        if (mm[k].match(/bar|atm/i)) {
                            let wrm = parseFloat(mm[k].replace('ATM', '').replace('BAR', '').replace(",", "").trim()) * 10;
                            r = wrm + ' m';
                        } else if (mm[k].match(/meter|metre|m/i)) {
                            let wrm = parseFloat(mm[k].replace('METERS', '').replace('METER', '').replace('METRES', '').replace('METRE', '').replace('m.', '').replace('m', '').replace(",", "").trim());
                            r = wrm + ' m';
                        } else if (mm[k].match(/feet|foot|ft/i)) {
                            let wrm = parseFloat(mm[k].replace('FEET', '').replace('FOOT', '').replace('FT', '').replace(",", "").trim());
                            wrm = Math.round(wrm / 3.3);
                            r = wrm + ' m';
                        }
                    }
                } else {
                    if (m[j].match(/bar|atm/i)) {
                        let wrm = parseFloat(m[j].replace('ATM', '').replace('BAR', '').replace(",", "").trim()) * 10;
                        r = wrm + ' m';
                    } else if (r === "0 m" && m[j].match(/meter|metre|m/i)) {
                        let wrm = parseFloat(m[j].replace('METERS', '').replace('METER', '').replace('METRES', '').replace('METRE', '').replace('M.', '').replace('M', '').replace('.00', '').replace(",", "").trim());
                        r = wrm + ' m';
                    } else if (r === "0 m" && m[j].match(/feet|foot|ft/i)) {
                        let wrm = parseFloat(m[j].replace('FEET', '').replace('FOOT', '').replace('FT', '').replace(",", "").trim());
                        wrm = Math.round(wrm / 3.3);
                        r = wrm + ' m';
                    }
                }
            }
        }
        return r;
    }
}

export class getColor implements DataMapper<string, any> {
    map(input: string): any {
        if (!input) return "";

        if (input.match(/two[ -_]?(tone|color)|tri[ -_]?(tone|color)/i)) {
            // return input;
            return 'Two-tone';
        }
        if (input.match(/Skelteton|Skleleton|\bopen\b|skelet|openwork/i)) {
            return 'Skeleton';
        }
        if (input.match(/see[ -]?(through|thru)|transparent/i)) {
            return 'Transparent';
        }
        if (input.match(/diamond|diamond[s]?.*pav|pav.*diamond|diamond[ -]?set/i)) {
            return 'Diamond-paved';     // dialColor = 'Diamond'
        }
        // else if (input.match(/diamond/i)) {
        //     return 'Diamond';
        // }
        if (input.match(/Beige[ -_]*gold/i)) {
            if (input.match(/tone/i)) {
                return 'Beige Gold-Tone';
            }
            return 'Beige Gold';
        }
        if (input.match(/beige/i)) {
            return 'Beige';
        }
        if (input.match(/coffee|\bsable\b|Meteorite|Graphite|anthracite|black|carbon|charcoal/i)) {
            if (input.match(/(Meteorite|Graphite|anthracite|black|carbon|charcoal) *((mother[ -_]*of[ -_]*pearl)|MOP)/i))
                return 'Black Mother of Pearl';         // dialColor = 'Mother of Pearl'
            return 'Black';
        }
        if (input.match(/cobalt|aqua|cyan|bue|azure|sapphire|blue|teal|turquoise/i)) {
            if (input.match(/(blue|teal|turquoise) *((mother[ -_]*of[ -_]*pearl)|MOP)/i))
                return 'Blue Mother of Pearl';
            return 'Blue';
        }
        if (input.match(/Tigers?[ -]?Eyes?|Tobacco|walnut|Wheat|Wood|Burgandy|chestnut|havana|Cognac|\btan\b|copper|bronze|cocoa|brown|chocolate|maroon|burgundy/i)) {
            if (input.match(/(Cognac|\btan\b|copper|bronze|cocoa|brown|chocolate|maroon|burgundy) *((mother[ -_]*of[ -_]*pearl)|MOP)/i))
                return 'Brown Mother of Pearl';
            return 'Brown';
        }
        if (input.match(/champange|champagne|brass|wine/i)) {
            return 'Champagne';
        }
        if (input.match(/Turqouise|Verdigris|lime|olive|mint|digital|camouflage|green/i)) {
            if (input.match(/green *((mother[ -_]*of[ -_]*pearl)|MOP)/i))
                return 'Green Mother of Pearl';
            return 'Green';
        }
        if (input.match(/taupe|Ardoise|pewter|slate|steel|gun[ -_]?metal|grey|gray/i)) {
            return 'Grey';
        }
        if (input.match(/khaki/i)) {
            return 'Khaki';
        }
        if (input.match(/Sprinkle|rainbow|enamel|multi[ -_]?colo[u]?r|multi[ -_]?(ton|strip)/i)) {
            return 'Multi-color';
        }
        if (input.match(/navy/i)) {
            return 'Navy';
        }
        if (input.match(/Tangerine|coral|salmon|orange/i)) {
            return 'Orange';
        }
        if (input.match(/(18[ -_]?(k|kt|ct|karat|carat))[ -_]?((ever|eve)?rose|red|pink)|((ever|eve)?rose|red|pink)[ -_]?(gold)/i)) {
            if (input.match(/tone/i)) {
                return 'Rose Gold-Tone';
            }
            return 'Rose Gold';
        }
        if (input.match(/blush|pink/i)) {
            if (input.match(/(blush|pink) *((mother[ -_]*of[ -_]*pearl)|MOP)/i))
                return 'Pink Mother of Pearl';
            return 'Pink';
        }
        if (input.match(/Velvet|plum|lil[l]?ac|Aubergine|lavender|purple|violet/i)) {
            if (input.match(/(Aubergine|lavender|purple|violet) *((mother[ -_]*of[ -_]*pearl)|MOP)/i))
                return 'Purple Mother of Pearl';
            return 'Purple';
        }
        if (input.match(/Fuchsia|\bred\b|cherry|rose/i)) {
            if (input.match(/(\bred\b|cherry|rose) *((mother[ -_]*of[ -_]*pearl)|MOP)/i))
                return 'Red Mother of Pearl';
            return 'Red';
        }
        if (input.match(/rhodium|mirror|Ruthenium|Siver|Siulver|Silvr|Silver|Silve|Sillver|Silive|Slver|Sliver|Slilver|silver|platin[i]?um|rhodium|titan[i]?um/i)) {
            if (input.match(/tone/i)) {
                return 'Silver-Tone';
            }
            return 'Silver';
        }
        if (input.match(/(18[ -_]?(k|kt|ct|karat|carat))[ -_]?white|white[ -_]?(gold)/i)) {
            if (input.match(/tone/i)) {
                return 'White Gold-Tone';
            }
            return 'White Gold';
        }
        if (input.match(/Vanilla|Porcelain|ivoy|creem|creme|egg[ -]?shell|Cream|ivory|Opaline?|Whitw|Whire|Whie|Whitw|Whute|Whtie|Whte|White/i)) {
            if (input.match(/(Cream|ivory|Opaline|Whitw|Whire|Whie|Whitw|Whute|Whtie|Whte|White) *((mother[ -_]*of[ -_]*pearl)|MOP)/i))
                return 'White Mother of Pearl';
            if (!input.match(/mop/i))
                return 'White';
        }
        if (input.match(/(18[ -_]?(k|kt|ct|karat|carat))[ -_]?(yellow|king)|(yellow|king)[ -_]?(gold)/i)) {
            if (input.match(/tone/i)) {
                return 'Yellow Gold-Tone';
            }
            return 'Yellow Gold';
        }
        if (input.match(/amber|sun|chrome|yellow/i)) {
            if (input.match(/(yellow) *((mother[ -_]*of[ -_]*pearl)|MOP)/i))
                return 'Yellow Mother of Pearl';
            return 'Yellow';
        }
        if (input.match(/gilt|gold/i)) {
            if (input.match(/tone/i)) {
                return 'Gold-Tone';
            }
            return 'Gold';
        }
        if (input.match(/mother[ -_]*of[ -_]*(pearl|Pear|peal|peral)|MOP/i)) {
            return 'Mother Of Pearl';
        }
        if (input.match(/crystal[s].*pav|pav.*crystal/i)) {
            return 'Crystal paved';
        } else if (input.match(/crystal/i)) {
            return 'Crystal';
        }
        if (input.match(/polish/i)) {
            return 'Polished';
        }
        // if (input.match(/two[ -]?tone/i)) {
        //     return 'Two-tone';
        // }
        // cannot identify
        return "";
    }
}

export class getMaterial implements DataMapper<string, any> {
    map(input: string): any {
        if (!input) return {};

        let bm = "";
        let bt = "";
        let bms = [];
        let goldAssigned = false;

        if ((input.match(/;/) && input.match(/ 2/i)) || input.match(/1\) /i)) {				// strap options, dont handle
            return {};
        }
        if (input.match(/gun[ -_]*metal|stainless|oyster[ -_]?steel|\bSS\b|stainless stee|Stainless[ -_]*Steel/i) || ((input.match(/mesh/i) && (!(input.match(/alloy[ -_]*mesh/i))))) || (input.match(/polished pvd/i))) {
            if (!bm) {
                bm = 'Stainless Steel';
                if (input.match(/mesh/i)) {
                    bt = 'Strap';
                } else {
                    bt = 'Bracelet';
                }
            }
            bms.push('Stainless Steel');
        } else if (input.match(/Steel|-tone case/i)) {
            if (!bm) {
                bm = 'Steel';
                bt = 'Bracelet';
            }
            bms.push('Steel');
        }
        if (input.match(/bronze/i)) {
            if (!bm) {
                bm = 'Bronze';
                bt = 'Bracelet';
            }
            bm = bm ? bm : 'Bronze';
            bms.push('Bronze');
        }
        if (input.match(/Titanium|Titanum|Tiatnium/i)) {
            if (!bm) {
                bm = 'Titanium';
                bt = 'Bracelet';
            }
            bm = bm ? bm : 'Titanium';
            bms.push('Titanium');
        }
        if (input.match(/Platinum|Platinium/i)) {
            if (!bm) {
                bm = 'Platinum';
                bt = 'Bracelet';
            }
            bm = bm ? bm : 'Platinum';
            bms.push('Platinum');
        }
        if (input.match(/composite/i)) {
            if (!bm) {
                bm = 'Composite';
                bt = 'Bracelet';
            }
            bm = bm ? bm : 'Composite';
            bms.push('Composite');
        }
        if (input.match(/Yellow Rolesor/i)) {
            if (!bm) {
                bm = 'Composite';
                bt = 'Bracelet';
            }
            bm = bm ? bm : 'Composite';
            bms.push('Composite');
        }
        // plating/coating
        if (input.match(/gold[s]?[ -_]?(((ion)[ -_]?)?plate|ip|pvd|coat)/i)) {
            const m = (input.match(/pvd/i)) ? 'Gold-PVD' : 'Gold-plated';
            let c = '';
            if (input.match(/rose[ -_]?gold[s]?[ -_]?(((ion)[ -_]?)?plate|ip|pvd|coat)/i)) {
                c = 'Rose ';
            }
            if (input.match(/(eve|ever)rose[ -_]?gold[s]?[ -_]?(((ion)[ -_]?)?plate|ip|pvd|coat)/i)) {
                c = 'Everose ';
            }
            if (input.match(/red[ -_]?gold[s]?[ -_]?(((ion)[ -_]?)?plate|ip|pvd|coat)/i)) {
                c = 'Red ';
            }
            if (input.match(/pink[ -_]?gold[s]?[ -_]?(((ion)[ -_]?)?plate|ip|pvd|coat)/i)) {
                c = 'Pink ';
            }
            if (input.match(/king[ -_]?gold[s]?[ -_]?(((ion)[ -_]?)?plate|ip|pvd|coat)/i)) {
                c = 'King ';
            }
            if (input.match(/beige[ -_]?gold[s]?[ -_]?(((ion)[ -_]?)?plate|ip|pvd|coat)/i)) {
                c = 'Beige ';
            }
            if (input.match(/white[ -_]?gold[s]?[ -_]?(((ion)[ -_]?)?plate|ip|pvd|coat)/i)) {
                c = 'White ';
            }
            if (input.match(/yellow[ -_]?gold[s]?[ -_]?(((ion)[ -_]?)?plate|ip|pvd|coat)/i)) {
                c = 'Yellow ';
            }
            if (!bm) {
                bm = c + m;
                bt = 'Bracelet';
            }
            bms.push(c + m)
        }

        // actual material
        if (input.match(/18[ -_]?(k|kt|ct|karat|carat)[ -_]?(Eve)[ -_]?(rose)|(Eve)[ -_]?(rose)[ -_]?(gold)/i) &&
            (!(input.match(/gold[s]?[ -_]?(((ion)[ -_]?)?plate|ip|grain|tone|pvd|trim|coat)/i)))) {
            if (!bm) {
                bm = 'Everose Gold';
                bt = 'Bracelet';
            }
            bms.push('Everose Gold');
            goldAssigned = true;
        } else if (input.match(/18[ -_]?(k|kt|ct|karat|carat)[ -_]?(rose)|(rose)[ -_]*[\(\s*pink\s*\)]?(gold)/i) && (!(input.match(/IP rose gold|gold[s]?[ -_]?(((ion)[ -_]?)?plate|ip|grain|tone|pvd|trim|coat)/i)))) {
            if (!bm) {
                bm = 'Rose Gold';
                bt = 'Bracelet';
            }
            bms.push('Rose Gold');
            goldAssigned = true;
        }
        if (input.match(/18[ -_]?(k|kt|ct|karat|carat)[ -_]?(sedna)|(sedna)[ -_]?(gold)/i) && (!(input.match(/gold[s]?[ -_]?(((ion)[ -_]?)?plate|ip|grain|tone|pvd|trim|coat)/i)))) {
            if (!bm) {
                bm = 'Sedna Gold';
                bt = 'Bracelet';
            }
            bms.push('Sedna Gold');
            goldAssigned = true;
        }
        if (input.match(/18[ -_]?(k|kt|ct|karat|carat)[ -_]?(red)|(red)[ -_]?(gold)/i) && (!(input.match(/gold[s]?[ -_]?(((ion)[ -_]?)?plate|ip|grain|tone|pvd|trim|coat)/i)))) {
            if (!bm) {
                bm = 'Red Gold';
                bt = 'Bracelet';
            }
            bms.push('Red Gold');
            goldAssigned = true;
        }
        if (input.match(/18[ -_]?(k|kt|ct|karat|carat)[ -_]?(king)|(king)[ -_]?(gold)/i) && (!(input.match(/ggold[s]?[ -_]?(((ion)[ -_]?)?plate|ip|grain|tone|pvd|trim|coat)/i)))) {
            if (!bm) {
                bm = 'King Gold';
                bt = 'Bracelet';
            }
            bms.push('King Gold');
            goldAssigned = true;
        }
        if (input.match(/18[ -_]?(k|kt|ct|karat|carat)[ -_]?(pink)|(pink)[ -_]?(gold)/i) && (!(input.match(/gold[s]?[ -_]?(((ion)[ -_]?)?plate|ip|grain|tone|pvd|trim|coat)/i)))) {
            if (!bm) {
                bm = 'Pink Gold';
                bt = 'Bracelet';
            }
            bms.push('Pink Gold');
            goldAssigned = true;
        }
        if (input.match(/18[ -_]?(k|kt|ct|karat|carat)[ -_]?(beige)|(beige)[ -_]?(gold)/i) && (!(input.match(/gold[s]?[ -_]?(((ion)[ -_]?)?plate|ip|grain|tone|pvd|trim|coat)/i)))) {
            if (!bm) {
                bm = 'Beige Gold';
                bt = 'Bracelet';
            }
            bms.push('Beige Gold');
            goldAssigned = true;
        }
        if (input.match(/18[ -_]?(k|kt|ct|karat|carat)[ -_]?(white)|(white)[ -_]?(gold)/i) && (!(input.match(/gold[s]?[ -_]?(((ion)[ -_]?)?plate|ip|grain|tone|pvd|trim|coat)/i)))) {
            if (!bm) {
                bm = 'White Gold';
                bt = 'Bracelet';
            }
            bms.push('White Gold');
            goldAssigned = true;
        }
        if (input.match(/18[ -_]?(k|kt|ct|karat|carat)[ -_]?(yellow)|(yellow)[ -_]?(gold)/i) && (!(input.match(/gold[s]?[ -_]?(((ion)[ -_]?)?plate|ip|grain|tone|pvd|trim|coat)/i)))) {
            if (!bm) {
                bm = 'Yellow Gold';
                bt = 'Bracelet';
            }
            bms.push('Yellow Gold');
            goldAssigned = true;
        }
        if ((!goldAssigned && input.match(/gold with/i)) || (!goldAssigned && (input.match(/gold/i) && (!(input.match(/gold[s]?[ -_]?(((ion)[ -_]?)?plate|ip|grain|tone|pvd|trim|coat)/i))) && (!(input.match(/resin|rubber|leather/i)))))) {
            if (!bm) {
                bm = 'Gold';
                bt = 'Bracelet';
            }
            bms.push('Gold');
        }
        if (input.match(/Scamosciato|Shell Cordovan|cowhide|synthetic|nappa|stingray|leathe|skin|Leather|Lizard|snake|shark|python|Ostrich|Leaher|Leahter|Suede|Horse|nubuck|letaher/i)) {
            if (!bm) {
                bm = 'Leather'
                bt = 'Strap';
            }
            bms.push('Leather');
        }
        if (input.match(/Alligarot|Alliagtor|Alligaor|Alligaror|(al(l)?igator)[\s-_]*(leather)?|lligator/i) && (!(input.match(/Alligator Motif|Alligator[\s-_]*(patte|emb[r]?oss|texture|grain)/i)))) {
            if (bm) {
                if (bm === 'Leather') {
                    bm = 'Alligator Leather'
                    bt = 'Strap';
                    bms = bms.filter(v => v !== 'Leather');
                }
            } else {
                bm = 'Alligator Leather'
                bt = 'Strap';
            }
            bms.push('Alligator Leather');
        }
        if (input.match(/(croc)(o)?(dile)?[\s-_]*(leather)?/i) && (!(input.match(/Crocoi-Emboss|(cro(c)?c)(o)?(dile)?[\s-_]*(patte|emb[r]?oss|texture|grain)/i)))) {
            if (bm) {
                if (bm === 'Leather' || bm === 'Alligator Leather') {
                    bm = 'Crocodile Leather'
                    bt = 'Strap';
                    bms = bms.filter(v => v !== 'Leather' && v !== 'Alligator Leather');
                }
            } else {
                bm = 'Crocodile Leather'
                bt = 'Strap';
            }
            bms.push('Crocodile Leather');
        }
        if (input.match(/(calf)[\s-_]*(skin)?[\s-_]?(leather)?|Calskin|Clafskin|Calkskin|alfskin|veal/i)) {
            if (bm) {
                if (bm === 'Leather') {
                    bm = 'Calfskin Leather'
                    bt = 'Strap';
                    bms = bms.filter(v => v !== 'Leather');
                }
            } else {
                bm = 'Calfskin Leather'
                bt = 'Strap';
            }
            bms.push('Calfskin Leather');
        }
        if (input.match(/Alloy|Aloy|Alloy Mesh/i)) {
            if (!bm) {
                bm = 'Alloy';
                bt = 'Bracelet';
            }
            bm = bm ? bm : 'Alloy';
            bms.push('Alloy');
        }
        if (input.match(/Aluminium|Aluminum/i)) {
            if (!bm) {
                bm = 'Aluminium';
                bt = 'Bracelet';
            }
            bm = bm ? bm : 'Aluminium';
            bms.push('Aluminium');
        }
        if (input.match(/Base[\s-_]*Metal|Base Meta|\bmetal\b/i)) {
            if (!bm) {
                bm = 'Base Metal';
                bt = 'Bracelet';
            }
            bm = bm ? bm : 'Base Metal';
            bms.push('Base Metal');
        }
        if (input.match(/Brass/i)) {
            if (!bm) {
                bm = 'Brass';
                bt = 'Bracelet';
            }
            bm = bm ? bm : 'Brass';
            bms.push('Brass');
        }
        if (input.match(/Acetate/i)) {
            bm = bm ? bm : 'Acetate';
            bms.push('Acetate');
        }
        if (input.match(/Acrylic/i)) {
            if (!bm) {
                bm = 'Acrylic';
                bt = 'Bracelet';
            }
            bm = bm ? bm : 'Acrylic';
            bms.push('Acrylic');
        }
        if (input.match(/Enamel/i)) {
            bm = bm ? bm : 'Enamel';
            bms.push('Enamel');
        }
        if (input.match(/Canvas/i)) {
            if (!bm) {
                bm = 'Canvas';
                bt = 'Strap';
            }
            bms.push('Canvas');
        }
        if (input.match(/Crystal/i)) {
            bm = bm ? bm : 'Crystal';
            bms.push('Crystal');
        }
        if (input.match(/Ceramos|Ceramic|Ceranic/i)) {
            if (!bm) {
                bm = 'Ceramic';
                bt = 'Bracelet';
            }
            bm = bm ? bm : 'Ceramic';
            bms.push('Ceramic');
        }
        if (input.match(/velvet|Sportech|Nato|Textlie|denim|cloth|Frabric|Fabric|Linen|Textile|Farbic|Fabrik/i)) {
            if (!bm) {
                bm = 'Fabric';
                bt = 'Strap';
            }
            bms.push('Fabric');
        }
        if (input.match(/Nylon|nilon/i)) {
            if (!bm) {
                bm = 'Nylon';
                bt = 'Strap';
            }
            bms.push('Nylon');
        }
        if (input.match(/Plastic/i)) {
            if (!bm) {
                bm = 'Plastic';
                bt = 'Strap';
            }
            bms.push('Plastic');
        }
        if (input.match(/Resin/i)) {
            if (!bm) {
                bm = 'Resin';
                bt = 'Bracelet';
            }
            bms.push('Resin');
        }
        if (input.match(/Poly[\s-_]*carbon/i)) {
            if (!bm) {
                bm = 'Polycarbon';
                bt = 'Bracelet';
            }
            bm = bm ? bm : 'Polycarbon';
            bms.push('Polycarbon');
        }
        if (input.match(/Poly[\s-_]*urethane/i)) {
            if (!bm) {
                bm = 'Polyurethane';
                bt = 'Bracelet';
            }
            bm = bm ? bm : 'Polyurethane';
            bms.push('Polyurethane');
        }
        if (input.match(/Quartz/i)) {
            bm = bm ? bm : 'Quartz';
            bms.push('Quartz');
        }
        if (input.match(/Caoutchouc|riubber|Rubber|rubbe|ruuber|twin pro/i)) {
            if (!bm) {
                bm = 'Rubber';
                bt = 'Strap';
            }
            bms.push('Rubber');
        }
        if (input.match(/Satin/i) && (!(input.match(/satined|satin[\s-_]*(Look|Brush|Cover|Finish|Over|Polish)/i)))) {
            if (!bm) {
                bm = 'Satin';
                bt = 'Strap';
            }
            bms.push('Satin');
        }
        if (input.match(/Slicone|Selicone?|Sil{1,2}icone?|Silcone/i)) {
            if (!bm) {
                bm = 'Silicone';
                bt = 'Bracelet';
            }
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
            if (!bm) {
                bm = 'Wood';
                bt = 'Bracelet';
            }
            bm = bm ? bm : 'Wood';
            bms.push('Wood');
        }
        if (input.match(/Silver/i) && (!(input.match(/silver[s -_]?(((ion|ip)[ -_]?)?plate|grain|tone|pvd|coat)/i)))) {
            if (!bm) {
                bm = 'Silver';
                bt = 'Bracelet';
            }
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
        if (input.match(/Carbotech|carbon fib(er|re)/i)) {
            bm = bm ? bm : 'Carbon Fiber';
            bms.push('Carbon Fiber');
        } else if (input.match(/carbon/i)) {
            bm = bm ? bm : 'Carbon';
            bms.push('Carbon');
        } else if (input.match(/Fib(er|re)[ -_]?(Glass)/i)) {
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
            if (!bm) {
                bm = 'Palladium';
                bt = 'Bracelet';
            }
            bms.push('Palladium');
        }
        // cannot identify
        return { bm, bms, bt, };
    }
}

export class getCaseShape implements DataMapper<string, any> {
    map(input: string): any {
        if (!input) return "";

        if (input.match(/Rectang(le|ular)/i)) {
            return 'Rectangle';
        }
        if (input.match(/Rhombus/i)) {
            return 'Rhombus';
        }
        if (input.match(/Round|circular case/i)) {
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
        if (input.match(/Unique|heart|star/i)) {
            return 'Unique';
        }
        if (input.match(/Other|agon/i)) {
            return 'Other';
        }
        if (input.match(/tonneau/i)) {
            return 'Tonneau';
        }
        // cannot identify
        return "";
    }
}

export class getCoating implements DataMapper<string, any> {
    map(input: string): any {
        if (!input) return "";

        if (input.match(/PVD/i)) {
            return 'PVD Coating';
        }
        if (input.match(/DLC/i)) {
            return 'DLC Coating';
        }
        // cannot identify
        return "";
    }
}

export class getDialType implements DataMapper<string, any> {
    map(input: string): any {
        if (!input) return "";

        if (input.match(/(Analog(ue)?|Chronograph)[ -_]*Digital/i)) {
            return 'Analog-Digital';
        }
        if (input.match(/Analog|Unique|Chronograph/i)) {
            return 'Analog';
        }
        if (input.match(/Digital/i)) {
            return 'Digital';
        }
        // cannot identify
        return "";
    }
}

export class getCaliberType implements DataMapper<string, any> {
    map(input: string): any {
        if (!input) return "";

        if (input.match(/automati[c|k]|self[ -_]?(wind|wound)/i)) {
            return 'Automatic';
        }
        if (input.match(/Tourbillon|manual|hand[ -_]?(wind|wound)/i)) {
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
        if (input.match(/electro|quartz|quarz/i)) {
            return 'Quartz';
        }
        // cannot identify
        return "";
    }
}

export class getGender implements DataMapper<string, any> {
    map(input: string): any {
        if (!input) return "M";     // assume male

        if (input.match(/lady|ladies|woman|women|female/i)) {
            return 'F';
        }
        if (input.match(/\bboys?\b|gent|\bmens?\b|\bmans?\b|\bmales?\b/i)) {
            return 'M';
        }
        if (input.match(/unisex|pocket/i)) {
            return 'X';
        }
        // cannot identify
        return "";
    }
}

export class getCrystal implements DataMapper<string, any> {
    map(input: string): any {
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
        return "";
    }
}

export class getCrystalCoating implements DataMapper<string, any> {
    map(input: string): any {
        if (!input) return "";

        if (input.match(/sapphire( |-|_)*(coat|layer|treat)/i)) {
            return 'Sapphire';
        }
        if (((input.match(/non|anti|Anit|Anri|Ant/i) && input.match(/glare|reflex|rflective|relfective|reflctive|eflective|Refective|Refllective|Relective|reflect|glare/i)) || (input.match(/glare/i) && input.match(/proof/i))) && input.match(/interior\/exterior|on the underside|double|coating on inner side|both side|coating inside and out|treatment inside/i)) {
            return 'Both Side Anti Reflective';
        }
        if (input.match(/non|anti|Anit|Anri|Ant/i) && input.match(/glare|reflex|rflective|relfective|reflctive|eflective|Refective|Refllective|Relective|reflect|glare/i) || (input.match(/glare/i) && input.match(/proof/i))) {
            return 'Anti Reflective';
        }
        // cannot identify
        return "";
    }
}

export class getCaseCrown implements DataMapper<string, any> {
    map(input: string): any {
        if (!input) return "";

        if (input.match(/non[ -]?screw/i)) {
            return 'Non-Screw';
        }
        if (input.match(/screw(ed)?[ -_]*in/i) && (!(input.match(/non/i)))) {
            return 'Screw In';
        }
        if (input.match(/screw(ed)?[ -_]*lock/i) && (!(input.match(/non/i)))) {
            return 'Screw Lock';
        }
        if (input.match(/screw(ed)?[ -_]*down/i) && (!(input.match(/non/i)))) {
            return 'Screw Down';
        }
        if (input.match(/water[ -_]?proof|Water[ -_]?resistant/i)) {
            return 'Waterproof';
        }
        if (input.match(/dust[ -_]?proof/i)) {
            return 'Dustproof';
        }
        if (input.match(/Dress[ -_]?Crown/i)) {
            return 'Dress Crown';
        }
        if (input.match(/push(ed)?[ -_]*in/i)) {
            return 'Push-in';
        }
        if (input.match(/pull|push/i)) {
            return 'Pull/Push';
        }
        // cannot identify
        return "";
    }
}

export class getCaseBack implements DataMapper<string, any> {
    map(input: string): any {
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
        if (input.match(/Skelet|open/i)) {
            return 'Skeleton';
        }
        // accordance to jomashop
        if (input.match(/solid/i)) {
            return 'Solid';
        }
        if (input.match(/transparent|see[- ]?(through|thru)/i)) {
            return 'Transparent';
        }
        if (input.match(/engrave/i)) {
            return 'Engraved';
        }
        if (input.match(/decor/i)) {
            return 'Special Decoration';
        }
        if (input.match(/Exhibit/i)) {
            return 'Exhibition';
        }
        if (input.match(/stainless[ -]*steel/i)) {
            return 'Stainless Steel';
        }
        if (input.match(/sapphire/i)) {
            return 'Sapphire';
        }
        if (input.match(/close/i)) {
            return 'Closed';
        }
        // cannot identify
        return "";
    }
}

export class getBezel implements DataMapper<string, any> {
    map(input: string): any {
        if (!input) return "";

        if (input.match(/Plain/i)) {
            return "Plain";
        }
        if (input.match(/Dive/i)) {
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
        if (input.match(/fixed/i)) {
            return 'Fixed';
        }
        if (input.match(/uni[ -_]?direction/i)) {
            return 'Uni-directional Rotating';
        }
        if (input.match(/bi[ -_]?direction/i)) {
            return 'Bi-directional Rotating';
        }
        // cannot identify
        return "";
    }
}

export class getIndexType implements DataMapper<string, any> {
    map(input: string): any {
        if (!input) return "";

        if (input.match(/Arabic/i)) {
            return "Arabic Numerals";
        }
        if (input.match(/Arrow/i)) {
            return "Arrow Marker";
        }
        if (input.match(/Baton/i)) {
            return "Baton Indexes";
        }
        if (input.match(/Breguet/i)) {
            return "Breguet Numerals";
        }
        if (input.match(/Dagger/i)) {
            return "Dagger Indexes";
        }
        if (input.match(/Diamond/i)) {
            return "Diamond Markers";
        }
        if (input.match(/Roman/i)) {
            return "Roman Numerals";
        }
        if (input.match(/Round/i)) {
            return "Round Indexes";
        }
        if (input.match(/Stick/i)) {
            return "Stick Indexes";
        }
        // cannot identify
        return "";
    }
}

export class getHandStyle implements DataMapper<string, any> {
    map(input: string): any {
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
        if (input.match(/Baguette|Breguet/i)) {
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
        if (input.match(/feuille|Leaf/i)) {
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
        if (input.match(/Skelet/i)) {
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
        if (input.match(/Stick/i)) {
            return "Stick";
        }
        if (input.match(/diamond[ -]?shape/i)) {
            return 'Diamond shape';
        }
        if (input.match(/baton/i)) {
            return 'Baton';
        }
        // others
        if (input.match(/silver/i)) {
            if (input.match(/lumin/i)) return 'Luminous Silver-tone';
            else return 'Silver-tone';
        }
        if (input.match(/rose[ -_]?gold/i)) {
            if (input.match(/lumin/i)) return 'Luminous Rose Gold-tone';
            else return 'Rose Gold-tone';
        }
        if (input.match(/yellow[ -_]?gold/i)) {
            if (input.match(/lumin/i)) return 'Luminous Yellow Gold-tone';
            else return 'Yellow Gold-tone';
        }
        if (input.match(/gold/i)) {
            if (input.match(/lumin/i)) return 'Luminous Gold-tone';
            else return 'Gold-tone';
        }
        if (input.match(/Rhodium/i)) {
            if (input.match(/lumin/i)) return 'Luminous Rhodium-plated';
            else return 'Rhodium-plated';
        }
        if (input.match(/lumin/i)) {
            return 'Luminous';
        }

        // cannot identify
        return "";
    }
}

export class getDialFinish implements DataMapper<string, any> {
    map(input: string): any {
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
        if (input.match(/skelet/i)) {
            return "Skeleton";
        }
        if (input.match(/Tapisserie/i)) {
            return "Tapisserie";
        }
        if (input.match(/Teaked/i)) {
            return "Teaked";
        }
        // cannot identify
        return "";
    }
}

export class getLuminescence implements DataMapper<string, any> {
    map(input: string): any {
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
        return "";
    }
}

export class getCalendar implements DataMapper<string, any> {
    map(input: string): any {
        if (!input) return "";

        if (input.match(/big[ -_]?date/i)) {
            return 'Big Date';
        }
        if (input.match(/day.*of.*week|day[ -_]?date/i)) {
            return 'Day Date';
        }
        if (input.match(/triple[ -_]?date/i) || (input.match(/date/i) && input.match(/day.*of.*week/i) && input.match(/year|month/i))) {
            return 'Triple Date';
        }
        if (input.match(/date/i)) {
            return 'Date';
        }
        if (input.match(/Leap[ -]?Year|Annual[ -_]?Calendar/i)) {
            return 'Annual Calendar';
        }
        if (input.match(/Perpetual[ -_]?Calendar/i)) {
            return 'Date';
        }
        if (input.match(/Moon[ -_]?Phase[ -_]?Calendar/i)) {
            return 'Moon Phase Calendar';
        }
        // cannot identify
        return "";
    }
}

export class getBandType implements DataMapper<string, any> {
    map(input: string): any {
        if (!input) return "";

        if (input.match(/strap|band/i)) {
            return 'Strap';
        }
        if (input.match(/bracelet|bangle/i)) {
            return 'Bracelet';
        }
        // cannot identify
        return "";
    }
}

export class getStyle implements DataMapper<string, any> {
    map(input: string): any {
        if (!input) return "";

        if (input.match(/Casual/i)) {
            return 'Casual';
        }
        if (input.match(/Dive/i)) {
            return 'Dive';
        }
        if (input.match(/Dress/i)) {
            return 'Dress';
        }
        if (input.match(/Fashion/i)) {
            return 'Fashion';
        }
        if (input.match(/luxury/i)) {
            return 'Luxury';
        }
        if (input.match(/Military/i)) {
            return 'Military';
        }
        if (input.match(/Sport/i)) {
            return 'Sport';
        }
        if (input.match(/Pilot/i)) {
            return 'Pilot';
        }
        if (input.match(/Smart/i)) {
            return 'Smart';
        }
        if (input.match(/Travel/i)) {
            return 'Travel';
        }
        // cannot identify
        return "";
    }
}

export class getDialColor implements DataMapper<string, any> {
    map(input: string): any {
        if (!input) return "";

        if (input.match(/mother of pearl/i)) {
            return 'Mother of Pearl';
        }
        if (input.match(/diamond/i)) {
            return 'Diamond';
        }
        // cannot identify
        return input;
    }
}

// export class getAttr implements DataMapper<string, any> {
//     map(input: string): any {
//         if (!input) return "";

//         // cannot identify
//         return input;
//     }
// }

