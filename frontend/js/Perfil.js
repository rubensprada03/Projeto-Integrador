var clienteId;
$(document).ready(function () {
    clienteId = localStorage.getItem('userId');  // Remova o "var" para não redeclarar

    if (clienteId) {
        $.ajax({
            url: 'http://localhost:8000/clientes/' + clienteId,
            method: 'GET',
            success: function (cliente) {
                $('#clienteId').text(cliente.id);
                $('#clienteNome').text(cliente.nome);
                $('#clienteCpf').text(cliente.cpf);
                $('#clienteEmail').text(cliente.email);
                $('#clienteDataNasc').text(cliente.data_nascimento);
                $('#clienteGenero').text(cliente.genero);

                if (cliente.enderecos_entrega && cliente.enderecos_entrega.length > 0) {
                    var enderecoHtml = '';
                    for (var i = 0; i < cliente.enderecos_entrega.length; i++) {
                        var endereco = cliente.enderecos_entrega[i];
                        enderecoHtml += '<div class="endereco">';
                        enderecoHtml += '<h5 class="endereco-title">Endereço ' + (i + 1) + ' (ID: ' + endereco.id + '):</h5>'; // Mostrando o ID aqui
                        enderecoHtml += '<ul>';
                        enderecoHtml += '<li class="content-adr">CEP: ' + endereco.cep + '</li>';
                        enderecoHtml += '<li class="content-adr">Logradouro: ' + endereco.logradouro + '</li>';
                        enderecoHtml += '<li class="content-adr">Número: ' + endereco.numero + '</li>';
                        enderecoHtml += '<li class="content-adr">Complemento: ' + endereco.complemento + '</li>';
                        enderecoHtml += '<li class="content-adr">Bairro: ' + endereco.bairro + '</li>';
                        enderecoHtml += '<li class="content-adr">Cidade: ' + endereco.cidade + '</li>';
                        enderecoHtml += '<li class="content-adr">UF: ' + endereco.uf + '</li>';
                        enderecoHtml += '<li class="content-adr">Endereço principal: ' + booleanParaSimNao(endereco.is_principal) + '</li>';

                        enderecoHtml += '</ul >';
                        enderecoHtml += '<button class="deleteAddress" data-endereco-id="' + endereco.id + '">Excluir</button>';
                        enderecoHtml += '<button class="mark-principal" data-endereco-id="' + endereco.id + '" >Marcar como pricipal</button>';
                        enderecoHtml += '</div><hr class="divider-address">';

                    }
                    $('#enderecos').html(enderecoHtml);
                } 
                
            },
            error: function (error) {
                alert("Erro ao buscar informações do cliente: " + error.responseText);
            }
        });
    } else {
        alert("ID do cliente não encontrado no localStorage. Por favor, faça login novamente.");
    }

    $('#changePasswordBtn').on('click', function() {
        $('#changePasswordForm').show();
    });

    $('#cancelPasswordChange').on('click', function() {
        $('#changePasswordForm').hide();
        $('#currentPassword, #newPassword, #confirmNewPassword').val('');
    });

    $('#submitNewPassword').on('click', function(e) {
        e.preventDefault();

        var novaSenha = $('#newPassword').val();
        var confirmarNovaSenha = $('#confirmNewPassword').val();

        if (novaSenha !== confirmarNovaSenha) {
            alert("As senhas não coincidem. Por favor, tente novamente.");
            return;
        }

        $.ajax({
            url: 'http://localhost:8000/cliente/' + clienteId + '/alterar-senha',
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify({
                nova_senha: novaSenha,
                confirmar_nova_senha: confirmarNovaSenha
            }),
            success: function(response) {
                alert("Senha alterada com sucesso!");
                $('#changePasswordForm').hide();
                $('#currentPassword, #newPassword, #confirmNewPassword').val('');
            },
            error: function(error) {
                alert("Erro ao alterar senha: " + error.responseText);
            }
        });
    });

    $('#updateProfileBtn').on('click', function() {
        // Preencha os campos de entrada com os valores originais do cliente
        $('#updateNome').val($('#clienteNome').text());  
        $('#updateDataNascimento').val($('#clienteDataNasc').text()); 
        $('#updateGenero').val($('#clienteGenero').text());  

        $('#updateProfileForm').show();
    });

    $('#cancelUpdateProfile').on('click', function() {
        $('#updateProfileForm').hide();
        $('#updateNome, #updateDataNasc, #updateGenero').val('');
    });

    $('#submitUpdateProfile').on('click', function(e) {
        e.preventDefault();

        var nome = $('#updateNome').val();
        var dataNascimento = $('#updateDataNascimento').val();
        var genero = $('#updateGenero').val();

        $.ajax({
            url: 'http://localhost:8000/cliente/' + clienteId,
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify({
                nome: nome,
                data_nascimento: dataNascimento,
                genero: genero
            }),
            success: function(response) {
                alert("Perfil atualizado com sucesso!");
                $('#updateProfileForm').hide();
                $('#updateNome, #updateDataNasc, #updateGenero').val('');
            },
            error: function(error) {
                alert("Erro ao atualizar o perfil: " + error.responseText);
            }
        });
    });

    $('#addAddressBtn').on('click', function(){
        $('#addAddressFields').show();  // Mostra a lista de campos
    });

    $('#cancelAddAddress').on('click', function(){
        $('#addAddressFields').hide();  // Oculta a lista de campos
    });
    function fillAddressFields(cep) {
        $.getJSON("https://viacep.com.br/ws/" + cep + "/json/", function (data) {
            if (!data.erro) {
                // Populate the form fields with the retrieved data
                $('#newLogradouro').val(data.logradouro);
                $('#newBairro').val(data.bairro);
                $('#newCidade').val(data.localidade);
                $('#newUf').val(data.uf);
            } else {
                alert("CEP não encontrado.");
            }
        });
    }
    function booleanParaSimNao(valor) {
        return valor ? "Sim" : "Não";
      }
      
    
    $('#newCep').on('blur', function () {
        var cep = $(this).val().replace(/\D/g, '');
        if (cep.length == 8) {
            fillAddressFields(cep);
        }
    });


});



function addNewAddress() {
    var enderecoData = {
        cep: $("#newCep").val(),
        logradouro: $("#newLogradouro").val(),
        numero: $("#newNumero").val(),
        complemento: $("#newComplemento").val(),
        bairro: $("#newBairro").val(),
        cidade: $("#newCidade").val(),
        uf: $("#newUf").val()
    };

    $.ajax({
        type: "POST",
        url: "http://localhost:8000/cliente/" + clienteId + "/endereco",
        data: JSON.stringify(enderecoData),
        contentType: "application/json; charset=utf-8",
        success: function(response) {
            alert("Endereço adicionado com sucesso!");
            // Aqui, você pode adicionar qualquer ação adicional que deseja realizar após uma resposta bem-sucedida.
        },
        error: function(error) {
            alert("Erro ao adicionar endereço. Por favor, tente novamente.");
        }
    });
}


$(document).on('click', '.deleteAddress', function() {
    var enderecoId = $(this).data('endereco-id');
    
    $.ajax({
        url: 'http://localhost:8000/cliente/' + clienteId + '/endereco?endereco_id=' + enderecoId,
        method: 'DELETE',
        data: { endereco_id: enderecoId },
        success: function(response) {
            alert("Endereço excluído com sucesso!");
            // Atualize a exibição do endereço ou recarregue a página para refletir as mudanças
        },
        error: function(error) {
            alert("Erro ao excluir o endereço: " + error.responseText);
        }
    });
});



$(document).on('click', '.mark-principal', function() {
    var enderecoId = $(this).data('endereco-id');  // Adicione o atributo data-endereco-id aos seus botões "Marcar como principal"
    
    $.ajax({
        url: 'http://localhost:8000/cliente/' + clienteId + '/endereco/' + enderecoId + '/principal',
        method: 'PATCH',
        success: function(response) {
            alert("Endereço definido como principal com sucesso!");
            // Aqui você pode adicionar qualquer ação que deseja realizar após uma resposta bem-sucedida,
            // como recarregar os endereços para refletir a mudança.
        },
        error: function(error) {
            alert("Erro ao definir o endereço como principal: " + error.responseText);
        }
    });
});

// Não esqueça de adicionar o atributo data-endereco-id aos botões "Marcar como principal"
// Exemplo:
// enderecoHtml += '<button class="mark-principal" data-endereco-id="' + endereco.id + '">Marcar como pricipal</button>';


$(document).on('click', '.unmark-principal', function() {
    var enderecoId = $(this).data('endereco-id');
    
    $.ajax({
        url: 'http://localhost:8000/cliente/' + clienteId + '/endereco/' + enderecoId + '/principal',
        method: 'PATCH',
        data: JSON.stringify({ is_principal: false }),
        contentType: 'application/json',
        success: function(response) {
            alert("Endereço desativado como principal com sucesso!");
            // Atualize a exibição ou recarregue a página
        },
        error: function(error) {
            alert("Erro ao desativar o endereço como principal: " + error.responseText);
        }
    });
});
  