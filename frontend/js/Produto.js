async function listarProdutos() {
    try {
        const response = await fetch('http://127.0.0.1:8000/produtos');
        if (!response.ok) {
            throw new Error('Erro ao buscar produtos.');
        }
        const produtos = await response.json();

        const listaProdutos = document.getElementById('listaProdutos');
        listaProdutos.innerHTML = '';

        produtos.forEach((produto) => {
            const card = document.createElement('div');
            card.className = 'col-sm-4';

            const statusLabel = produto.status ? 'Ativo' : 'Desativo';

            card.innerHTML = `
            <div class="card mb-4">
                <div id="carousel-${produto.id}" class="carousel slide" data-bs-ride="carousel">
                    <div class="carousel-inner">
                        ${produto.imagens.map((imagem, index) => `
                            <div class="carousel-item ${index === 0 ? 'active' : ''}">
                                <img src="http://localhost:8000/${imagem.replace('src/', '')}" class="d-block w-100 product-image" alt="Imagem ${index + 1}">
                            </div>
                        `).join('')}
                    </div>
                    <button class="carousel-control-prev" type="button" data-bs-target="#carousel-${produto.id}" data-bs-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Anterior</span>
                    </button>
                    <button class="carousel-control-next" type="button" data-bs-target="#carousel-${produto.id}" data-bs-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Próximo</span>
                    </button>
                </div>

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
                    <button class="btn btn-warning edit" data-produto-id="${produto.id}" onclick="editarProduto(this)">Editar</button>
                </div>
            </div>
            `;

            listaProdutos.appendChild(card);
        });
    } catch (error) {
        console.error(error);
    }
}

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


// Função para abrir o modal de edição
function editarProduto(button) {
    const modal = document.getElementById('editarModal');
    const form = modal.querySelector('form');
    const produtoId = button.getAttribute('data-produto-id');

    // Aqui você deve buscar os detalhes do produto pelo ID e preencher o formulário no modal.
    // Suponhamos que você tenha obtido o objeto produto com os detalhes.
    // Substitua este exemplo com os valores reais do produto.
    const produto = {
        nome: null,
        avaliacao: null,
        descricao_detalhada: null,
        preco: null,
        qtd_estoque: null,
    };

    // Preencha os campos do formulário com os valores atuais do produto
    form.querySelector('#nome').value = produto.nome;
    form.querySelector('#avaliacao').value = produto.avaliacao;
    form.querySelector('#preco').value = produto.preco;
    form.querySelector('#descricao').value = produto.descricao_detalhada;
    form.querySelector('#qtd_estoque').value = produto.qtd_estoque;

    // Abra o modal de edição
    $('#editarModal').modal('show');

    // Configure o botão "Salvar" para chamar a função salvarEdicao
    const salvarButton = modal.querySelector('.btn-primary');
    salvarButton.onclick = () => salvarEdicao(produtoId);
}

// Função para salvar as edições feitas no modal
function salvarEdicao(produtoId) {
    const modal = document.getElementById('editarModal');
    const form = modal.querySelector('form');

    // Obtenha os valores dos campos do formulário
    const nome = form.querySelector('#nome').value;
    const preco = form.querySelector('#preco').value;
    const descricao = form.querySelector('#descricao').value;
    const qtd_estoque = form.querySelector('#qtd_estoque').value;
    const avaliacao = form.querySelector('#avaliacao').value;

    // Construa um objeto com os novos valores
    const novoProduto = {
        nome: nome,
        avaliacao: parseFloat(avaliacao),
        descricao_detalhada: descricao,
        preco: parseFloat(preco),
        qtd_estoque: parseInt(qtd_estoque),
    };

    // Envie a solicitação para atualizar o produto no servidor
    fetch(`http://127.0.0.1:8000/produtos/${produtoId}/`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(novoProduto),
    })
    .then((response) => {
        if (response.status === 200) {
            // Feche o modal após a atualização
            $('#editarModal').modal('hide');
            // Atualize a lista de produtos após a edição
            listarProdutos();
        } else {
            alert('Erro ao salvar as alterações. Verifique os dados e tente novamente.');
        }
    })
    .catch((error) => {
        console.error('Erro:', error);
        alert('Erro ao salvar as alterações. Verifique os dados e tente novamente.');
    });
}
