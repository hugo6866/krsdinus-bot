const colors = require('./colors');
const parseHTML = require('./parseHTML');
const questionAsync = require('./questionAsync');
const sleep = require('./sleep');
module.exports = {
  colors: colors.colors,
  parseHTML: parseHTML.parseHTML,
  questionAsync: questionAsync.questionAsync,
  sleep: sleep.sleep
};
