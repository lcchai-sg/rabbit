const u = [
    "https://shop.ballwatch.ch/en/AeroGMTII40?model=DG2118C-S11C-BE",
    "https://shop.ballwatch.ch/en/AeroGMTII40?model=DG2118C-S3C-BE",
    "https://shop.ballwatch.ch/en/AeroGMTII40?model=DG2118C-S9C-BE",
    "https://shop.ballwatch.ch/en/AeroGMTII?model=DG2018C-P10C-BE",
    "https://shop.ballwatch.ch/en/AeroGMTII?model=DG2018C-P11C-BE",
    "https://shop.ballwatch.ch/en/AeroGMTII?model=DG2018C-P3C-BE",
    "https://shop.ballwatch.ch/en/AeroGMTII?model=DG2018C-P4C-BE",
    "https://shop.ballwatch.ch/en/AeroGMTII?model=DG2018C-P9C-BE",
    "https://shop.ballwatch.ch/en/AeroGMTII?model=DG2018C-PC-BE",
    "https://shop.ballwatch.ch/en/AeroGMTII?model=DG2018C-S10C-BE",
    "https://shop.ballwatch.ch/en/AeroGMTII?model=DG2018C-S11C-BE",
    "https://shop.ballwatch.ch/en/AeroGMTII?model=DG2018C-S3C-BE",
    "https://shop.ballwatch.ch/en/AeroGMTII?model=DG2018C-S4C-BE",
    "https://shop.ballwatch.ch/en/AeroGMTII?model=DG2018C-S9C-BE",
    "https://shop.ballwatch.ch/en/AeroGMTII?model=DG2018C-SC-BE",
    "https://shop.ballwatch.ch/en/CM1052D-S7J?model=CM1052D-S7J-BE",
    "https://shop.ballwatch.ch/en/CM1052D-S7J?model=CM1052D-S7J-BK",
    "https://shop.ballwatch.ch/en/CM1052D-S7J?model=CM1052D-S7J-WH",
    "https://shop.ballwatch.ch/en/CM2192C-L4A-GY",
    "https://shop.ballwatch.ch/en/CM2198C-S1CJ?model=CM2198C-S1CJ-BE",
    "https://shop.ballwatch.ch/en/CM2198C-S1CJ?model=CM2198C-S1CJ-SL",
    "https://shop.ballwatch.ch/en/CM2198C-S3C-BE",
    "https://shop.ballwatch.ch/en/CM2198C-S3C-BK",
    "https://shop.ballwatch.ch/en/CM3188D-SCJ-BE",
    "https://shop.ballwatch.ch/en/CM3188D-SCJ-BK",
    "https://shop.ballwatch.ch/en/CM3388D?model=CM3388D-L-BE",
    "https://shop.ballwatch.ch/en/CM3388D?model=CM3388D-S-BK",
    "https://shop.ballwatch.ch/en/DC3026A-NEDU?model=DC3026A-P3C-BE",
    "https://shop.ballwatch.ch/en/DC3026A-NEDU?model=DC3026A-S3C-BE",
    "https://shop.ballwatch.ch/en/DC3030C-S-BE",
    "https://shop.ballwatch.ch/en/DC3030C-S-BK",
    "https://shop.ballwatch.ch/en/DD3072B-P1CJ-BE",
    "https://shop.ballwatch.ch/en/DD3072B-P1CJ-BK",
    "https://shop.ballwatch.ch/en/DG2018C-S7C-BE",
    "https://shop.ballwatch.ch/en/DG2018C-S7C-BK",
    "https://shop.ballwatch.ch/en/DG2118C-S7C-BE",
    "https://shop.ballwatch.ch/en/DG2118C-S7C-BK",
    "https://shop.ballwatch.ch/en/DG2232A-PC-BE",
    "https://shop.ballwatch.ch/en/DG2232A-PC-BK",
    "https://shop.ballwatch.ch/en/DG2232A-SC-BE",
    "https://shop.ballwatch.ch/en/DG2232A-SC-BK",
    "https://shop.ballwatch.ch/en/DG3030B-S1CJ-BE",
    "https://shop.ballwatch.ch/en/DG3030B-S1CJ-BK",
    "https://shop.ballwatch.ch/en/DG3030B-S2C-BK",
    "https://shop.ballwatch.ch/en/DG3030B-S2C-GR",
    "https://shop.ballwatch.ch/en/DG3030B-S3C-BK",
    "https://shop.ballwatch.ch/en/DG3030B-S3C-BR",
    "https://shop.ballwatch.ch/en/DG3030B-S4C-BE",
    "https://shop.ballwatch.ch/en/DG3030B-S4C-BK",
    "https://shop.ballwatch.ch/en/DG3030B-S5C-BK",
    "https://shop.ballwatch.ch/en/DG3030B-S5C-GR",
    "https://shop.ballwatch.ch/en/DG3030B-S7CJ-BE",
    "https://shop.ballwatch.ch/en/DG3030B-S7CJ-BK",
    "https://shop.ballwatch.ch/en/DG3030B-S7CJ-WH",
    "https://shop.ballwatch.ch/en/DG3038A-S1C-BE",
    "https://shop.ballwatch.ch/en/DG3038A-S1C-BK",
    "https://shop.ballwatch.ch/en/DG3038A-S1C-WH",
    "https://shop.ballwatch.ch/en/DG3038A-S2C-BE",
    "https://shop.ballwatch.ch/en/DG3038A-S2C-BK",
    "https://shop.ballwatch.ch/en/DG3038A-S2C-WH",
    "https://shop.ballwatch.ch/en/DM2076C-S2CA-BE",
    "https://shop.ballwatch.ch/en/DM2076C-S2CA-BK",
    "https://shop.ballwatch.ch/en/DM2218B?model=DM2218B-PCJ-BK",
    "https://shop.ballwatch.ch/en/DM2218B?model=DM2218B-SCJ-BK",
    "https://shop.ballwatch.ch/en/DM2276A-S3CJ-BE",
    "https://shop.ballwatch.ch/en/DM2276A-S3CJ-BK",
    "https://shop.ballwatch.ch/en/DM2276A?model=DM2276A-PCJ-BK",
    "https://shop.ballwatch.ch/en/DM2276A?model=DM2276A-SCJ-BK",
    "https://shop.ballwatch.ch/en/DM3002A?model=DM3002A-P2C-BK",
    "https://shop.ballwatch.ch/en/DM3002A?model=DM3002A-S2C-BK",
    "https://shop.ballwatch.ch/en/DM3050B-S2CJ-BK",
    "https://shop.ballwatch.ch/en/DM3070B-P1CJ-BE",
    "https://shop.ballwatch.ch/en/DM3070B-P1CJ-BK",
    "https://shop.ballwatch.ch/en/DM3130B-S7CJ-BK",
    "https://shop.ballwatch.ch/en/DM3130B-S7CJ-GR",
    "https://shop.ballwatch.ch/en/DM3208B-P2-BE",
    "https://shop.ballwatch.ch/en/DM3308A?model=DM3308A-P1C-BE",
    "https://shop.ballwatch.ch/en/DM3308A?model=DM3308A-PCJ-BK",
    "https://shop.ballwatch.ch/en/DM3308A?model=DM3308A-S1C-BE",
    "https://shop.ballwatch.ch/en/DM3308A?model=DM3308A-SCJ-BK",
    "https://shop.ballwatch.ch/en/DT3030B-S3-BKC",
    "https://shop.ballwatch.ch/en/DT3030B-S4-BEC",
    "https://shop.ballwatch.ch/en/Ducks-NM2188C-S19-BK",
    "https://shop.ballwatch.ch/en/EIINavigator?model=GM1086C-L3-BK",
    "https://shop.ballwatch.ch/en/EIINavigator?model=GM1086C-S3-BK",
    "https://shop.ballwatch.ch/en/EMIIVoyager?model=GM2126C-LBK-BE",
    "https://shop.ballwatch.ch/en/EMIIVoyager?model=GM2126C-LJBK-BE",
    "https://shop.ballwatch.ch/en/EMIIVoyager?model=GM2126C-SJ-BK",
    "https://shop.ballwatch.ch/en/EMIIVoyager?model=GM2128C-LBK-BE",
    "https://shop.ballwatch.ch/en/EMIIVoyager?model=GM2128C-LJBK-BE",
    "https://shop.ballwatch.ch/en/EMIIVoyager?model=GM2128C-SJ-BK",
    "https://shop.ballwatch.ch/en/EMMarvelight?model=NM2032C-S1C-BE",
    "https://shop.ballwatch.ch/en/EMMarvelight?model=NM2032C-S1C-BK",
    "https://shop.ballwatch.ch/en/EMMarvelight?model=NM2032C-S1C-GY",
    "https://shop.ballwatch.ch/en/EMMarvelight?model=NM2128C-S1C-BE",
    "https://shop.ballwatch.ch/en/EMMarvelight?model=NM2128C-S1C-BK",
    "https://shop.ballwatch.ch/en/EMMarvelight?model=NM2128C-S1C-GY",
    "https://shop.ballwatch.ch/en/GM9020C-SC-BE",
    "https://shop.ballwatch.ch/en/GM9020C-SC-BK",
    "https://shop.ballwatch.ch/en/GM9020C-SC-BR",
    "https://shop.ballwatch.ch/en/Icebreaker-PM3030C-S-BE",
    "https://shop.ballwatch.ch/en/Icebreaker-PM3030C-S-BK",
    "https://shop.ballwatch.ch/en/Icebreaker-PM3030C-S-WH",
    "https://shop.ballwatch.ch/en/Icebreaker-PM3030C-SC-BE",
    "https://shop.ballwatch.ch/en/Icebreaker-PM3030C-SC-BK",
    "https://shop.ballwatch.ch/en/Icebreaker-PM3030C-SC-WH",
    "https://shop.ballwatch.ch/en/M_Icebreaker-NM9030B-S1C-BE",
    "https://shop.ballwatch.ch/en/M_Icebreaker-NM9030B-S1C-BK",
    "https://shop.ballwatch.ch/en/M_Icebreaker-NM9030B-S1C-WH",
    "https://shop.ballwatch.ch/en/M_Icebreaker-NM9030B-SC-BE",
    "https://shop.ballwatch.ch/en/M_Icebreaker-NM9030B-SC-BK",
    "https://shop.ballwatch.ch/en/M_Icebreaker-NM9030B-SC-WH",
    "https://shop.ballwatch.ch/en/Midsize - DL2016B-S3CAJ-WH",
    "https://shop.ballwatch.ch/en/Moon_Navigator-DM3320C-SAJ-BE",
    "https://shop.ballwatch.ch/en/Moon_Navigator-DM3320C-SAJ-BK",
    "https://shop.ballwatch.ch/en/ND2186C-L1C-BE",
    "https://shop.ballwatch.ch/en/ND2186C-L1C-BK",
    "https://shop.ballwatch.ch/en/NL1026C-SJ?model=NL1026C-SJ-BK",
    "https://shop.ballwatch.ch/en/NL1026C?model=NL1026C-S4A--BE",
    "https://shop.ballwatch.ch/en/NL2080D-SJ-BK",
    "https://shop.ballwatch.ch/en/NL2098C-S3J?model=NL2098C-S3J-BK",
    "https://shop.ballwatch.ch/en/NM1058D-S3J-WH",
    "https://shop.ballwatch.ch/en/NM1080C?model=NM1080C-L13-BK",
    "https://shop.ballwatch.ch/en/NM1080C?model=NM1080C-S13-BK",
    "https://shop.ballwatch.ch/en/NM2026C-04CAJ-SL?model=NM2026C-L4CAJ-SL",
    "https://shop.ballwatch.ch/en/NM2026C-04CAJ-SL?model=NM2026C-S4CAJ-SL",
    "https://shop.ballwatch.ch/en/NM2026C-19?model=NM2026C-S19-BE",
    "https://shop.ballwatch.ch/en/NM2026C-19?model=NM2026C-S19-BK",
    "https://shop.ballwatch.ch/en/NM2026C-S12A-BE",
    "https://shop.ballwatch.ch/en/NM2026C-S15CJ?model=NM2026C-S15CJ-BE",
    "https://shop.ballwatch.ch/en/NM2026C-S27C-BE",
    "https://shop.ballwatch.ch/en/NM2026C-S27C-BK",
    "https://shop.ballwatch.ch/en/NM2026C-S27C-SL",
    "https://shop.ballwatch.ch/en/NM2026C-S28C-BK",
    "https://shop.ballwatch.ch/en/NM2026C-S31C-BE",
    "https://shop.ballwatch.ch/en/NM2026C-S31C-BK",
    "https://shop.ballwatch.ch/en/NM2026C-S31C-SL",
    "https://shop.ballwatch.ch/en/NM2026C-S6J?model=NM2026C-S6J-SL",
    "https://shop.ballwatch.ch/en/NM2028C-19?model=NM2028C-S19-BE",
    "https://shop.ballwatch.ch/en/NM2028C-19?model=NM2028C-S19-BK",
    "https://shop.ballwatch.ch/en/NM2028C-20?model=NM2028C-LBK20-BE",
    "https://shop.ballwatch.ch/en/NM2028C-20?model=NM2028C-LBK20-BK",
    "https://shop.ballwatch.ch/en/NM2028C-20?model=NM2028C-LBR20-BE",
    "https://shop.ballwatch.ch/en/NM2028C-20?model=NM2028C-LBR20-BK",
    "https://shop.ballwatch.ch/en/NM2028C-L13A?model=NM2028C-L13A-BE",
    "https://shop.ballwatch.ch/en/NM2028C-L13A?model=NM2028C-L13A-BK",
    "https://shop.ballwatch.ch/en/NM2028C-L4CJ-BK",
    "https://shop.ballwatch.ch/en/NM2028C-S31C-BE",
    "https://shop.ballwatch.ch/en/NM2028C-S31C-BK",
    "https://shop.ballwatch.ch/en/NM2028C-S31C-SL",
    "https://shop.ballwatch.ch/en/NM2050C?model=NM2050C-P1A-BK",
    "https://shop.ballwatch.ch/en/NM2050C?model=NM2050C-S1A-BK",
    "https://shop.ballwatch.ch/en/NM2080D-S1J?model=NM2080D-S1J-BE",
    "https://shop.ballwatch.ch/en/NM2080D-S1J?model=NM2080D-S1J-BK",
    "https://shop.ballwatch.ch/en/NM2080D-S1J?model=NM2080D-S1J-SL",
    "https://shop.ballwatch.ch/en/NM2098C-S20J-BK",
    "https://shop.ballwatch.ch/en/NM2098C?model=NM2098C-S4J-BE",
    "https://shop.ballwatch.ch/en/NM2098C?model=NM2098C-S4J-BK",
    "https://shop.ballwatch.ch/en/NM2098C?model=NM2098C-S4J-SL",
    "https://shop.ballwatch.ch/en/NM2098C?model=NM2098C-S5J-BE",
    "https://shop.ballwatch.ch/en/NM2098C?model=NM2098C-S5J-BK",
    "https://shop.ballwatch.ch/en/NM2098C?model=NM2098C-S5J-SL",
    "https://shop.ballwatch.ch/en/NM2098C?model=NM2098C-S6J-BE",
    "https://shop.ballwatch.ch/en/NM2098C?model=NM2098C-S6J-BK",
    "https://shop.ballwatch.ch/en/NM2098C?model=NM2098C-S6J-SL",
    "https://shop.ballwatch.ch/en/NM2126C-03?model=NM2126C-S3A-BEYE",
    "https://shop.ballwatch.ch/en/NM2126C-03?model=NM2126C-S3A-BKGR",
    "https://shop.ballwatch.ch/en/NM2126C-S5C-BE1?model=NM2126C-S5C-BE1",
    "https://shop.ballwatch.ch/en/NM2126C-S5C-BE1?model=NM2126C-S5C-BE2",
    "https://shop.ballwatch.ch/en/NM2126C-S5C-BK1?model=NM2126C-S5C-BK1",
    "https://shop.ballwatch.ch/en/NM2126C-S5C-BK1?model=NM2126C-S5C-BK2",
    "https://shop.ballwatch.ch/en/NM2128C-SCA-BE",
    "https://shop.ballwatch.ch/en/NM2128C-SCA-BK",
    "https://shop.ballwatch.ch/en/NM2182C-S2J-BK",
    "https://shop.ballwatch.ch/en/NM2186C-L3J-BK",
    "https://shop.ballwatch.ch/en/NM2186C-L4J?model=NM2186C-L4J-BE",
    "https://shop.ballwatch.ch/en/NM2282C-SJ-GY",
    "https://shop.ballwatch.ch/en/NM3026C?model=NM3026C-L1CJ-BE",
    "https://shop.ballwatch.ch/en/NM3026C?model=NM3026C-L1CJ-BK",
    "https://shop.ballwatch.ch/en/NM3026C?model=NM3026C-P1CJ-BE",
    "https://shop.ballwatch.ch/en/NM3026C?model=NM3026C-P1CJ-BK",
    "https://shop.ballwatch.ch/en/NM3080D-SJ-GY",
    "https://shop.ballwatch.ch/en/NM3082D-SJ?model=NM3082D-SJ-BE",
    "https://shop.ballwatch.ch/en/NM3280D-S1CJ?model=NM3280D-S1CJ-BE",
    "https://shop.ballwatch.ch/en/NM3280D-S1CJ?model=NM3280D-S1CJ-BK",
    "https://shop.ballwatch.ch/en/NM3280D-S1CJ?model=NM3280D-S1CJ-SL",
    "https://shop.ballwatch.ch/en/NM3288D-SJ-WH",
    "https://shop.ballwatch.ch/en/NM3288D-trainmaster-endeavour",
    "https://shop.ballwatch.ch/en/NM3288D-trainmaster-endeavour?model=NM3288D-L2C-WH",
    "https://shop.ballwatch.ch/en/NM3288D-trainmaster-endeavour?model=NM3288D-S2C-WH",
    "https://shop.ballwatch.ch/en/NM3888D-S1CJ-WH",
    "https://shop.ballwatch.ch/en/NM9028C-S29C-BK",
    "https://shop.ballwatch.ch/en/NM9032C-S2C-BE?model=NM9032C-S2C-BE2",
    "https://shop.ballwatch.ch/en/NM9032C-S2C-BK?model=NM9032C-S2C-BK2",
    "https://shop.ballwatch.ch/en/NM9032C-S2C-GR?model=NM9032C-S2C-GR2",
    "https://shop.ballwatch.ch/en/NT2222C-S1C-BEC",
    "https://shop.ballwatch.ch/en/NT2222C?model=NT2222C-P2C-BEC",
    "https://shop.ballwatch.ch/en/NT2222C?model=NT2222C-S1C-BEC",
    "https://shop.ballwatch.ch/en/NT2222C?model=NT2222C-S1C-BKC",
    "https://shop.ballwatch.ch/en/NT2222C?model=NT2222C-S2C-BEC",
    "https://shop.ballwatch.ch/en/NT2222C?model=NT2222C-S2C-BKC",
    "https://shop.ballwatch.ch/en/Original-DM2118B-SCJ-BK",
    "https://shop.ballwatch.ch/en/PM9026C-S3C-BE?model=PM9026C-S3C-BE1",
    "https://shop.ballwatch.ch/en/PM9026C-S3C-BE?model=PM9026C-S3C-BE2",
    "https://shop.ballwatch.ch/en/PM9026C-S3C-BK?model=PM9026C-S3C-BK1",
    "https://shop.ballwatch.ch/en/PM9026C-S3C-BK?model=PM9026C-S3C-BK2",
    "https://shop.ballwatch.ch/en/PM9026C-S3C-SL?model=PM9026C-S3C-SL1",
    "https://shop.ballwatch.ch/en/PM9026C-S3C-SL?model=PM9026C-S3C-SL2",
    "https://shop.ballwatch.ch/en/PW1098E-WH",
    "https://shop.ballwatch.ch/en/Skipper-DM3030B-S7CJ-BE",
    "https://shop.ballwatch.ch/en/Skipper-DM3030B-S7CJ-GY",
    "https://shop.ballwatch.ch/en/Skipper-DM3050B-S7CJ-BE",
    "https://shop.ballwatch.ch/en/Skipper-DM3050B-S7CJ-GY",
    "https://shop.ballwatch.ch/en/Skipper-DM3130B-S3CJ-BE",
    "https://shop.ballwatch.ch/en/Skipper-DM3130B-S3CJ-GY",
    "https://shop.ballwatch.ch/en/Skipper-DM3150B-S3CJ-BE",
    "https://shop.ballwatch.ch/en/Skipper-DM3150B-S3CJ-GY",
    "https://shop.ballwatch.ch/en/StarLight_Bronze-DD3072B-LC-BE",
    "https://shop.ballwatch.ch/en/StarLight_Bronze-DD3072B-LC-BR",
    "https://shop.ballwatch.ch/en/StarLight_Bronze-DM3070B-LC-BE",
    "https://shop.ballwatch.ch/en/StarLight_Bronze-DM3070B-LC-BR",
    "https://shop.ballwatch.ch/en/Starlight-DM3050B-S4-BK",
    "https://shop.ballwatch.ch/en/Starlight-DM3050B-S5-BE",
    "https://shop.ballwatch.ch/en/Starlight-DM3050B-S5-BK",
    "https://shop.ballwatch.ch/en/Starlight-DM3050B-S6-GR",
    "https://shop.ballwatch.ch/en/Submarine - DC2276A[bracelet]-BK?model=DC2276A-PJ-BK",
    "https://shop.ballwatch.ch/en/Submarine - DC2276A[bracelet]-BK?model=DC2276A-SJ-BK",
    "https://shop.ballwatch.ch/en/TMT-DT3050B-S3-BKF",
    "https://shop.ballwatch.ch/en/TMT-DT3050B-S4-BEF",
    "https://shop.ballwatch.ch/en/Vanguard-DG3036B-S1C-BE",
    "https://shop.ballwatch.ch/en/Vanguard-DG3036B-S1C-BK",
    "https://shop.ballwatch.ch/en/Vanguard-DG3036B-S2C-BE",
    "https://shop.ballwatch.ch/en/Vanguard-DG3036B-S2C-BK",
    "https://shop.ballwatch.ch/en/armor40?model=NM2026C-S32C-BE1",
    "https://shop.ballwatch.ch/en/armor40?model=NM2026C-S32C-BK1",
    "https://shop.ballwatch.ch/en/armor43?model=NM2028C-S32C-BE1",
    "https://shop.ballwatch.ch/en/armor43?model=NM2028C-S32C-BK1",
    "https://shop.ballwatch.ch/en/fireman-glory",
    "https://shop.ballwatch.ch/en/fireman-glory-463224001",
    "https://shop.ballwatch.ch/en/fireman-racer",
    "https://shop.ballwatch.ch/en/fireman-racer-1945220343",
    "https://shop.ballwatch.ch/en/pulsemeter_GMT_MSF",
    "https://shop.ballwatch.ch/en/pulsemeter_chronograph_MSF",
    "https://shop.ballwatch.ch/en/rms_worldtime_610",
    "https://shop.ballwatch.ch/en/rms_worldtime_611",
    "https://shop.ballwatch.ch/en/rms_worldtime_612",
    "https://shop.ballwatch.ch/en/rms_worldtime_613",
    "https://shop.ballwatch.ch/en/rms_worldtime_614",
    "https://shop.ballwatch.ch/en/rms_worldtime_615",
];

module.exports = u;