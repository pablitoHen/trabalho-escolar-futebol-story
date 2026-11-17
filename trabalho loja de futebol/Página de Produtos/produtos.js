
 // ========================================
 // ABRIR PRODUTO
 // ========================================

function abrirProduto(id) {

    let recentes = [];

    try {
        recentes = JSON.parse(
            localStorage.getItem("produtosRecentes") || "[]"
        );
    } catch (erro) {
        recentes = [];
    }

    recentes = recentes.filter(
        produto => produto !== id
    );

    recentes.unshift(id);
    recentes = recentes.slice(0, 10);

    localStorage.setItem(
        "produtosRecentes",
        JSON.stringify(recentes)
    );

    window.location.href =
        "../Página de Compra/compra.html?id=" + id;
}


// ========================================
// ABRIR E FECHAR CATEGORIAS
// ========================================

function abrirCategorias() {

    let menu = document.getElementById("menuCategorias");

    if (menu.style.display === "flex") {
        menu.style.display = "none";
    } else {
        menu.style.display = "flex";
    }

}


// ========================================
// FILTRAR POR CATEGORIA
// ========================================

function filtrarCategoria(categoria) {

    let produtos = document.querySelectorAll(".produto");

    produtos.forEach(function(produto) {


const imagemProduto = produto.querySelector("img");

if (imagemProduto) {
    produto.style.setProperty(
        "--imagem-produto",
        `url("${imagemProduto.getAttribute("src")}")`
    );
}


        if (
            categoria === "todos" ||
            produto.dataset.categoria === categoria
        ) {
            produto.style.display = "block";
        } else {
            produto.style.display = "none";
        }

    });

}


// ========================================
// PESQUISAR PRODUTOS
// ========================================

function filtrarProdutos() {

    let pesquisa = document
        .getElementById("pesquisa")
        .value
        .toLowerCase();

    let produtos = document.querySelectorAll(".produto");

    produtos.forEach(function(produto) {

        let texto = produto.innerText.toLowerCase();

        if (texto.includes(pesquisa)) {
            produto.style.display = "block";
        } else {
            produto.style.display = "none";
        }

    });

}


// ========================================
// IDENTIFICAR A CONTA ATUAL
// ========================================

function obterChaveFavoritos() {

    let usuario = null;

    try {
        usuario = JSON.parse(
            localStorage.getItem("usuarioLogado")
        );
    } catch (erro) {
        usuario = null;
    }

    if (usuario && usuario.email) {

        return "favoritos_" +
            usuario.email.trim().toLowerCase();

    }

    return "favoritos_visitante";

}


// ========================================
// BUSCAR FAVORITOS SALVOS
// ========================================

function obterFavoritos() {

    try {

        return JSON.parse(
            localStorage.getItem(obterChaveFavoritos()) || "[]"
        );

    } catch (erro) {

        return [];

    }

}


// ========================================
// SALVAR FAVORITOS
// ========================================

function salvarFavoritos(favoritos) {

    localStorage.setItem(
        obterChaveFavoritos(),
        JSON.stringify(favoritos)
    );

}


// ========================================
// ATUALIZAR CORAÇÕES
// ========================================

function atualizarCoracoes() {

    const favoritos = obterFavoritos();

    document.querySelectorAll(".botao-favorito")
        .forEach(function(botao) {

            const id = Number(botao.dataset.id);

            const favoritado = favoritos.includes(id);

            botao.classList.toggle(
                "favoritado",
                favoritado
            );

            botao.innerHTML = favoritado ? "♥" : "♡";

            botao.setAttribute(
                "aria-label",
                favoritado
                    ? "Remover dos favoritos"
                    : "Adicionar aos favoritos"
            );

        });

}


// ========================================
// ADICIONAR OU REMOVER FAVORITO
// ========================================

function alternarFavorito(id) {

    let favoritos = obterFavoritos();

    if (favoritos.includes(id)) {

        favoritos = favoritos.filter(
            produto => produto !== id
        );

    } else {

        favoritos.push(id);

    }

    salvarFavoritos(favoritos);

    atualizarCoracoes();

}


// ========================================
// CRIAR BOTÕES DE FAVORITOS
// ========================================

function prepararFavoritos() {

    const produtos = document.querySelectorAll(".produto");

    produtos.forEach(function(produto) {

        if (produto.querySelector(".botao-favorito")) {
            return;
        }

        const codigo = produto.getAttribute("onclick");

        const resultado = codigo
            ? codigo.match(/abrirProduto\((\d+)\)/)
            : null;

        if (!resultado) return;

        const id = Number(resultado[1]);

        const botao = document.createElement("button");

        botao.className = "botao-favorito";
        botao.type = "button";
        botao.dataset.id = id;

        botao.innerHTML = "♡";

        botao.setAttribute(
            "aria-label",
            "Adicionar aos favoritos"
        );

        botao.addEventListener("click", function(event) {

            event.preventDefault();
            event.stopPropagation();

            alternarFavorito(id);

        });

        produto.appendChild(botao);

    });

    atualizarCoracoes();

}


// ========================================
// INICIALIZAR FAVORITOS
// ========================================

document.addEventListener("DOMContentLoaded", function() {

    prepararFavoritos();

});
