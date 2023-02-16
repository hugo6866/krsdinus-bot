const { checkAbleInputKRS, getIDKelas,inputKRS, getCurrentKRS } = require("../features");
const { colors, sleep } = require("../utils");
const fs = require('fs');
async function autoInputKRS() {
    try {
        const willCheckAbleInput = true; //not recommended to turn it false
        const jsonKRS = fs.readFileSync('krs.json');
        const krs = JSON.parse(jsonKRS);
        console.table(krs);
        if (willCheckAbleInput) {
            let checkInput = await checkAbleInputKRS();
            while (checkInput !== 'ok') {
                console.table(krs);
                console.log(`${colors.red}Checking KRS input status at ${colors.green} ${new Date().toLocaleString()}...${colors.reset}`);
                await sleep(1000);
                checkInput = await checkAbleInputKRS();
            }
        }
        console.log(`${colors.green}KRS input is now open!`);
        for (const course of krs) {
            console.log('------------------');
            console.log(`No: ${course.no}`);
            console.log(`Kode MK: ${course.kodeMk}`);
            console.log(`Kelompok: ${course.kelompok}`);
            console.log(`SKS: ${course.sks}`);
            console.log(`Jenis: ${course.jenis}`);
            console.log('------------------');
            const idKelas = await getIDKelas(course.kodeMk,course.kelompok);
            if (idKelas) {
                console.log(`${colors.green} ${course.nama} - ${course.kodeMk} (${course.kelompok}) - Available! ${colors.reset}`)
                const input = await inputKRS(idKelas, course.kodeMk, course.sks, course.jenis);
                if (input) {
                    console.log(input);
                } else {
                    console.log("${colors.red}${course.nama} - ${course.kodeMk} (${course.kelompok}) Gagal Input!")
                }
            } else {
                console.log(`${colors.red}${course.nama} - ${course.kodeMk} (${course.kelompok}) Gagal! (Bentrok Matkul/Kuota SKS Habis/Kelas Penuh) ${colors.reset}`)
            }
            
        }
        await getCurrentKRS();
    }
    catch (error) {
        if (error.code == 'ENOENT') {
            console.log(`${colors.red}krs.json is missing! plz setup automate configuration first!${colors.reset}`);
        }
        console.log(error);
    }
}

module.exports = { autoInputKRS };
