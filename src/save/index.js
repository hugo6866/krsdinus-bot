const loadAuthFromConfig = require('./loadAuthFromConfig');
const parseSessionFromJSON = require('./parseSession')
module.exports = {
  loadAuthFromConfig: loadAuthFromConfig.loadAuthFromConfig,
  parseSessionFromJSON: parseSessionFromJSON.parseSessionFromJSON
};
