const weedClient = require("node-seaweedfs");

const seaweedfs = new weedClient({
    server: "synopsis.cosmos.ieplsg.com/files/",
    // port: 9333
});

fileId = "4,05cd3e35c08b04";
seaweedfs.read(fileId).then(function (Buffer) {
    //do something with the buffer
    console.log("no error");
    console.log(Buffer);
}).catch(function (err) {
    //error handling
    console.log("error : ", err);
});