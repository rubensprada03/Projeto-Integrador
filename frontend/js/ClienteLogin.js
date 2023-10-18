$(document).ready(function () {
    $("#formularioLogin").submit(function (event) {
        event.preventDefault();

        var email = $("#loginEmail").val();
        var senha = $("#loginSenha").val();

        $.ajax({
            url: 'http://localhost:8000/cliente/login',  // Endereço da sua rota de login
            method: 'POST',
            data: {
                username: email,
                password: senha
            },
            success: function (response) {
                // Informa o usuário sobre o sucesso no login
                alert("Login com sucesso!");

                // Redireciona para uma página inicial
                localStorage.setItem('userId', response.id);
                console.log("Resposta do login:", response);
                window.location.href = '/frontend/html/landingPage.html';

            },
            error: function (error) {
                // Aqui você pode definir o gue fazer em caso de erro no login.
                alert("Erro ao fazer login: " + error.responseText);
            }
        });
    });
});
