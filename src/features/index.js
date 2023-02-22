const checkInput = require('./checkInput');
const checkMatkul = require('./checkMatkul');
const getKelompokMatkul = require('./getKelompokMatkul');
const getKRS = require('./getKRS');
const getKuotaKRS = require('./getKuota');
const inputKRS = require('./inputKRS');
const getIDKelas = require('./getIDKelas');
const getMatkulKRS = require('./getMatkul');
const refreshSession = require('./refreshSession');

module.exports = {
    checkAbleInputKRS: checkInput.checkAbleInputKRS,
    checkMatkul: checkMatkul.checkMatkul,
    getIDKelas: getIDKelas.getIDKelas,
    getMatkulKRS :getMatkulKRS.getMatkulKRS,
    getKelompokMatkul: getKelompokMatkul.getKelompokMatkul,
    getCurrentKRS: getKRS.getCurrentKRS,
    getKuotaKRS: getKuotaKRS.getKuotaKRS,
    inputKRS: inputKRS.inputKRS,
    refreshSession: refreshSession.refreshSession
};
