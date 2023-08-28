document.addEventListener("DOMContentLoaded", async () => {
    const userTableContainer = document.getElementById("user-table-container");

    try {
        const response = await fetch("http://127.0.0.1:8000/usuario"); // Substitua pela URL correta
        const usuarios = await response.json();

        const table = document.createElement("table");
        table.innerHTML = `
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Email</th>
                    <th>Endereço</th>
                    <th>Telefone</th>
                    <th>Grupo</th>
                    <th>CPF</th>
                    <th>Status</>
                    <th>Editar</th>
                </tr>
            </thead>
            <tbody>
                ${usuarios.map(usuario => `
                    <tr>
                        <td>${usuario.id}</td>
                        <td>${usuario.nome}</td>
                        <td>${usuario.email}</td>
                        <td>${usuario.endereco}</td>
                        <td>${usuario.telefone}</td>
                        <td>${usuario.grupo}</td>
                        <td>${usuario.cpf}</td>
                        <td>${usuario.status}</td>
                        <td>
                            <button class="edit-button" data-user-id="${usuario.id}" style="cursor: pointer;">Editar</button>
                            <span style="cursor: pointer;">&#x2716;</span>
                        </td>


                        
                    </tr>
                `).join('')}
            </tbody>
        `;

        userTableContainer.appendChild(table);
    } catch (error) {
        console.error("Erro ao buscar os usuários:", error);
    }
    
    const userForm = document.getElementById("user-form");
    
    userForm.addEventListener("submit", async event => {
        event.preventDefault();
        
        const nome = document.getElementById("nome").value;
        const cpf = document.getElementById("cpf").value;
        const email = document.getElementById("email").value;
        const senha = document.getElementById("senha").value;
        const confirmarSenha = document.getElementById("confirmar-senha").value;
        const endereco = document.getElementById("endereco").value;
        const telefone = document.getElementById("telefone").value;
        const grupo = document.getElementById("grupo").value;
        
        // Realize validações e verifique se as senhas coincidem
        
        try {
            const response = await fetch("http://127.0.0.1:8000/usuario", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nome,
                    cpf,
                    email,
                    senha,
                    confirmar_senha: confirmarSenha,
                    endereco,
                    telefone,
                    grupo
                })
            });
        
            const responseData = await response.json();
        
            if (response.ok) {
                console.log("Novo usuário criado:", responseData);
                alert("Usuário criado com sucesso!");
            } else if (response.status === 400) {
                // Erro de validação ou dados duplicados
                if (responseData.detail === "Email já está em uso") {
                    alert("Email já está em uso. Por favor, escolha outro.");
                } else if (responseData.detail === "Cpf ja em uso") {
                    alert("CPF já está em uso. Por favor, escolha outro.");
                } else if (responseData.detail === "As senhas não coincidem") {
                    alert("As senhas não coincidem. Por favor, verifique novamente.");
                } else {
                    alert("Erro ao criar o usuário. Por favor, verifique os dados e tente novamente.");
                }
            } else {
                console.error("Erro ao criar o usuário:", responseData);
                alert("Erro ao criar o usuário. Por favor, tente novamente mais tarde.");
            }
        } catch (error) {
            console.error("Erro ao criar o usuário:", error);
            alert("Erro ao criar o usuário. Por favor, tente novamente mais tarde.");
        }
        
    });

/*     const editButtons = document.querySelectorAll(".edit-button");

    editButtons.forEach(button => {
        button.addEventListener("click", () => {
            const userId = button.getAttribute("data-user-id");
            const row = button.parentNode.parentNode;
            const fields = row.querySelectorAll("td:not(:last-child)");

            if (row.classList.contains("editing")) {
                const nome = fields[1].querySelector("input").value;
                const cpf = fields[6].querySelector("input").value;
                const senha = fields[3].querySelector("input").value;
                const confirmarSenha = fields[3].querySelector("input").value;
                const grupo = fields[5].querySelector("input").value;

                const requestBody = {
                    nome,
                    cpf,
                    senha,
                    confirmar_senha: confirmarSenha,
                    grupo
                };

                // Faça a requisição PUT para atualizar o usuário

                button.textContent = "Editar";
                row.classList.remove("editing");
            } else {
                row.classList.add("editing");

                const originalValues = {
                    nome: fields[1].textContent,
                    cpf: fields[6].textContent,
                    senha: fields[3].textContent,
                    grupo: fields[5].textContent
                };

                fields[1].innerHTML = `<input type="text" value="${originalValues.nome}">`;
                fields[6].innerHTML = `<input type="text" value="${originalValues.cpf}">`;
                fields[3].innerHTML = `<input type="password" value="${originalValues.endereco}">`;
                fields[5].innerHTML = `<input type="text" value="${originalValues.grupo}">`;

                button.textContent = "Salvar";
                const cancelButton = document.createElement("button");
                cancelButton.textContent = "Cancelar";
                cancelButton.classList.add("cancel-button");
                cancelButton.addEventListener("click", () => {
                    fields[1].textContent = originalValues.nome;
                    fields[6].textContent = originalValues.cpf;
                    fields[3].textContent = originalValues.senha;
                    fields[5].textContent = originalValues.grupo;

                    button.textContent = "Editar";
                    row.classList.remove("editing");
                });
                fields[7].appendChild(cancelButton);
            }
        });
    }); */
});
