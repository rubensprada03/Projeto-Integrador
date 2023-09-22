async function listarProdutos() {
    try {
        const response = await fetch('http://127.0.0.1:8000/produtos');
        if (!response.ok) {
            throw new Error('Erro ao buscar produtos.');
        }
        const produtos = await response.json();

        const listaProdutos = document.getElementById('listaProdutos');

        function populateTable(data) {
            const table = document.createElement('table');
            table.innerHTML = `
                <thead>
                    <tr>
                        <th>Imagem</th>
                        <th>Nome</th>
                        <th>Avaliação</th>
                        <th>Preço</th>
                        <th>Descrição</th>
                        <th>Quantidade em Estoque</th>
                        <th>Status</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.map(produto => `
                        <tr>
                            <td><img class="product-image" src="http://localhost:8000/${produto.imagens[0].replace('src/', '')}" alt="Imagem do produto" class="product-image"></td>
                            <td>${produto.nome}</td>
                            <td>${produto.avaliacao}/5</td>
                            <td>R$ ${produto.preco.toFixed(2)}</td>
                            <td>${produto.descricao_detalhada}</td>
                            <td>${produto.qtd_estoque}</td>
                            <td>${produto.status ? 'Ativo' : 'Desativo'}</td>
                            <td>
                                <button class="btn btn-primary" data-produto-id="${produto.id}" onclick="ativarProduto(this)">Ativar</button>
                                <button class="btn btn-danger" data-produto-id="${produto.id}" onclick="desativarProduto(this)">Desativar</button>
                                <button class="btn btn-warning" data-produto-id="${produto.id}" onclick="editarProduto(this)">Editar</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            `;
            listaProdutos.innerHTML = '';
            listaProdutos.appendChild(table);
        }

        populateTable(produtos);
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

    const userGroup = localStorage.getItem('userGroup');

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
    form.querySelector('#descricao').value = produto.descricao_detalhada;
    form.querySelector('#preco').value = produto.preco;
    form.querySelector('#qtd_estoque').value = produto.qtd_estoque;

    // Abra o modal de edição
    $('#editarModal').modal('show');

    // Configure o botão "Salvar" para chamar a função salvarEdicao
    const salvarButton = modal.querySelector('.btn-primary');
    salvarButton.onclick = () => salvarEdicao(produtoId);

    // Verifique o grupo do usuário e aplique limitações
    if (userGroup === 'estoquista') {
        // Restrinja as edições permitidas para o grupo "estoquista"
        form.querySelector('#nome').disabled = true;
        form.querySelector('#avaliacao').disabled = true;
        form.querySelector('#descricao').disabled = true;
        // Permita a edição do preço e da nota
        form.querySelector('#preco').disabled = true;
        form.querySelector('#qtd_estoque').disabled = false;
    }


}

// Função para salvar as edições feitas no modal
function salvarEdicao(produtoId) {
    const modal = document.getElementById('editarModal');
    const form = modal.querySelector('form');

    // Obtenha os valores dos campos do formulário
    const nome = form.querySelector('#nome').value;
    const avaliacao = form.querySelector('#avaliacao').value;
    const descricao = form.querySelector('#descricao').value;
    const preco = form.querySelector('#preco').value;
    const qtd_estoque = form.querySelector('#qtd_estoque').value;

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
