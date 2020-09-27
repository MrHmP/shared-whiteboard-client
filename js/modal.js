let modal = document.querySelector(".modal");
let closeButton = document.querySelector(".close-button");

function toggleModal() {
    modal.classList.toggle("show-modal");
}

closeButton.addEventListener("click", toggleModal);

function openModalPopup(heading, placeHolderText, buttonText, submitCallBack) {
    document.getElementById('modal-heading').innerHTML = heading;
    document.getElementById('modal-textbox').placeholder = placeHolderText;
    document.getElementById('modal-action-button').innerHTML = buttonText;
    document.getElementById("modal-action-button").addEventListener("click", submitCallBack);
    toggleModal();
}