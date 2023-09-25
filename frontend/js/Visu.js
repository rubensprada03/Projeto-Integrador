// VISUALIZAR PRODUTO
function visualizarProduto(produtoId) {
    // Redireciona para a página "vizuprod.html" com o ID do produto na URL
    window.location.href = `/frontend/html/vizuprod.html?id=${produtoId}`;
    console.log(produtoId)
}

