const path = require('path');
const fsPromise = require('fs/promises');

const dirPath = path.resolve(__dirname, 'files');
const dirCopyPath = path.resolve(__dirname, 'files-copy');

const errors = [
    'Ошибка при создание папки files-copy: ',
    'Ошибка при прочтение папки files: ',
    'Ошибка при создание нового файла в папке files-copy: ',
    'Ошибка при копировании из старого файла в новый: '
]

function copyFiles() {
    fsPromise.readdir(dirPath, {withFileTypes: true})
        .then(data => {
            data.forEach( item => {
                const itemPath = path.resolve(__dirname, 'files', item.name)
                const itemCopyPath = path.resolve(__dirname, 'files-copy', item.name)

                fsPromise.writeFile(itemCopyPath, '')
                    .then(() => {
                        fsPromise.copyFile(itemPath, itemCopyPath)
                            .then()
                            .catch(err => console.log(errors[3], err))
                    })
                    .catch(err => console.log(errors[2], err))
            })

        })
        .then(() => console.log('Файлы успешно скопированы в папку "files-copy"!'))
        .catch(err => console.log(errors[1], err))
}

fsPromise.mkdir(dirCopyPath, { recursive: true })
    .then(() => copyFiles())
    .catch(err => console.log(errors[0], err))
