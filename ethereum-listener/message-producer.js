const amqp = require('amqplib/callback_api');

const verifiedQueue = 'verified-contract';
const notVerifiedQueue = 'contract';

const sendVerified = function (contractId, source) {
    let json = {contractId: contractId, source: source};
    sendMessage(JSON.stringify(json), verifiedQueue).catch(console.error);
};

const sendNotVerified = function (contractId) {
    sendMessage(contractId, notVerifiedQueue).catch(console.error);
};

const sendMessage = async function(payload, q) {
    amqp.connect('amqp://rabbitmq:rabbitmq@rabbit', function(err, conn) {
        conn.createChannel(function(err, ch) {
            ch.assertQueue(q, {durable: true});
            ch.sendToQueue(q, new Buffer(payload), {persistent: false});
            console.log(`Sent ${payload} to queue ${q}`);
        });
    });
};

module.exports.sendVerified = sendVerified;
module.exports.sendNotVerified = sendNotVerified;
