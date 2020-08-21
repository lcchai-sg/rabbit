const { MongoClient } = require('mongodb');

(async () => {
  const db_url = `mongodb://localhost/`;
  const conn = await MongoClient.connect(db_url);

  console.log("***** processing data *****");
  const findKey = "Local";
  let local = false;
  let noLocal = [];
  try {
    let result = await conn
      .db('synopsis')
      .collection('product')
      .find();
    let cnt = 0;
    await result.forEach(data => {
      cnt++;
      // console.log(cnt, data.id, data.name);
      let p_local = {
        parentID: data.id,
        lang: "jp",
      };

      Object.keys(data).forEach(key => {
        if (key.indexOf(findKey) > 0) {
          local = true;
          switch (key) {
            case "nameLocal":
            if (data.nameLocal) {
              p_local = {...p_local, name: data.nameLocal[0].value};
            }
              break;
            case "descriptionLocal":
              if (data.descriptionLocal) {
                p_local = {...p_local, description: data.descriptionLocal[0].value};
              }
              break;
            case "waterResistanceLocal":
              if (data.waterResistanceLocal) {
                p_local = {...p_local, waterResistance: data.waterResistanceLocal[0].value};
              }
              break;
            case "caliberLocal":
              if (data.caliberLocal) {
                obj = data.caliberLocal[0];
                delete obj["lang"];
                caliber = obj;
                p_local = {...p_local, caliber};
              }
              break;
            case "bandLocal":
              if (data.bandLocal) {
                obj = data.bandLocal[0];
                delete obj["lang"];
                band = obj;
                p_local = {...p_local, band};
              }
              break;
            case "caseLocal":
              if (data.caseLocal) {
                obj = data.caseLocal[0];
                delete obj["lang"];
                newCase = obj;
                p_local = {...p_local, case: newCase};
              }
              break;
            case "dialLocal":
              if (data.dialLocal) {
                obj = data.dialLocal[0];
                delete obj["lang"]; 
                dial = obj;
                p_local = {...p_local, dial};
              }
              break;
            default:
              break;
          } // case
        } // if
      }) // Object forEach
      if (local) {
        p_local = {...p_local,
          updatedAt: new Date(),
          version: 1
        }
      // };
        // console.log("plocal:::", p_local);
        conn.db("synopsis")
          .collection("product_local_test")
          .insert(p_local);
      } else {
        noLocal.push({id: data.id, name: data.name});
      }
      local = false;
    }) // result forEach
    console.log("********** no local **********");
    console.log("noLocal:::", noLocal);
  } catch (error) {
    console.log(error);
  }
})();
