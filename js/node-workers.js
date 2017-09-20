var workers = function ($scope, editor) {
    var Canvas = Texturity.Canvas;

    function getNode(id) {
        return editor.nodes.find(a => a.id === id);
    }

    function createEmptyTexture(w, h, isNormalMap) {
        var gl = Texturity.getGL();

        var data = isNormalMap ?
            new Uint8Array([128, 255, 128, 255]) :
            new Uint8Array([0, 0, 0, 255]);

        emptyTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, emptyTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.bindTexture(gl.TEXTURE_2D, null);

        return emptyTexture;
    }

    function _resizeCanvas(canvas, w, h) {
        var texture = canvas.toTexture();
        var c = new Canvas(w, h);

        c.drawTexture(texture, 0, 0, w, h);
        return c;
    }

    function _updatePreview(node, canvas) {
        var previewSize = 256;
        var previewControl = getNode(node.id).controls[0];
        var previewCanvas = canvas;
        if (previewControl.getElement() !== texturePreview.bindElement)
            previewCanvas = _resizeCanvas(canvas, previewSize, previewSize);

        previewControl.updatePreview(previewCanvas.toSrc());
    }

    async function binaryOperation(inputs, expression) {
        var a = inputs[0][0];
        var b = inputs[1][0];

        var sql = Math.sqrt,
            abs = Math.abs;

        if (typeof a === "number" && typeof b === "number")
            return eval(expression);

        if (a instanceof WebGLTexture && b instanceof WebGLTexture) {
            var result = new Canvas($scope.textureSize, $scope.textureSize);
            result.blend(a, b, expression);

            return result.toTexture();
        }

        if (a instanceof Color && b instanceof Color) {
            var c1 = a;
            var c2 = b;

            var color = new Color();
            [a, b] = [a.r, b.r];
            eval(expression);
            [a, b] = [a.g, b.g];
            eval(expression);
            [a, b] = [a.b, b.b];
            eval(expression);

            return color;
        }

        if (a instanceof WebGLTexture && typeof b === "number" ||
            ([a, b] = [b, a], a instanceof WebGLTexture && typeof b === "number")) {

            var result = new Canvas($scope.textureSize, $scope.textureSize);
            result.blend(a, b, expression);

            return result.toTexture();
        }

        if (a instanceof WebGLTexture && b instanceof Color ||
            ([a, b] = [b, a], a instanceof WebGLTexture && b instanceof Color)) {

            var result = new Canvas($scope.textureSize, $scope.textureSize);
            result.blend(a, b.toArray(), expression);

            return result.toTexture();
        }

        if (typeof a === "number" && b instanceof Color ||
            ([a, b] = [b, a], typeof a === "number" && b instanceof Color)) {

            var color = new Color(
                f(b.r, a),
                f(b.g, a),
                f(b.b, a)
            );
            return color;
        }
    };

    function unaryOperation(inputs, f) {
        var a = inputs[0][0];

        if (typeof a === "number")
            return f(a);

        if (a instanceof Color)
            return new Color(f(a.r), f(a.g), f(a.b));

        if (a instanceof WebGLTexture) {
            var result = a.clone();
            result.pixels().map((x, y, c) => {
                return [f(c[0]), f(c[1]), f(c[2])];
            });

            return result;
        }
    }

    return {
        "input texture": function (node, inputs, outputs) {

        },
        "input number": function (node, inputs, outputs) {
            outputs[0] = node.data.number;
        },
        "input curve": function (node, inputs, outputs) {

        },
        "input color": function (node, inputs, outputs) {
            outputs[0] = Color.fromArray(node.data.color);
        },
        "white": async function (node, inputs, outputs) {
            var result = new Canvas($scope.textureSize, $scope.textureSize);
            result.fillStyle([1, 1, 1, 1]);
            result.drawRect(0, 0, $scope.textureSize, $scope.textureSize);

            outputs[0] = result.toTexture();
            _updatePreview(node, result);
        },
        "noise texture": async function (node, inputs, outputs) {
            var level = typeof inputs[0][0] === "number" ? inputs[1][0] : node.data.level;

            var result = new Canvas($scope.textureSize, $scope.textureSize);
            result.noise();

            outputs[0] = result.toTexture();
            _updatePreview(node, result);
        },
        "brick texture": async function (node, inputs, outputs) {
            var count = typeof inputs[0][0] === "number" ? inputs[0][0] : node.data.count;
            var margin = typeof inputs[1][0] === "number" ? inputs[1][0] : node.data.margin;

            var result = new Canvas($scope.textureSize, $scope.textureSize);
            result.fillStyle([1, 1, 1, 1]);
            result.drawBricks(count, margin);

            outputs[0] = result.toTexture();
            _updatePreview(node, result);
        },
        "circle texture": async function (node, inputs, outputs) {
            var size = typeof inputs[0][0] === "number" ? inputs[0][0] : node.data.size;

            var result = new Canvas($scope.textureSize, $scope.textureSize);
            result.drawCircle(size);

            outputs[0] = result.toTexture();
            _updatePreview(node, result);
        },
        "texture transform": async function (node, inputs, outputs) {
            var texture = inputs[0][0] instanceof WebGLTexture ? inputs[0][0] : createEmptyTexture($scope.textureSize, $scope.textureSize);
            var x = typeof inputs[1][0] === "number" ? inputs[1][0] : node.data.x;
            var y = typeof inputs[2][0] === "number" ? inputs[2][0] : node.data.y;
            var repeat = typeof inputs[3][0] === "number" ? inputs[3][0] : node.data.repeat;

            var result = new Canvas($scope.textureSize, $scope.textureSize);
            result.transform(texture, x, y, repeat);

            outputs[0] = result.toTexture();
            _updatePreview(node, result);
        },
        "lightness": async function (node, inputs, outputs) {
            var texture = inputs[0][0] instanceof WebGLTexture ? inputs[0][0] : createEmptyTexture($scope.textureSize, $scope.textureSize);
            var scalar = typeof inputs[1][0] === "number" ? inputs[1][0] : node.data.scalar;

            var result = new Canvas($scope.textureSize, $scope.textureSize);
            result.blend(texture, scalar, 'a+b');

            outputs[0] = result.toTexture();
            _updatePreview(node, result);
        },
        "normal map": async function (node, inputs, outputs) {
            var texture = inputs[0][0] instanceof WebGLTexture ? inputs[0][0] : createEmptyTexture($scope.textureSize, $scope.textureSize);
            var scale = typeof inputs[1][0] === "number" ? inputs[1][0] : node.data.scale;

            var result = new Canvas($scope.textureSize, $scope.textureSize);

            result.normalMap(texture, scale);

            outputs[0] = result.toTexture();
            _updatePreview(node, result);
        },
        "blur": async function (node, inputs, outputs) {
            var texture = inputs[0][0] instanceof WebGLTexture ? inputs[0][0] : createEmptyTexture($scope.textureSize, $scope.textureSize);
            var radius = typeof inputs[1][0] === "number" ? inputs[1][0] : node.data.radius;

            var result = new Canvas($scope.textureSize, $scope.textureSize);

            result.blur(texture, radius);
            /*result.covolutionMatrix(canvas, [
                0, 0, 0, 0, 0,
                0, 0, 0, 0, 0,
                0, 0, 1, 0, 0,
                0, 0, 0, 0, 0,
                0, 0, 0, 0, 0
            ]);*/

            outputs[0] = result.toTexture();
            _updatePreview(node, result);
        },
        "texture gradient": function (node, inputs, outputs) {

        },
        "invert": async function (node, inputs, outputs) {
            var texture = inputs[0][0] instanceof WebGLTexture ? inputs[0][0] : createEmptyTexture($scope.textureSize, $scope.textureSize);

            var result = new Canvas($scope.textureSize, $scope.textureSize);
            result.blend(texture, 1, 'b - a');

            outputs[0] = result.toTexture();
            _updatePreview(node, result);
        },
        "add": function (node, inputs, outputs) {
            outputs[0] = binaryOperation(inputs, 'a + b');

        },
        "subtract": function (node, inputs, outputs) {
            outputs[0] = binaryOperation(inputs, 'a - b');

        },
        "distance": function (node, inputs, outputs) {
            outputs[0] = binaryOperation(inputs, 'abs(a - b)');

        },
        "multiply": function (node, inputs, outputs) {
            outputs[0] = binaryOperation(inputs, 'a * b');

        },
        "divide": function (node, inputs, outputs) {
            outputs[0] = binaryOperation(inputs, 'a / b');

        },
        "pow": function (node, inputs, outputs) {
            var pow = typeof inputs[1][0] === "number" ? inputs[1][0] : node.data.pow;

            outputs[0] = unaryOperation(inputs, (a) => {
                return Math.pow(a, pow);
            });
        },
        "output material": async function (node, inputs, outputs) {
            var diffuse = inputs[0][0] instanceof WebGLTexture ? inputs[0][0] : createEmptyTexture($scope.textureSize, $scope.textureSize);
            var normal = inputs[1][0] instanceof WebGLTexture ? inputs[1][0] : createEmptyTexture($scope.textureSize, $scope.textureSize, true);
            var roughness = inputs[2][0] instanceof WebGLTexture ? inputs[2][0] : createEmptyTexture($scope.textureSize, $scope.textureSize);
            var metalness = inputs[3][0] instanceof WebGLTexture ? inputs[3][0] : createEmptyTexture($scope.textureSize, $scope.textureSize);
            var emissive = inputs[4][0] instanceof WebGLTexture ? inputs[4][0] : createEmptyTexture($scope.textureSize, $scope.textureSize);
            var displacement = inputs[5][0] instanceof WebGLTexture ? inputs[5][0] : createEmptyTexture($scope.textureSize, $scope.textureSize);

            var size = $scope.textureSize;
            var canvas = new Canvas(size, size);

            await materialPreview.update({
                diffuse: canvas.drawTexture(diffuse, 0, 0, size, size).toSrc(),
                normal: canvas.drawTexture(normal, 0, 0, size, size).toSrc(),
                roughness: canvas.drawTexture(roughness, 0, 0, size, size).toSrc(),
                metalness: canvas.drawTexture(metalness, 0, 0, size, size).toSrc(),
                emissive: canvas.drawTexture(emissive, 0, 0, size, size).toSrc(),
                displacement: canvas.drawTexture(displacement, 0, 0, size, size).toSrc()
            });
        }
    }
}