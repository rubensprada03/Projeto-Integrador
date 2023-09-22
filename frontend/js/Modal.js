document.addEventListener("DOMContentLoaded", () => {
    const openModalButton = document.getElementById("open-modal-button");
    const modal = document.getElementById("modal");
    const closeButton = document.getElementById("close-button");

    openModalButton.addEventListener("click", () => {
        modal.style.display = "block";
    });

    closeButton.addEventListener("click", () => {
        modal.style.display = "none";
    });

    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
});


// Botão para abrir o modal
const openModalButton = document.getElementById('open-modal-button');

// Modal e botão para fechar
const modal = document.getElementById('modal');
const closeButton = document.getElementById('close-button');

// Verifique o grupo do usuário no localStorage
const userGroup = localStorage.getItem('userGroup');

// Verifique se o usuário é um "estoquista" e oculte o botão se for
if (userGroup === 'estoquista') {
    openModalButton.style.display = 'none';
}

// Abre o modal
openModalButton.addEventListener('click', () => {
    modal.style.display = 'block';
});

// Resto do código para fechar o modal, etc.


// Fecha o modal
closeButton.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Fecha o modal ao clicar fora do conteúdo do modal
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

