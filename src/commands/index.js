const setupAutomationKRS = require('./setupAutomation');
const checkSKS = require('./checkSKS');
const inputKRSConfig = require('./inputKRSConfig');
const autoInputKRS = require('./autoInputKRS')
const inputKRSLoop = require('./inputKRSLoop')
module.exports = {
    setupAutomationKRS: setupAutomationKRS.setupAutomationKRS,
    inputKRSConfig: inputKRSConfig.inputKRSConfig,
    checkSKS: checkSKS.checkSKS,
    autoInputKRS: autoInputKRS.autoInputKRS,
    inputKRSLoop : inputKRSLoop.inputKRSLoop
}