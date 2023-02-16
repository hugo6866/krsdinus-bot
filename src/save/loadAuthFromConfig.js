const fs = require('fs');

function loadAuthFromConfig() {
  try {
    const configContents = fs.readFileSync('account.json');
    const config = JSON.parse(configContents);
    return config;
  } catch (err) {
    return null;
  }
}

module.exports = {
  loadAuthFromConfig
};
