let login = {
    name:""
}
let mensagem;


function fazerlogin(){
    let nick = prompt("Bem vindo, chatter!\nQual nickname quer usar?");
    login = {
        name:`${nick}`
    };
    console.log(login);
    let promisse = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", login);
    promisse.then(loginbemsucedido, login);
    promisse.catch(logininvalido);

}
function loginbemsucedido(){
    alert(`Bem vindo ao chat ${login.name}!\nLembre-se de manter o respeito e a educação`);
    setInterval(manterconexao, 5000);
    setInterval(getmsgs, 3000);
    setInterval(getusuarios, 10000);
    getmsgs();
    getusuarios();
}

function logininvalido(erro){
    if(erro.response.status === 400){
        alert("Nickname já cadastrado, favor escolher outro");
        fazerlogin();

    }
}

function getmsgs(){
    let promissemsgs = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
    promissemsgs.then(carregarmsgs);
}
function carregarmsgs(objetomsgs){
    let mensagens = objetomsgs.data;
   let mensagensfiltradas =  mensagens.filter(filtrarprivadas);
   let campomensagens = document.querySelector(".caixamensagens");
   campomensagens.innerHTML = '';
   mensagensfiltradas.forEach(imprimemensagens);
   campomensagens.lastChild.scrollIntoView();

}
function imprimemensagens(mensagens){
    let campomensagens = document.querySelector(".caixamensagens");
    if(mensagens.type==="status"){
        campomensagens.innerHTML += `<div class="status"><span>(${mensagens.time})</span> <strong> ${mensagens.from}    </strong> ${mensagens.text} `;
    }
    if(mensagens.type ==="message"){
    campomensagens.innerHTML += `<div class=${mensagens.type}><span>(${mensagens.time})</span> <strong> ${mensagens.from}    </strong> para <strong> ${mensagens.to}: </strong> ${mensagens.text}</div>`;
    }
    if(mensagens.type ==="private_message"){
        campomensagens.innerHTML += `<div class=${mensagens.type}><span>(${mensagens.time})</span> <strong> *${mensagens.from}    </strong> reservadamente para <strong> ${mensagens.to}: </strong> ${mensagens.text}</div>`;
    }


}
function filtrarprivadas(mensagens){
    console.log(mensagens.from);
    console.log(mensagens.to);
    console.log(login.name);
    if(mensagens.type === "private_message" && (mensagens.from !== login.name || mensagens.to !== login.name)){
        return false;
    }
    else{
        return true;
    }
}

function manterconexao(){
    console.log(login);
    let promisseconexao = axios.post("https://mock-api.driven.com.br/api/v6/uol/status", login);
    promisseconexao.catch(conexaoperdida);
}
function conexaoperdida(){
    alert("Sua conexão com o servidor foi perdida, favor fazer login novamente!");
    fazerlogin();
}
function getusuarios(){
    let promisse = axios.get("https://mock-api.driven.com.br/api/v6/uol/participants");
    promisse.then(carregausuarios);
    console.log(promisse);
}
function carregausuarios(resposta){
    let usuarios = resposta.data;
    console.log(usuarios);
    let campousuarios = document.querySelector(".direitousuarios");
    campousuarios.innerHTML = `<div class="usuario todos selecionado" data-identifier="participant" onclick="clicou(this)">
    <ion-icon class="people" name="people"></ion-icon>
    <h1>Todos</h1>
    <ion-icon class="checkmark" name="checkmark-sharp"></ion-icon>
</div>`
    usuarios.forEach(imprimeusuarios);
    
}
function imprimeusuarios(usuarios){
    let campousuarios = document.querySelector(".direitousuarios");
    campousuarios.innerHTML += `<div class="usuario ${usuarios.name}" onclick="clicou(this)" >
    <ion-icon class="person-circle" name="person-circle"></ion-icon>
    <h1>${usuarios.name}</h1>
    <ion-icon class="checkmark escondido" name="checkmark-sharp"></ion-icon>
</div>`

}
function escondeusuarios(){
    let esconde = document.querySelector(".lateralesquerdo");
    esconde.classList.add("escondido");
    let esconde2 = document.querySelector(".lateraldireito");
    esconde2.classList.add("escondido");
    let destinatario = document.querySelector(".lateraldireito .selecionado");
    let to = destinatario.classList[1];
    let visibilidade = document.querySelector(".direitovisibilidade .selecionado");
    let type = visibilidade.classList[0];
    console.log(type);
    alteracampoinput(to, type);

}
function mostramenu(){
    let mostra = document.querySelector(".lateralesquerdo");
    mostra.classList.remove("escondido");
    let mostra2 = document.querySelector(".lateraldireito");
    mostra2.classList.remove("escondido");

}
function clicou(clicado){
    let checkselecionado = document.querySelector(".direitousuarios .selecionado .checkmark");
    console.log(checkselecionado);
    checkselecionado.classList.add("escondido");
    let usuarioselecionado =  document.querySelector(".direitousuarios .selecionado");
    console.log(usuarioselecionado);
    usuarioselecionado.classList.remove("selecionado");
    console.log(clicado);
  clicado.classList.add("selecionado");  
  clicado.lastElementChild.classList.remove("escondido");
}
function clicouvisibilidade(clicado){
    let checkselecionado = document.querySelector(".direitovisibilidade .selecionado .checkmark");
    console.log(checkselecionado);
    checkselecionado.classList.add("escondido");
    let visibilidadeselecionada =  document.querySelector(".direitovisibilidade .selecionado");
    visibilidadeselecionada.classList.remove("selecionado");
    clicado.classList.add("selecionado");  
    clicado.lastElementChild.classList.remove("escondido");

}
function alteracampoinput(to, type){
    let caixamsgs = document.querySelector("p");
    console.log(caixamsgs);
    caixamsgs.innerHTML= `Enviando para ${to} (${type})`

}
function enviamsg(){
    let destinatario = document.querySelector(".lateraldireito .selecionado");
    let destino = destinatario.classList[1];
    let visibilidade = document.querySelector(".direitovisibilidade .selecionado");
    let type = visibilidade.classList[0];
    
    let texto = document.querySelector("input");
    console.log(type);
    console.log(destino);
    console.log(texto.value)
    
    if(type === "reservadamente" ){
        mensagem = {
            from: login.name,
            to: destino,
            text: texto.value,
            type: "private_message"            
        }
    }
    if(type === "publico"){
        mensagem = {
            from: login.name,
            to: destino,
            text: texto.value,
            type: "message"            
        }
    }
    console.log(mensagem);
    let promisse = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", mensagem);

    promisse.then(getmsgs);
    promisse.catch(window.location.reload);
    let limpa = document.querySelector("input");
    limpa.value="";

}

var input = document.getElementById("input");
input.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    document.getElementById("botaoenvia").click();
  }
});