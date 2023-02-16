const { parseSessionFromJSON } = require('../save/parseSession.js');
const { sendHttpRequest } = require('../network/request.js');
const cheerio = require('cheerio');

const fs = require('fs');


async function getCurrentKRS() {
    const jsonData = fs.readFileSync('account.json', 'utf8');
    const data = parseSessionFromJSON(jsonData);
    const session = data.session;
    const csrf = data.csrf;
    const cookie = `${csrf.id}=${csrf.key};${session.id}=${session.key}`
    try {
        const url = 'https://krs.dinus.ac.id/get-krs2';
        const headers = {
            'Cookie': cookie,
            'X-Requested-With': 'XMLHttpRequest'
        };
        const response = await sendHttpRequest("get", url, headers, null, false);
        const $ = cheerio.load(response.data);
        const headerz = $('thead tr th').map(function () {
            return $(this).text().trim();
        }).get();
        const rows = $('tbody tr').map(function () {
            const row = {};
            $(this).find('td').each(function (i) {
                const colName = headerz[i];
                row[colName] = $(this).text().trim();
            });
            return row;
        }).get();

        console.table(rows);
        return response.data;
    } catch (error) {
        console.log(error.response);
        console.error(error);
        
    }
}

module.exports = { getCurrentKRS };
