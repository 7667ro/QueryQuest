const mongoose = require('mongoose');
const BlockSchema = require('./block');
const OptionSchema = require('./option')
const questionSchema = new  mongoose.Schema({
   
    type:{
        type:String,
        required:true,
    },
    anagramType:{
        type:String,
        
    },
    blocks:{
        type:[BlockSchema],
    },
   
    options:{
        type:[OptionSchema]
    },
    solution:{ 
        type: String, 
    },
    title:{ 
        type: String, 
        required: true 
    },

});
module.exports = mongoose.model('Question', questionSchema);