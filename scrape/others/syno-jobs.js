const jobs = [
  // 1. About Vintage
  {
    "dryRun": false,
    "payload": {
      "base": "https://www.rado.cn",
      "strategy": "rado",
      "command": "indexing",
      "context": {
        "entry": "https://www.rado.cn/collections",
        "brand": "rado",
        "brandID": 160,
        "lang": "zh"
      }
    }
  },
];

module.exports = jobs;