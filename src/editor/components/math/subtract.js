import createBinaryMath from '../../common/builders/binary-math';
import binaryOperation from '../../common/workers/binary-operation';

export default new D3NE.Component('subtract', {
    builder() {
        var node = createBinaryMath();

        node.title = 'Subtract';

        return node;
    },
    worker(node, inputs, outputs) {
        outputs[0] = binaryOperation(inputs, 'a - b');
    }
});