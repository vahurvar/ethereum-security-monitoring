const Web3 = require('web3');
const SourceClient = require('./source-client');
const MessageProducer = require('./message-producer');
const PropertiesReader = require('properties-reader');

const properties = PropertiesReader('./config.properties');
const url = properties.get('infura.mainnet');
const key = properties.get('infura.key');

const web3 = new Web3(new Web3.providers.WebsocketProvider('wss://' + url + key));

const blockNumbers = [];
const transactions = [];
const contracts = [];

(function(){
  web3.eth.subscribe('newBlockHeaders', function(error, result){
    if (!error) {
      console.log(result);
      return;
    }
    console.error(error);
  })
      .on("data", blockHeader => {
        var nr = blockHeader.number;
        console.log(nr);
        blockNumbers.push(nr);
      })
      .on("error", console.error);

  setInterval(function(){
    console.log(new Date());

    console.log('Contracts: ', contracts.length);
    while(contracts.length !== 0) {
      SourceClient.fetchSource(contracts.shift(), MessageProducer.sendVerified, MessageProducer.sendNotVerified);
    }

    console.log('Transactions: ', transactions.length);
    while(transactions.length !== 0) {
      getContractAddressFromTransaction(transactions.shift());
    }

    console.log('Blocks: ', blockNumbers);
    while(blockNumbers.length !== 0) {
      getTransactionsFromBlock(blockNumbers.shift());
    }
  }, 5000);
})();

async function getTransactionsFromBlock(nr) {
  console.log('Block number:', nr);
  web3.eth.getBlock(nr)
    .then(block => {
      block.transactions
        .forEach(transaction => transactions.push(transaction));
      })
      .catch(err => {
        console.log('Block not yet available:', nr);
        blockNumbers.push(nr)
    })
}

async function getContractAddressFromTransaction(transaction) {
  web3.eth.getTransactionReceipt(transaction)
    .then(t => {
      if (t) {
        if (t.contractAddress) {
          console.log(t.contractAddress);
          contracts.push(t.contractAddress);
        }
      }
    }).catch(err => {
      console.log('Transaction not yet availabe:', transaction);
      transactions.push(transaction);
    })
}
