const path = require('path');
const fsPromise = require('fs/promises');

const textPath = path.resolve(__dirname, 'secret-folder');

function consoleFilesInfo(data) {
    data.forEach( item => {
        if (item.isFile()) {
            let itemPath = path.resolve(__dirname, 'secret-folder', item.name)
            let itemParse = path.parse(itemPath)
            let name = itemParse.name
            let ext = itemParse.ext.replace('.', '')

            fsPromise.stat(itemPath)
                .then(stats => console.log(`${name} - ${ext} - ${stats["size"]}b`))
                .catch(() => console.log(`${name} - ${ext} - Не удалось получить размер файла :(`))
        }
    })
}

fsPromise.readdir(textPath, {withFileTypes: true})
    .then(data => consoleFilesInfo(data))
    .catch(err => console.log('Ошибка: ', err))