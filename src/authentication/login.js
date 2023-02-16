const cheerio = require('cheerio');
const { sendHttpRequest } = require('../network/request.js');

async function getCSRF() {
    try {
        const url = 'https://krs.dinus.ac.id/login.html';
        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
        };
        const response = await sendHttpRequest("get", url,headers, null, true);
        const $ = cheerio.load(response.data);
        const inputElement = $('input[type="hidden"]');
        const inputName = inputElement.attr('name');
        const inputValue = inputElement.attr('value');
        return {
            [inputName]: inputValue,
        };
    } catch (error) {
        console.error(error);
    }
}

async function loginKRS(nim, password) {
    const csrf = await getCSRF();
    const data = {
        ...csrf,
        'username': nim,
        'pass': password
    }
    const csrfID = Object.keys(csrf)[0];
    const csrfKey = data[csrfID];
    const url = 'https://krs.dinus.ac.id/auth.html';
    const headers = {
        "Cookie" : `${csrfID}=${csrfKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
    };
    const response = await sendHttpRequest('post', url, headers, data, false);
    const $ = cheerio.load(response.data);
    const errorMessages = [];
    $('div[style="color:red"]').each((i, el) => {
        errorMessages.push($(el).text());
    });
    if (errorMessages.length !== 0) {
        console.log('Error Messages:', errorMessages);
    } else {
        if (response.status === 302) {
            var cookies = response.headers['set-cookie']
            if (cookies) {
                const sessionCookie = cookies[1];
                const sessionParts = sessionCookie.split('=');
                const sessionId = sessionParts[0];
                const sessionValue = sessionParts[1].split(';')[0];

                console.log('Session ID:', sessionId);
                console.log('Session Key:', sessionValue);
                const session = {
                    "id": sessionId,
                    "key" : sessionValue
                }
                console.log(session);
                return {
                    "csrf": { 
                        "id": csrfID,
                        "key": csrfKey
                    },
                    session
                };
            }
        }
    }
    return false;
}

module.exports = { loginKRS };
