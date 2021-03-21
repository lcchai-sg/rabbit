const u = [
  "https://www.rolex.com/watches/cellini/m50505-0009.html",
  "https://www.rolex.com/watches/cellini/m50505-0020.html",
  "https://www.rolex.com/watches/cellini/m50509-0016.html",
  "https://www.rolex.com/watches/cellini/m50509-0017.html",
  "https://www.rolex.com/watches/cellini/m50515-0008.html",
  "https://www.rolex.com/watches/cellini/m50519-0006.html",
  "https://www.rolex.com/watches/cellini/m50519-0007.html",
  "https://www.rolex.com/watches/cellini/m50519-0011.html",
  "https://www.rolex.com/watches/cellini/m50525-0016.html",
  "https://www.rolex.com/watches/cellini/m50529-0007.html",
  "https://www.rolex.com/watches/cellini/m50529-0009.html",
  "https://www.rolex.com/watches/cellini/m50535-0002.html",
  "https://www.rolex.com/watches/cosmograph-daytona/m116500ln-0001.html",
  "https://www.rolex.com/watches/cosmograph-daytona/m116500ln-0002.html",
  "https://www.rolex.com/watches/cosmograph-daytona/m116503-0004.html",
  "https://www.rolex.com/watches/cosmograph-daytona/m116503-0006.html",
  "https://www.rolex.com/watches/cosmograph-daytona/m116505-0012.html",
  "https://www.rolex.com/watches/cosmograph-daytona/m116506-0001.html",
  "https://www.rolex.com/watches/cosmograph-daytona/m116506-0002.html",
  "https://www.rolex.com/watches/cosmograph-daytona/m116508-0013.html",
  "https://www.rolex.com/watches/cosmograph-daytona/m116509-0071.html",
  "https://www.rolex.com/watches/cosmograph-daytona/m116515ln-0041.html",
  "https://www.rolex.com/watches/cosmograph-daytona/m116518ln-0048.html",
  "https://www.rolex.com/watches/cosmograph-daytona/m116519ln-0027.html",
  "https://www.rolex.com/watches/datejust/m115234-0011.html",
  "https://www.rolex.com/watches/datejust/m126234-0015.html",
  "https://www.rolex.com/watches/datejust/m126303-0019.html",
  "https://www.rolex.com/watches/datejust/m126333-0010.html",
  "https://www.rolex.com/watches/datejust/m278273-0016.html",
  "https://www.rolex.com/watches/day-date/m128238-0022.html",
  "https://www.rolex.com/watches/day-date/m128238-0069.html",
  "https://www.rolex.com/watches/day-date/m128239-0025.html",
  "https://www.rolex.com/watches/day-date/m128345rbr-0028.html",
  "https://www.rolex.com/watches/day-date/m128345rbr-0043.html",
  "https://www.rolex.com/watches/day-date/m128348rbr-0037.html",
  "https://www.rolex.com/watches/day-date/m228238-0042.html",
  "https://www.rolex.com/watches/day-date/m228239-0033.html",
  "https://www.rolex.com/watches/day-date/m228239-0046.html",
  "https://www.rolex.com/watches/day-date/m228345rbr-0002.html",
  "https://www.rolex.com/watches/day-date/m228348rbr-0002.html",
  "https://www.rolex.com/watches/day-date/m228349rbr-0003.html",
  "https://www.rolex.com/watches/explorer/m214270-0003.html",
  "https://www.rolex.com/watches/explorer/m216570-0001.html",
  "https://www.rolex.com/watches/explorer/m216570-0002.html",
  "https://www.rolex.com/watches/gmt-master-ii/m126710blnr-0002.html",
  "https://www.rolex.com/watches/gmt-master-ii/m126710blro-0001.html",
  "https://www.rolex.com/watches/gmt-master-ii/m126711chnr-0002.html",
  "https://www.rolex.com/watches/gmt-master-ii/m126715chnr-0001.html",
  "https://www.rolex.com/watches/gmt-master-ii/m126719blro-0002.html",
  "https://www.rolex.com/watches/gmt-master-ii/m126719blro-0003.html",
  "https://www.rolex.com/watches/milgauss/m116400gv-0001.html",
  "https://www.rolex.com/watches/milgauss/m116400gv-0002.html",
  "https://www.rolex.com/watches/pearlmaster/m81405rbr-0001.html",
  "https://www.rolex.com/watches/pearlmaster/m81409rbr-0001.html",
  "https://www.rolex.com/watches/pearlmaster/m86405rbr-0001.html",
  "https://www.rolex.com/watches/pearlmaster/m86409rbr-0001.html",
  "https://www.rolex.com/watches/sea-dweller/m126600-0001.html",
  "https://www.rolex.com/watches/sea-dweller/m126603-0001.html",
  "https://www.rolex.com/watches/sea-dweller/m126660-0001.html",
  "https://www.rolex.com/watches/sea-dweller/m126660-0002.html",
  "https://www.rolex.com/watches/sky-dweller/m326933-0001.html",
  "https://www.rolex.com/watches/sky-dweller/m326933-0002.html",
  "https://www.rolex.com/watches/sky-dweller/m326933-0009.html",
  "https://www.rolex.com/watches/sky-dweller/m326934-0001.html",
  "https://www.rolex.com/watches/sky-dweller/m326934-0003.html",
  "https://www.rolex.com/watches/sky-dweller/m326934-0005.html",
  "https://www.rolex.com/watches/sky-dweller/m326935-0007.html",
  "https://www.rolex.com/watches/sky-dweller/m326938-0004.html",
  "https://www.rolex.com/watches/submariner/m116613ln-0001.html",
  "https://www.rolex.com/watches/yacht-master/m116680-0002.html",
  "https://www.rolex.com/watches/yacht-master/m116681-0002.html",
  "https://www.rolex.com/watches/yacht-master/m116688-0002.html",
  "https://www.rolex.com/watches/yacht-master/m116689-0002.html",
  "https://www.rolex.com/watches/yacht-master/m126621-0001.html",
  "https://www.rolex.com/watches/yacht-master/m126622-0002.html",
  "https://www.rolex.com/watches/yacht-master/m126655-0005.html",
  "https://www.rolex.com/watches/yacht-master/m226659-0002.html",
  "https://www.rolex.com/watches/yacht-master/m268621-0003.html",
  "https://www.rolex.com/watches/yacht-master/m268621-0004.html",
  "https://www.rolex.com/watches/yacht-master/m268622-0002.html",
  "https://www.rolex.com/watches/yacht-master/m268655-0010.html",
];

module.exports = u;