const path = require('path');
const fsPromise = require('fs/promises');

const textPath = path.resolve(__dirname, 'text.txt');

fsPromise.readFile(textPath, { encoding: 'utf-8' })
    .then(data => console.log(data))
    .catch(err => console.log('Ошибка: ', err))