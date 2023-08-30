document.addEventListener("DOMContentLoaded", async () => {
    const userTableContainer = document.getElementById("user-table-container");

    try {
        const response = await fetch("http://127.0.0.1:8000/usuario");
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
                    <th>Senha</th>
                    <th>Grupo</th>
                    <th>CPF</th>
                    <th>Status</th>
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
                        <td>${usuario.senha}</td>
                        <td>${usuario.grupo}</td>
                        <td>${usuario.cpf}</td>
                        <td>${usuario.status ? 'Ativo' : 'Desativado'}</td>
                        <td>
                            <button class="edit-button" data-user-id="${usuario.id}" style="cursor: pointer;">Editar</button>
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
        const grupoCriacao = document.getElementById("grupo-criacao").value;

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
                    grupo: grupoCriacao
                })
            });

            const responseData = await response.json();

            if (response.ok) {
                console.log("Novo usuário criado:", responseData);
                alert("Usuário criado com sucesso!");
            } else if (response.status === 400) {
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

    const editButtons = document.querySelectorAll(".edit-button");

    editButtons.forEach(button => {
        button.addEventListener("click", async () => {
            const userId = button.getAttribute("data-user-id");
            const row = button.parentNode.parentNode;
            const fields = row.querySelectorAll("td:not(:last-child)");

            if (row.classList.contains("editing")) {
                const nome = fields[1].querySelector("input").value;
                const cpf = fields[7].querySelector("input").value;
                const senha = fields[5].querySelector("input").value;
                const grupo = fields[6].querySelector("select").value;
                const status = fields[8].querySelector(".status-select").value === 'ativo';

                const requestBody = {
                    nome,
                    cpf,
                    senha,
                    grupo, 
                    status,
                };

                try {
                    const response = await fetch(`http://127.0.0.1:8000/usuario/${userId}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(requestBody)
                    });

                    const responseData = await response.json();

                    if (response.ok) {
                        console.log("Usuário atualizado:", responseData);
                        button.textContent = "Editar";
                        row.classList.remove("editing");
                    } else {
                        console.error("Erro ao atualizar o usuário:", responseData);
                        alert("Erro ao atualizar o usuário. Por favor, tente novamente mais tarde.");
                    }
                } catch (error) {
                    console.error("Erro ao atualizar o usuário:", error);
                    alert("Erro ao atualizar o usuário. Por favor, tente novamente mais tarde.");
                }
                
            } else {
                row.classList.add("editing");

                const originalValues = {
                    nome: fields[1].textContent,
                    cpf: fields[7].textContent,
                    senha: fields[5].textContent,
                    grupo: fields[6].textContent,
                    status: fields[8].textContent
                };

                fields[1].innerHTML = '<input type="text" value="' + originalValues.nome + '">';
                fields[7].innerHTML = '<input type="text" value="' + originalValues.cpf + '">';
                fields[5].innerHTML = '<input type="password" value="' + originalValues.senha + '">';

                const grupoSelect = document.createElement("select");
                grupoSelect.innerHTML = `
                    <option value="estoquista" ${originalValues.grupo === 'estoquista' ? 'selected' : ''}>estoquista</option>
                    <option value="admin" ${originalValues.grupo === 'admin' ? 'selected' : ''}>admin</option>
                `;
                fields[6].innerHTML = '';
                fields[6].appendChild(grupoSelect);

                const statusSelect = document.createElement("select");
                statusSelect.classList.add("status-select"); 
                statusSelect.innerHTML = `
                    <option value="ativo" ${originalValues.status === 'Ativo' ? 'selected' : ''}>Ativo</option>
                    <option value="desativado" ${originalValues.status === 'Desativado' ? 'selected' : ''}>Desativado</option>
                `;
                fields[8].innerHTML = '';
                fields[8].appendChild(statusSelect);

                button.textContent = "Salvar";

                const cancelButton = document.createElement("button");
                cancelButton.textContent = "Cancelar";
                cancelButton.style.cursor = "pointer";
                cancelButton.style.marginLeft = "20px";
                cancelButton.style.marginTop = "7px";
                cancelButton.style.color = "red";
                cancelButton.addEventListener("click", () => {
                    fields[1].innerHTML = originalValues.nome;
                    fields[7].innerHTML = originalValues.cpf;
                    fields[5].innerHTML = originalValues.senha;
                    fields[6].innerHTML = originalValues.grupo;
                    fields[8].innerHTML = originalValues.status;        

                    button.textContent = "Editar";
                    row.classList.remove("editing");
                    row.removeChild(cancelButton);
                });

                row.appendChild(cancelButton);
            }
        });
    });
});
