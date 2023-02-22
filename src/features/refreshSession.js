const { loginKRS } = require("../authentication");
const fs = require('fs');
const { loadAuthFromConfig } = require("../save/loadAuthFromConfig");

async function refreshSession() {
    const authConfig = loadAuthFromConfig();
    const loginResult = await loginKRS(authConfig.username, authConfig.password);
    if (loginResult) {
        const jsonData = fs.readFileSync('account.json', 'utf8');
        const session = JSON.parse(jsonData);
        const mergedData = { ...session, ...loginResult };
        fs.writeFileSync('account.json', JSON.stringify(mergedData, null, 2));
        return true;
      } else {
        console.log(`${utils.colors.red}Login failed, please reenter your credentials.${utils.colors.reset}`);
        return false;
    }
}

module.exports = { refreshSession };
