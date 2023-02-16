const features = require('../features');

async function checkSKS() {
    const kuotaKRS = await features.getKuotaKRS();
    const data = kuotaKRS.data;
    if (data) {
        return data;
    } else {
        console.log("Session Expired, relogin...");
        return null;
    }
}

module.exports = { checkSKS };
