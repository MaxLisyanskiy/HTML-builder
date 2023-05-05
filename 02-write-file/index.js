const path = require('path');
const fsPromise = require('fs/promises');
const readline = require("readline");

const textPath = path.resolve(__dirname, 'text.txt');

const rl = readline.createInterface({
    input: process.stdin, 
    output: process.stdout,
})

function exit() {
    console.log('\nПроцесс завершён. Удачного дня!')
    process.exit(1)
}

function ask(question) {
    rl.question(question, (answer) => {
        if(answer === "exit") {
            exit()
        }

        fsPromise.appendFile(textPath, answer)
            .then(ask(question))
            .catch(err => console.log('Ошибка: ', err))
    })
}

rl.on('close', () => {
    rl.write('exit\n')
    exit()
}); 

fsPromise.writeFile(textPath, '')
    .then(ask("Введите текст и нажмите Enter: ") )
    .catch(err => console.log('Ошибка: ', err))