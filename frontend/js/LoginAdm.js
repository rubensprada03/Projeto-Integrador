// SISTEMA DE LOGIN

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("login-form");
    const errorElement = document.getElementById("error-message");
    const modal = document.getElementById("modal");
    const closeButton = document.getElementById("close-button");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData = new URLSearchParams(new FormData(form));

        try {
            const response = await fetch("http://127.0.0.1:8000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: formData.toString(),
            });

            if (response.ok) {
                const data = await response.json();
                alert("Login bem-sucedido");

                // Exiba o modal após o login bem-sucedido
                modal.style.display = "block";
            } else {
                const errorData = await response.json();
                errorElement.textContent = errorData.detail;
            }
        } catch (error) {
            errorElement.textContent = "Erro ao fazer a solicitação. Verifique sua conexão.";
        }
    });

    closeButton.addEventListener("click", () => {
        // Feche o modal quando o botão "x" for clicado
        modal.style.display = "none";
    });
});
