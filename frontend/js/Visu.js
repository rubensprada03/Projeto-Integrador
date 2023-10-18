// VISUALIZAR PRODUTO
function visualizarProduto(produtoId) {
    // Redireciona para a página "vizuprod.html" com o ID do produto na URL
    window.location.href = `/frontend/html/vizuprod.html?id=${produtoId}`;
    console.log(produtoId)
}


document.addEventListener('DOMContentLoaded', function () {
    // Recupere o ID do produto da URL
    const urlParams = new URLSearchParams(window.location.search);
    const produtoId = urlParams.get('id');

    // Faça uma solicitação Fetch para obter os detalhes do produto
    fetch(`http://127.0.0.1:8000/produtos/${produtoId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao buscar detalhes do produto.');
            }
            return response.json();
        })
        .then(produto => {
            // Atualize o conteúdo da página com os detalhes do produto
            // Atualize o conteúdo da página com os detalhes do produto, incluindo o carrossel de imagens
            const detalhesProdutoDiv = document.getElementById('detalhesProduto');
            detalhesProdutoDiv.innerHTML = `
                <h2 class="title-product">${produto.nome}</h2>
                <p class="avaliacao">Avaliação: ${produto.avaliacao}/5</p>
                <p class="complemento">Preço: R$ ${produto.preco.toFixed(2)}</p>
                <p class="complemento">Descrição: ${produto.descricao_detalhada}</p>
                <p class="complemento">Quantidade em Estoque: ${produto.qtd_estoque}</p>
                <p class="complemento">Status: ${produto.status ? 'Ativo' : 'Desativo'}</p>
                <div class="prod-img">
                    <div id="imagemCarousel" class="carousel slide" data-bs-ride="carousel">
                        <div class="carousel-inner">
                        ${produto.imagens.map((imagem, index) => `
                            <div class="carousel-item ${index === 0 ? 'active' : ''}">
                                <img class="d-block w-100" src="http://localhost:8000/${imagem.replace('src/', '')}" alt="Imagem do produto ${index + 1}">
                                <button class="mark-main-btn" data-index="${index}">Marcar como Principal</button>
                            </div>
                        `).join('')}
                    
                        </div>
                        <button class="carousel-control-prev" type="button" data-bs-target="#imagemCarousel" data-bs-slide="prev">
                            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">Anterior</span>
                        </button>
                        <button class="carousel-control-next" type="button" data-bs-target="#imagemCarousel" data-bs-slide="next">
                            <span class="carousel-control-next-icon seta-direita" aria-hidden="true"></span>
                            <span class="visually-hidden">Próximo</span>
                        </button>
                    </div>
                </div>
                <div class="comprar-btn d-flex align-items-center comprar">
                    <button class="btn btn-success">
                         <i class="fas fa-shopping-cart ml-2">  Comprar</i>
                    </button>
                </div>
            `;

        })
        .catch(error => {
            console.error(error);
            // Trate os erros adequadamente, por exemplo, exibindo uma mensagem de erro na página
        });
});


