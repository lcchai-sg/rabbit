const hs = [
	"Rose Gold-tone",
	"Alpha",
	"Rose Gold",
	"18kt Everose Gold",
	"Stick",
	"Silver Diamond",
	"Black Roman Numeral",
	"Luminous Silver-tone",
	"Silver-tone",
	"Rose-Gold Tone",
	"Luminous",
	"Gold Tone",
	"Gold-Toned",
	"Silver-Tone",
	"Luminous Black",
	"Luminous Silver-tone Mercedes-logo, sword, and Breguet-style shape",
	"Rolex Professional (Maxi)",
	"Yellow Gold-Tone Mercedes-logo, sword, and Breguet-style shape",
	"Yellow Gold Mercedes-logo, sword, and Breguet-style shape",
	"Luminous Mercedes-logo, sword, and Breguet-style shape",
	"Yellow Gold-Tone",
	"Gold-tone Mercedes-logo, sword, and Breguet-style shape",
	"Silver-tone Mercedes-logo, sword, and Breguet-style shape",
	"Yellow Gold-tone",
	"Luminous Yellow Gold-tone Mercedes-logo, sword, and Breguet-style shape",
	"Gold-tone",
	"Luminous Blue",
	"Luminous Yellow Gold-tone",
	"Yellow Gold",
	"Luminous Everose Gold",
	"Luminous Rose Gold",
	"Proprietary ",
	"Arrow",
	"Blue Steel",
	"Losange",
	"Rose Gold-Tone",
	"Gold-Tone",
	"Dauphine",
	"Mercedes",
	"Yellow-Gold Tone",
	"Feuille",
	"Luminous Everose Gold-tone",
	"Black",
	"Blue",
	"Silver-toned",
	"Sword",
	"Luminous Silver-toned",
	"Everose Gold-tone",
	"Luminous Silver-tone Mercedes-logo, sword shape",
	"Baton",
	"Dauphines",
	"Everose Gold",
	"Luminous Gold-tone",
	"Luminous Yellow Gold-tone Mercedes-logo, sword shape",
	"Blue Sword-shaped",
	"Black Opalin",
	"Sword-shaped Blue",
	"Black Sword Shaped",
	"Blued Steel",
	"Luminous Steel Hands and Index Hour Markers With 3 Sub-dials on a Skeleton",
	"Luminous Grey",
	"hands with white luminescent",
	"Rose Gold Tone Hands And Arabic Numeral Hour Markers With 3 Sub-dials on a Black",
	"Luminousn Silver-tone",
	"Rose Gold tone",
	"Luminous Blue Arrow-shaped",
	"Black Chronograph",
	"Silver-tone Mercedes-logo, sword, shape",
	"Skeleton",
	"Hours, minutes, seconds",
	"Black with Date at 3",
	"Blue with Date at 3",
	"Black Linear Design with Date at 3",
	"Lumious",
	"Silver tone luminous hands and Index hour markers with minute markers around the outer rim and 3 Sub-dials on a Blue",
	"Silver toned hands and Index hour markers on a Blue Sunray",
	"Grey",
	"Orange",
	"Luminous Red and Blue",
	"Black Skeleton",
	"Luminous Rose Gold-tone",
	"Silver-tone and Blue",
	"Black with Silver Index Hour Markers and Hands",
	"Red luminous hands and Black luminous index hour markers with 3 Sub-dials, minute markers around the outer rim and Red accents on a Black",
	"Luminous Beige",
	"Luminous Copper",
	"Arabic",
	"Black with Day-Date at 3, Rose Gold Tone Hands and Markers",
	"Silver toned hands and Index hour markers on a Blue",
	"Rhodium-plated",
	"Polished Rhodium-plated",
	"Hours, minutes, seconds at 9",
	"Polished Rhodium plated hands and Index hour markers on a Black",
	"Brushed Silver tone hands and index hour markers with 2 sub-dials on a flat black",
	"Rhodium- Plated",
	"Black Guilloche",
	"Blue Skeletal Steel",
	"Luminous hands and Arabic numerals/Index hour markers with a small seconds sub-dial on a Brown",
	"Silver tone hands and Index hour markers with minute markers around the outer rim on a Blue",
	"Silver",
	"Mother of Pearl with 11 Diamond Hour Markers and Date at 3",
	"Hours, minutes",
	"Hours, minutes, seconds at 3",
	"Mother Of Pearl",
	"Red and Black",
	" blued-steel sword-shaped hands",
	"Silver tone luminous hands and Index hour markers with minute markers around the outer rim and a Seconds Sub-dial on a Lacquered Black",
	"Cathedrale",
	"Luminous Gunmetal",
	"Silver luminous hands and Arabic numeral/index hour markers on a black Dial",
	"Metal skeleton Superluminova-filled hour and minute hands",
	"Metal skeletonised Superluminova®-filled hour and minute hands",
	"Métal skeletonized hour and minute hands filled with sand-coloured Superluminova®",
	"Black-toned",
	"Silver tone hands and Roman Numerals/Index hour markers with 3 floating diamonds on a Black",
	"Yellow Chronograph with Date at 4",
	"18K Everose Gold",
	"Luminous Bronze",
	"Silver Tone Hands And Index Hour Markers on Blue Sunray",
	"Luminous Everose Gold Mercedes-logo, sword, and Breguet-style shape",
	"Luminous Pink Gold-tone",
	"Silver tone luminous hands and Index hour markers with minute markers around the outer rim on a Black",
	"Blue-tone",
	"Poire",
	"Spade",
	"Rhodium",
	"Silver tone hands and Arabic numeral/Index hour markers with red accents and alarm power reserve shown on a disc at 3 o'clock, date hand and counter at 6 o'clock and on/off indicator for alarm function at 9 o'clock on a black",
	"Silver tone hands and Arabic numeral/Index hour markers with red accents and alarm power reserve shown on a disc at 3 o'clock, date hand and counter at 6 o'clock and on/off indicator for alarm function at 9 o'clock on a Cognac",
	"Hands covered with black Superluminova®",
	"Hands, numerals and indices coated in Superluminova®C3",
	"Luminbous Gold-tone",
	"Everose",
	" Blued-steel sword-shaped hands",
	"18K Sedna Gold",
	"Orange and Silver-tone",
	"Metal skeletonised Super-LumiNova®-filled hands",
	"Polished Steel",
	"Pink Gold-tone",
	"Arabic,Roman",
	"Volcano Black Chronograph with Luminescent Hands and Markers, Date Between 4 and 5",
	"Luminous Everrose Gold",
	"White Gold",
	"Mother of Pearl Diamond",
	"Silver tone hands and Index hour markers on a Black",
	"Scoties",
	"Luminous Skeleton",
	"Silver-tone Skeleton",
	"MOP White with Roman Numerals",
	"Silvered polished hands",
	"Black with Roman Numerals",
	"Silver Index Arabic",
	"Pink",
	"White Mother of Pearl with Diamonds",
	"Luminous Orange",
	"Amoled Touch Screen Display",
	"White with Index Numerals",
	"White with Arabic + Index Numerals",
	"Skeletal",
	"Black hands",
	"White Hour and Orange Minute luminous hands with index hour markers and minute markers around the outer rim on a Grey Dial",
	"Baguette",
	"Black Arabic Numerals and Blue Luminescent Hands on White",
	"White with Luminescent Index Hour Markers",
	"Red gold-plated dauphine hands and blued second hands",
	"Red gold-plated dauphine hands and blued date hand",
	"Yellow Gold hands and Index hour markers with minute markers around the outer rim and 3 Sub-dials featuring a representation of Apollo and the moon on a Blue",
	"Silver tone luminous hands and Index hour markers with minute markers around the outer rim and 3 White Sub-dials on a Blue ,Light Blue and Orange",
	"Rose gold hands and Index hour markers on a Black",
	"Silver tone hands and Index hour markers on a Blue",
	"Silver Tone Hands And Index Hour Markers With Cutaway Exposing The Heart Of The Movement - The Escapement And 2 Sub-dials on Silver",
	"Black with Date at 3, SuperLuminova Filled Hands and Markers, GMT/24hr Feature with Red Hand Indicator",
	" sword-shaped hands in blued steel",
	"Black Hands and Index Hour Markers on a Genuine Berluti Patinated Venezia Black Leather",
	"Silver tone luminous hands and Index hour markers with minute markers around the outer rim, Power reserve indicator and Sub-dials on a Blue Skeleton",
	"Ruthenium plated luminous hands and Index hour markers with minute markers around the outer rim and 3 Sub-dials on a Skeleton",
	"Luminous hands and Index/Circle hour markers with minute markers around the outer rim on a Black",
	" sword-shaped hands",
	"Red",
	"Rhodium-plated hour markers and hands",
	"Gold hour markers and hands",
	"Blue tone hands and alternating Arabic Numerals/Index hour markers with minute markers around the outer rim on a Black",
	"Arabic,roman",
	"Luminous Brown",
	"Rhodium Plated luminous filled hands and Index hour markers with minute markers around the outer rim and 3 Black Sub-dials on a Silver",
	"18kt Rose Gold",
	"Luminescent rhodium-coated hours and minutes hands and red-colored seconds hand",
	"Black with rose gold hands",
	"Rose Gold Hands And Roman Numeral hour marker on Chocolate",
	"Mother of Pearl Roman Numeral",
	"Applied Steel Luminous filled hands and Index hour markers with minute markers around the outer rim on a Horizontal Linear Textured Silver",
	"Luminous hands and Arabic Numeral hour markers with 24 hour markings and minute markers around the outer rim on a Beige",
	"Rhodium plated hands and Index hour markers with 3 Sub-dials on a Open Skeleton",
	"Black with Arabic Numerals and Luminious Hands",
	"Black Luminous hands and Index hour markers with minute markers around the outer rim and Red accents on a Black",
	"Silver with Date at 3, SuperLuminova Filled Hands and Markers, GMT/24hr Feature with Red Hand Indicator",
	"Blue steel hands",
	"Blue Leaf-style shape",
	"Yellow Gold-tone Dauphine-style shape",
	"Black Luminous hands and Index hour markers with minute markers around the outer rim and Red accents on a Black Carbon Fiber",
	"Blue Breguet-style shape",
	"Black/White",
	"Silver tone luminous hands and Index hour markers with minute markers around the outer rim, Power reserve indicator and Sub-dials on a Skeletonized with Black and Blue Accents",
	"Rhodium Plated Hands and Index Hour Markers With Cut- out Exposing Heart of Movement- Escapement And 2 Sub-Dials on a Black",
	"Metal skeleton Superluminova®-filled hour and minute hands",
	"Silver-tone Sword-shaped",
	"Blued steel hands",
	"Black Chronograph with Date at 6",
	"Black Luminous hands and Index hour markers with minute markers around the outer rim and Red accents on a Silver",
	"Polished Rose Gold Plated hands and Roman Numerals/Circle hour markers with minute markers around the outer rim on a Textured Silver",
	"Black Sandwich Dial with Luminous Arabic Numerals and Hour markers",
	"Blue dial and rhodium plated luminescent indexes",
	"Silver-tone Polished",
	"Gilt skeletonised Superluminova®-filled hour and minute hands",
	"Metal skeletonized Superluminova®-filled hour and minute hands",
	"Sand-coloured Superluminova®-filled metal skeleton hour and minute hands",
	"Grey Leaf-style shape",
	"Silver-plated with Superluminova Green Inlay,",
	"steel, tempered blue",
	"rhodium-plated, with superluminova inlay in white, seconds hand neon orange",
	"rhodium-plated, faceted",
	"Silver tone luminous hands and Roman numeral hour markers with minute markers around the outer rim on a Black",
	"Silver tone hands and Index/ Arabic numeral hour markers with minute markers around the outer rim on a Anthracite",
	"Silver with Arabic + Index Numerals",
	"oxidized black, seconds hand red",
	"rhodium-plated, seconds hand red",
	"Rhodium-plated, seconds hand neon orange",
	"Luminous Silver tone hands and index hour markers With minute markers around outer rim and 3 sub-dials on a Black",
	"polished and rhodium-plated",
	"polished and rhodium-plated, seconds hand neon orange",
	"Steel, tempered blue",
	"Luminous Silver tone hands and Index hour markers With minute markers around outer rim and 3 sub-dials on a Black",
	"rhodium-plated, seconds hand neon orange",
	"steel, tempered blue, seconds hand red",
	"Black with Arabic + Index Numerals",
	"Luminous Grey hands and index hour markers With minute markers around outer rim and 3 sub-dials on a silver",
	"Silver with Arabic and Index Numerals",
	"rhodium-plated, hour hand with superluminova inlay in blue (blue luminescence)",
	"red",
	"rhodium-plated",
	"Blue-toned",
	"Rhodium Plated hands and Index hour markers with minute markers around the outer rim on a Black Smoked",
	"Black Hour Hand, Sandblasted Rhodium Minute Hand",
	"Silver with Day-Date at 3",
	"Luminour Black",
	"18k Sedna Rose Gold",
	"Silver-tone Leaf-style shape",
	"Luminous Yellow gold tone hands and index hour markers on Mother of Pearl",
	"Rose Gold Luminous filled hands and Index hour markers with minute markers around the outer rim on a Horizontal Linear Textured Silver",
	"Blue with Arabic + Index Numerals",
	"Pink Mother of Pearl with Rose Gold Hands and Diamond Hour Markers",
	"Rose Gold Plated luminous filled hands and Arabic numeral hour markers with 3 sub-dials on a Silver",
	"White Mother Of Pearl",
	"Luminous silver tone hands and Index/Arabic Numeral hour markers with minute markers around the outer rim and a Power reserve Sub-dials and Red Accents on a Black",
	"Blued steel feuille and baton hands",
	"18 K red gold-coated feuille hands",
	"Silver tone hands and Index hour markers on a Green",
	"Silver with Roman Numerals",
	"White Index",
	"Luminous Bronze Cathedral-style",
	"Luminous hands and hour markers on Blue",
	"Red gold-plated feuille and baton hands",
	"Pink hands",
	"Yellow gold-tone hands and Roman Numeral hour markers on Ivory",
	"Blued steel feuille hands",
	"Silver with Rose Gold Tone Hands and Markers, Date at 3",
	"Red gold-plated hands",
	"Silver Arabic",
	"18 K red gold-coated feuille and baton hands",
	"Black carbon",
	"18 K red gold-coated sword and blued baton hands",
	"Luminescent rhodium-coated hours and minutes hands, red-colored chronograph hand, rhodium-coated second time zone hand",
	"Rhodium-plated regate and baton hands, luminescent hour and minute hands",
	"Steel",
	"Blue Luminous",
	"Black Sword-shaped",
	"Gold-tone Spade-shaped",
	"Black and Rose Gold-tone",
	"Rose gold plated",
	"Red gold-plated sword and blued baton hands",
	"Rhodium plated feuille hands",
	"Embossed Dial with diamond markers",
	"Silver tone luminous hands and Index/Roman Numeral hour markers with minute markers around the outer rim on a Silver",
	"Luminescent rhodium-plated hours and minutes hands and red-coloured seconds hand",
	"MOP White with Index Numerals",
	"Rose Gold-tone Leaf-style shape",
	"White stick",
	"Gilt hands",
	"Silver tone luminous hands and Index hour markers with 3 Sub-dials on a Silver",
	"Silvered sandy hands",
	"Rhodium-coated sword hands",
	"Rose Gold-Plated Leaf-style",
	"Luminous Fill Silver-tone",
	"Gold-toned",
	"Gold",
	"White with Day & Date Calendar and Moonphase Features",
	"Silver Chronograph with Date at 6",
	"Blue-Steel Leaf-style shape",
	"Blue with Arabic Numeral Markers",
	"Gold-tone Leaf-style shape",
	"Rose Gold tone Hands and Index Hour Markers with minute markers around the outer rim on a White Dial",
	"Yellow Gold tone luminous hands and Index hour markers with minute markers around the outer rim on a Silver",
	"White-Gold",
	"Silver-tone Lance-style",
	"Luminous Silver-tone Snowflake-shape",
	"Rose Gold tone hands",
	"5N Rose Gold Hands and Hour Markers on a White Mother of Pearl",
	"Black Arabic Hour Markers and Blue Steeled Hands on a Silver Dial",
	"Silver tone luminous hands and Index hour markers with minute markers around the outer rim and 3 Black Sub-dials on a Silver Dial",
	"Silver Opaline with Roman Numeral Hour Markers and Blued Steel Hands",
	"Black Honeycomb Structure",
	"Rose Gold hands and Roman Numeral hour markers on a Silver",
	"Silver tone luminous hands and Diamond hour markers with minute markers around the outer rim on a Black Mother of Pearl",
	"Mercedes-logo, sword, and Breguet-style shape",
	"Silver tone luminous hands and Index hour markers with minute markers around the outer rim on a Anthracite Grey",
	"Silver toned luminous hands and Arabic Numerals/Index hour markers with minute markers around the outer rim and 2 Sub-Dials on a Skeleton",
	"Mother of Pearl with Rose Gold Hands and Roman Numerals",
	"Silver tone hands with Diamond hour markers on a Mother of Pearl",
	"Luminous silver-tone hands and index hour markers With minute markers around outer rim and 3 sub-dials on a black",
	"Luminous Grey-tone",
	"Rose Gold Tone hands and Index hour markers with minute markers around the outer rim on a White",
	"Silver tone hands with alternating Roman Numerals and Index hour markers on a Black",
	"Yellow Gold-tone Skeleton",
	"Blue with Silver Hands and Roman Numerals",
	"Black Opalin with Silver Luminescent Hands and Index Hour Markers",
	"rhodium-plated, with superluminova inlay in light blue, seconds hand neon orange",
	" sword-shaped hands in steel",
	"Rhodium Plated luminous filled hands and Index hour markers with 3 sub-dials on a Black Opalin",
	"Luminous Black Arrow-shaped",
	"Rose Gold tone hands and Diamond hour markers on a Mother of Pearl",
	"Rose Gold-tone Skeleton",
	"Yellow Gold Alpha-style",
	"Polished Rhodium plated hands and Index hour markers on a Silver",
	"Blue Steel luminous hands and Arabic Numeral hour markers with minute markers around the outer rim on a Black",
	"Silver tone hands and Index hour markers on a Grey",
	"Silver tone luminous hands and alternating Arabic Numerals/Index hour markers with minute markers around the outer rim and 2 Sub-dials on a Matte Blue Skeleton",
	"Rhodium-Plated, Blue Superluminova",
	"gold-plated, with superluminova inlay in green, seconds hand neon orange",
	"tempered blue",
	"polished and rhodium-plated, seconds hand red",
	"Florale",
	"rhodium-plated, with superluminova inlay in white (blue luminescence), seconds hand neon orange",
	"rhodium-plated, hour hand with superluminova inlay in white (blue luminescence)",
	"Mother of Pearl with Diamonds",
	"Red (Hour Hand)",
	"Numerals and hands Superluminova BG W9",
	"Indices, numbers and hands with Superluminova C1/C3\r\n",
	"Indices and hands Superluminova light old radium",
	"Indices and hands Superluminova BG W9",
	"Indices and hands Superluminova dark orange",
	"Luminous filled hands and Index hour markers with minute markers around the outer rim on a Black",
	"gold-plated",
	"Polished Rhodium plated hands and Index hour markers on a Blue",
	"Yellow Gold hands and Diamond hour markers on a Mother of Pearl",
	"Silver with Luminous Hands and Hour Markers",
	"Silver tone hands and Index hour markers with minute markers aorund the outer rim and 3 Sub-dials on a Skeleton",
	"Gold-plated skeletonised Super-LumiNova®-filled hands",
	"Silver tone luminous hands and Index hour markers with 3 Silver 'Clous de Paris' Design Sub-Dials on a Black Dial",
	"black, with red inlay",
	"Rose gold plated hands and Index hour markers with 3 Sub-dials on a Open Skeleton",
	"Blue hour markers and hands",
	"Rose-gold sword-shaped hands",
	"Rose Gold tone hands and Arabic Numeral hour markers with minute markers around the inner rim on a White Dial",
	"Gold-tone Dauphine-style shape",
	"Hour and minute hands",
	"Luminous Gold-toned",
	"Midnight Blue with Diamond Markers and an Aquila Constilation represented by Diamonds on",
	"Metal skeletonised Super-LumiNova®-filled hour and minute hands",
	"Blue rimmed sub-dials with Yellow large central hand seconds counter on Silver",
	"hour and minute hands in gold",
	"Silver Chronograph",
	"rhodium-plated, hour and minute hands with white superluminova inlay (blue luminescence)",
	"rose gold, hour and minute hands with white superluminova inlay (blue luminescence)",
	"White with Index Hour Markers",
	"Silver tone hands and Diamond hour markers on a White",
	"Polished rhodium plated hands and hour markers on a blue mother of pearl",
	"Silver tone luminous hands and Index hour markers with minute markers around the outer rim on a Blue Sunray",
	"Mother of Pearl with Diamond Hour markers",
	"Matte Black Dial With Luminious hour and minute hand",
	"tempered blue, with superluminova inlay in white (blue luminescence), seconds hand red",
	"Yellow gold tone hands and Diamond hour markers on Mother of Pearl",
	"Silver with Roman + Index Numerals",
	"Silver tone hands and Index hour markers with minute markers around the outer rim on a Black Open Heart",
	"Rose gold tone hands and alternating Roman Numerals/Index hour markers with minute markers around the outer rim on a Silver",
	"Silver tone hands and Arabic numeral/index hour markers on a silver",
	"Pink Gold",
	"Rhodium-plated with White Luminescent",
	"Blue with Rose gold minute and hour hands on",
	"Blue Steeled hands and Black roman numeral hour markers on a silver opaline",
	"Silver Tone Luminous hands and diamond hour markers on a black Mother of Pearl",
	"Silver Luminous Hands And Index Hour Markers with Red Accents and 3 Sub-dials on a Brown Skeleton",
	"Blue-Arabic Numerals",
	"Silver Luminous hands and Index Hour markers with a seconds sub-dial on a White",
	"Rose Gold plated luminous hands and Index hour markers with 3 Sub-dials on a Skeleton",
	"Skeleton with silver flange",
	"oxidized black",
	"Mother of Pearl with Rose Gold Hands and Index Hour Markers",
	"Rose Gold hands and Index hour markers with Minute markers around the outer rim and 3 sub-dials on a Black Skeleton",
	"Blue with Rose Gold Minute and Hour Hand with White Luminescent Markers",
	"Rhodium plated hands and index hour markers on a pink mother of pearl",
	"Silver tone hands and Index hour markers with minute markers around the outer rim and 2 Sub-dials on a Black",
	"Hands covered with orange Super-LumiNova®",
	"rhodium-plated, hour and minute hands with superluminova inlay in dark blue",
	"Luminescent rhodium-coated dauphine hour and minute hands, blued steel baton second and chronograph hands",
	"rhodium-plated, hour and minute hands with sand-colored superluminova inlay, seconds hand red",
	"Rose Gold Toned Hands and Hour Markers",
	"Gold-tone Cathedral-style",
	"rhodium-plated, hour and minute hands with superluminova inlay in white",
	"Blue hands",
	"White Gold hands on a Time sub-dial with Arabic Numeral/Index hour markers, a Second sub-dial and a Power Reserve Indicator on a Grey Dial",
	"Silver tone hands",
	"Black Breguet-style shape",
	"Metal skeleton Super-LumiNova®-filled hour and minute hands",
	"Bâton",
	"Luminous Gold Tone Hands and Arabic Hour Markers. A 60 Second and 30 Minute Sub-dial Displayed on a Khaki Green Grained Dial.",
	"Rhodium Plated",
	"White Mother of Pearl with Rose Gold Luminescent Hands and Diamond Hour Markers",
	"Silver with Date at 3",
	"Grey with Diamond Hour Markers",
	"White with Gold Toned Hands and Index Hour Markers",
	"11 Diamonds",
	"White with Subs and Index Hour Markers",
	"Black with Silver Subdials and Luminious Hour Markers",
	"Silver tone luminous hands and Arabic Numeral hour markers with minute markers around the outer rim and 3 Sub-dials on a Black",
	"indices and hour and minute hands",
	"Rose Gold Indexes",
	"Silver tone hands and Index hour markers on a Mother of Pearl",
	"Luminous Silver Tone Hands and Index Hour Markers With 3 Subdials and a Red Seconds Hand On Silver",
	"Rhodium plated hands and Roman Numeral hour markers on a Silver",
	"Rose Gold hands with Red Ruby hour markers on a Mother of Pearl",
	"18kt Yellow Gold Skeleton Alpha-style",
	"Silver & Gray Dial with Black Printed Roman Numerals and Blue Hands",
	"Dauphines  Dauphines",
	"rhodium-plated, seconds hand dark red",
	"gold-plated, seconds hand dark red",
	"rhodium-plated, with superluminova inlay in white , seconds hand neon orange",
	"tempered blue, with superluminova inlay in white (green luminescence), seconds hand red",
	"Yellow Gold tone hands and Diamond hour markers on a Silver Dial",
	"Grey Yellow Accented Chronograph with Black 'Clous de Paris' Design Sub-Dials, Date at 6",
	"Numerals and hands Superluminova BG W9 Grade A",
	"Proprietary",
	"Hours, minutes, seconds at 6",
	"Polished silver tone hands and index hour markers with 3 sub-dials and blue accents on white",
	"Luminous Gold-tone Cathedral-style",
	"Hands",
	"Silver tone hands and Circle hour markers on a Silver Mesh with Red and Green Striped",
	"Silver tone luminous hands and Index hour markers with minute markers around the outer rim on a Grey Dial",
	"Silver tone hands and Arabic Numeral hour markers with minute markers around the outer rim on a Blue Dial",
	"Silver tone hands and Index hour markers with minute markers around the outer rim on a Blue Dial",
	"Silver tone luminous hands and Index hour markers with minute markers around the outer rim on a Blue Dial",
	"Silver tone luminous hands",
	"Luminous silver-tone hands and index hour markers with red accents on black",
	"Rose Gold-tone Dauphine-style shape",
	"Luminous Anthracite",
	"Silver-tone Rhodium-plated Leaf-style shape",
	"Silver-tone Rhodium-plated Leaf-style",
	"Luminous Rhodium-plated",
	"Luminous Arrow-shaped",
	"Luminbous Silver-tone",
	"Blackened Hands",
	"Silver tone luminous hands and Arabic numeral hour markers with minute markers around the outer rim and 2 Sub-dials on a BlACK Dial",
	"18kt White Gold",
	"Silver-tone Dauphine-style shape",
	"Silver tone hands and Index hour markers with minute markers around the outer rim on a Beige Dial",
	"White hands",
	"Silver tone luminous hands and Index hour markers with minute markers around the outer rim and 3 sub-dials on a Grey Dial",
	"Luminous Silver-tone Cathedral-style",
	"Black Filled hands and Arabic Numeral hour markers with red minute markers around the outer rim on a Black Dial",
	"Silver-tone hands and alternating Arabic numeral and index hour markers on a Black Dial",
	"Bronze",
	"Silver-tone with luminous fill",
	"White",
	"Luminous hands",
	"Silver-tone Leaf-style",
	"Rhodium-plated Leaf-style",
	"Luminous Leaf-style shape",
	"Luminous Rose Gold-tone Leaf-style",
	"Silver-toned Dauphine-style shape",
	"Silver-tone Dauphine-style Hands and Index Hour Markers, Date, Day, Month and Moonphase Displayed, on a Silvered Opaline Dial.",
	"Blued-steel Sword-shaped",
	"Gilt Hands",
	"Silver tone luminous hands and Arabic Numeral/Index hour markers with minute markers around the outer rim on a Blue Dial",
	"White Roman Numeral",
	"Rose gold luminous hands and Index hour markers on a Golden Brown Opaline",
	"Silver-tone Alpha-style shape",
	"Luminous Rose Gold-tone Spade-shaped",
	"Silver-tone Baton-style shape",
	"Luminous Silver-tone Baton-style shape",
	"Rose Gold Luminescent Hands and Arabic Hour Markers With the Date Displayed at 6, on a Brown Sunburst  Dial.",
	"Luminous Yeloow Gold",
	"Luminous Yellow Gold",
	"Luminous Rose Gold-tone Dauphine-style shape",
	"Luminous Yellow Gold-tone Dauphine-style shape",
	"Silver White",
	"Blue Hands and Arabic Numeral hour markers with minute markers around the outer rim on a Silver Dial",
	"Silver tone hands and Index hour markers with minute markers around the outer rim and 3 sub-dials on a Blue Dial",
	"Luminous Gold-tone Snowflake",
	"Oxidized black, with superluminova inlay in white",
	"Solid Silver-tone",
	"Luminous Silver-tone Sword-shaped",
	"Luminous Silver tone",
	"Apple-shaped Blue Steel",
	"Silver-tone Snowflake-shape",
	"Gunmetal",
	"",
	"Silver tone luminous hands and Arabic numeral hour markers with minute markers around the outer rim and 3 sub-dials on a Grey Dial",
	"Silver tone luminous hands and Index hour markers with minute markers around the outer rim on a White Dial",
	"Silver tone luminous hands and Index hour markers with minute markers around the outer rim on a Black Dial",
	"Luminous Hands and Hour Markers on Blue",
	"Luminous Rose Gold Arrow-shaped",
	"Gold-tone Skeleton",
	"Brown",
	"Beige",
	"Luminoius Rose Gold-tone",
	"Silver tone luminous hands Orange Chronograph hand and accents, Arabic numerals",
	"Silver tone hands and Arabic Numeral/Index hour markers with minute markers around the outer rim and 2 black sub-dials on a Copper Dial",
	"Black with Arabic and Index Numerals",
	"Super-LumiNova",
	"Rose Gold hands and Roman Numeral hour markers on a Burgundy Dial",
	"Silver tone hands and Index hour markers with minute markers around the outer rim on a Green Dial",
	"Green Camo Dial with Gold Gilded Applique Numerals, Indices and Hands",
	"Sand",
	"Blue Hour Hand, Metal Minute Hand",
	"Black Dauphine-style shape",
	"Silver tone luminous hands and Arabic numeral hour markers with minute markers around the outer rim on a Grey Dial",
	"Blue Alpha-style",
	"Luminescent",
	"Black with Luminescent Hands",
	"White Arabic Numeral with Seconds Sub at 6",
	"Hour and minute hand coated with luminescent colour",
	"Silver-tone Cathedral-style",
	"Luminous Arabic Hands and Hour Markers on a Red Dial",
	"Luminous Yellow",
	"Silver Luminous Hands",
	"Blued Steel Sword-shaped Hands",
	"Black Tone",
	"Navy Blue",
	"Luminous Yellow gold tone hands and Index hour markers with minute markers around the outer rim on a Blue Dial",
	"Hour, minute and second hand coated with luminescent colour",
	"Rose Gold-tone Alpha-style shape",
	"Luminous Bronze-tone",
	"Luminous Green",
	"Luminous Silver",
	"Luminous Silver-tone Arrow-shaped",
	"Hour hand, minute hand and stopwatch second hand coated with luminescent colour",
	"18K White Gold",
	"Luminous Silver-tone Alpha-style shape",
	"Silver tone hands and Index Hour Markers on a Blue Skeleton Dial",
	"Blue Leaf-shaped",
	"Grey Skeleton",
	"Orange and Black",
	"Black Alpha-style shape",
	"Rose Gold-tone Lance-style shape",
	"Luminous Silver-tone Lance-style shape",
	"Gold-tone Alpha-style shape",
	"3 hand",
	"Silver-tone Alpha-style",
	"Silver-tone Lance-style shape",
	"multi-eye",
	"Luminous Yellow Gold-tone Snowflake",
	"Silver hands",
	"Rose Gold tone luminous hands",
	"Luminous Rose Gold-tone Lance-style shape",
	"Silver-tone Arrow-shaped",
	"Anthracite",
	"Luminous White",
	"Black and Silver Skeleton",
	"Blue Skeleton",
	"Neon Blue",
	"Silver-tone Spade-shape",
	"Luminous Dark Grey",
	"Luminous Rose Gold-plated",
	"Blue Spade-shape",
	"Silver tone hands and Index hour markers with minute markers around the outer rim and 3 sub-dials on a Black Dial",
	"Luminous silver tone hands",
	"Hour hand, minute hand and Stopwatch second hand coated with luminescent colour",
	"Hour, minute and stopwatch second hand coated with luminescent colour",
	"Luminous Silver-tone Dauphine-style shape",
	"Gray",
	"white SLN hands",
	"Yellow Gold Tone Hands on a GG Supreme Canvas with Pink Blossom Print",
	"Silver-tone Stick-style shape",
	"Digital",
	"Silver tone hands and Index hour markers with a Feline Motif in the center on a Pink Mother of Pearl",
	"Black Digital",
	"Rose Gold tone hands and Index hour markers with minute markers around the outer rim and 3 sub-dials on a Black Dial",
	"Luminous Rhodium",
	"luminous Black"
];

module.exports = hs;