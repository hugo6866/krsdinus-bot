const { parseSessionFromJSON } = require('../save/parseSession.js');
const { sendHttpRequest } = require('../network/request.js');
const cheerio = require('cheerio');
const utils = require('../utils')
const { getKelompokMatkul } = require('../features/getKelompokMatkul.js');

const fs = require('fs');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m'
};


async function getMatkulKRS() {
    const jsonData = fs.readFileSync('account.json', 'utf8');
    const data = parseSessionFromJSON(jsonData);
    const session = data.session;
    const csrf = data.csrf;
    const cookie = `${csrf.id}=${csrf.key};${session.id}=${session.key}`
    try {
        const url = 'https://krs.dinus.ac.id/get-makul.html';
        const headers = {
            'Cookie': cookie,
            'X-Requested-With': 'XMLHttpRequest'
        };
        const response = await sendHttpRequest("get", url, headers, null, false);
        const html = response.data.data;
        const $ = cheerio.load(html);
        const courseCodes = [];
        let number = 0;

        $('option').each((i, el) => {
        const optionText = $(el).text().trim();
        const match = optionText.match(/^(\w+\.\d+)\s*-\s*\d+\s+SKS/);
        if (match) {
            const courseCode = match[1];
            courseCodes.push(courseCode);
            number++;
            console.log(`${number} : ${optionText}`);
        }
        });
        const answer = await utils.questionAsync('Get detail matkul? (y/n) ');
        if (answer.toLowerCase() === 'y') {
            const userInput = await utils.questionAsync(`${colors.red}Choose an option :${colors.reset} `);
            const courseCodeIndex = userInput - 1;
            const kodeMk = courseCodes[courseCodeIndex];
            await getKelompokMatkul(kodeMk);
        } else if (!isNaN(answer) && answer >= 1 && answer <= courseCodes.length) {
            const kodeMk = courseCodes[answer - 1];
            await getKelompokMatkul(kodeMk);
        } 
      

        return response.data;
    } catch (error) {
        console.error(error);
        
    }
}

module.exports = { getMatkulKRS };
