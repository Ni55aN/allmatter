import eventbus from '../../eventbus';

export default function (key, title, def = '') {
    return new D3NE.Control('<input type="text" title="' + title + '" placeholder="' + title + '"/>', (el, control) => {

        el.value = control.getData(key) || def;
        control.putData(key, el.value);
        el.addEventListener('change', () => {
            control.putData(key, el.value);
            eventbus.$emit('process');
        });

        el.addEventListener('mousedown', function(e) {e.stopPropagation()});
    });
}