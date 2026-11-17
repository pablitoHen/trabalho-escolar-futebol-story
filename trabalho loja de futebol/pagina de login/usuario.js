
// ========================================
// CONTROLE DO USUÁRIO LOGADO
// ========================================


// ========================================
// MOSTRAR USUÁRIO LOGADO
// ========================================

function mostrarUsuarioLogado() {

    const areaUsuario =
        document.getElementById("areaUsuario");

    if (!areaUsuario) return;

    let usuario = null;

    try {
        usuario = JSON.parse(
            localStorage.getItem("usuarioLogado")
        );
    } catch (erro) {
        console.error("Erro ao carregar usuário:", erro);
    }

    if (!usuario) {

        areaUsuario.style.display = "none";
        return;

    }

    const nomeUsuario =
        document.getElementById("nomeUsuarioLogado");

    if (nomeUsuario) {

        nomeUsuario.textContent =
            "Bem-vindo, " + usuario.nome + "!";

    }

    areaUsuario.style.display = "block";

}


// ========================================
// VERIFICAR SE EXISTE USUÁRIO LOGADO
// ========================================

function verificarUsuarioLogado() {

    try {

        const usuario = JSON.parse(
            localStorage.getItem("usuarioLogado")
        );

        return usuario;

    } catch (erro) {

        return null;

    }

}


// ========================================
// SAIR DA CONTA
// ========================================

function sairDaConta() {

    localStorage.removeItem("usuarioLogado");

    const areaUsuario =
        document.getElementById("areaUsuario");

    if (areaUsuario) {
        areaUsuario.style.display = "none";
    }

    mostrarLogin();

    const mensagem =
        document.getElementById("mensagem");

    if (mensagem) {

        mensagem.textContent =
            "Você saiu da sua conta.";

        mensagem.className = "mensagem-sucesso";

    }

}
