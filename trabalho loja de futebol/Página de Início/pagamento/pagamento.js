
// =====================================
// RECUPERAR PRODUTOS
// =====================================

const produtoDireto = JSON.parse(
    localStorage.getItem("produtoCompra")
);

const produtosCarrinho = JSON.parse(
    localStorage.getItem("produtosPagamento")
);

let produtosPagamento = [];

if (produtosCarrinho && produtosCarrinho.length > 0) {
    produtosPagamento = produtosCarrinho;
} else if (produtoDireto) {
    produtosPagamento = [{
        ...produtoDireto,
        quantidade: produtoDireto.quantidade || 1
    }];
}


// =====================================
// VARIÁVEIS
// =====================================

let cupomAplicado = "";
let porcentagemDesconto = 0;
let pedidoSalvo = false;


// =====================================
// USUÁRIO
// =====================================

function obterUsuario() {
    try {
        return JSON.parse(localStorage.getItem("usuarioLogado"));
    } catch (erro) {
        return null;
    }
}


// =====================================
// PREÇOS
// =====================================

function converterPreco(valor) {
    return parseFloat(
        String(valor)
            .replace("R$", "")
            .replace(/\./g, "")
            .replace(",", ".")
            .trim()
    ) || 0;
}

function formatarPreco(valor) {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function calcularSubtotal() {
    return produtosPagamento.reduce(function(total, produto) {
        return total +
            converterPreco(produto.preco) *
            (Number(produto.quantidade) || 1);
    }, 0);
}


// =====================================
// ATUALIZAR RESUMO
// =====================================

function atualizarValores() {
    const subtotal = calcularSubtotal();
    const desconto = subtotal * porcentagemDesconto / 100;
    const total = subtotal - desconto;

    document.getElementById("subtotalPagamento").textContent =
        formatarPreco(subtotal);

    document.getElementById("descontoPagamento").textContent =
        formatarPreco(desconto);

    document.getElementById("totalPagamento").textContent =
        formatarPreco(total);

    document.getElementById("valorDesconto").textContent =
        desconto > 0
            ? "Você economizou " + formatarPreco(desconto) + "!"
            : "";

    document.getElementById("mensagemTotal").textContent =
        "Valor total: " + formatarPreco(total);
}


// =====================================
// MOSTRAR PRODUTOS
// =====================================

function mostrarProdutos() {
    const lista = document.getElementById("listaPagamento");
    lista.innerHTML = "";

    if (produtosPagamento.length === 0) {
        lista.innerHTML = `
            <div style="text-align:center; padding:30px;">
                <h2>🛒 Nenhum produto encontrado</h2>
                <p>Volte para a loja e escolha um produto.</p>
            </div>
        `;
        atualizarValores();
        return;
    }

    produtosPagamento.forEach(function(produto) {
        const quantidade = Number(produto.quantidade) || 1;
        const preco = converterPreco(produto.preco);
        const subtotal = preco * quantidade;

        const item = document.createElement("div");
        item.className = "produto-pagamento";

        item.innerHTML = `
            <img src="${produto.imagem}" alt="${produto.nome}">

            <div class="produto-info">
                <h2>${produto.nome}</h2>
                <p>Categoria: ${produto.categoria || "Produto"}</p>

                ${
                    produto.tamanho &&
                    produto.tamanho !== "Não selecionado"
                    ? `<p>Tamanho: ${produto.tamanho}</p>`
                    : ""
                }

                ${produto.modelo ? `<p>Modelo: ${produto.modelo}</p>` : ""}

                <p class="quantidade">Quantidade: ${quantidade}</p>
                <p>Preço unitário: ${formatarPreco(preco)}</p>

                <p class="preco-item">
                    Subtotal: ${formatarPreco(subtotal)}
                </p>
            </div>
        `;

        lista.appendChild(item);
    });

    atualizarValores();
}


// =====================================
// APLICAR CUPOM
// =====================================

function aplicarCupom() {
    if (pedidoSalvo) return;

    const usuario = obterUsuario();
    const campo = document.getElementById("campoCupom");
    const mensagem = document.getElementById("mensagemCupom");
    const codigo = campo.value.trim().toUpperCase();

    if (!usuario || !usuario.email) {
        mensagem.textContent = "Entre na sua conta para usar um cupom.";
        mensagem.style.color = "#ff9999";
        return;
    }

    if (!codigo) {
        mensagem.textContent = "Digite um cupom.";
        mensagem.style.color = "#ff9999";
        return;
    }

    const email = usuario.email.trim().toLowerCase();
    const chavePedidos = "pedidos_" + email;

    let pedidos = [];

    try {
        pedidos = JSON.parse(localStorage.getItem(chavePedidos) || "[]");
    } catch (erro) {
        pedidos = [];
    }

    if (codigo === "PRIMEIRA25") {
        if (pedidos.length > 0) {
            mensagem.textContent =
                "Este cupom vale somente para a primeira compra.";
            mensagem.style.color = "#ff9999";
            return;
        }

        cupomAplicado = "PRIMEIRA25";
        porcentagemDesconto = 25;

    } else if (codigo === "CADASTRO15") {
        const disponivel = localStorage.getItem(
            "cupomCadastroDisponivel_" + email
        );

        const usado = localStorage.getItem(
            "cupomCadastroUsado_" + email
        );

        if (disponivel !== "true" || usado === "true") {
            mensagem.textContent =
                "Este cupom não está disponível ou já foi utilizado.";
            mensagem.style.color = "#ff9999";
            return;
        }

        cupomAplicado = "CADASTRO15";
        porcentagemDesconto = 15;

    } else {
        mensagem.textContent = "Cupom inválido.";
        mensagem.style.color = "#ff9999";
        return;
    }

    mensagem.textContent =
        "Cupom " + cupomAplicado + " aplicado com sucesso!";
    mensagem.style.color = "#80ffb0";

    campo.disabled = true;

    const botaoCupom = document.querySelector(".campo-cupom button");
    if (botaoCupom) botaoCupom.disabled = true;

    atualizarValores();
}


// =====================================
// MOSTRAR FORMA DE PAGAMENTO
// =====================================

function mostrarPagamento(id) {
    document.querySelectorAll(".dados").forEach(function(area) {
        area.classList.remove("ativo");
    });

    const selecionado = document.getElementById(id);

    if (selecionado) {
        selecionado.classList.add("ativo");
    }
}


// =====================================
// FINALIZAR PAGAMENTO
// =====================================

function continuarPagamento() {
    const selecionado = document.querySelector(
        'input[name="pagamento"]:checked'
    );

    if (!selecionado) {
        alert("Escolha uma forma de pagamento.");
        return;
    }

    if (produtosPagamento.length === 0) {
        alert("Não há produtos para finalizar a compra.");
        return;
    }

    const usuario = obterUsuario();

    if (!usuario || !usuario.email) {
        alert("Entre na sua conta antes de finalizar a compra.");
        return;
    }

    if (pedidoSalvo) return;

    const email = usuario.email.trim().toLowerCase();
    const chavePedidos = "pedidos_" + email;

    let pedidos = [];

    try {
        pedidos = JSON.parse(localStorage.getItem(chavePedidos) || "[]");
    } catch (erro) {
        pedidos = [];
    }

    // Conferir novamente a validade do cupom
    if (cupomAplicado === "PRIMEIRA25" && pedidos.length > 0) {
        alert("O cupom de primeira compra não está mais disponível.");
        return;
    }

    if (cupomAplicado === "CADASTRO15") {
        const disponivel = localStorage.getItem(
            "cupomCadastroDisponivel_" + email
        );

        const usado = localStorage.getItem(
            "cupomCadastroUsado_" + email
        );

        if (disponivel !== "true" || usado === "true") {
            alert("O cupom de cadastro não está mais disponível.");
            return;
        }
    }

    const subtotal = calcularSubtotal();
    const desconto = subtotal * porcentagemDesconto / 100;
    const totalFinal = subtotal - desconto;

    const produtosDoPedido = produtosPagamento.map(function(produto) {
        return {
            id: produto.id || null,
            nome: produto.nome,
            imagem: produto.imagem,
            preco: converterPreco(produto.preco),
            quantidade: Number(produto.quantidade) || 1,
            tamanho: produto.tamanho || "",
            modelo: produto.modelo || ""
        };
    });

    const pedido = {
        id: Date.now(),
        data: new Date().toLocaleString("pt-BR"),
        produtos: produtosDoPedido,
        subtotal: subtotal,
        desconto: desconto,
        cupom: cupomAplicado,
        total: totalFinal,
        pagamento: selecionado.value,
        status: "Pagamento simulado"
    };

    pedidos.unshift(pedido);

    localStorage.setItem(chavePedidos, JSON.stringify(pedidos));

    if (cupomAplicado === "CADASTRO15") {
        localStorage.setItem("cupomCadastroUsado_" + email, "true");
    }

    pedidoSalvo = true;

    document.getElementById("mensagem").style.display = "block";

    document.getElementById("mensagemTotal").textContent =
        "Subtotal: " + formatarPreco(subtotal) +
        " | Desconto: " + formatarPreco(desconto) +
        " | Total: " + formatarPreco(totalFinal);

    document.getElementById("mensagem").scrollIntoView({
        behavior: "smooth"
    });

    const botao = document.querySelector(".botao-continuar");
    botao.disabled = true;
    botao.textContent = "PEDIDO REGISTRADO";
}


// =====================================
// INICIAR
// =====================================

mostrarProdutos();
