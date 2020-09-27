const ws = new WebSocket(`ws://${window.location.hostname}:9898`);

const MESSAGE_TYPE = {
    DRAW: 'DRAW',
    BOARD_ADDED: 'BOARD_ADDED',
    PING: 'PING',
    BOARD_GET: 'BOARD_GET',
    ATTENDEES_CHANGED: 'ATTENDEES_CHANGED'
}

function uuidv4() {
    return 'xxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function getURLParam(param) {
    return new URLSearchParams(window.location.search).get(param);
}

function getMessageForServer(type, data) {
    let message = {};
    if (isJson(data)) {
        data['type'] = type;
        message = data;
    } else {
        message['type'] = type;
        message.data = data;
    }
    appLog(`Sending message from sever of type ${message.type}`);
    return JSON.stringify(message);
}

function isJson(obj) {
    var t = typeof obj;
    return ['boolean', 'number', 'string', 'symbol', 'function'].indexOf(t) == -1;
}

const delay = (function () {
    var timer = 0;
    return function (callback, ms) {
        clearTimeout(timer);
        timer = setTimeout(callback, ms);
    };
})();

function appLog(msg) {
    console.log(`${new Date()} : ${msg}`);
}