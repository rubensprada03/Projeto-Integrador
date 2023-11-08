document.addEventListener("DOMContentLoaded", function () {
    carregarCarrinho();
});

const valoresFrete = [10, 20, 30]; // Valores fictícios para os fretes

function calcularFrete(quantidadeItens) {
    const tipoFrete = document.getElementById('frete').value;
    return valoresFrete[tipoFrete];
    // Lógica fictícia para cálculo de frete com base na quantidade
        if (quantidadeItens < 5) {
            return valoresFrete[0];
        } else if (quantidadeItens < 10) {
            return valoresFrete[1];
        } else {
            return valoresFrete[2];
        }



}

function atualizarPrecoTotalComFrete() {
    const totalItens = parseInt(document.getElementById('total-itens').textContent, 10);
    const precoTotalSemFrete = parseFloat(document.getElementById('preco-total').textContent);
    const valorFrete = calcularFrete(totalItens);
    const precoTotalComFrete = precoTotalSemFrete + valorFrete;
    
    document.getElementById('preco-total').textContent = precoTotalComFrete.toFixed(2);
    // Atualize também algum elemento no HTML com o valor do frete, se necessário
}

// Depois atualize suas funções `carregarCarrinho` e `ajustarQuantidade` para chamar `atualizarPrecoTotalComFrete`
// Exemplo: no final de carregarCarrinho(), adicione atualizarPrecoTotalComFrete();



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
    atualizarPrecoTotalComFrete();
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
    atualizarPrecoTotalComFrete();
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

// Função para abrir o modal
document.getElementById('abrirModalEndereco').addEventListener('click', function() {
    document.getElementById('modalEndereco').style.display = 'block';
    carregarEnderecosNoModal();
});

// Função para fechar o modal
document.getElementsByClassName('close')[0].addEventListener('click', function() {
    document.getElementById('modalEndereco').style.display = 'none';
});

// Função para carregar os endereços no modal
// Função para carregar os endereços no modal e adicionar um atributo de dados com todas as informações do endereço
function carregarEnderecosNoModal() {
    var clienteId = localStorage.getItem('userId');
    if (clienteId) {
        $.ajax({
            url: 'http://localhost:8000/clientes/' + clienteId,
            method: 'GET',
            success: function (cliente) {
                var enderecosHtml = '';
                cliente.enderecos_entrega.forEach(function(endereco, i) {
                    // Adicionando um atributo de dados com o endereço completo
                    enderecosHtml += '<div class="endereco">';
                    enderecosHtml += '<input type="radio" name="enderecoSelecionado" value="' + endereco.id + '" data-endereco-completo="' + endereco.logradouro + ', ' + endereco.numero + (endereco.complemento ? ', ' + endereco.complemento : '') + ', ' + endereco.bairro + ', ' + endereco.cidade + ' - ' + endereco.uf + ', ' + endereco.cep + '">';
                    enderecosHtml += '<label for="' + endereco.id + '">Endereço ' + (i + 1) + '</label>';
                    enderecosHtml += '</div>';
                });
                document.getElementById('enderecosCadastrados').innerHTML = enderecosHtml;
            }
        });
    }
}

// Função para confirmar a seleção do endereço e exibir fora do modal
document.getElementById('confirmarEndereco').addEventListener('click', function() {
    var enderecoRadioSelecionado = document.querySelector('input[name="enderecoSelecionado"]:checked');
    var enderecoSelecionado = enderecoRadioSelecionado.getAttribute('data-endereco-completo');
    // Atualizando o conteúdo do elemento HTML com o endereço selecionado
    document.getElementById('enderecoSelecionadoDisplay').textContent = enderecoSelecionado;
    // Fechando o modal
    document.getElementById('modalEndereco').style.display = 'none';
});




document.addEventListener('DOMContentLoaded', function() {
    // Função para mostrar/esconder detalhes do cartão
    function toggleCardDetails() {
      var paymentMethod = document.querySelector('input[name="formaPagamento"]:checked').value;
      var cardDetails = document.getElementById('detalhesCartao');
      if (paymentMethod === 'cartao') {
        cardDetails.style.display = 'block';
      } else {
        cardDetails.style.display = 'none';
      }
    }
  
    // Adicionar evento de clique aos botões de rádio
    document.getElementById('boleto').addEventListener('change', toggleCardDetails);
    document.getElementById('cartao').addEventListener('change', toggleCardDetails);
  
    // Validação do formulário antes do envio
    document.getElementById('formPagamento').onsubmit = function(e) {
      e.preventDefault();
      var paymentMethod = document.querySelector('input[name="formaPagamento"]:checked');
  
      // Se nenhum método de pagamento estiver selecionado
      if (!paymentMethod) {
        alert('Por favor, selecione uma forma de pagamento.');
        return;
      }
  
      // Se cartão de crédito estiver selecionado, validar campos
      if (paymentMethod.value === 'cartao') {
        var numeroCartao = document.getElementById('numeroCartao').value;
        var codigoVerificador = document.getElementById('codigoVerificador').value;
        var nomeCompleto = document.getElementById('nomeCompleto').value;
        var dataVencimento = document.getElementById('dataVencimento').value;
        var quantidadeParcelas = document.getElementById('quantidadeParcelas').value;
  
        if (!numeroCartao || !codigoVerificador || !nomeCompleto || !dataVencimento || !quantidadeParcelas) {
          alert('Por favor, preencha todos os campos do cartão de crédito.');
          return;
        }
  
        // Aqui você pode adicionar mais validações de formato, como verificar se o número do cartão é válido, etc.
      }
  
      // Se tudo estiver ok, prosseguir para a próxima etapa
      // Por exemplo: enviar as informações do pedido e pagamento para o servidor
      alert('Pedido validado com sucesso!');
      // Aqui você pode adicionar a lógica para enviar as informações ao servidor
    };
  });
  



  document.getElementById('finalizarCompraBtn').addEventListener('click', function() {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const enderecoEntrega = document.getElementById('enderecoSelecionadoDisplay').textContent;
    const formaPagamento = document.querySelector('input[name="formaPagamento"]:checked').value;
    const frete = parseFloat(document.getElementById('preco-total').textContent) - parseFloat(carrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0));
    const totalGeral = parseFloat(document.getElementById('preco-total').textContent);

    const compra = {
        produtos: carrinho.map(item => ({ nome: item.nome, precoUnitario: item.preco, quantidade: item.quantidade, valorTotal: item.preco * item.quantidade })),
        frete: frete,
        totalGeral: totalGeral,
        enderecoEntrega: enderecoEntrega,
        formaPagamento: formaPagamento
    };

    localStorage.setItem('compraFinalizada', JSON.stringify(compra));
    alert('Compra finalizada com sucesso!');
});

document.getElementById('checkout-button').addEventListener('click', function() {
    // Aqui você pega os dados do Local Storage
    var purchaseData = localStorage.getItem('compraFinalizada');
    
    if (purchaseData) {
      // Faz o parse dos dados JSON para um objeto JavaScript
      var purchaseObj = JSON.parse(purchaseData);
      
      // Estrutura inicial para a sua lista
      var htmlContent = `<ul>
                           <li>Frete: R$${purchaseObj.frete.toFixed(2)}</li>
                           <li>Total Geral: R$${purchaseObj.totalGeral.toFixed(2)}</li>
                           <li>Forma de Pagamento: ${purchaseObj.formaPagamento}</li>
                           <li>Produtos:</li>`;
  
      // Iterar sobre os produtos e adicionar à lista
      purchaseObj.produtos.forEach(function(produto) {
        htmlContent += `<li>${produto.quantidade}x ${produto.nome} - R$${produto.valorTotal.toFixed(2)}</li>`;
      });
  
      // Fechar a tag <ul>
      htmlContent += '</ul>';
  
      // Atualizar o modal com os dados de compra formatados
      document.getElementById('purchase-info').innerHTML = htmlContent;
    } else {
      // Se não houver dados, informar ao usuário
      document.getElementById('purchase-info').textContent = 'Nenhum detalhe de compra encontrado.';
    }
    
    // Mostrar o modal
    document.getElementById('checkout-modal').style.display = 'block';
  });
  
  // Fechar o modal
  document.getElementById('modal-close-btn').addEventListener('click', function() {
    document.getElementById('checkout-modal').style.display = 'none';
  });
  
  