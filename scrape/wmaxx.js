const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

(async () => {
  const entry = "https://www.watchmaxx.com/watches";
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(entry, { waitUntil: 'domcontentloaded' });

  let content = await page.content();
  console.log(content);
  process.exit(0)
  // var $ = cheerio.load(content);
})();