var numSocket = new D3NE.Socket('number', 'Number value', 'hint');
var imageSocket = new D3NE.Socket('image', 'Image', 'hint');
var valSocket = new D3NE.Socket('value', 'Image', 'hint');
var curveSocket = new D3NE.Socket('curve', 'Curve', 'hint');
var colorSocket = new D3NE.Socket('color', 'Color', 'hint');

numSocket.combineWith(valSocket);
imageSocket.combineWith(valSocket);
colorSocket.combineWith(valSocket);
valSocket.combineWith(numSocket);
valSocket.combineWith(imageSocket);
valSocket.combineWith(colorSocket);

numSocket.combineWith(imageSocket);
numSocket.combineWith(colorSocket);
colorSocket.combineWith(imageSocket);


var _modifyIdInput = function (node) {

    var id = new D3NE.Control('<input type="text" placeholder="id">')
    node.addControl(id, 0);

    return node;
}

var _createTexture = function () {

    var out = new D3NE.Output('Image', imageSocket);
    var ctrl = _previewControl();


    return new D3NE.Node('Texture')
        .addControl(ctrl)
        .addOutput(out);
};

var _createMath = function () {

    var inp = new D3NE.Input('Value', valSocket);
    var out = new D3NE.Output('Value', valSocket);

    return new D3NE.Node('Math')
        .addInput(inp)
        .addOutput(out);
}

var _createMathBinary = function () {

    var node = _createMath();
    var inp = new D3NE.Input('Value', valSocket);

    return node
        .addInput(inp);
};

var _numInput = function (key, title, def = 1) {
    return new D3NE.Control('<input type="number" title="' + title + '" placeholder="' + title + '"/>', (el, control) => {

        el.value = control.getData(key) || def;
        control.putData(key, parseFloat(el.value));
        el.addEventListener('change', () => {
            control.putData(key, parseFloat(el.value));
            editor.eventListener.trigger('change');
        });
    });
}

var _colorPicker = function (key, color) {
    return new D3NE.Control('<input type="color"/>', (el, control) => {

        color = control.getData(key) ? Color.fromArray(control.getData(key)) : color.clone();
        el.value = color.toHex();
        control.putData(key, color.toArray());

        el.addEventListener('change', (e) => {
            var color = Color.fromHex(el.value);
            control.putData(key, color.toArray());
            editor.eventListener.trigger('change');
        });

    });
}

var _previewControl = function () {
    return new D3NE.Control('<img width="140px" height="140px"/>', (el, control) => {

        el.addEventListener('click', function (e) {
            texturePreview.bind(el);
            e.preventDefault();
        });

        control.getElement = function () {
            return el;
        }

        control.updatePreview = function (src) {
            el.src = src;
        }
    });
}

var builder = {

    //// Input
    "input texture": function () {

        var node = _modifyIdInput(_createTexture());
        node.title = "Input texture";

        var ctrl = new D3NE.Control('<input type="file"/>', (el, control) => {
            el.addEventListener('change', () => {
                control.getNode().controls[1].updatePreview();
            });
        });

        return node
            .addControl(ctrl);
    },
    "input number": function () {

        var out = new D3NE.Output('Number', numSocket);
        var ctrl = _numInput('number', 'Value');

        return _modifyIdInput(new D3NE.Node('Input number'))
            .addControl(ctrl)
            .addOutput(out);
    },
    "input curve": function () {

        var out = new D3NE.Output("Curve", curveSocket);
        var ctrl = new D3NE.Control('<div style="width: 140px; height: 140px; border: 2px solid red"></div>');

        return _modifyIdInput(new D3NE.Node('Input curve'))
            .addOutput(out)
            .addControl(ctrl);
    },
    "input color": function () {

        var out = new D3NE.Output("Color", colorSocket);
        var ctrl = _colorPicker('color', new Color());

        return _modifyIdInput(new D3NE.Node('Input color'))
            .addOutput(out)
            .addControl(ctrl);
    },

    /// Generator
    "white": function () {

        var node = _createTexture();
        node.title = "White";

        return node;
    },
    "noise texture": function () {

        var node = _createTexture();
        node.title = "Noise texture";

        var inp = new D3NE.Input('Level', numSocket);
        inp.addControl(_numInput('level', 'Level', 1));

        return node
            .addInput(inp);
    },
    "brick texture": function () {

        var node = _createTexture();
        node.title = "Brick texture";

        var inp = new D3NE.Input('Count', numSocket);
        var inp2 = new D3NE.Input('Margin', numSocket);

        var ctrl = _numInput('count', 'Count', 1);
        var ctrl2 = _numInput('margin', 'Margin', 0.02);
        inp.addControl(ctrl);
        inp2.addControl(ctrl2);

        return node
            .addInput(inp)
            .addInput(inp2);
    },
    "circle texture": function () {

        var node = _createTexture();
        node.title = "Circle texture";

        var inp = new D3NE.Input('Size', numSocket);
        var ctrl = _numInput('size', 'Size', 1);
        inp.addControl(ctrl);

        return node
            .addInput(inp);
    },

    /// Texture

    "texture transform": function () {

        var node = _createTexture();
        node.title = "Texture transform";

        var inp = new D3NE.Input('Image', imageSocket);
        var inpX = new D3NE.Input('Translate X', numSocket);
        var inpY = new D3NE.Input('Translate Y', numSocket);
        var inputRepeat = new D3NE.Input('Repeat', numSocket);

        inpX.addControl(_numInput('x', 'Translate X', 0));
        inpY.addControl(_numInput('y', 'Translate Y', 0));
        inputRepeat.addControl(_numInput('repeat', 'Repeat', 0));

        return node
            .addInput(inp)
            .addInput(inpX)
            .addInput(inpY)
            .addInput(inputRepeat)
    },
    "lightness": function () {

        var node = _createTexture();
        node.title = "Lightness";

        var inp = new D3NE.Input('Image', imageSocket);
        var inp2 = new D3NE.Input('Scalar', numSocket);
        inp2.addControl(_numInput('scalar', 'Scalar', 0));

        return node
            .addInput(inp)
            .addInput(inp2);
    },
    "normal map": function () {

        var node = _createTexture();
        node.title = "Normal map";

        var inp = new D3NE.Input('Image', imageSocket);
        var inp2 = new D3NE.Input('Scale', numSocket);
        inp2.addControl(_numInput('scale', 'Scale'));

        return node
            .addInput(inp)
            .addInput(inp2);
    },
    "blur": function () {

        var node = _createTexture();
        node.title = "Blur";

        var inp = new D3NE.Input('Image', imageSocket);
        var inp2 = new D3NE.Input("Radius", numSocket);
        inp2.addControl(_numInput('radius', 'Radius'));

        return node
            .addInput(inp)
            .addInput(inp2);
    },
    "texture gradient": function () {

        var node = _createTexture();
        node.title = "Texture gradient";

        var inp = new D3NE.Input('Image', imageSocket);
        var inp2 = new D3NE.Input("Curve", curveSocket);

        return node
            .addInput(inp)
            .addInput(inp2);
    },
    "invert": function () {
        var node = _createTexture();
        node.title = "Invert";

        var inp = new D3NE.Input('Image', imageSocket);

        return node
            .addInput(inp);
    },
    "blend": function () {
        var node = _createTexture();
        node.title = "Blend";

        var inp1 = new D3NE.Input('Image', imageSocket);
        var inp2 = new D3NE.Input('Image', imageSocket);
        var inp3 = new D3NE.Input('Mask', imageSocket);

        return node
            .addInput(inp1)
            .addInput(inp2)
            .addInput(inp3);
    },


    /// Math

    "add": function () {
        var node = _createMathBinary();
        node.title = "Add";

        return node;
    },
    "subtract": function () {
        var node = _createMathBinary();
        node.title = "Subtract";
        return node;
    },
    "distance": function () {
        var node = _createMathBinary();
        node.title = "Distance";
        return node;
    },
    "multiply": function () {
        var node = _createMathBinary();
        node.title = "Multiply";
        return node;
    },
    "divide": function () {
        var node = _createMathBinary();
        node.title = "Divide";
        return node;
    },
    "pow": function () {
        var node = _createMath();
        node.title = "Pow";

        var inp = new D3NE.Input('Pow', numSocket);

        var ctrl = _numInput('pow', 'Value');
        inp.addControl(ctrl);

        return node
            .addInput(inp);
    },

    // Output
    "output material": function () {

        var inp1 = new D3NE.Input('Diffuse', imageSocket);
        var inp2 = new D3NE.Input('Normal', imageSocket);
        var inp3 = new D3NE.Input('Roughness', imageSocket);
        var inp4 = new D3NE.Input('Metalness', imageSocket);
        var inp5 = new D3NE.Input('Emissive', imageSocket);
        var inp6 = new D3NE.Input('Displacement', imageSocket);


        return new D3NE.Node('Output material')
            .addInput(inp1)
            .addInput(inp2)
            .addInput(inp3)
            .addInput(inp4)
            .addInput(inp5)
            .addInput(inp6);
    }
};