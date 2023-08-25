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
