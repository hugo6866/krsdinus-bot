const { parseSessionFromJSON } = require('../save/parseSession.js');
const { sendHttpRequest } = require('../network/request.js');
const fs = require('fs');


async function getKuotaKRS() {
    const jsonData = fs.readFileSync('account.json', 'utf8');
    const data = parseSessionFromJSON(jsonData);
    const session = data.session;
    const csrf = data.csrf;
    const cookie = `${csrf.id}=${csrf.key};${session.id}=${session.key}`
    try {
        const url = 'https://krs.dinus.ac.id/get-kuota.html';
        const headers = {
            'Accept': 'application/json, text/javascript, */*; q=0.01',
            'User-Agent' : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.63 Safari/537.36',
            'Cookie': cookie,
            'X-Requested-With': 'XMLHttpRequest'
        };
        const response = await sendHttpRequest("get", url,headers, null, false);
        return response.data;
    } catch (error) {
        console.error(error);
        
    }
}

module.exports = { getKuotaKRS };
