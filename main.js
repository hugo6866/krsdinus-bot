const save = require('./src/save');
const utils = require('./src/utils')
const authKRS = require('./src/authentication');
const features = require('./src/features');
const commands = require('./src/commands');

const fs = require('fs');

async function login() {
    console.log(`${utils.colors.yellow}Login KRS.DINUS.AC.ID${utils.colors.reset}`);
    const authConfig = save.loadAuthFromConfig();
    if (authConfig) {
      console.log(authConfig);
    const useSavedAuth = await utils.questionAsync(`Use saved authentication? (y/n): `);
        if (useSavedAuth.toLowerCase() === 'y') {
            const sessionValid = await commands.checkSKS();
            if (sessionValid) {
                showMainMenu();
            } else {
                await checkLogin(authConfig.username, authConfig.password);
            }
    } else {
      await loginPrompt();
    }
  } else {
    await loginPrompt();
  }
}

async function checkLogin(username, password) {
    
    const loginResult = await authKRS.loginKRS(username, password);
    if (loginResult) {
        const jsonData = fs.readFileSync('account.json', 'utf8');
        const session = JSON.parse(jsonData);
        const mergedData = { ...session, ...loginResult };
        fs.writeFileSync('account.json', JSON.stringify(mergedData, null, 2));
        console.log(`${utils.colors.green}Logged in as ${username}.${utils.colors.reset}`);
        showMainMenu();
      } else {
        console.log(`${utils.colors.red}Login failed, please reenter your credentials.${utils.colors.reset}`);
        await loginPrompt();
    }
    
}

async function loginPrompt() {
  const username = await utils.questionAsync('NIM: ');
  const password = await utils.questionAsync('Password: ');
  const authConfig = { username, password };
  const configString = JSON.stringify(authConfig , null, 2);
  fs.writeFile('account.json', configString, (err) => {
    if (err) throw err;
    console.log('Authentication configuration saved to account.json');
  });
    checkLogin(username, password);
}

async function showMainMenu() {
    const kuotaKRS = await features.getKuotaKRS();
    const data = kuotaKRS.data;
    if (data) {
        const match = data.match(/<h2>(\d+)\sSKS<\/h2>/);
        if (match) {
            const remainingSks = parseInt(match[1], 10);
            console.log(`${utils.colors.blue}Sisa Kuota SKS : ${utils.colors.green} ${remainingSks} ${utils.colors.reset}`);
        } else {
            login();
            return;
        }
    } else {
        console.log(kuotaKRS);
        login();
        return;
    }
    console.log(`${utils.colors.magenta}Main Menu: ${utils.colors.reset}`);
    console.log(`${utils.colors.yellow}1. Auto Input KRS${utils.colors.reset}`);
    console.log(`${utils.colors.yellow}2. Setup Config Automate Input KRS${utils.colors.reset}`);
    console.log(`${utils.colors.yellow}3. Get Current KRS${utils.colors.reset}`);
    console.log(`${utils.colors.yellow}4. Get List Matkul${utils.colors.reset}`);
    console.log(`${utils.colors.yellow}5. Get List Kelas Matkul${utils.colors.reset}`);
    console.log(`${utils.colors.yellow}6. Exit${utils.colors.reset}`);

    try {
    const option = await utils.questionAsync(`${utils.colors.red}Choose an option: ${utils.colors.reset}`);
    console.log(option);
    switch (option) {
        case '1':
        await commands.autoInputKRS();
        await backToMainMenu();
        break;
        case '2':
        await commands.setupAutomationKRS();
        await backToMainMenu();
        break;
        case '3':
        await features.getCurrentKRS();
        await backToMainMenu();
        break;
        case '4':
        await features.getMatkulKRS();
        await backToMainMenu();
        break;
        case '5':
         const kodeMk = await utils.questionAsync('Kode Matkul (e.g N201702): ');
        await features.getKelompokMatkul(kodeMk);
        await backToMainMenu();
        break;
        case '6':
        console.log(`${utils.colors.green}bye!${utils.colors.reset}`);
        process.exit(-1);
        default:
        console.log(`${utils.colors.red}Invalid option${utils.colors.reset}`);
        await showMainMenu();
        break;
    }
    } catch (error) {
    console.log(`${utils.colors.red}Error: ${error}${utils.colors.reset}`);
    }

}

async function backToMainMenu() {
  const answer = await utils.questionAsync('Back to the main menu? (y/n) ');
  if (answer.toLowerCase() === 'y') {
    await showMainMenu();
  } 
}

login();
