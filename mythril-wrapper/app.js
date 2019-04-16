const exec = require('child_process').exec;
const amqp = require('amqplib/callback_api');

const rabbitUrl ='amqp://rabbitmq:rabbitmq@rabbit';

const receiveQueue = 'contract';
const sendQueue = 'dynamic-analysis';

const execMythril = function (contractId) {
    exec(`myth -xa ${contractId} -o json` , (error, stdout, stderr) => {
        if (stdout) {
            let result = JSON.parse(stdout);
            console.log('Mythril analysis:', result);
            submitResult(contractId, result.issues);
        }
        if (stderr) {
            console.error(`Error error: ${stderr}`);
        }
        if (error) {
            console.error(`Exec error: ${error}`);
        }
    })
};

const submitResult = async function(contractId, result) {
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
            console.log("Received: " + message);
            execMythril(message);
        }, {noAck: true});
    });
});
