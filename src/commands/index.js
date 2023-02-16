const setupAutomationKRS = require('./setupAutomation');
const checkSKS = require('./checkSKS');
const inputKRSConfig = require('./inputKRSConfig');
const autoInputKRS = require('./autoInputKRS')
module.exports = {
    setupAutomationKRS: setupAutomationKRS.setupAutomationKRS,
    inputKRSConfig: inputKRSConfig.inputKRSConfig,
    checkSKS: checkSKS.checkSKS,
    autoInputKRS : autoInputKRS.autoInputKRS
}