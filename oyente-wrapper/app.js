// Container has Node6 installed

const exec = require('child_process').exec;
const amqp = require('amqplib/callback_api');
const tmp = require('tmp');
const fs  = require("fs");

const rabbitUrl ='amqp://rabbitmq:rabbitmq@rabbit';

const receiveQueue = 'verified-contract';
const sendQueue = 'static-analysis';

const execOyente = function (json) {
    let temp = tmp.fileSync();
    let file = temp.name;

    fs.appendFile(file, json.source, (err) => {
        if (err) throw err;
        console.log('Created temp file: ' + file);
    });

    // python /oyente/oyente/oyente.py -s
    exec(`python ../oyente/oyente.py -s ${file}` , (error, stdout, stderr) => {
        if (stdout) {
            let result = parseOyenteResponse(stdout);
            sendParsedOutput(json.contractId, result);
        }
        if (stderr !== null) {
            console.error(`Error error: ${stderr}`);
        }
        if (error !== null) {
            console.error(`Exec error: ${error}`);
        }
    })
};

const parseOyenteResponse = function(input) {
    // TODO Parse the response into better format
    return input;
};

const sendParsedOutput = function(contractId, result) {
    let json = {contractId: contractId, result: result};

    amqp.connect(rabbitUrl, function(err, conn) {
        conn.createChannel(function(err, ch) {
            ch.assertQueue(sendQueue, {durable: true});
            ch.sendToQueue(sendQueue, new Buffer(JSON.stringify(json)), {persistent: false});
            console.log(`Sent ${JSON.stringify(json)} to queue ${sendQueue}`);
        });
    });
};

amqp.connect(rabbitUrl, function(err, conn) {
    conn.createChannel(function(err, ch) {
        ch.assertQueue(receiveQueue, {durable: true});

        ch.consume(receiveQueue, function(msg) {
            let message = msg.content.toString();
            let json = JSON.parse(message);
            console.log("Received: " + message);
            execOyente(json);
        }, {noAck: true});
    });
});

