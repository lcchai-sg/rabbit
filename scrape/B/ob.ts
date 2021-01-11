import { MongoClient } from 'mongodb';
import { EMPTY, of, Subject } from "rxjs";
import { expand, filter, map, mergeAll } from "rxjs/operators";

const d = {
  "source": "watchesofmayfair", "lang": "en", "collections": ["all"],
  "items": {
    "all": [{
      "source": "watchesofmayfair", "lang": "en", "brand": "Breitling", "brandID": 118,
      "url": "https://watchesofmayfair.com/brand/breitling/professional-collection/breitling-exospace-b55-new-eb5510h1-be79-263s-e20dsa-2",
      "name": "Breitling Exospace B55 EB5510H1.BE79.263S.E20DSA.2",
      "reference": "EB5510H1.BE79.263S.E20DSA.2", "price": "€4,287 excl. tax",
      "thumbnail": "https://watchesofmayfair.com/media/catalog/product/cache/aefcd4d8d5c59ba860378cf3cd2e94da/e/b/eb5510h1be79263se20dsa.2_image-01.jpg"
    },
    {
      "source": "watchesofmayfair", "lang": "en", "brand": "Breitling", "brandID": 118,
      "url": "https://watchesofmayfair.com/brand/breitling/professional-collection/breitling-exospace-b55-new-eb5510h1-be79-245s-e20dsa-2",
      "name": "Breitling Exospace B55 EB5510H1.BE79.245S.E20DSA.2",
      "reference": "EB5510H1.BE79.245S.E20DSA.2", "price": "€4,287 excl. tax",
      "thumbnail": "https://watchesofmayfair.com/media/catalog/product/cache/aefcd4d8d5c59ba860378cf3cd2e94da/e/b/eb5510h1.be79.245s.e20dsa.2_image-01_1.jpg"
    },
    {
      "source": "watchesofmayfair", "lang": "en", "brand": "Breitling", "brandID": 118,
      "url": "https://watchesofmayfair.com/brand/breitling/professional-collection/breitling-exospace-b55-new-eb5510h1-be79-181e",
      "name": "Breitling Exospace B55 EB5510H1.BE79.181E",
      "reference": "EB5510H1.BE79.181E", "price": "€4,577 excl. tax",
      "thumbnail": "https://watchesofmayfair.com/media/catalog/product/cache/aefcd4d8d5c59ba860378cf3cd2e94da/e/b/eb5510h1.be79.181e_image-01_1.jpg"
    },
    {
      "source": "watchesofmayfair", "lang": "en", "brand": "Breitling", "brandID": 118,
      "url": "https://watchesofmayfair.com/brand/breitling/professional-collection/breitling-aerospace-evo-e793637v-g817-152e",
      "name": "Breitling Aerospace Evo E793637V.G817.152E",
      "reference": "E793637V.G817.152E", "price": "€3,006 excl. tax",
      "thumbnail": "https://watchesofmayfair.com/media/catalog/product/cache/aefcd4d8d5c59ba860378cf3cd2e94da/b/r/breitling-aerospace-evo-e793637v-g817-152e_image-01.png"
    },
    {
      "source": "watchesofmayfair", "lang": "en", "brand": "Breitling", "brandID": 118,
      "url": "https://watchesofmayfair.com/brand/breitling/navitimer-collection/breitling-navitimer-gmt-rb044121-bd30-441x-r20ba-1",
      "name": "Breitling Navitimer GMT RB044121.BD30.441X.R20BA.1",
      "reference": "RB044121.BD30.441X.R20BA.1", "price": "€16,071 excl. tax",
      "thumbnail": "https://watchesofmayfair.com/media/catalog/product/cache/aefcd4d8d5c59ba860378cf3cd2e94da/b/r/breitling-navitimer-gmt-rb044121-bd30-441x-r20ba-1.jpg"
    },
    {
      "source": "watchesofmayfair", "lang": "en", "brand": "Breitling", "brandID": 118,
      "url": "https://watchesofmayfair.com/brand/breitling/navitimer-collection/breitling-navitimer-01-rb012012-q606-739p-r20ba-1",
      "name": "Breitling Navitimer 01 RB012012.Q606.739P.R20BA.1",
      "reference": "RB012012.Q606.739P.R20BA.1", "price": "€12,177 excl. tax",
      "thumbnail": "https://watchesofmayfair.com/media/catalog/product/cache/aefcd4d8d5c59ba860378cf3cd2e94da/b/r/breitling-navitimer-01-rb012012-q606-739p-r20ba-1.jpg"
    },
    {
      "source": "watchesofmayfair", "lang": "en", "brand": "Breitling", "brandID": 118,
      "url": "https://watchesofmayfair.com/brand/breitling/navitimer-collection/breitling-navitimer-01-rb012012-bb07-447r",
      "name": "Breitling Navitimer 01 RB012012.BB07.447R",
      "reference": "RB012012.BB07.447R", "price": "€28,923 excl. tax",
      "thumbnail": "https://watchesofmayfair.com/media/catalog/product/cache/aefcd4d8d5c59ba860378cf3cd2e94da/b/r/breitling-navitimer-01-rb012012-bb07-447r.jpg"
    },
    {
      "source": "watchesofmayfair", "lang": "en", "brand": "Breitling", "brandID": 118,
      "url": "https://watchesofmayfair.com/brand/breitling/navitimer-collection/breitling-navitimer-01-rb012012-ba49-435x-r20ba-1",
      "name": "Breitling Navitimer 01 RB012012.BA49.435X.R20BA.1",
      "reference": "RB012012.BA49.435X.R20BA.1", "price": "€11,929 excl. tax",
      "thumbnail": "https://watchesofmayfair.com/media/catalog/product/cache/aefcd4d8d5c59ba860378cf3cd2e94da/b/r/breitling-navitimer-01-rb012012-ba49-435x-r20ba-1.jpg"
    },
    {
      "source": "watchesofmayfair", "lang": "en", "brand": "Breitling", "brandID": 118,
      "url": "https://watchesofmayfair.com/brand/breitling/galactic-collection/breitling-galactic-unitime-sleekt-wb3510u4-bd94-743p-a20ba-1",
      "name": "Breitling Galactic Unitime SleekT WB3510U4.BD94.743P.A20BA.1",
      "reference": "WB3510U4.BD94.743P.A20BA.1", "price": "€4,791 excl. tax",
      "thumbnail": "https://watchesofmayfair.com/media/catalog/product/cache/aefcd4d8d5c59ba860378cf3cd2e94da/b/r/breitling-galactic-unitime-sleekt-wb3510u4-bd94-743p-a20ba-1.jpg"
    },
    {
      "source": "watchesofmayfair", "lang": "en", "brand": "Breitling", "brandID": 118,
      "url": "https://watchesofmayfair.com/brand/breitling/galactic-collection/breitling-galactic-unitime-sleekt-wb3510u4-bd94-375a",
      "name": "Breitling Galactic Unitime SleekT WB3510U4.BD94.375A",
      "reference": "WB3510U4.BD94.375A", "price": "€5,277 excl. tax",
      "thumbnail": "https://watchesofmayfair.com/media/catalog/product/cache/aefcd4d8d5c59ba860378cf3cd2e94da/b/r/breitling-galactic-unitime-sleekt-wb3510u4-bd94-375a.jpg"
    },
    {
      "source": "watchesofmayfair", "lang": "en", "brand": "Breitling", "brandID": 118,
      "url": "https://watchesofmayfair.com/brand/breitling/galactic-collection/breitling-galactic-unitime-sleekt-wb3510u0-a777-375a",
      "name": "Breitling Galactic Unitime SleekT WB3510U0.A777.375A",
      "reference": "WB3510U0.A777.375A", "price": "€5,277 excl. tax",
      "thumbnail": "https://watchesofmayfair.com/media/catalog/product/cache/aefcd4d8d5c59ba860378cf3cd2e94da/b/r/breitling-galactic-unitime-sleekt-wb3510u0-a777-375a.jpg"
    },
    {
      "source": "watchesofmayfair", "lang": "en", "brand": "Breitling", "brandID": 118, "url": "https://watchesofmayfair.com/brand/breitling/galactic-collection/breitling-galactic-32-a71356l2-ba10-208x-a14ba-1", "name": "Breitling Galactic 32 A71356L2.BA10.208X.A14BA.1",
      "reference": "A71356L2.BA10.208X.A14BA.1", "price": "€1,956 excl. tax",
      "thumbnail": "https://watchesofmayfair.com/media/catalog/product/cache/aefcd4d8d5c59ba860378cf3cd2e94da/b/r/breitling-a71356l2-ba10-208x-a14ba-1_image.jpg"
    }]
  }
};

const source = new Subject();
source
  .pipe(
    expand((d, i) => {
      console.log('d : ', d);
      console.log('i : ', i)
    }),
    mergeAll()
  )
  .subscribe(data => {

  })