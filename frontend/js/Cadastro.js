$(document).ready(function () {
    $('#dataNascimento').inputmask({
        mask: '99/99/9999',
        placeholder: 'DD/MM/AAAA'
    });

    $('#cpf').inputmask({
        mask: '999.999.999-99',
    });

    function fillAddressFields(cep) {
        $.getJSON("https://viacep.com.br/ws/" + cep + "/json/", function (data) {
            if (!data.erro) {
                // Populate the form fields with the retrieved data
                $('#endereco').val(data.logradouro);
                $('#bairro').val(data.bairro);
                $('#cidade').val(data.localidade);
                $('#estado').val(data.uf);
            } else {
                alert("CEP não encontrado.");
            }
        });
    }

    $('#cep').on('blur', function () {
        var cep = $(this).val().replace(/\D/g, '');
        if (cep.length == 8) {
            fillAddressFields(cep);
        }
    });
});

$(document).ready(function() {
    $("button[type='submit']").click(function(event) {
        event.preventDefault();

        let clienteData = {
            nome: $("#nomeCompleto").val(),
            cpf: $("#cpf").val(),
            email: $("#email").val(),
            senha: $("#senha").val(),
            confirmar_senha: $("#confirmarSenha").val(),
            data_nascimento: $("#dataNascimento").val(), // Certifique-se de que a data esteja no formato AAAA-MM-DD
            genero: $("#genero").val(),
            endereco_entrega: {
                cep: $("#cep").val(),
                logradouro: $("#endereco").val(),
                numero: $("#numero").val(),
                complemento: $("#complemento").val(),
                bairro: $("#bairro").val(),
                cidade: $("#cidade").val(),
                uf: $("#estado").val()
            }
        };

        $.ajax({
            url: "http://localhost:8000/cliente",
            type: "POST",
            data: JSON.stringify(clienteData),
            contentType: "application/json",
            success: function(response) {
                alert("Cliente criado com sucesso!");
                window.location.href = '/frontend/html/loginCliente.html';
            },
            error: function(xhr, status, error) {
                alert("Erro ao criar o cliente: " + xhr.responseText);
            }
        });
    });
});
