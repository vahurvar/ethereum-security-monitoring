const amqp = require('amqplib/callback_api');
const MongoClient = require('mongodb').MongoClient;

const rabbitUrl ='amqp://rabbitmq:rabbitmq@rabbit';

const receiveQueueDynamic = 'dynamic-analysis';
const receiveQueueStatic = 'static-analysis';

const insertContract = function(contractJson) {
    MongoClient.connect('mongodb://mongo/', function(err, db) {
        if (err) throw err;
        var dbo = db.db("loginapp");
        contractJson.timestamp = new Date();
        dbo.collection("mythrilinfo").insertOne(contractJson, function(err, res) {
            if (err) throw err;
            db.close();
        });
    });
};

const setUpListener = function() {
    amqp.connect(rabbitUrl, function(err, conn) {
        conn.createChannel(function(err, ch) {
            ch.assertQueue(receiveQueueDynamic, {durable: true});

            ch.consume(receiveQueueDynamic, function(msg) {
                let message = msg.content.toString();
                console.log("Received: " + message);
                insertContract(JSON.parse(message));
            }, {noAck: true});
        });
    });
};

module.exports.setUpListener = setUpListener;
