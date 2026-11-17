
// ========================================
// USUÁRIOS CADASTRADOS
// ========================================

window.usuariosCadastrados = [
    {
        nome: "Integrante 1",
        email: "integrante1@escola.com",
        senha: "1234"
    },

    {
        nome: "Integrante 2",
        email: "integrante2@escola.com",
        senha: "1234"
    },

    {
        nome: "Integrante 3",
        email: "integrante3@escola.com",
        senha: "1234"
    }
];


// ========================================
// CARREGA OS USUÁRIOS SALVOS
// ========================================

function obterUsuarios() {

    const usuariosSalvos =
        localStorage.getItem("usuariosCadastrados");

    if (usuariosSalvos) {

        try {
            window.usuariosCadastrados =
                JSON.parse(usuariosSalvos);
        } catch (erro) {
            console.error("Erro ao carregar usuários:", erro);
        }

    } else {

        salvarUsuarios();

    }

    return window.usuariosCadastrados;
}


// ========================================
// SALVAR USUÁRIOS
// ========================================

function salvarUsuarios() {

    localStorage.setItem(
        "usuariosCadastrados",
        JSON.stringify(window.usuariosCadastrados)
    );

}


// Inicializa a lista

obterUsuarios();
