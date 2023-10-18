document.addEventListener("DOMContentLoaded", function () {
  atualizarIndicadorCarrinho();

  const params = new URLSearchParams(window.location.search);
  const idDoProduto = params.get("id");

  fetch(`http://localhost:8000/produtos/${idDoProduto}`)
      .then(function(response) {
          return response.json();
      })
      .then(function(produto) {
          const nomeDoProduto = document.getElementById("nome-do-produto");
          const descricaoDoProduto = document.getElementById("descricao-do-produto");
          const precoDoProduto = document.getElementById("preco-do-produto");
          const imagensDoProduto = document.getElementById("imagens-do-produto");
          const avaliacao = document.getElementById("avaliacao");

          nomeDoProduto.textContent = produto.nome;
          descricaoDoProduto.textContent = produto.descricao_detalhada;
          precoDoProduto.textContent = `Preço: R$ ${produto.preco} `;
          avaliacao.textContent = `Avaliação: ${produto.avaliacao}/5`

          produto.imagens.forEach(function (imagemSrc, index) {
              const imagem = document.createElement("img");
              imagem.src = `http://localhost:8000/${imagemSrc.replace('src/', '')}`;
              imagem.alt = produto.nome + ` - Imagem ${index + 1}`;
              imagensDoProduto.appendChild(imagem);
          });

          const botaoComprar = document.querySelector('.compra');
          botaoComprar.addEventListener('click', function() {
              adicionarAoCarrinho(produto);
              //window.location.href = "/paginaPrincipalOuCarrinho.html"; // Modifique este URL conforme necessário
          });
      })
      .catch(function(error) {
          console.error("Erro ao obter detalhes do produto:", error);
      });
});

function adicionarAoCarrinho(produto) {
  let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

  let produtoExistente = carrinho.find(p => p.id === produto.id);

  if (produtoExistente) {
      produtoExistente.quantidade += 1;
  } else {
      carrinho.push({
          id: produto.id,
          nome: produto.nome,
          preco: produto.preco,
          quantidade: 1
      });
  }

  localStorage.setItem('carrinho', JSON.stringify(carrinho));
  atualizarIndicadorCarrinho();
}

function atualizarIndicadorCarrinho() {
  let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
  let totalItens = carrinho.reduce((total, produto) => total + produto.quantidade, 0);

  let indicadorCarrinho = document.getElementById('carrinho').querySelector('span');
  if (indicadorCarrinho) {
      indicadorCarrinho.textContent = totalItens;
  }
}
