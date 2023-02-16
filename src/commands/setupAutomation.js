const utils = require("../utils");
const { inputKRSConfig } = require("./inputKRSConfig");
const fs = require('fs');

async function setupAutomationKRS() {
  const maxSKS = 24;
  let totalSKS = 0;
  let matkulCount = 0;
  let krs = [];

  try {
    const krsData = fs.readFileSync('krs.json');
      krs = JSON.parse(krsData);
      if (krs.length !== 0) {
          var newKRS = "";

          while (newKRS.toLowerCase() !== 'new') {
              totalSKS = krs.reduce((acc, curr) => acc + curr.sks, 0);
              console.log(`Current KRS: ${totalSKS} SKS`);
              console.table(krs);
              while (newKRS !== 'y' && newKRS !== 'new') {
                  newKRS = await utils.questionAsync('Do you want to modify the current KRS? (y/new/exit) : ');
                  if (newKRS === 'exit') return;
              }
              if (newKRS.toLowerCase() === 'new') {
                  console.log("Starting new KRS...");
                  break;
              }

              const action = await utils.questionAsync('Do you want to add or remove or save current KRS? (add/remove/save/exit) : ');

              if (action.toLowerCase() === 'add') {
                  await inputKRSConfig(krs, totalSKS, maxSKS);
              } else if (action.toLowerCase() === 'remove') {
                  const courseNo = await utils.questionAsync('Enter the course number to remove: ');

                  const courseToRemove = krs.find(course => course.no === parseInt(courseNo));

                  if (courseToRemove) {
                      krs = krs.filter(course => course.no !== parseInt(courseNo));
                      console.log(`Course number ${courseNo} (${courseToRemove.nama}) has been removed from the KRS.`);
                  } else {
                      console.log(`Course number ${courseNo} does not exist in the KRS.`);
                  }

                  console.log('Current KRS:');
                  console.table(krs);
              } else if (action.toLowerCase() === 'save') {
                  const data = JSON.stringify(krs, null, 2);
                  fs.writeFileSync('krs.json', data);
                  console.log('KRS berhasil disimpan.');
                  console.table(krs);
                  break;
              }
              else if (action.toLowerCase() === 'exit') {
                  break;
              }
              else {
                  console.log(`Invalid action: ${action}`);
              }
          }
          if (newKRS === 'y') {
              return;
          }
         
      }
        else {
            console.log('Current KRS data not found, starting new KRS.');
        }
  } catch (err) {
    console.log('Current KRS data not found, starting new KRS.');
    }
    totalKRS = 0;
    krs = [];
    await inputKRSConfig(krs, totalSKS, maxSKS)
    const data = JSON.stringify(krs, null, 2);
    fs.writeFileSync('krs.json', data);
    console.log('KRS berhasil disimpan.');
    console.table(krs);
}

module.exports = { setupAutomationKRS };
