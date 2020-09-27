// Web socket connection initialiser
ws.onopen = function () {
    appLog('WebSocket Client Connected');
    sendDataOverSocket(getMessageForServer(MESSAGE_TYPE.PING, 'Hi this is web client.'));
};

ws.onerror = function(e){
    appLog(`Error in web socket ${e}`);
    appLog(`${JSON.stringify(e)}`);
}

ws.onmessage = function (e) {
    let receivedData = JSON.parse(e.data);
    appLog(`Got message of type ${receivedData.type}`);
    switch (receivedData.type) {
        case MESSAGE_TYPE.BOARD_GET:
            showBoard(receivedData, false);
            break;
        case MESSAGE_TYPE.DRAW:
            drawFromStream(receivedData);
            break;
        case MESSAGE_TYPE.ATTENDEES_CHANGED:
            changeCollaboratorsCount(receivedData);
            break;
        default:
            break;
    }
};

function publish(data, callBack) {
    sendDataOverSocket(getMessageForServer(MESSAGE_TYPE.DRAW,
        {
            drawing: data,
            board: JSON.parse(localStorage.getItem('board'))
        })
        , callBack);
}

this.sendDataOverSocket = (message, callback) => {
    this.waitForConnection(function () {
        ws.send(message);
        if (typeof callback !== 'undefined') {
            callback();
        }
    }, 1000);
}

this.waitForConnection = (callback, interval) => {
    appLog(`Trying to send data 🙃`);
    if (ws.readyState === 1) {
        callback();
    } else {
        var that = this;
        // optional: implement backoff for interval here
        setTimeout(function () {
            that.waitForConnection(callback, interval);
        }, interval);
    }
}