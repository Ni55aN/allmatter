import sockets from './sockets';

var inputs = {
    'Input texture': sockets.image,
    'Input number': sockets.num,
    'Input curve': sockets.curve,
    'Input color': sockets.color
};
var outputs = {
    'Output texture': sockets.image,
    'Output number': sockets.num,
    'Output curve': sockets.curve,
    'Output color': sockets.color
}

export function getSocket(title) {
    return inputs[title] || outputs[title];
}

export var moduleManager = new D3NE.ModuleManager(Object.keys(inputs), Object.keys(outputs));