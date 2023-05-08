const path = require('path');
const fs = require('fs');
const fsPromise = require('fs/promises');

const dirProjectDistPath = path.resolve(__dirname, 'project-dist');

const dirTemplatePath = path.resolve(__dirname, 'template.html');
const dirTemplateCopyPath = path.resolve(__dirname, 'project-dist', 'index.html');

const dirStylePath = path.resolve(__dirname, 'styles');
const dirProjectDistStylePath = path.resolve(__dirname, 'project-dist', 'style.css');

const dirAssetsPath = path.resolve(__dirname, 'assets');
const dirAssetsCopyPath = path.resolve(__dirname, 'project-dist', 'assets');

const errors = [
    'Ошибка при создание папки "project-dist": ',
    'Ошибка при прочтение основго файла "template.html": ',
    'Ошибка при прочтение/при замене тега: ',
    'Ошибка при создании css-файла: ',
    'Ошибка при прочтение папки styles: ',
    'Ошибка при прочтение css-файла в папке styles: ',
    'Ошибка при сборке css-файла: ',
    'Ошибка при создании папки в copyDir: ',
    'Ошибка при прочтение папки в copyDir: ',
    'Ошибка при копировании файла в copyDir: ',
]

// Build template
function replaceTags() {
    fsPromise.readFile(dirTemplatePath, { encoding: 'utf-8' })
        .then(data => {
            let template = data;
            const replacedTags = data.match(/{{\w+}}/gm);

            replacedTags.forEach(tag => {
                const tagName = tag.replace(/[{{}}]/g,'')
                const tagPath = path.resolve(__dirname, 'components', `${tagName}.html`)
          
                fsPromise.readFile(tagPath, { encoding: 'utf-8' })
                    .then(text => {
                        template = template.replace(tag, text);
                        const indexHTMLWriteStream = fs.createWriteStream(dirTemplateCopyPath);
                        indexHTMLWriteStream.write(template);
                    })
                    .catch(err => console.log(errors[2], err))
            })
        })
        .catch(err => console.log(errors[1], err))
}

// Bundle css-styles
function bundleCSSFiles() {
    fsPromise.writeFile(dirProjectDistStylePath, '')
        .then(() => {
            fsPromise.readdir(dirStylePath, { withFileTypes: true })
                .then(data => {
                    data.forEach( item => {
                        const itemPath = path.resolve(__dirname, 'styles', item.name)
        
                        if (item.isFile() && path.parse(itemPath).ext === ".css") {
                            fsPromise.readFile(itemPath, { encoding: 'utf-8' })
                                .then(text => {
                                    fsPromise.appendFile(dirProjectDistStylePath, text)
                                        .then()
                                        .catch(err => console.log(errors[6], err))
                                })
                                .catch(err => console.log(errors[5], err))
                        }
                    })
                })
                .catch(err => console.log(errors[4], err))
        })
        .catch(err => console.log(errors[3], err))
}

// Copy assets folder
function copyDir(oldPath, newPath) {
    fsPromise.mkdir(newPath, { recursive: true })
        .then(() => {})
        .catch(err => console.log(errors[7], err))

    fsPromise.readdir(oldPath, { withFileTypes: true })
        .then( data => {
            data.forEach( file => {
                const oldFilePath = path.join(oldPath, file.name);
                const newFilePath = path.join(newPath, file.name);

                if (file.isDirectory()) {
                    copyDir(oldFilePath, newFilePath);
                }

                if (file.isFile()) {
                    fsPromise.copyFile(oldFilePath, newFilePath)
                        .then(() => {})
                        .catch(err => console.log(errors[9], err))
                }
            });
        })
        .catch(err => console.log(errors[8], err))
}


// Create project-dist folder 
fsPromise.mkdir(dirProjectDistPath, { recursive: true })
    .then(() => replaceTags())
    .then(() => bundleCSSFiles())
    .then(() => copyDir(dirAssetsPath, dirAssetsCopyPath))
    .catch(err => console.log(errors[0], err))