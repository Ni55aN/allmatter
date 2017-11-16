import eventbus from '../../eventbus';

export default function (key, title, def = 1) {
    return new D3NE.Control('<input type="number" title="' + title + '" placeholder="' + title + '"/>', (el, control) => {

        el.value = control.getData(key) || def;
        control.putData(key, parseFloat(el.value));
        el.addEventListener('change', () => {
            control.putData(key, parseFloat(el.value));
            eventbus.$emit('process');
        });

        el.addEventListener('mousedown', function(e) {e.stopPropagation()});
    });
}