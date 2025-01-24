
const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  text: { 
    type: String, 
    required: true 
  },
  isCorrectAnswer: {
    type: Boolean, 
    required: true 
  },
});

module.exports = optionSchema;
