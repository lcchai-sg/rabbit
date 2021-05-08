const u = [
    "https://nomos-glashuette.com/en/ahoi/ahoi-555",
    "https://nomos-glashuette.com/en/ahoi/ahoi-atlantic-552",
    "https://nomos-glashuette.com/en/ahoi/ahoi-date-siren-blue-554",
    "https://nomos-glashuette.com/en/ahoi/ahoi-datum-fur-aerzte-ohne-grenzen-deutschland-551-s2",
    "https://nomos-glashuette.com/en/ahoi/ahoi-neomatik-560",
    "https://nomos-glashuette.com/en/ahoi/ahoi-neomatik-atlantic-561",
    "https://nomos-glashuette.com/en/ahoi/ahoi-neomatik-fur-aerzte-ohne-grenzen-deutschland-560-s1",
    "https://nomos-glashuette.com/en/ahoi/ahoi-neomatik-siren-blue-562",
    "https://nomos-glashuette.com/en/ahoi/ahoi-neomatik-siren-red-563",
    "https://nomos-glashuette.com/en/ahoi/ahoi-neomatik-siren-white-564",
    "https://nomos-glashuette.com/en/autobahn/autobahn-neomatik-41-date-1301",
    "https://nomos-glashuette.com/en/autobahn/autobahn-neomatik-41-date-midnight-blue-1302",
    "https://nomos-glashuette.com/en/autobahn/autobahn-neomatik-41-date-sports-gray-1303",
    "https://nomos-glashuette.com/en/club/club-701",
    "https://nomos-glashuette.com/en/club/club-automatic-date-775",
    "https://nomos-glashuette.com/en/club/club-automatic-date-atlantic-776",
    "https://nomos-glashuette.com/en/club/club-automatic-date-siren-blue-777",
    "https://nomos-glashuette.com/en/club/club-campus-38-735",
    "https://nomos-glashuette.com/en/club/club-campus-38-night-736",
    "https://nomos-glashuette.com/en/club/club-campus-708",
    "https://nomos-glashuette.com/en/club/club-campus-neomatik-39-765",
    "https://nomos-glashuette.com/en/club/club-campus-neomatik-39-midnight-blue-767",
    "https://nomos-glashuette.com/en/club/club-campus-neomatik-748",
    "https://nomos-glashuette.com/en/club/club-neomatik-740",
    "https://nomos-glashuette.com/en/club/club-neomatik-atlantic-741",
    "https://nomos-glashuette.com/en/club/club-neomatik-siren-blue-742",
    "https://nomos-glashuette.com/en/club/club-neomatik-siren-red-743",
    "https://nomos-glashuette.com/en/club/club-neomatik-siren-white-744",
    "https://nomos-glashuette.com/en/club/club-sport-neomatik-42-date-black-781",
    "https://nomos-glashuette.com/en/lambda/lambda-175-years-watchmaking-glashutte-960-s1",
    "https://nomos-glashuette.com/en/lambda/lambda-175-years-watchmaking-glashutte-960-s2",
    "https://nomos-glashuette.com/en/lambda/lambda-175-years-watchmaking-glashutte-960-s3",
    "https://nomos-glashuette.com/en/lambda/lambda-39-952",
    "https://nomos-glashuette.com/en/lambda/lambda-39-953",
    "https://nomos-glashuette.com/en/lambda/lambda-39-velvet-black-954",
    "https://nomos-glashuette.com/en/lambda/lambda-deep-blue-935",
    "https://nomos-glashuette.com/en/lambda/lambda-rose-gold-930",
    "https://nomos-glashuette.com/en/lambda/lambda-rose-gold-932",
    "https://nomos-glashuette.com/en/lambda/lambda-white-gold-931",
    "https://nomos-glashuette.com/en/lambda/lambda-white-gold-933",
    "https://nomos-glashuette.com/en/ludwig/ludwig-175-years-watchmaking-glashutte-205-s2",
    "https://nomos-glashuette.com/en/ludwig/ludwig-201",
    "https://nomos-glashuette.com/en/ludwig/ludwig-33-243",
    "https://nomos-glashuette.com/en/ludwig/ludwig-33-champagne-247",
    "https://nomos-glashuette.com/en/ludwig/ludwig-33-duo-240",
    "https://nomos-glashuette.com/en/ludwig/ludwig-33-duo-enamel-white-242",
    "https://nomos-glashuette.com/en/ludwig/ludwig-38-235",
    "https://nomos-glashuette.com/en/ludwig/ludwig-38-date-231",
    "https://nomos-glashuette.com/en/ludwig/ludwig-38-enamel-white-236",
    "https://nomos-glashuette.com/en/ludwig/ludwig-automatic-251",
    "https://nomos-glashuette.com/en/ludwig/ludwig-automatic-date-271",
    "https://nomos-glashuette.com/en/ludwig/ludwig-neomatik-282",
    "https://nomos-glashuette.com/en/ludwig/ludwig-neomatik-39-175-years-watchmaking-glashutte-250-s1",
    "https://nomos-glashuette.com/en/ludwig/ludwig-neomatik-39-250",
    "https://nomos-glashuette.com/en/ludwig/ludwig-neomatik-41-date-175-years-watchmaking-glashutte-261-s1",
    "https://nomos-glashuette.com/en/ludwig/ludwig-neomatik-41-date-260",
    "https://nomos-glashuette.com/en/ludwig/ludwig-neomatik-41-date-261",
    "https://nomos-glashuette.com/en/ludwig/ludwig-neomatik-champagne-283",
    "https://nomos-glashuette.com/en/lux/lux-hermelin-940",
    "https://nomos-glashuette.com/en/lux/lux-white-gold-920",
    "https://nomos-glashuette.com/en/lux/lux-white-gold-light-921",
    "https://nomos-glashuette.com/en/lux/lux-zikade-941",
    "https://nomos-glashuette.com/en/lux/lux-zobel-942",
    "https://nomos-glashuette.com/en/metro/metro-38-1109",
    "https://nomos-glashuette.com/en/metro/metro-38-date-1102",
    "https://nomos-glashuette.com/en/metro/metro-38-date-urban-gray-1103",
    "https://nomos-glashuette.com/en/metro/metro-38-urban-gray-1112",
    "https://nomos-glashuette.com/en/metro/metro-date-power-reserve-1101",
    "https://nomos-glashuette.com/en/metro/metro-neomatik-1106",
    "https://nomos-glashuette.com/en/metro/metro-neomatik-39-1113",
    "https://nomos-glashuette.com/en/metro/metro-neomatik-39-midnight-blue-1115",
    "https://nomos-glashuette.com/en/metro/metro-neomatik-39-silvercut-1114",
    "https://nomos-glashuette.com/en/metro/metro-neomatik-champagne-1107",
    "https://nomos-glashuette.com/en/metro/metro-neomatik-midnight-blue-1110",
    "https://nomos-glashuette.com/en/metro/metro-rose-gold-33-1170",
    "https://nomos-glashuette.com/en/metro/metro-rose-gold-neomatik-39-1180",
    "https://nomos-glashuette.com/en/minimatik/minimatik-1203",
    "https://nomos-glashuette.com/en/minimatik/minimatik-champagne-1204",
    "https://nomos-glashuette.com/en/minimatik/minimatik-midnight-blue-1205",
    "https://nomos-glashuette.com/en/orion/orion-1989-326",
    "https://nomos-glashuette.com/en/orion/orion-1989-385",
    "https://nomos-glashuette.com/en/orion/orion-301",
    "https://nomos-glashuette.com/en/orion/orion-33-321",
    "https://nomos-glashuette.com/en/orion/orion-33-champagne-327",
    "https://nomos-glashuette.com/en/orion/orion-33-duo-319",
    "https://nomos-glashuette.com/en/orion/orion-33-midnight-blue-330",
    "https://nomos-glashuette.com/en/orion/orion-33-rose-325",
    "https://nomos-glashuette.com/en/orion/orion-33-white-324",
    "https://nomos-glashuette.com/en/orion/orion-38-387",
    "https://nomos-glashuette.com/en/orion/orion-38-date-380",
    "https://nomos-glashuette.com/en/orion/orion-38-date-white-381",
    "https://nomos-glashuette.com/en/orion/orion-38-gray-383",
    "https://nomos-glashuette.com/en/orion/orion-38-midnight-blue-388",
    "https://nomos-glashuette.com/en/orion/orion-38-white-386",
    "https://nomos-glashuette.com/en/orion/orion-anthracite-307",
    "https://nomos-glashuette.com/en/orion/orion-neomatik-39-340",
    "https://nomos-glashuette.com/en/orion/orion-neomatik-39-midnight-blue-343",
    "https://nomos-glashuette.com/en/orion/orion-neomatik-39-silvercut-342",
    "https://nomos-glashuette.com/en/orion/orion-neomatik-39-white-341",
    "https://nomos-glashuette.com/en/orion/orion-neomatik-392",
    "https://nomos-glashuette.com/en/orion/orion-neomatik-41-date-360",
    "https://nomos-glashuette.com/en/orion/orion-neomatik-41-date-midnight-blue-363",
    "https://nomos-glashuette.com/en/orion/orion-neomatik-41-date-olive-gold-364",
    "https://nomos-glashuette.com/en/orion/orion-neomatik-champagne-393",
    "https://nomos-glashuette.com/en/orion/orion-rose-352",
    "https://nomos-glashuette.com/en/orion/orion-white-331",
    "https://nomos-glashuette.com/en/tangente/tangente-101",
    "https://nomos-glashuette.com/en/tangente/tangente-33-122",
    "https://nomos-glashuette.com/en/tangente/tangente-33-champagne-150",
    "https://nomos-glashuette.com/en/tangente/tangente-33-duo-120",
    "https://nomos-glashuette.com/en/tangente/tangente-33-gray-125",
    "https://nomos-glashuette.com/en/tangente/tangente-33-karat-126",
    "https://nomos-glashuette.com/en/tangente/tangente-38-165",
    "https://nomos-glashuette.com/en/tangente/tangente-38-date-130",
    "https://nomos-glashuette.com/en/tangente/tangente-38-midnight-blue-166",
    "https://nomos-glashuette.com/en/tangente/tangente-date-power-reserve-131",
    "https://nomos-glashuette.com/en/tangente/tangente-midnight-blue-132",
    "https://nomos-glashuette.com/en/tangente/tangente-neomatik-175",
    "https://nomos-glashuette.com/en/tangente/tangente-neomatik-39-140",
    "https://nomos-glashuette.com/en/tangente/tangente-neomatik-39-midnight-blue-142",
    "https://nomos-glashuette.com/en/tangente/tangente-neomatik-39-silvercut-141",
    "https://nomos-glashuette.com/en/tangente/tangente-neomatik-41-update-180",
    "https://nomos-glashuette.com/en/tangente/tangente-neomatik-41-update-ruthenium-181",
    "https://nomos-glashuette.com/en/tangente/tangente-neomatik-champagne-176",
    "https://nomos-glashuette.com/en/tangente/tangente-neomatik-midnight-blue-177",
    "https://nomos-glashuette.com/en/tangente/tangente-power-reserve-172",
    "https://nomos-glashuette.com/en/tangente/tangente-sport-neomatik-42-date-580",
    "https://nomos-glashuette.com/en/tangente/tangente-sport-neomatik-42-date-marine-black-581",
    "https://nomos-glashuette.com/en/tangomat/tangomat-641",
    "https://nomos-glashuette.com/en/tangomat/tangomat-date-602",
    "https://nomos-glashuette.com/en/tangomat/tangomat-fur-aerzte-ohne-grenzen-deutschland-601-s13",
    "https://nomos-glashuette.com/en/tangomat/tangomat-gmt-635",
    "https://nomos-glashuette.com/en/tangomat/tangomat-ruthenium-603",
    "https://nomos-glashuette.com/en/tangomat/tangomat-ruthenium-date-604",
    "https://nomos-glashuette.com/en/tetra/tetra-27-401",
    "https://nomos-glashuette.com/en/tetra/tetra-27-champagne-473",
    "https://nomos-glashuette.com/en/tetra/tetra-27-duo-405",
    "https://nomos-glashuette.com/en/tetra/tetra-27-karat-472",
    "https://nomos-glashuette.com/en/tetra/tetra-408",
    "https://nomos-glashuette.com/en/tetra/tetra-azure-496",
    "https://nomos-glashuette.com/en/tetra/tetra-claerchen-489",
    "https://nomos-glashuette.com/en/tetra/tetra-divine-spark-443",
    "https://nomos-glashuette.com/en/tetra/tetra-fidelio-449",
    "https://nomos-glashuette.com/en/tetra/tetra-goldelse-491",
    "https://nomos-glashuette.com/en/tetra/tetra-grenadine-498",
    "https://nomos-glashuette.com/en/tetra/tetra-immortal-beloved-447",
    "https://nomos-glashuette.com/en/tetra/tetra-kleene-492",
    "https://nomos-glashuette.com/en/tetra/tetra-matcha-495",
    "https://nomos-glashuette.com/en/tetra/tetra-nachtijall-490",
    "https://nomos-glashuette.com/en/tetra/tetra-neomatik-39-421",
    "https://nomos-glashuette.com/en/tetra/tetra-neomatik-39-midnight-blue-422",
    "https://nomos-glashuette.com/en/tetra/tetra-neomatik-39-silvercut-423",
    "https://nomos-glashuette.com/en/tetra/tetra-ode-to-joy-445",
    "https://nomos-glashuette.com/en/tetra/tetra-pearl-497",
    "https://nomos-glashuette.com/en/tetra/tetra-plum-499",
    "https://nomos-glashuette.com/en/zurich/zurich-806",
    "https://nomos-glashuette.com/en/zurich/zurich-date-802",
    "https://nomos-glashuette.com/en/zurich/zurich-world-time-805",
    "https://nomos-glashuette.com/en/zurich/zurich-world-time-midnight-blue-807",
];

module.exports = u;