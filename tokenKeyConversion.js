const fs = require('fs');
const key = fs.readFileSync('./safar-e-muqaddas-jwt-token.json', 'utf8');
const base64 = Buffer.from(key).toString('base64')
console.log(base64);