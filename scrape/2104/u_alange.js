const u = [
    "http://www.alange-soehne.com/en/timepieces/1815-annual-calendar/238026-white-gold",
    "http://www.alange-soehne.com/en/timepieces/1815-annual-calendar/238032-pink-gold",
    "http://www.alange-soehne.com/en/timepieces/1815-chronograph/414026-white-gold",
    "http://www.alange-soehne.com/en/timepieces/1815-chronograph/414028-white-gold-black-dial",
    "http://www.alange-soehne.com/en/timepieces/1815-chronograph/414031-pink-gold-black-dial",
    "http://www.alange-soehne.com/en/timepieces/1815-chronograph/414032-pink-gold",
    "http://www.alange-soehne.com/en/timepieces/1815-homage-to-walter-lange/297021-yellow-gold",
    "http://www.alange-soehne.com/en/timepieces/1815-homage-to-walter-lange/297026-white-gold",
    "http://www.alange-soehne.com/en/timepieces/1815-homage-to-walter-lange/297032-pink-gold",
    "http://www.alange-soehne.com/en/timepieces/1815-rattrapante-honeygold-homage-to-fa-lange-425050",
    "http://www.alange-soehne.com/en/timepieces/1815-rattrapante-perpetual-calendar-handwerkskunst/421048-white-gold-blue-emaille-dial",
    "http://www.alange-soehne.com/en/timepieces/1815-rattrapante-perpetual-calendar/421025f-platinum",
    "http://www.alange-soehne.com/en/timepieces/1815-rattrapante-perpetual-calendar/421032f-pink-gold",
    "http://www.alange-soehne.com/en/timepieces/1815-thin-honeygold-homage-to-fa-lange-239050",
    "http://www.alange-soehne.com/en/timepieces/1815-tourbillon-handwerkskunst/730048f-pink-gold-hand-engraved-tremblage-dial",
    "http://www.alange-soehne.com/en/timepieces/1815-tourbillon/730032f-pink-gold",
    "http://www.alange-soehne.com/en/timepieces/1815-tourbillon/730079-platinum-emaille-dial",
    "http://www.alange-soehne.com/en/timepieces/1815-updown/234026-white-gold",
    "http://www.alange-soehne.com/en/timepieces/1815-updown/234032-pink-gold",
    "http://www.alange-soehne.com/en/timepieces/1815/235026-white-gold",
    "http://www.alange-soehne.com/en/timepieces/1815/235032-pink-gold",
    "http://www.alange-soehne.com/en/timepieces/datograph-perpetual-tourbillon/740036f-platinum-black-dial",
    "http://www.alange-soehne.com/en/timepieces/datograph-perpetual-tourbillon/datograph-perpetual-tourbillon-740056",
    "http://www.alange-soehne.com/en/timepieces/datograph-perpetual/410038-white-gold-grey-dial",
    "http://www.alange-soehne.com/en/timepieces/datograph-updown-lumen/410038-platinum",
    "http://www.alange-soehne.com/en/timepieces/datograph-updown/405031-pink-gold-black-dial",
    "http://www.alange-soehne.com/en/timepieces/datograph-updown/405035-platinum-black-dial",
    "http://www.alange-soehne.com/en/timepieces/double-split/404032-pink-gold",
    "http://www.alange-soehne.com/en/timepieces/grand-complication/912032f-pink-gold",
    "http://www.alange-soehne.com/en/timepieces/grand-lange-1-moon-phase/grand-lange-1-moon-phase-25th-anniversary-139066",
    "http://www.alange-soehne.com/en/timepieces/grand-lange-1/grand-lange-1-25th-anniversary-117066",
    "http://www.alange-soehne.com/en/timepieces/grand-lange1-moonphase-lumen/139035f-platinum-semitransparent-crystal-sapphire-dial",
    "http://www.alange-soehne.com/en/timepieces/grand-lange1-moonphase/139025-platinum",
    "http://www.alange-soehne.com/en/timepieces/grand-lange1-moonphase/139032-pink-gold",
    "http://www.alange-soehne.com/en/timepieces/grand-lange1/117025-platinum",
    "http://www.alange-soehne.com/en/timepieces/grand-lange1/117028-white-gold-black-dial",
    "http://www.alange-soehne.com/en/timepieces/grand-lange1/117032-pink-gold",
    "http://www.alange-soehne.com/en/timepieces/lange-1-daymatic/lange-1-daymatic-25th-anniversary-320066",
    "http://www.alange-soehne.com/en/timepieces/lange-1-moon-phase/lange-1-moon-phase-25th-anniversary-192066",
    "http://www.alange-soehne.com/en/timepieces/lange-1-time-zone/lange-1-time-zone-136021",
    "http://www.alange-soehne.com/en/timepieces/lange-1-time-zone/lange-1-time-zone-136029",
    "http://www.alange-soehne.com/en/timepieces/lange-1-time-zone/lange-1-time-zone-136032",
    "http://www.alange-soehne.com/en/timepieces/lange-1-time-zone/lange-1-timezone-25th-anniversary-116066",
    "http://www.alange-soehne.com/en/timepieces/lange-1-tourbillon-25th-anniversary-722066",
    "http://www.alange-soehne.com/en/timepieces/lange-1-tourbillon-perpetual-calendar/lange-1-tourbillon-perpetual-calendar-25th",
    "http://www.alange-soehne.com/en/timepieces/lange-1/lange-1-25th-anniversary-191066",
    "http://www.alange-soehne.com/en/timepieces/lange1-daymatic/320028-white-gold-blue-dial",
    "http://www.alange-soehne.com/en/timepieces/lange1-moonphase/192025-platinum",
    "http://www.alange-soehne.com/en/timepieces/lange1-moonphase/192029-white-gold-black-dial",
    "http://www.alange-soehne.com/en/timepieces/lange1-moonphase/192032-pink-gold",
    "http://www.alange-soehne.com/en/timepieces/lange1-tourbillon-handwerkskunst/704048-platinum",
    "http://www.alange-soehne.com/en/timepieces/lange1-tourbillon-perpetual-calendar-handwerkskunst/720048f-platinum-hand-engraved-relief-dial",
    "http://www.alange-soehne.com/en/timepieces/lange1-tourbillon-perpetual-calendar/720032f-pink-gold",
    "http://www.alange-soehne.com/en/timepieces/lange1-tourbillon-perpetual-calendar/720038f-white-gold-grey-dial",
    "http://www.alange-soehne.com/en/timepieces/lange1/191021-yellow-gold",
    "http://www.alange-soehne.com/en/timepieces/lange1/191025-platinum",
    "http://www.alange-soehne.com/en/timepieces/lange1/191028-white-gold-blue-dial",
    "http://www.alange-soehne.com/en/timepieces/lange1/191032-pink-gold",
    "http://www.alange-soehne.com/en/timepieces/lange1/191039-white-gold",
    "http://www.alange-soehne.com/en/timepieces/lange31/130039f-white-gold-grey-dial",
    "http://www.alange-soehne.com/en/timepieces/langematik-perpetual-honeygold/langematik-perpetual-honeygold-310050",
    "http://www.alange-soehne.com/en/timepieces/little-lange-1-moon-phase/little-lange-1-moonphase-25th-anniversary-182066",
    "http://www.alange-soehne.com/en/timepieces/little-lange-1/little-lange-1-25th-anniversary-181066",
    "http://www.alange-soehne.com/en/timepieces/little-lange1-moonphase/182030-pink-gold-guilloched-dial",
    "http://www.alange-soehne.com/en/timepieces/little-lange1-moonphase/182830-pink-gold",
    "http://www.alange-soehne.com/en/timepieces/little-lange1/181037-white-gold",
    "http://www.alange-soehne.com/en/timepieces/little-lange1/181038-white-gold",
    "http://www.alange-soehne.com/en/timepieces/little-lange1/181039-pink-gold",
    "http://www.alange-soehne.com/en/timepieces/odysseus/odysseus-363038",
    "http://www.alange-soehne.com/en/timepieces/odysseus/odysseus-363068",
    "http://www.alange-soehne.com/en/timepieces/richard-lange-jumping-second/252025-platinum",
    "http://www.alange-soehne.com/en/timepieces/richard-lange-jumping-second/252032-pink-gold",
    "http://www.alange-soehne.com/en/timepieces/richard-lange-jumping-seconds/richard-lange-jumping-seconds-252029",
    "http://www.alange-soehne.com/en/timepieces/richard-lange-perpetual-calendar-terraluna/180026f-white-gold",
    "http://www.alange-soehne.com/en/timepieces/richard-lange-perpetual-calendar-terraluna/180032f-pink-gold",
    "http://www.alange-soehne.com/en/timepieces/richard-lange-pour-le-merite/260028-white-gold",
    "http://www.alange-soehne.com/en/timepieces/richard-lange-tourbillon-pour-le-merite-handwerkskunst/761050f-honey-gold-hand-engraved-tremblage-dial",
    "http://www.alange-soehne.com/en/timepieces/richard-lange-tourbillon-pour-le-merite/760026f-white-gold",
    "http://www.alange-soehne.com/en/timepieces/richard-lange-tourbillon-pour-le-merite/760032f-pink-gold",
    "http://www.alange-soehne.com/en/timepieces/richard-lange/232026-white-gold",
    "http://www.alange-soehne.com/en/timepieces/richard-lange/232032-pink-gold",
    "http://www.alange-soehne.com/en/timepieces/saxonia-annual-calendar/330025-platinum",
    "http://www.alange-soehne.com/en/timepieces/saxonia-annual-calendar/330026-white-gold",
    "http://www.alange-soehne.com/en/timepieces/saxonia-annual-calendar/330032-pink-gold",
    "http://www.alange-soehne.com/en/timepieces/saxonia-automatic/380027-white-gold",
    "http://www.alange-soehne.com/en/timepieces/saxonia-automatic/380028-white-gold-blue-dial",
    "http://www.alange-soehne.com/en/timepieces/saxonia-automatic/380033-pink-gold",
    "http://www.alange-soehne.com/en/timepieces/saxonia-automatic/380042-pink-gold-brown-dial",
    "http://www.alange-soehne.com/en/timepieces/saxonia-automatic/380044-white-gold-brown-dial",
    "http://www.alange-soehne.com/en/timepieces/saxonia-dual-time/386032-pink-gold",
    "http://www.alange-soehne.com/en/timepieces/saxonia-moonphase/384026-white-gold",
    "http://www.alange-soehne.com/en/timepieces/saxonia-moonphase/384029-white-gold-black-dial",
    "http://www.alange-soehne.com/en/timepieces/saxonia-moonphase/384031-pink-gold-black-dial",
    "http://www.alange-soehne.com/en/timepieces/saxonia-moonphase/384032-pink-gold",
    "http://www.alange-soehne.com/en/timepieces/saxonia-outsize-date/381029-white-gold-black-dial",
    "http://www.alange-soehne.com/en/timepieces/saxonia-outsize-date/381031-pink-gold-black-dial",
    "http://www.alange-soehne.com/en/timepieces/saxonia-outsize-date/saxonia-outsize-date-381026",
    "http://www.alange-soehne.com/en/timepieces/saxonia-outsize-date/saxonia-outsize-date-381032",
    "http://www.alange-soehne.com/en/timepieces/saxonia-outsize-date/saxonia-outsize-date-381041",
    "http://www.alange-soehne.com/en/timepieces/saxonia-outsize-date/saxonia-outsize-date-381043",
    "http://www.alange-soehne.com/en/timepieces/saxonia-thin/201027-white-gold",
    "http://www.alange-soehne.com/en/timepieces/saxonia-thin/201033-pink-gold",
    "http://www.alange-soehne.com/en/timepieces/saxonia-thin/205086-white-gold-blue-dial",
    "http://www.alange-soehne.com/en/timepieces/saxonia-thin/saxonia-thin-211087",
    "http://www.alange-soehne.com/en/timepieces/saxonia/216027-white-gold-grey-dial",
    "http://www.alange-soehne.com/en/timepieces/saxonia/216033-pink-gold-grey-dial",
    "http://www.alange-soehne.com/en/timepieces/saxonia/219026-white-gold",
    "http://www.alange-soehne.com/en/timepieces/saxonia/219028-white-gold-blue-dial",
    "http://www.alange-soehne.com/en/timepieces/saxonia/219032-pink-gold",
    "http://www.alange-soehne.com/en/timepieces/saxonia/219043-pink-gold-mother-of-pearl-dial",
    "http://www.alange-soehne.com/en/timepieces/saxonia/219047-white-gold-mother-of-pearl-dial",
    "http://www.alange-soehne.com/en/timepieces/tourbograph-perpetual-honeygold-homage-to-fa-lange-706050",
    "http://www.alange-soehne.com/en/timepieces/tourbograph-perpetual-pour-le-merite/706025f-platinum",
    "http://www.alange-soehne.com/en/timepieces/triple-split/424038f-white-gold-grey-dial",
    "http://www.alange-soehne.com/en/timepieces/zeitwerk-date/zeitwerk-date-148038",
    "http://www.alange-soehne.com/en/timepieces/zeitwerk-decimal-strike-honeygold/14305-honeygold",
    "http://www.alange-soehne.com/en/timepieces/zeitwerk-handwerkskunst/140048-platinum-hand-engraved-tremblage-dial",
    "http://www.alange-soehne.com/en/timepieces/zeitwerk-minute-repeater/zeitwerk-minute-repeater-147028",
    "http://www.alange-soehne.com/en/timepieces/zeitwerk-minute-repetition/147025f-platinum",
    "http://www.alange-soehne.com/en/timepieces/zeitwerk-striking-time/145029-white-gold-black-dial",
    "http://www.alange-soehne.com/en/timepieces/zeitwerk-striking-time/145032-pink-gold",
    "http://www.alange-soehne.com/en/timepieces/zeitwerk/140029-white-gold-black-dial",
    "http://www.alange-soehne.com/en/timepieces/zeitwerk/140032-pink-gold",
];

module.exports = u;