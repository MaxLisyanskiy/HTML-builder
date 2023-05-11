const path = require('path');
const fs = require('fs');

const textPath = path.resolve(__dirname, 'text.txt');

const stream = fs.createReadStream(textPath, 'utf-8');

stream.on('data', data => process.stdout.write(data));
stream.on('error', error => process.stdout.write(`Ошибка: ${error}`));