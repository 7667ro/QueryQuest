const mongoose = require('mongoose');

const blockSchema = new mongoose.Schema({
  text: { 
    type: String, 
    required: true 
  },
  showInOption: { 
    type: Boolean, 
    required: true 
  },
  isAnswer: { 
    type: Boolean, 
    required: true 
  },
});

module.exports = blockSchema;
