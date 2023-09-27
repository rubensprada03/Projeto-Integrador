document.addEventListener("DOMContentLoaded", function () {
    // Obtenha o ID do produto a partir do URL
    const params = new URLSearchParams(window.location.search);
    const idDoProduto = params.get("id");
  
    // Faça uma solicitação AJAX para obter os detalhes do produto com base no ID
    fetch(`http://localhost:8000/produtos/${idDoProduto}`)
      .then(function (response) {
        return response.json();
      })
      .then(function (produto) {
        // Atualize a página com os detalhes do produto
        const nomeDoProduto = document.getElementById("nome-do-produto");
        const descricaoDoProduto = document.getElementById("descricao-do-produto");
        const precoDoProduto = document.getElementById("preco-do-produto");
        const imagensDoProduto = document.getElementById("imagens-do-produto");
  
        nomeDoProduto.textContent = produto.nome;
        descricaoDoProduto.textContent = produto.descricao_detalhada; // Substitua pelo nome do atributo correto
        precoDoProduto.textContent = `Preço: R$ ${produto.preco} `;
  
        // Adicione todas as imagens do produto ao elemento de imagens
        produto.imagens.forEach(function (imagemSrc, index) {
          const imagem = document.createElement("img");
          imagem.src = `http://localhost:8000/${imagemSrc.replace('src/', '')}`;
          imagem.alt = produto.nome + ` - Imagem ${index + 1}`;
          imagensDoProduto.appendChild(imagem);
        });
        
      })
      .catch(function (error) {
        console.error("Erro ao obter detalhes do produto:", error);
      });
  });
  

