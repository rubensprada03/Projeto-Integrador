
// TABELA DE USUARIOS DO ADM 
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
                    <th>cpf</th>
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
                    </tr>
                `).join('')}
            </tbody>
        `;

        userTableContainer.appendChild(table);
    } catch (error) {
        console.error("Erro ao buscar os usuários:", error);
    }
});

