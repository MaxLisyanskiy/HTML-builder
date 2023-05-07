const path = require('path');
const fsPromise = require('fs/promises');

const dirStylePath = path.resolve(__dirname, 'styles');
const bundleItemPath = path.resolve(__dirname, 'project-dist', 'bundle.css');

const errors = [
    'Ошибка при создание файла bundle.css: ',
    'Ошибка при прочтение папки styles: ',
    'Ошибка при прочтение файла в папке styles: ',
    'Ошибка при копировании стилей в файл bundle.css: '
]

function bundleCSSFiles() {
    fsPromise.readdir(dirStylePath, { withFileTypes: true })
        .then(data => {
            data.forEach( item => {
                const itemPath = path.resolve(__dirname, 'styles', item.name)

                if (item.isFile() && path.parse(itemPath).ext === ".css") {
                    fsPromise.readFile(itemPath, { encoding: 'utf-8' })
                        .then(text => {
                            fsPromise.appendFile(bundleItemPath, text)
                                .then()
                                .catch(err => console.log(errors[3], err))
                        })
                        .catch(err => console.log(errors[2], err))
                }
            })
        })
        .then(() => console.log('Файлы стилей успешно собраны!'))
        .catch(err => console.log(errors[1], err))
}

fsPromise.writeFile(bundleItemPath, '')
    .then(() => bundleCSSFiles())
    .catch(err => console.log(errors[0], err))
