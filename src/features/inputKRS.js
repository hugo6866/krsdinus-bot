const { parseSessionFromJSON } = require('../save/parseSession.js');
const { sendHttpRequest } = require('../network/request.js');
const fs = require('fs');


async function inputKRS(idMatkul, kodeMatkul, sks, jenis) {
    /*
    Example Usage
    inputKRS(270262, 'N201702', 2, 'T');
    */
    const jsonData = fs.readFileSync('account.json', 'utf8');
    const data = parseSessionFromJSON(jsonData);
    const session = data.session;
    const csrf = data.csrf;
    const cookie = `${csrf.id}=${csrf.key};${session.id}=${session.key}`
    try {
        const url = 'https://krs.dinus.ac.id/input-reguler.html';
        const headers = {
            'Cookie': cookie,
            'X-Requested-With': 'XMLHttpRequest',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.63 Safari/537.36',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Accept': '*/*'
        };
        const data = {
            'id': idMatkul,
            'kdmk': kodeMatkul,
            'sks': sks,
            'tp': jenis,
            [csrf.id] : csrf.key
        }
        const response = await sendHttpRequest("post", url, headers, data, false);
        return response.data;
    } catch (error) {
        console.error(error);
        return error
    }
}

module.exports = { inputKRS };
