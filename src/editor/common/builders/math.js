import sockets from '../../sockets';

export default function () {

    var inp = new D3NE.Input('Value', sockets.value);
    var out = new D3NE.Output('Value', sockets.value);

    return new D3NE
        .Node('Math')
        .addInput(inp)
        .addOutput(out);
}
