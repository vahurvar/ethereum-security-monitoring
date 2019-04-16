const axios = require('axios');
const PropertiesReader = require('properties-reader');

const properties = PropertiesReader('./config.properties');
const url = properties.get('etherscan.url');
const key = properties.get('etherscan.key');

async function fetchSourceCodeThroughApi(address, callback1, callback2) {
    axios.get(url + '?module=contract&action=getsourcecode&address=' + address + '&apikey=' + key)
        .then(function (response) {
            console.log('Etherscan response for contract: ', address)
            const sourceCode = response.data.result[0].SourceCode;
            if (sourceCode !== '') {
                console.log('Fetched source code for contract:', address);
                callback1(address, sourceCode);
            } else {
                console.log('Contract not verified');
            }

            callback2(address);
        })
        .catch(function (error) {
            console.log('Error fetching from API:', error);
        })
};

module.exports.fetchSource = fetchSourceCodeThroughApi
