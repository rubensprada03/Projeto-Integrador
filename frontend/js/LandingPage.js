const imgs = document.getElementById("img");
const img = document.querySelectorAll("#img img");

let idx = 0;

function carrossel(){
    idx++;
    if(idx > img.length -1){
        idx = 0
    }

    imgs.style.transform = `translatex($-idx*200)px`;

}

setInterval(carrossel,1800);


document.addEventListener("DOMContentLoaded", function () {
  atualizarIndicadorCarrinho();
  function carregarProdutos() {
    fetch("http://localhost:8000/produtos/")
      .then((response) => response.json())
      .then((data) => {
        // Seleciona o elemento onde você deseja exibir os produtos
        const produtosContainer = document.getElementById("produtos-container");

        // Limpa o conteúdo anterior
        produtosContainer.innerHTML = "";

        // Itera sobre os produtos e cria elementos HTML para cada um deles
        data.forEach((produto) => {
          const card = document.createElement("div");
          card.classList.add("card");

          // Use a imagem do produto no caminho correto
          const imagem = document.createElement("img");
          imagem.src = `http://localhost:8000/${produto.imagens[0].replace('src/', '')}`;
          imagem.alt = produto.nome;
          imagem.classList.add("product-image");

          const h2 = document.createElement("h2");
          h2.textContent = produto.nome;

          // Adicione o preço do produto (substitua "preco" pelo nome do atributo correto)
          const precoParagrafo = document.createElement("p");
          precoParagrafo.textContent = `Preço: ${produto.preco} R$`; // Substitua "preco" pelo nome do atributo correto

          // Adicione o botão "Visualizar"
          const visualizarLink = document.createElement("a");
          visualizarLink.textContent = "Visualizar";
          visualizarLink.classList.add("visualizar-button");
          visualizarLink.href = `/frontend/html/detalhes.html?id=${produto.id}`; // Substitua pelo URL da página de detalhes com o ID do produto
          
          // Adicione os elementos ao cartão
          card.appendChild(imagem);
          card.appendChild(h2);
          card.appendChild(precoParagrafo);
          card.appendChild(visualizarLink);

          // Adicione o cartão ao contêiner de produtos
          produtosContainer.appendChild(card);
        });
      })
      .catch((error) => {
        console.error("Erro ao obter produtos:", error);
      });
  }

  // Carregue os produtos inicialmente
  carregarProdutos();
});



function atualizarIndicadorCarrinho() {
  let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
  let totalItens = carrinho.reduce((total, produto) => total + produto.quantidade, 0);
  
  let indicadorCarrinho = document.getElementById('carrinho-indicador');
  if (indicadorCarrinho) {
      indicadorCarrinho.textContent = totalItens;
  }
}
