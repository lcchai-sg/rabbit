const util = require('util');
const exec = util.promisify(require('child_process').exec);

const u = [
  "https://cdn.shopify.com/s/files/1/0201/4832/2358/products/SEVENFRIDAY_WATCHES_P3C06_WebAssets_Soldier_800px_800x800.png?v=1597678243     https://synopsis.cosmos.ieplsg.com/files/5,06a4463be8aca2",
  "https://cdn.shopify.com/s/files/1/0201/4832/2358/products/M1B01_800x800_29f05cd9-5a3c-4fa0-85f6-43680c761d9b_800x800.png?v=1579707420     https://synopsis.cosmos.ieplsg.com/files/6,06a44039b3272e",
  "https://cdn.shopify.com/s/files/1/0201/4832/2358/products/SEVENFRIDAY_WATCH_M303_ROCKETBYZ_SOLDIER_2019_72dpi_png_800x800.png?v=1579521515     https://synopsis.cosmos.ieplsg.com/files/5,06a43b305bc7c1",
  "https://cdn.shopify.com/s/files/1/0201/4832/2358/products/SEVENFRIDAY_WATCH_M304_ROCKETBYZ_SOLDIER_2019_72dpi_cd0641e0-c622-4aa7-8897-ce167ae9e711_800x800.png?v=1579522099     https://synopsis.cosmos.ieplsg.com/files/6,06a43d67fb05f6",
  "https://cdn.shopify.com/s/files/1/0201/4832/2358/products/SEVENFRIDAY_WATCH_M305_ROCKETBYZ_SOLDIER_2019_72dpi_png_800x800.png?v=1579522814     https://synopsis.cosmos.ieplsg.com/files/4,06a43cc861ced6",
  "https://cdn.shopify.com/s/files/1/0201/4832/2358/products/SEVENFRIDAY_Watches_WebAssets_P3C03_Soldier_800px_800x800.png?v=1593503929     https://synopsis.cosmos.ieplsg.com/files/6,06a443f58099b9",
  "https://cdn.shopify.com/s/files/1/0201/4832/2358/products/SEVENFRIDAY_Watches_WebAssets_P3C04RedCarbon_Soldier_800px_800x800.png?v=1596616124     https://synopsis.cosmos.ieplsg.com/files/6,06a447a5536671",
  "https://cdn.shopify.com/s/files/1/0201/4832/2358/products/SEVENFRIDAY_Watches_WebAssets_P3C07WhiteCarbon_Soldier_800px_800x800.png?v=1605007585     https://synopsis.cosmos.ieplsg.com/files/5,06a44892349b82",
  "https://cdn.shopify.com/s/files/1/0201/4832/2358/products/SEVENFRIDAY_Watches_WebAssets_P3C09OrangeCarbon_Soldier_800px_800x800.png?v=1612272145     https://synopsis.cosmos.ieplsg.com/files/5,08a80e16ce8ce6",
  "https://cdn.shopify.com/s/files/1/0201/4832/2358/products/SEVENFRIDAY_Watches_WebAssets_S101M_Soldier_72dpi_800x800.png?v=1593442627     https://synopsis.cosmos.ieplsg.com/files/4,06a455929957e3",
  "https://cdn.shopify.com/s/files/1/0201/4832/2358/products/5dee652ed090e05989b6ea8d_1920x1920.png?v=1575906299     https://synopsis.cosmos.ieplsg.com/files/6,06a441dac849f8",
  "https://cdn.shopify.com/s/files/1/0201/4832/2358/products/5dee616bd090e05989b6e9a5_1920x1920.png?v=1575905590     https://synopsis.cosmos.ieplsg.com/files/5,06a43e1d221a83",
  "https://cdn.shopify.com/s/files/1/0201/4832/2358/products/5dee6511d090e05989b6ea85_1920x1920.png?v=1575906280     https://synopsis.cosmos.ieplsg.com/files/5,06a43f718757a8",
  "https://cdn.shopify.com/s/files/1/0201/4832/2358/products/5dee6495d090e05989b6ea63_1920x1920.png?v=1575906202     https://synopsis.cosmos.ieplsg.com/files/4,06a4423c64eccb",
  "https://cdn.shopify.com/s/files/1/0201/4832/2358/products/5def5c2f3684a230e58f8531_1920x1920.png?v=1575968076     https://synopsis.cosmos.ieplsg.com/files/5,06a444d097c951",
  "https://cdn.shopify.com/s/files/1/0201/4832/2358/products/P1B01M_800x800.png?v=1576677014     https://synopsis.cosmos.ieplsg.com/files/4,06a44ab16ff8a4",
  "https://cdn.shopify.com/s/files/1/0201/4832/2358/products/5dee65b2d090e05989b6eaae_1920x1920.png?v=1575906393     https://synopsis.cosmos.ieplsg.com/files/5,06a44575dd8e01",
  "https://cdn.shopify.com/s/files/1/0201/4832/2358/products/5dee623dd090e05989b6e9d2_1920x1920.png?v=1575905737     https://synopsis.cosmos.ieplsg.com/files/6,06a44dd2fca30d",
  "https://cdn.shopify.com/s/files/1/0201/4832/2358/products/5dee6265d090e05989b6e9db_1920x1920.png?v=1575905762     https://synopsis.cosmos.ieplsg.com/files/5,06a44b5f270ded",
  "https://cdn.shopify.com/s/files/1/0201/4832/2358/products/5dee64cfd090e05989b6ea73_0dd7beb9-5051-42cc-84bc-010349e5d6b4_1920x1920.png?v=1575906944     https://synopsis.cosmos.ieplsg.com/files/5,06a44c6fbddc12",
  "https://cdn.shopify.com/s/files/1/0201/4832/2358/products/5dee64ecd090e05989b6ea7b_1920x1920.png?v=1575906963     https://synopsis.cosmos.ieplsg.com/files/5,06a44e3bae4e5b",
  "https://cdn.shopify.com/s/files/1/0201/4832/2358/products/5dee6598d090e05989b6eaa6_c590d969-5547-4895-acbf-a045cf1c070f_1920x1920.png?v=1575906986     https://synopsis.cosmos.ieplsg.com/files/5,06a449bbb47b4e",
  "https://cdn.shopify.com/s/files/1/0201/4832/2358/products/5dee6299d090e05989b6e9e6_1920x1920.png?v=1575905795     https://synopsis.cosmos.ieplsg.com/files/5,06a450542bee7d",
  "https://cdn.shopify.com/s/files/1/0201/4832/2358/products/5dee6307d090e05989b6ea03_1920x1920.png?v=1575905882     https://synopsis.cosmos.ieplsg.com/files/4,06a45155ca08cc",
  "https://cdn.shopify.com/s/files/1/0201/4832/2358/products/5dee64b1d090e05989b6ea6b_367cb073-bcce-449e-a93a-71ff90fcdc50_1920x1920.png?v=1575906925     https://synopsis.cosmos.ieplsg.com/files/6,06a44f41e2b808",
  "https://cdn.shopify.com/s/files/1/0201/4832/2358/products/5dee62eed090e05989b6e9fc_1920x1920.png?v=1575905864     https://synopsis.cosmos.ieplsg.com/files/4,06a45292c198a6",
  "https://cdn.shopify.com/s/files/1/0201/4832/2358/products/5dee6321d090e05989b6ea0a_1920x1920.png?v=1575905901     https://synopsis.cosmos.ieplsg.com/files/4,06a4548b507eee",
  "https://cdn.shopify.com/s/files/1/0201/4832/2358/products/5dee6342d090e05989b6ea13_1920x1920.png?v=1575905922     https://synopsis.cosmos.ieplsg.com/files/5,06a45373a13360",
  "https://cdn.shopify.com/s/files/1/0201/4832/2358/products/5dee6616d090e05989b6eacc_1920x1920.png?v=1575906489     https://synopsis.cosmos.ieplsg.com/files/4,06a458512a3db4",
  "https://cdn.shopify.com/s/files/1/0201/4832/2358/products/5dee65f9d090e05989b6eac4_1920x1920.png?v=1575906471     https://synopsis.cosmos.ieplsg.com/files/4,06a459d664581f",
  "https://cdn.shopify.com/s/files/1/0201/4832/2358/products/5dee6631d090e05989b6ead4_1920x1920.png?v=1575906508     https://synopsis.cosmos.ieplsg.com/files/4,06a45730ff2b21",
  "https://cdn.shopify.com/s/files/1/0201/4832/2358/products/T302_800x800.png?v=1576677409     https://synopsis.cosmos.ieplsg.com/files/4,06a45a8972011a",
  "https://cdn.shopify.com/s/files/1/0201/4832/2358/products/5dee618cd090e05989b6e9ac_1920x1920.png?v=1575905609     https://synopsis.cosmos.ieplsg.com/files/6,06a45c745392cb",
  "https://cdn.shopify.com/s/files/1/0201/4832/2358/products/5dee61abd090e05989b6e9b4_1920x1920.png?v=1575905628     https://synopsis.cosmos.ieplsg.com/files/5,06a45b2411c4b3",
  "https://cdn.shopify.com/s/files/1/0201/4832/2358/products/5dee61cbd090e05989b6e9bc_1920x1920.png?v=1575905647     https://synopsis.cosmos.ieplsg.com/files/5,06a45d8b86ece3",
  "https://cdn.shopify.com/s/files/1/0201/4832/2358/products/5dee6559d090e05989b6ea9a_1920x1920.png?v=1575906334     https://synopsis.cosmos.ieplsg.com/files/4,06a45e6fbe8519",
  "https://cdn.shopify.com/s/files/1/0201/4832/2358/products/SEVENFRIDAY_Watch_OffSeries_WebAssets_T101_Soldier_800px_800x800.png?v=1594113204     https://synopsis.cosmos.ieplsg.com/files/4,06a456a514c6e6"
];

(async () => {
  for (let i = 0; i < u.length; i++) {
    const th = u[i].split('     ')[0];
    const a = u[i].split('     ')[1];
    const cmdjpg = 'open -a "Google Chrome" "' + th + '"';
    await exec(cmdjpg);
    const cmda = 'open -a "Google Chrome" "' + a + '"';
    await exec(cmda);
  }
})();
