const SitemapGenerator = require('advanced-sitemap-generator');

// create generator
const generator = SitemapGenerator('https://www.zenith-watches.com/', {
  stripQuerystring: false,
  ignoreHreflang: true,
  filepath: './zenith1_sitemap.xml',
});

// register event listeners
generator.on('done', () => {
  // sitemaps created
  console.log('generate completed')
});

// start the crawler
generator.start();