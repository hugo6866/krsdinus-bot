const { parseSessionFromJSON } = require('../save/parseSession.js');
const { sendHttpRequest } = require('../network/request.js');
const fs = require('fs');


async function checkAbleInputKRS() {
    const jsonData = fs.readFileSync('account.json', 'utf8');
    const data = parseSessionFromJSON(jsonData);
    const session = data.session;
    const csrf = data.csrf;
    const cookie = `${csrf.id}=${csrf.key};${session.id}=${session.key}`
    try {
        const url = 'https://krs.dinus.ac.id/reg.html';
        const headers = {
            'Cookie': cookie,
            'X-Requested-With': 'XMLHttpRequest'
        };
        const response = await sendHttpRequest("get", url, headers, null, false);
        //console.log(response.data);
        if (response.data.includes('Silahkan Pilih pada dropdown Matakuliah')) {
            return "ok";
        } else {
            return "no";
        }
    } catch (error) {
        console.error(error);
        return error
    }
}

module.exports = { checkAbleInputKRS };
