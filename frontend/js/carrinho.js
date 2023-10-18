document.addEventListener("DOMContentLoaded", function () {
    carregarCarrinho();
});

function carregarCarrinho() {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const listaCarrinho = document.getElementById('lista-carrinho');
    const totalItensEl = document.getElementById('total-itens');
    const precoTotalEl = document.getElementById('preco-total');

    // Limpa a lista de carrinho existente
    listaCarrinho.innerHTML = '';

    let totalItens = 0;
    let precoTotal = 0;

    carrinho.forEach((item, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>${item.nome}</strong> - 
            Quantidade: <input type="number" min="1" data-index="${index}" class="item-quantidade" value="${item.quantidade}"> - 
            Preço: R$ ${(item.preco * item.quantidade).toFixed(2)}
        `;

        const btnExcluir = document.createElement('button');
        btnExcluir.textContent = "Excluir";
        btnExcluir.dataset.index = index;
        btnExcluir.addEventListener('click', removerDoCarrinho);

        li.appendChild(btnExcluir);
        listaCarrinho.appendChild(li);

        totalItens += item.quantidade;
        precoTotal += item.preco * item.quantidade;
    });

    // Add event listener for quantity input changes
    document.querySelectorAll('.item-quantidade').forEach(input => {
        input.addEventListener('input', function(event) {
            ajustarQuantidade(event.target);
        });
    });

    totalItensEl.textContent = totalItens;
    precoTotalEl.textContent = precoTotal.toFixed(2);
}

function removerDoCarrinho(event) {
    const index = parseInt(event.target.dataset.index, 10);
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

    if (index > -1 && index < carrinho.length) {
        carrinho.splice(index, 1);
    }

    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    carregarCarrinho();
    atualizarIndicadorCarrinho();
}

function ajustarQuantidade(inputQuantidade) {
    const index = parseInt(inputQuantidade.dataset.index, 10);
    const novaQuantidade = parseInt(inputQuantidade.value, 10);
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

    if (index > -1 && index < carrinho.length) {
        carrinho[index].quantidade = novaQuantidade;
        if (carrinho[index].quantidade <= 0) {
            carrinho.splice(index, 1);
        }
    }

    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    carregarCarrinho();
}
