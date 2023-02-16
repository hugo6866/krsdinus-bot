const features = require("../features");
const utils = require("../utils");

async function inputKRSConfig(krs,totalSKS, maxSKS) {
    let isMoreSKS = true;

    while (totalSKS <= maxSKS && isMoreSKS) {
    console.log(`${utils.colors.red}Masukan kode dengan lengkap!${utils.colors.reset}`);
    const kodeMk = await utils.questionAsync('Masukkan kode mata kuliah: (contoh A11.54402) : ');
    const kelompok = await utils.questionAsync('Masukkan kelompok mata kuliah: (contoh A11.4414) : ');
    const dataMatkul = await features.checkMatkul(kodeMk);
      matkulCount = krs.length;
    if (dataMatkul) {
      const nama = dataMatkul.nama;
      const sks = parseInt(dataMatkul.sks);
        const jenis = dataMatkul.jenis;
        if ((totalSKS + sks) < maxSKS) {
            totalSKS += sks;
            matkulCount++;

            console.log(`${matkulCount}. Mata kuliah ${nama} - ${kodeMk} (${kelompok}) dengan ${sks} SKS berhasil ditambahkan. Total SKS: ${totalSKS}`);
            krs.push({
                no: matkulCount,
                nama,
                kodeMk,
                kelompok,
                sks,
                jenis
            });

            if (totalSKS >= maxSKS) {
                isMoreSKS = false;
            } else {
                let isAnswerValid = false;
                let answer = '';

                while (!isAnswerValid) {
                    answer = await utils.questionAsync(`Total SKS saat ini adalah ${totalSKS}. Apakah Anda ingin menambah mata kuliah lagi? (y/n) `);

                    if (answer.toLowerCase() !== 'y' && answer.toLowerCase() !== 'n') {
                        console.log(`Jawaban yang dimasukkan tidak valid. Masukkan jawaban y atau n.`);
                    } else {
                        isAnswerValid = true;
                    }
                }

                if (answer.toLowerCase() === 'n') {
                    isMoreSKS = false;
                }
            }
        } else {
            console.log(`${matkulCount}. Mata kuliah ${nama} - ${kodeMk} (${kelompok}) dengan ${sks} SKS, Melebihi jumlah Maksimal SKS!`);
            isMoreSKS = false;
        }
    } else {
      console.log(`Data mata kuliah dengan kode ${kodeMk} tidak ditemukan.`);
    }
  }

    return krs;
}

module.exports = { inputKRSConfig };
