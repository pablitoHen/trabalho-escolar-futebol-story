
// CAMINHO DA PÁGINA INICIAL
const paginaInicial = "../Página de Início/inicio.html";

// CONTROLE DA ANIMAÇÃO
let trocaEmAndamento = false;


// ========================================
// ANIMAÇÃO ENTRE LOGIN E CADASTRO
// ========================================

function trocarFormulario(modo) {

    if (trocaEmAndamento) return;

    const caixa = document.querySelector(".caixa-acesso");

    const formLogin = document.getElementById("formLogin");
    const formCadastro = document.getElementById("formCadastro");

    const abaLogin = document.getElementById("abaLogin");
    const abaCadastro = document.getElementById("abaCadastro");

    const areaUsuario = document.getElementById("areaUsuario");

    const jaEstaNoModoEscolhido =
        modo === "login"
            ? !formLogin.classList.contains("escondido")
            : !formCadastro.classList.contains("escondido");

    if (jaEstaNoModoEscolhido) {
        limparMensagem();
        return;
    }

    trocaEmAndamento = true;

    limparMensagem();

    // INICIA A PASSAGEM DA FAIXA
    caixa.classList.add("animando");

    // TROCA O FORMULÁRIO QUANDO A FAIXA PASSA
    setTimeout(function() {

        if (modo === "login") {

            formLogin.classList.remove("escondido");
            formCadastro.classList.add("escondido");

            abaLogin.classList.add("ativa");
            abaCadastro.classList.remove("ativa");

        } else {

            formLogin.classList.add("escondido");
            formCadastro.classList.remove("escondido");

            abaLogin.classList.remove("ativa");
            abaCadastro.classList.add("ativa");

        }

        areaUsuario.classList.add("escondido");

    }, 300);

    // FINALIZA A ANIMAÇÃO
    setTimeout(function() {

        caixa.classList.remove("animando");

        trocaEmAndamento = false;

    }, 750);

}


// MOSTRAR LOGIN
function mostrarLogin() {
    trocarFormulario("login");
}


// MOSTRAR CADASTRO
function mostrarCadastro() {
    trocarFormulario("cadastro");
}


// ========================================
// FAZER LOGIN
// ========================================

function fazerLogin(event) {

    event.preventDefault();

    const email = document.getElementById("emailLogin").value.trim().toLowerCase();
    const senha = document.getElementById("senhaLogin").value;

    const usuarios = obterUsuarios();

    const usuarioEncontrado = usuarios.find(

        usuario =>
            usuario.email.toLowerCase() === email &&
            usuario.senha === senha

    );

    if (!usuarioEncontrado) {

        mostrarMensagem("E-mail ou senha incorretos!", "mensagem-erro");

        return;
    }

    // SALVA O USUÁRIO CONECTADO
    localStorage.setItem("usuarioLogado", JSON.stringify({

        nome: usuarioEncontrado.nome,
        email: usuarioEncontrado.email

    }));

    mostrarMensagem("Login realizado com sucesso!", "mensagem-sucesso");

    // VOLTA PARA A LOJA
    setTimeout(function () {

        const destino = localStorage.getItem("voltarAposLogin");

        if (destino) {

            localStorage.removeItem("voltarAposLogin");

            window.location.replace(destino);

        } else {

            window.location.replace(paginaInicial);

        }

    }, 1000);
}


// ========================================
// FAZER CADASTRO
// ========================================

function fazerCadastro(event) {

    event.preventDefault();

    const nome = document.getElementById("nomeCadastro").value.trim();

    const email = document.getElementById("emailCadastro").value.trim().toLowerCase();

    const senha = document.getElementById("senhaCadastro").value;

    const usuarios = obterUsuarios();

    // VERIFICA SE O E-MAIL JÁ EXISTE
    const emailExiste = usuarios.some(

        usuario => usuario.email.toLowerCase() === email

    );

    if (emailExiste) {

        mostrarMensagem("Este e-mail já está cadastrado!", "mensagem-erro");

        return;
    }

    // CRIA NOVO USUÁRIO
    const novoUsuario = {

        nome: nome,
        email: email,
        senha: senha

    };

    usuarios.push(novoUsuario);

    salvarUsuarios();

    // LIBERA O CUPOM DE 15%
    localStorage.setItem(
        "cupomCadastroDisponivel_" + email,
        "true"
    );

    // CONECTA O CLIENTE AUTOMATICAMENTE
    localStorage.setItem("usuarioLogado", JSON.stringify({

        nome: novoUsuario.nome,
        email: novoUsuario.email

    }));

    mostrarMensagem(
        "Cadastro realizado! Você ganhou 15% de desconto na primeira utilização do cupom CADASTRO15!",
        "mensagem-sucesso"
    );

    // VOLTA PARA A LOJA
    setTimeout(function () {

        window.location.replace(paginaInicial);

    }, 1000);
}


// ========================================
// MOSTRAR MENSAGENS
// ========================================

function mostrarMensagem(texto, classe) {

    const mensagem = document.getElementById("mensagem");

    mensagem.textContent = texto;

    mensagem.className = classe;
}


// LIMPAR MENSAGENS
function limparMensagem() {

    const mensagem = document.getElementById("mensagem");

    mensagem.textContent = "";

    mensagem.className = "";
}


// ========================================
// VERIFICAR SE JÁ ESTÁ CONECTADO
// ========================================

document.addEventListener("DOMContentLoaded", function () {

    const usuario = verificarUsuarioLogado();

    if (usuario) {

        window.location.replace(paginaInicial);

    }

});
