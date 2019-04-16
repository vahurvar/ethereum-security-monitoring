const mongoose = require('mongoose');

const mythrilSchema = new mongoose.Schema({
    TestID:{
        type: String,
        required: true
    },
    contractId:{
        type: String,
    },
    result:[{
        address: {
            type: String,
            required: true
          },
          contract: {
            type: String,
            required: true
          },
          debug: {
              calldata:{
                  type: String,
              },
              callValue:{
                  type: String,
              },
              caller:{
                  type: String,
              }
          },
          description: {
            type: String,
           },
           function:{
               type: String,
           },
           maxGasPrice:{
               type: String,
           },
           maxGasUsed:{
               type: Number,
           },
           minGasUsed:{
               type: Number,
           },
           severity:{
               type: String,
           },
           sourceMap:{
               type: Number,
           },
           swcid:{
               type: Number,
           },
           title:{
               type: String,
           }
    }],
    timestamp:{
        type: Date,
    }

});


var mythril = module.exports = mongoose.model('loginapp', mythrilSchema,'mythrilinfo');

module.exports.getMythrilInfo = function(callback, limit){
	mythril.find(callback).limit(limit);
}
