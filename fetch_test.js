const https = require('https');

const urls = [
  'https://raw.githubusercontent.com/Me-Abhishek-patel/RTO_EXAM_APP/master/app/src/main/assets/rto_exam_questions.json',
  'https://raw.githubusercontent.com/msnikhil/rto-app/master/assets/questions.json',
  'https://raw.githubusercontent.com/Samkarya/online-exam-questions/main/driving_license.json',
  'https://raw.githubusercontent.com/bhargavpatel999/RTO-Exam/master/app/src/main/assets/gujarati_questions.json',
  'https://raw.githubusercontent.com/bhushankumarl/RTO-Driving-License-Test/master/app/src/main/assets/question_bank.json'
];

async function checkUrls() {
  for (let url of urls) {
    await new Promise((resolve) => {
      https.get(url, (res) => {
        let data = '';
        res.on('data', chunk => { data += chunk; if(data.length > 1000) res.destroy(); });
        res.on('end', () => {
          console.log(`\nURL: ${url}\nStatus: ${res.statusCode}\nPreview: ${data.substring(0, 200)}`);
          resolve();
        });
        res.on('error', () => resolve());
      });
    });
  }
}
checkUrls();
