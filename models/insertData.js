const fs = require('fs');
const Question = require('./question.js'); // Import your Question model
const data = [
  {
    "type": "ANAGRAM",
    "anagramType": "WORD",
    "blocks": [],
    "solution": "TOY",
    "title": "Rearrange the letters to form a word"
  }
]
async function insertData() {
  try {
    // Read the JSON file
    const rawData = fs.readFileSync('./questions.json', 'utf-8');
    const questions = JSON.parse(rawData);

    
    const processedQuestions = questions.map((question) => {
      const { _id, siblingId, ...rest } = question; // Destructure to exclude _id and siblingId
      return rest; 
    });

    // Insert cleaned data into MongoDB
    await Question.insertMany(processedQuestions);
    // await Question.insertMany(data);
    console.log('Data inserted successfully');
  } catch (err) {
    console.error('Error inserting data:', err);
  }
}

module.exports = { insertData }; 