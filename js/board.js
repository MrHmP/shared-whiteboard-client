
function showBoard(board, toggleBoard) {
    document.getElementById("h1BoardName").innerHTML = board.name;
    window.history.pushState("", board.name, `/?bid=${board.id}`);
    localStorage.setItem('board', JSON.stringify(board));
    (board.drawings || []).forEach(message => {
        drawFromStream(message);
    });
    if (toggleBoard)
        toggleModal();
}

function changeCollaboratorsCount(data) {
    document.getElementById('occupancy').innerHTML = data.listeners;
}

(() => {
    const boardId = getURLParam('bid');
    if (boardId == null) {
        openModalPopup('Create a new board', 'Add a new board name', 'Submit!', () => {
            if (document.getElementById('modal-heading').innerHTML === 'Create a new board') {
                const boardName = document.getElementById('modal-textbox').value;
                if (boardName) {
                    const board = { 'name': boardName, 'id': uuidv4() };
                    sendDataOverSocket(getMessageForServer(MESSAGE_TYPE.BOARD_ADDED, board)
                        , () => { showBoard(board, true) }
                    );
                }
            }
        })
    } else {
        sendDataOverSocket(getMessageForServer(MESSAGE_TYPE.BOARD_GET, { bid: boardId }));
    }
})();