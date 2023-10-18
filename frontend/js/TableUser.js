document.addEventListener("DOMContentLoaded", async () => {
    const userTableContainer = document.getElementById("user-table-container");

    // EXIBIR TABELA

    try {
        const response = await fetch("http://127.0.0.1:8000/usuario");
        const usuarios = await response.json();

        function populateTable(data) {
            const table = document.createElement("table");
            table.innerHTML = `
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Senha</th>
                        <th>Grupo</th>
                        <th>CPF</th>
                        <th>Status</th>
                        <th>Editar</th>
                        <th>Alterar senha
                    </tr>
                </thead>
                <tbody>
                    ${data.map(usuario => `
                        <tr>
                            <td>${usuario.id}</td>
                            <td>${usuario.nome}</td>
                            <td>${usuario.email}</td>
                            <td>${usuario.senha}</td>
                            <td>${usuario.grupo}</td>
                            <td>${usuario.cpf}</td>
                            <td>${usuario.status ? 'Ativo' : 'Desativado'}</td>
                            <td>
                                <button class="edit-button" data-user-id="${usuario.id}" style="cursor: pointer;">Editar</button>
                            </td>
                            <td>
                                <button class="edit-button" data-user-id="${usuario.id}" style="cursor: pointer;">Alterar senha</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            `;
            userTableContainer.innerHTML = '';
            userTableContainer.appendChild(table);
        }

        // BUSCA DE USUARIOS

        populateTable(usuarios);

        const searchInput = document.getElementById("search");
        
        searchInput.addEventListener("input", () => {
            const searchText = searchInput.value.trim().toLowerCase();
            
            const filteredUsers = usuarios.filter(usuario =>
                usuario.nome.toLowerCase().includes(searchText) ||
                usuario.cpf.toLowerCase().includes(searchText) ||
                usuario.email.toLowerCase().includes(searchText)
            );
            
            populateTable(filteredUsers);
        });

        // FORMULARIO DE CRIAÇÃO

        const userForm = document.getElementById("user-form");

        userForm.addEventListener("submit", async event => {
            event.preventDefault();

            const nome = document.getElementById("nome").value;
            const cpf = document.getElementById("cpf").value;
            const email = document.getElementById("email").value;
            const senha = document.getElementById("senha").value;
            const confirmarSenha = document.getElementById("confirmar-senha").value;
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

        // EDIÇÃO DE CAMPOS

        const userGroup = localStorage.getItem('userGroup');

        // Verifica se o usuário é do grupo "estoquista" e oculta os botões de edição
        if (userGroup === 'estoquista') {
            const editButtons = document.querySelectorAll(".edit-button");
        
            editButtons.forEach(button => {
                button.style.display = 'none'; 
            });
        }

        const editButtons = document.querySelectorAll(".edit-button");
        

        // SELECIONA TODOS OS BOTOES DE EDIÇÃO
        editButtons.forEach(button => {
            button.addEventListener("click", async () => {
                const userId = button.getAttribute("data-user-id");
                const row = button.parentNode.parentNode;
                const fields = row.querySelectorAll("td:not(:last-child)");

                // PEGA OS CAMPOS EM QUE PODE SER ALTERADO
                if (row.classList.contains("editing")) {
                    const nome = fields[1].querySelector("input").value;
                    const cpf = fields[5].querySelector("input").value;
                    const grupo = fields[4].querySelector("select").value;
                    const status = fields[6].querySelector(".status-select").value === 'ativo';

                    // CRIA O CORPO DA REQUISIÇÃO
                    const requestBody = {
                        nome,
                        cpf,
                        grupo, 
                        status,
                    };

                    // CHAMADA PARA API
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

                    // SETAR PARA OS VALORES ORIGINAIS
                    const originalValues = {
                        nome: fields[1].textContent,
                        cpf: fields[5].textContent,
                        grupo: fields[4].textContent,
                        status: fields[6].textContent
                    };

                    // SUBSTITUIR OS CAMPOS DE EDIÇÃO
                    fields[1].innerHTML = '<input type="text" value="' + originalValues.nome + '">';
                    fields[5].innerHTML = '<input type="text" value="' + originalValues.cpf + '">';

                    const grupoSelect = document.createElement("select");
                    grupoSelect.innerHTML = `
                        <option value="estoquista" ${originalValues.grupo === 'estoquista' ? 'selected' : ''}>estoquista</option>
                        <option value="admin" ${originalValues.grupo === 'admin' ? 'selected' : ''}>admin</option>
                    `;
                    fields[4].innerHTML = '';
                    fields[4].appendChild(grupoSelect);

                    const statusSelect = document.createElement("select");
                    statusSelect.classList.add("status-select"); 
                    statusSelect.innerHTML = `
                        <option value="ativo" ${originalValues.status === 'Ativo' ? 'selected' : ''}>Ativo</option>
                        <option value="desativado" ${originalValues.status === 'Desativado' ? 'selected' : ''}>Desativado</option>
                    `;
                    fields[6].innerHTML = '';
                    fields[6].appendChild(statusSelect);

                    // MUDA  O TEXTO "EDITAR" PARA "SALVAR" E AINDA VAI ADICIONAR O BOTAO CANCELAR 
                    button.textContent = "Salvar";
                    const cancelButton = document.createElement("button");
                    cancelButton.textContent = "Cancelar";
                    cancelButton.style.cursor = "pointer";
                    cancelButton.style.marginLeft = "20px";
                    cancelButton.style.marginTop = "7px";
                    cancelButton.style.color = "red";

                    // EVENTO DE CLICK PARA CANCELAR EDIÇÃO E SETAR PARA OS VALORES ORIGINAIS
                    cancelButton.addEventListener("click", () => {
                        fields[1].innerHTML = originalValues.nome;
                        fields[5].innerHTML = originalValues.cpf;
                        fields[4].innerHTML = originalValues.grupo;
                        fields[6].innerHTML = originalValues.status;  

                        button.textContent = "Editar";
                        row.classList.remove("editing");
                        row.removeChild(cancelButton);
                    });

                    row.appendChild(cancelButton);
                }
            });
        });

    } catch (error) {
        console.error("Erro ao buscar os usuários:", error);
    }
});
