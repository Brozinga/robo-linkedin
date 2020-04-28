const { ipcRenderer } = require('electron')

// console.log(ipcRenderer.sendSync('synchronous-message', 'ping')) // prints "pong"

// ipcRenderer.on('asynchronous-reply', (event, arg) => {
//   console.log(arg) // prints "pong"
// })

let button = document.querySelector('#submit');

let login = document.querySelector("#login");
let password = document.querySelector("#pass");
let perfil = document.querySelector("#perfil");
let message = document.querySelector("#message");

let container = document.querySelector(".container");
let box = document.querySelector(".box");


button.addEventListener('click', (e) => {

    const data = {
        "user": login.value,
        "pass": password.value,
        "perfil": perfil.value,
        "message": message.value,
    }

    container.classList.add('blur-effect');
    box.classList.add('active');
    button.setAttribute('disabled', true);

    ipcRenderer.send('informationsToLinkedin', data)
});

ipcRenderer.on('returnFinishedProcess', (event, arg) => {
    button.removeAttribute('disabled');
    box.classList.remove('active');
    container.classList.remove('blur-effect');

    if(arg.error) {
        alert('OPS! Houve um erro, verifique as informações de Login e tente novamente!');
    }

    console.log(event) 
    console.log(arg) 
  })