import createBinaryMath from '../../common/builders/binary-math';
import binaryOperation from '../../common/workers/binary-operation';

export default new D3NE.Component('distance', {
    builder() {
        var node = createBinaryMath();

        node.title = 'Distance';

        return node;
    },
    worker(node, inputs, outputs) {
        outputs[0] = binaryOperation(inputs, 'abs(a - b)');
    }
});