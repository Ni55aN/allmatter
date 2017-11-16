import sockets from '../../sockets';

export default function (node) {

    var inp = new D3NE.Input('Value', sockets.value);
    var out = new D3NE.Output('Value', sockets.value);

    return node
        .addInput(inp)
        .addOutput(out);
}
