const { sendHttpRequest } = require('../network/request.js');
const cheerio = require('cheerio');

const fs = require('fs');
const { parseSessionFromJSON } = require('../save');
const { features } = require('process');
const { refreshSession } = require('./refreshSession.js');



async function getIDKelas(kodeMatkul,kodeKelompok) {
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
        if (response.data.includes("SILAKAN PILIH JADWAL")) {
            console.log("session still active!");
        } else if (response.data.includes("Maaf Jadwal Belum Tersedia")) {
            console.log(`Maaf Jadwal Belum Tersedia kodeMatkul : ${kodeMatkul}`)
        } else {
            console.log("session expired??");
            console.log(response.data);
            const session = await refreshSession();
            if (session) {
                console.log("Session updated!");
            }
        }
        //const html = fs.readFileSync('test.html', 'utf-8');
        //const $ = cheerio.load(html);
        const $ = cheerio.load(response.data);
        let classNumber = null;
        $('tr.pilih').each((i, el) => {
        const kodeMK = $(el).find('td:nth-child(2) b').text();
        const kelp = $(el).find('td:nth-child(6)').text();
        const classAttr = $(el).find('a').attr('class'); 
        classNumber = classAttr ? classAttr.match(/\d+/)[0] : null; 
        
            if (kodeMK === kodeMatkul && kelp === kodeKelompok && classNumber != null) {
            console.log(`Found ${kodeMK} - ${kelp} idKelas : ${classNumber}`)
            return false;
        } 
        });
        return classNumber;
    } catch (error) {
        console.error(error);
        
    }
}

module.exports = { getIDKelas };
