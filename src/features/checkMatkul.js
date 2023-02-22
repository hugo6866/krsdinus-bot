const { parseSessionFromJSON } = require('../save/parseSession.js');
const { sendHttpRequest } = require('../network/request.js');
const fs = require('fs');
const cheerio = require('cheerio');


async function checkMatkul(kodeMatkul) {
    const jsonData = fs.readFileSync('account.json', 'utf8');
    const data = parseSessionFromJSON(jsonData);
    const session = data.session;
    const csrf = data.csrf;
    const cookie = `${csrf.id}=${csrf.key};${session.id}=${session.key}`
    try {
        const url = 'https://krs.dinus.ac.id/home.html';
        const headers = {
            'Accept': 'application/json, text/javascript, */*; q=0.01',
            'User-Agent' : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.63 Safari/537.36',
            'Cookie': cookie,
            'X-Requested-With': 'XMLHttpRequest'
        };
        const response = await sendHttpRequest("get", url, headers, null, false);
        const $ = cheerio.load(response.data);
        const kode = kodeMatkul.trim(); 
        const row = $('tr').filter((i, el) => $(el).find('td:nth-child(2)').text().includes(kode));
        const sks = row.find('td:nth-child(6)').text().trim(); 
        const jenis = row.find('td:nth-child(5)').text().trim(); 
        const nama = row.find('td:nth-child(3)').text(); 
        const data = {
            'nama' : nama,
            'sks': sks,
            'jenis' : jenis
        }
        return data;
        return response.data;
    } catch (error) {
        console.error(error);
        
    }
}

module.exports = { checkMatkul };
