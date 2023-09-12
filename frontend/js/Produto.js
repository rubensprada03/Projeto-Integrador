// Função para buscar e exibir os produtos
async function listarProdutos() {
    try {
        const response = await fetch('http://127.0.0.1:8000/produtos'); // Substitua pelo URL correto da sua API
        if (!response.ok) {
            throw new Error('Erro ao buscar produtos.');
        }
        const produtos = await response.json();
        
        const listaProdutos = document.getElementById('listaProdutos');
        listaProdutos.innerHTML = ''; // Limpar a lista antes de adicionar os produtos
        
        produtos.forEach((produto) => {
            const card = document.createElement('div');
            card.className = 'col-sm-4'; // Define o tamanho do card (4 colunas em telas pequenas)
            
            // Mapeia o valor booleano para "Ativo" ou "Desativo"
            const statusLabel = produto.status ? 'Ativo' : 'Desativo';
        
            card.innerHTML = `
            <div class="card mb-4">
            <img src="/imagesProd/${produto.imagens[0]}" class="card-img-top" alt="Imagem do Produto">
            <div class="card-body">
                    <h5 class="card-title">${produto.nome}</h5>
                    <p class="card-text">
                        <strong>Avaliação:</strong> ${produto.avaliacao}/5<br>
                        <strong>Preço:</strong> R$ ${produto.preco.toFixed(2)}<br>
                        <strong>Descrição:</strong> ${produto.descricao_detalhada}<br>
                        <strong>Quantidade em Estoque:</strong> ${produto.qtd_estoque}<br>
                        <strong>Status:</strong> ${statusLabel}<br>
                    </p>
                    <button class="btn btn-primary" data-produto-id="${produto.id}" onclick="ativarProduto(this)">Ativar</button>
                    <button class="btn btn-danger" data-produto-id="${produto.id}" onclick="desativarProduto(this)">Desativar</button>
                </div>
            </div>
            `;
        
            listaProdutos.appendChild(card);
        });
    } catch (error) {
        console.error(error);
    }
}

// Chamar a função para listar os produtos quando a página carregar
window.addEventListener('load', listarProdutos);


// CRIAR PRODUTO:
// Abre o modal de criação de produto quando o botão for clicado
document.getElementById('btnAdicionar').addEventListener('click', () => {
    $('#modalCriarProduto').modal('show');
});

document.getElementById('produtoForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    try {
        const response = await fetch('http://127.0.0.1:8000/produtos', {
            method: 'POST',
            body: formData,
        });

        if (response.status === 201) {
            alert('Produto criado com sucesso!');
            form.reset();
        } else {
            alert('Erro ao criar o produto. Verifique os dados e tente novamente.');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao criar o produto. Verifique os dados e tente novamente.');
    }
});



// Editar produto:
// Função para ativar um produto
async function ativarProduto(button) {
    const produtoId = button.getAttribute('data-produto-id');
    try {
        const response = await fetch(`http://127.0.0.1:8000/produto/ativar/${produtoId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error('Erro ao ativar o produto.');
        }
        // Atualize a exibição dos produtos após a ativação
        listarProdutos();
    } catch (error) {
        console.error(error);
    }
}

// Função para desativar um produto
async function desativarProduto(button) {
    const produtoId = button.getAttribute('data-produto-id');
    try {
        const response = await fetch(`http://127.0.0.1:8000/produto/desativar/${produtoId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error('Erro ao desativar o produto.');
        }
        // Atualize a exibição dos produtos após a desativação
        listarProdutos();
    } catch (error) {
        console.error(error);
    }
}
