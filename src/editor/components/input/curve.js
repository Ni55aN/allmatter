import modifyIdInput from '../../common/builders/modificator/input-id';

export default new D3NE.Component('input curve', {
    builder() {
        var out = new D3NE.Output('Curve', curveSocket);
        var ctrl = new D3NE.Control('<div style="width: 140px; height: 140px; border: 2px solid red"></div>');

        return modifyIdInput(new D3NE.Node('Input curve'))
            .addOutput(out)
            .addControl(ctrl);
    },
    worker() {}
});