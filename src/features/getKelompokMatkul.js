const { parseSessionFromJSON } = require('../save/parseSession.js');
const { sendHttpRequest } = require('../network/request.js');
const cheerio = require('cheerio');

const fs = require('fs');



async function getKelompokMatkul(kodeMatkul) {
    /* 
    kdmk=A11.54806&nil=&559d6c8a6a08e8515ab49692bb6db1e6=d24e932c66f59d47240ad4c2a67be5aa
    */
    const jsonData = fs.readFileSync('account.json', 'utf8');
    const data = parseSessionFromJSON(jsonData);
    const session = data.session;
    const csrf = data.csrf;
    const cookie = `${csrf.id}=${csrf.key};${session.id}=${session.key}`
    try {
        const url = 'https://krs.dinus.ac.id/listKelompok.html';
        const headers = {
            'Cookie': cookie,
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        };
        const data = {
            'kdmk': kodeMatkul,
            'nil' : '',
            [csrf.id] : csrf.key
        }
        const response = await sendHttpRequest("post", url, headers, data, false);
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
        console.error(error);
        
    }
}

module.exports = { getKelompokMatkul };
