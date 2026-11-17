
document.addEventListener("DOMContentLoaded", function () {

    const splash = document.getElementById("splash");
    const areaConta = document.getElementById("areaConta");


    // ========================================
    // LISTA DE PRODUTOS DA LOJA
    // ========================================

    const produtosLoja = [

        { id: 1, nome: "Conjunto do São Paulo para o inverno", preco: "R$ 499,99", imagem: "../Imagens/camisa sp.jpeg" },
        { id: 2, nome: "Camisa do Botafogo", preco: "R$ 350,00", imagem: "../Imagens/camisa frente botafogo.jpeg" },
        { id: 3, nome: "Camisa do São Paulo", preco: "R$ 359,99", imagem: "../Imagens/camisa dobrada sao paulo.jpeg" },
        { id: 4, nome: "Camisa do Corinthians", preco: "R$ 399,99", imagem: "../Imagens/camisa do corinthias.jpeg" },
        { id: 5, nome: "Chuteira da Umbro", preco: "R$ 1.199,99", imagem: "../Imagens/chuteira umbro com fundo.jpeg" },
        { id: 6, nome: "Meiões da Umbro", preco: "R$ 59,99", imagem: "../Imagens/meiao da umbro.jpeg" },
        { id: 7, nome: "Conjunto do Botafogo", preco: "R$ 190,00", imagem: "../Imagens/f botafogo.jpeg" },
        { id: 8, nome: "Chuteira da Puma", preco: "R$ 481,55", imagem: "../Imagens/chuteira puma com fundo.jpeg" },
        { id: 9, nome: "Perfume do Corinthians", preco: "R$ 99,99", imagem: "../Imagens/caixa e p corinthias.jpeg" },
        { id: 10, nome: "Caneleira da Umbro", preco: "R$ 59,99", imagem: "../Imagens/caneleira umbro.jpeg" }

    ];


    // ========================================
    // IDENTIFICAR A CONTA
    // ========================================

    function obterUsuario() {

        try {
            return JSON.parse(localStorage.getItem("usuarioLogado"));
        } catch (erro) {
            return null;
        }

    }


    // ========================================
    // IDENTIFICAR OS FAVORITOS
    // ========================================

    function obterChaveFavoritos() {

        const usuario = obterUsuario();

        if (usuario && usuario.email) {
            return "favoritos_" + usuario.email.trim().toLowerCase();
        }

        return "favoritos_visitante";

    }


    function buscarFavoritos() {

        try {
            return JSON.parse(
                localStorage.getItem(obterChaveFavoritos()) || "[]"
            );
        } catch (erro) {
            return [];
        }

    }


    function salvarFavoritos(favoritos) {

        localStorage.setItem(
            obterChaveFavoritos(),
            JSON.stringify(favoritos)
        );

    }


    // ========================================
    // MOSTRAR FAVORITOS NO PERFIL
    // ========================================

    function atualizarListaFavoritos() {

        const lista = document.getElementById("listaFavoritos");
        const quantidade = document.getElementById("quantidadeFavoritos");

        if (!lista || !quantidade) return;

        const favoritos = buscarFavoritos();

        const produtosFavoritos = produtosLoja.filter(
            produto => favoritos.includes(produto.id)
        );

        quantidade.textContent = produtosFavoritos.length + " produto(s)";

        if (produtosFavoritos.length === 0) {

            lista.innerHTML = `
                <div class="favoritos-vazio">
                    <span>♡</span>
                    <h3>Você ainda não tem favoritos</h3>
                    <p>Explore nossa loja e salve seus produtos preferidos!</p>
                </div>
            `;

            return;

        }

        lista.innerHTML = produtosFavoritos.map(function(produto) {

            return `
                <div class="card-favorito">

                    <img src="${produto.imagem}" alt="${produto.nome}">

                    <div class="informacoes-favorito">

                        <h3>${produto.nome}</h3>
                        <p>${produto.preco}</p>

                        <div class="acoes-favorito">

                            <button
                                class="ver-favorito"
                                data-id="${produto.id}"
                                type="button">
                                VER PRODUTO
                            </button>

                            <button
                                class="remover-favorito"
                                data-id="${produto.id}"
                                type="button"
                                aria-label="Remover dos favoritos">
                                ♥
                            </button>

                        </div>

                    </div>

                </div>
            `;

        }).join("");


        lista.querySelectorAll(".ver-favorito").forEach(function(botao) {

            botao.addEventListener("click", function() {

                const id = Number(botao.dataset.id);

                window.location.href =
                    "../Página de Compra/compra.html?id=" + id;

            });

        });


        lista.querySelectorAll(".remover-favorito").forEach(function(botao) {

            botao.addEventListener("click", function() {

                const id = Number(botao.dataset.id);

                const novosFavoritos = buscarFavoritos()
                    .filter(produto => produto !== id);

                salvarFavoritos(novosFavoritos);

                atualizarListaFavoritos();

            });

        });

    }


    // ========================================
    // IDENTIFICAR OS PEDIDOS DA CONTA
    // ========================================

    function buscarPedidos() {

        const usuario = obterUsuario();

        if (!usuario || !usuario.email) return [];

        const chave = "pedidos_" + usuario.email.trim().toLowerCase();

        try {
            return JSON.parse(localStorage.getItem(chave) || "[]");
        } catch (erro) {
            return [];
        }

    }


    // ========================================
    // FORMATAR VALORES
    // ========================================

    function formatarPreco(valor) {

        return Number(valor || 0).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });

    }


    // ========================================
    // MOSTRAR MEUS PEDIDOS
    // ========================================

    function atualizarListaPedidos() {

        const lista = document.getElementById("listaPedidos");
        const quantidade = document.getElementById("quantidadePedidos");

        if (!lista || !quantidade) return;

        const pedidos = buscarPedidos();

        quantidade.textContent = pedidos.length + " pedido(s)";

        if (pedidos.length === 0) {

            lista.innerHTML = `
                <div class="pedidos-vazio">
                    <span>📦</span>
                    <h3>Você ainda não fez pedidos</h3>
                    <p>Quando finalizar uma compra, ela aparecerá aqui!</p>
                </div>
            `;

            return;

        }


        lista.innerHTML = pedidos.map(function(pedido) {

            const produtos = Array.isArray(pedido.produtos)
                ? pedido.produtos
                : [];

            const itens = produtos.map(function(produto) {

                return `
                    <div class="item-pedido">

                        <img
                            src="${produto.imagem || ""}"
                            alt="${produto.nome || "Produto"}">

                        <div>
                            <strong>${produto.nome || "Produto"}</strong>
                            <p>Quantidade: ${Number(produto.quantidade) || 1}</p>
                            <p>${formatarPreco(produto.preco)}</p>
                        </div>

                    </div>
                `;

            }).join("");


            const formasPagamento = {
                credito: "Cartão de crédito",
                debito: "Cartão de débito",
                pix: "Pix",
                boleto: "Boleto"
            };

            return `
                <div class="card-pedido">

                    <div class="cabecalho-pedido">

                        <div>
                            <strong>Pedido #${String(pedido.id).slice(-6)}</strong>
                            <p>${pedido.data || "Data não informada"}</p>
                        </div>

                        <span class="status-pedido">
                            ${pedido.status || "Registrado"}
                        </span>

                    </div>

                    <div class="produtos-pedido">
                        ${itens}
                    </div>

                    <div class="rodape-pedido">

                        <p>
                            Pagamento:
                            ${formasPagamento[pedido.pagamento] || pedido.pagamento || "Não informado"}
                        </p>

                        <strong>
                            Total: ${formatarPreco(pedido.total)}
                        </strong>

                    </div>

                </div>
            `;

        }).join("");

    }


    // ========================================
    // ADICIONAR ESTILOS
    // ========================================

    function adicionarEstilosPerfil() {

        if (document.getElementById("estiloPerfilCompleto")) return;

        const estilo = document.createElement("style");

        estilo.id = "estiloPerfilCompleto";

        estilo.textContent = `

            .secao-favoritos,
            .secao-pedidos {
                margin-top: 25px;
                padding-top: 20px;
                border-top: 1px solid rgba(255,255,255,0.15);
                text-align: left;
            }

            .titulo-favoritos,
            .titulo-pedidos {
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 10px;
                margin-bottom: 15px;
            }

            .titulo-favoritos h3,
            .titulo-pedidos h3 {
                color: white;
                font-size: 17px;
                margin: 0;
            }

            #quantidadeFavoritos,
            #quantidadePedidos {
                color: #a9c5ff;
                font-size: 12px;
            }

            #listaFavoritos,
            #listaPedidos {
                display: flex;
                flex-direction: column;
                gap: 12px;
                max-height: 280px;
                overflow-y: auto;
                padding-right: 5px;
            }

            .card-favorito {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 10px;
                background: rgba(255,255,255,0.08);
                border: 1px solid rgba(255,255,255,0.12);
                border-radius: 12px;
            }

            .card-favorito img {
                width: 75px;
                height: 85px;
                object-fit: cover;
                border-radius: 8px;
                flex-shrink: 0;
            }

            .informacoes-favorito {
                flex: 1;
                min-width: 0;
            }

            .informacoes-favorito h3 {
                color: white;
                font-size: 13px;
                margin: 0 0 7px;
            }

            .informacoes-favorito p {
                color: #8eb5ff;
                font-size: 14px;
                font-weight: bold;
                margin: 0 0 9px;
            }

            .acoes-favorito {
                display: flex;
                gap: 8px;
            }

            .acoes-favorito button {
                cursor: pointer;
                border: none;
                border-radius: 6px;
                padding: 8px 10px;
                font-size: 10px;
                font-weight: bold;
            }

            .ver-favorito {
                background: #245bd3;
                color: white;
            }

            .remover-favorito {
                background: white;
                color: #e32645;
                font-size: 17px !important;
            }

            .favoritos-vazio,
            .pedidos-vazio {
                text-align: center;
                padding: 20px 10px;
                color: #d5dfff;
            }

            .favoritos-vazio span,
            .pedidos-vazio span {
                display: block;
                font-size: 38px;
                margin-bottom: 10px;
            }

            .favoritos-vazio h3,
            .pedidos-vazio h3 {
                font-size: 15px;
                margin-bottom: 8px;
            }

            .favoritos-vazio p,
            .pedidos-vazio p {
                font-size: 12px;
                line-height: 1.5;
            }

            .card-pedido {
                padding: 13px;
                background: rgba(255,255,255,0.08);
                border: 1px solid rgba(255,255,255,0.12);
                border-radius: 12px;
            }

            .cabecalho-pedido {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                gap: 10px;
                margin-bottom: 12px;
            }

            .cabecalho-pedido strong {
                color: white;
                font-size: 13px;
            }

            .cabecalho-pedido p {
                color: #b8c9ed;
                font-size: 11px;
                margin-top: 5px;
            }

            .status-pedido {
                color: #a9c5ff;
                background: rgba(36,91,211,0.2);
                border: 1px solid rgba(100,150,255,0.3);
                padding: 5px 8px;
                border-radius: 20px;
                font-size: 10px;
                text-align: center;
            }

            .produtos-pedido {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }

            .item-pedido {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 8px;
                background: rgba(0,0,0,0.15);
                border-radius: 8px;
            }

            .item-pedido img {
                width: 55px;
                height: 60px;
                object-fit: cover;
                border-radius: 6px;
            }

            .item-pedido strong {
                color: white;
                font-size: 12px;
            }

            .item-pedido p {
                color: #b8c9ed;
                font-size: 11px;
                margin-top: 4px;
            }

            .rodape-pedido {
                border-top: 1px solid rgba(255,255,255,0.12);
                margin-top: 12px;
                padding-top: 10px;
            }

            .rodape-pedido p {
                color: #b8c9ed;
                font-size: 11px;
                margin-bottom: 8px;
            }

            .rodape-pedido strong {
                color: #8eb5ff;
                font-size: 14px;
            }

            .caixa-perfil {
                max-height: 85vh;
                overflow-y: auto;
            }

            @media (max-width: 450px) {

                .card-favorito img {
                    width: 62px;
                    height: 75px;
                }

                .informacoes-favorito h3 {
                    font-size: 12px;
                }

                .cabecalho-pedido {
                    flex-direction: column;
                }

            }

        `;

        document.head.appendChild(estilo);

    }


    // ========================================
    // ATUALIZAR ÁREA DA CONTA
    // ========================================

    function atualizarAreaConta() {

        if (!areaConta) return;

        const usuario = obterUsuario();


        // VISITANTE NÃO LOGADO

        if (!usuario || !usuario.email) {

            areaConta.innerHTML = `

                <a href="../pagina de login/login.html"
                   class="botao-entrar">
                    ENTRAR
                </a>

                <a href="../pagina de login/login.html?cadastro"
                   class="botao-cadastrar">
                    CADASTRAR
                </a>

            `;

            const modalAntigo = document.getElementById("modalPerfil");

            if (modalAntigo) modalAntigo.remove();

            return;

        }


        // PEGAR OS DOIS PRIMEIROS NOMES

        const nomeCurto = (usuario.nome || "Cliente")
            .trim()
            .split(/\s+/)
            .slice(0, 2)
            .join(" ");


        // MOSTRAR PERFIL NA BARRA

        areaConta.innerHTML = `

            <div class="perfil-cliente">

                <button
                    class="foto-perfil"
                    id="abrirPerfil"
                    aria-label="Abrir meu perfil"
                    type="button">
                    👕
                </button>

                <span class="nome-cliente"></span>

            </div>

        `;

        areaConta.querySelector(".nome-cliente").textContent =
            "Olá, " + nomeCurto;


        // CRIAR JANELA DO PERFIL

        let modal = document.getElementById("modalPerfil");

        if (!modal) {

            modal = document.createElement("div");

            modal.id = "modalPerfil";
            modal.className = "modal-perfil";

            modal.innerHTML = `

                <div class="caixa-perfil">

                    <button
                        class="fechar-perfil"
                        id="fecharPerfil"
                        type="button">
                        ×
                    </button>

                    <div class="icone-perfil-grande">👕</div>

                    <h2>Minha conta</h2>

                    <p class="perfil-legenda">
                        Bem-vindo à Futbol Store!
                    </p>

                    <div class="informacao-perfil">
                        <span>Nome</span>
                        <strong id="perfilNome"></strong>
                    </div>

                    <div class="informacao-perfil">
                        <span>E-mail</span>
                        <strong id="perfilEmail"></strong>
                    </div>


                    <!-- MEUS FAVORITOS -->

                    <div class="secao-favoritos">

                        <div class="titulo-favoritos">
                            <h3>♡ MEUS FAVORITOS</h3>
                            <span id="quantidadeFavoritos">0 produto(s)</span>
                        </div>

                        <div id="listaFavoritos"></div>

                    </div>


                    <!-- MEUS PEDIDOS -->

                    <div class="secao-pedidos">

                        <div class="titulo-pedidos">
                            <h3>📦 MEUS PEDIDOS</h3>
                            <span id="quantidadePedidos">0 pedido(s)</span>
                        </div>

                        <div id="listaPedidos"></div>

                    </div>


                    <button
                        class="botao-sair"
                        id="botaoSair"
                        type="button">
                        SAIR DA CONTA
                    </button>

                </div>

            `;

            document.body.appendChild(modal);

        }


        // PREENCHER INFORMAÇÕES

        modal.querySelector("#perfilNome").textContent =
            usuario.nome || "Cliente";

        modal.querySelector("#perfilEmail").textContent =
            usuario.email;


        // ATUALIZAR FAVORITOS E PEDIDOS

        adicionarEstilosPerfil();

        atualizarListaFavoritos();

        atualizarListaPedidos();


        // ABRIR PERFIL

        document.getElementById("abrirPerfil")
            .addEventListener("click", function() {

                atualizarListaFavoritos();
                atualizarListaPedidos();

                modal.classList.add("perfil-aberto");

            });


        // FECHAR NO X

        document.getElementById("fecharPerfil")
            .addEventListener("click", function() {

                modal.classList.remove("perfil-aberto");

            });


        // FECHAR CLICANDO FORA

        modal.addEventListener("click", function(event) {

            if (event.target === modal) {
                modal.classList.remove("perfil-aberto");
            }

        });


        // SAIR DA CONTA

        document.getElementById("botaoSair")
            .addEventListener("click", function() {

                localStorage.removeItem("usuarioLogado");

                modal.classList.remove("perfil-aberto");

                atualizarAreaConta();

                alert("Você saiu da sua conta!");

            });

    }



// ========================================
// VITRINE DA PÁGINA INICIAL
// ========================================

// NOTAS DEMONSTRATIVAS DOS PRODUTOS

const produtosAvaliados = [
    { id: 1, nota: "4,9" },
    { id: 3, nota: "4,8" },
    { id: 8, nota: "4,8" },
    { id: 2, nota: "4,7" }
];


// PRODUTOS COM PREÇOS PROMOCIONAIS DEMONSTRATIVOS

const produtosPromocionais = [
    { id: 1, precoAntigo: 499.99, precoNovo: 399.99 },
    { id: 2, precoAntigo: 350.00, precoNovo: 297.50 },
    { id: 3, precoAntigo: 359.99, precoNovo: 287.99 },
    { id: 8, precoAntigo: 481.55, precoNovo: 409.32 }
];


// FORMATAR PREÇO PARA REAL

function formatarPrecoVitrine(valor) {
    return Number(valor).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}


// CRIAR CARTÃO DE PRODUTO

function criarCardVitrine(produto, configuracao = {}) {

    const desconto = configuracao.precoAntigo
        ? Math.round(
            (1 - configuracao.precoNovo / configuracao.precoAntigo) * 100
        )
        : 0;

    const preco = configuracao.precoNovo !== undefined
        ? formatarPrecoVitrine(configuracao.precoNovo)
        : produto.preco;

    const selo = configuracao.promocao
        ? `<span class="selo-vitrine selo-desconto">${desconto}% OFF</span>`
        : configuracao.nota
            ? `<span class="selo-vitrine">DESTAQUE</span>`
            : "";

    const avaliacao = configuracao.nota
        ? `
            <div class="avaliacao-vitrine">
                ★★★★★ <small>${configuracao.nota}/5</small>
            </div>
        `
        : "";

    const precoAntigo = configuracao.promocao
        ? `<span class="preco-antigo">${formatarPrecoVitrine(configuracao.precoAntigo)}</span>`
        : "";

    return `
        <article class="card-vitrine">

            <div class="imagem-vitrine">

                ${selo}

                <img
                    class="imagem-fundo"
                    src="${produto.imagem}"
                    alt=""
                    aria-hidden="true">

                <img
                    class="imagem-principal"
                    src="${produto.imagem}"
                    alt="${produto.nome}"
                    loading="lazy">

            </div>

            <div class="informacoes-vitrine">

                <h3>${produto.nome}</h3>

                ${avaliacao}

                <div class="preco-vitrine">
                    ${precoAntigo}
                    ${preco}
                </div>

                <a
                    class="botao-vitrine"
                    href="../Página de Compra/compra.html?id=${produto.id}">
                    VER PRODUTO
                </a>

            </div>

        </article>
    `;
}


// MOSTRAR PRODUTOS FAVORITOS

function atualizarVitrineFavoritos() {

    const vitrine = document.getElementById("vitrineFavoritos");

    if (!vitrine) return;

    const favoritos = buscarFavoritos();

    const produtosFavoritos = produtosLoja.filter(produto =>
        favoritos.includes(produto.id)
    );

    if (produtosFavoritos.length === 0) {

        vitrine.innerHTML = `
            <div class="vitrine-vazia">
                ♡ Você ainda não salvou nenhum favorito.
                Explore os produtos e clique no coração para adicioná-los!
            </div>
        `;

        return;
    }

    vitrine.innerHTML = produtosFavoritos
        .map(produto => criarCardVitrine(produto))
        .join("");
}


// MOSTRAR MAIS BEM AVALIADOS

function atualizarVitrineAvaliados() {

    const vitrine = document.getElementById("vitrineAvaliados");

    if (!vitrine) return;

    vitrine.innerHTML = produtosAvaliados.map(function(avaliacao) {

        const produto = produtosLoja.find(
            item => item.id === avaliacao.id
        );

        if (!produto) return "";

        return criarCardVitrine(produto, {
            nota: avaliacao.nota
        });

    }).join("");

}


// MOSTRAR PROMOÇÕES DO DIA

function atualizarVitrinePromocoes() {

    const vitrine = document.getElementById("vitrinePromocoes");

    if (!vitrine) return;

    vitrine.innerHTML = produtosPromocionais.map(function(promocao) {

        const produto = produtosLoja.find(
            item => item.id === promocao.id
        );

        if (!produto) return "";

        return criarCardVitrine(produto, {
            promocao: true,
            precoAntigo: promocao.precoAntigo,
            precoNovo: promocao.precoNovo
        });

    }).join("");

}


// INICIAR AS TRÊS VITRINES

atualizarVitrineFavoritos();
atualizarVitrineAvaliados();
atualizarVitrinePromocoes();


    // ========================================
    // INICIAR ÁREA DA CONTA
    // ========================================

    atualizarAreaConta();


    // ========================================
    // ANIMAÇÃO DE ABERTURA DA LOJA
    // ========================================

    if (sessionStorage.getItem("splashJaMostrada")) {

        if (splash) {
            splash.style.display = "none";
        }

        return;

    }

    sessionStorage.setItem("splashJaMostrada", "true");

    setTimeout(function() {

        if (splash) {
            splash.classList.add("sumir");
        }

    }, 2500);

});
