const amqp = require('amqplib');

const conn = amqp.connect('amqp://localhost');
const channel = conn.createChannel();
const queue = "indexing";
channel.assertQueue(queue, { durable: true });

console.log("[*] Waiting for messages in %s. To exit press CTRL+C", queue);
console.log("***********************************************************");

//     channel.consume(queue, function(msg) {
//       let data = JSON.parse(msg.content.toString());
//       // console.log(" [x] Received %s ", msg.content.toString());
//       console.log(" id --->         ", data.id);
//       console.log(" source --->     ", data.source);
//       console.log(" url --->        ", data.url);
//       console.log(" thumbnail --->  ", data.thumbnail);
//       console.log(" collection ---> ", data.collection);
//       console.log(" lang --->       ", data.lang);
//       console.log(" name --->       ", data.name);
//       console.log(" gender --->     ", data.gender);
//       console.log(" retail --->     ", data.retail);
//       console.log("***********************************************************");
//       setTimeout(function() {
//         channel.ack(msg);
//       }, 100000);
//     }, {
//         autoAck: false
//     });
//   });
// })


// amqp.connect('amqp://localhost', function(error0, connection) {
//   if (error0) {
//     throw error0;
//   }
//   connection.createChannel(function(error1, channel) {
//     if (error1) {
//       throw error1;
//     }

//     const queue = 'indexing';
//     channel.assertQueue(queue, {
//       durable: true
//     });

//     console.log("[*] Waiting for messages in %s. To exit press CTRL+C", queue);
//     console.log("***********************************************************");

//     channel.consume(queue, function(msg) {
//       let data = JSON.parse(msg.content.toString());
//       // console.log(" [x] Received %s ", msg.content.toString());
//       console.log(" id --->         ", data.id);
//       console.log(" source --->     ", data.source);
//       console.log(" url --->        ", data.url);
//       console.log(" thumbnail --->  ", data.thumbnail);
//       console.log(" collection ---> ", data.collection);
//       console.log(" lang --->       ", data.lang);
//       console.log(" name --->       ", data.name);
//       console.log(" gender --->     ", data.gender);
//       console.log(" retail --->     ", data.retail);
//       console.log("***********************************************************");
//       setTimeout(function() {
//         channel.ack(msg);
//       }, 100000);
//     }, {
//         autoAck: false
//     });
//   });
// })

