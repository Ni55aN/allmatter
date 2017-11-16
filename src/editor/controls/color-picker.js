import Color from '../../color';
import eventbus from '../../eventbus';

export default function (key, color) {
    return new D3NE.Control('<input type="color"/>', (el, control) => {

        color = control.getData(key)
            ? Color.fromArray(control.getData(key))
            : color.clone();
        el.value = color.toHex();
        control.putData(key, color.toArray());

        el.addEventListener('change', (e) => {
            let c = Color.fromHex(el.value);

            control.putData(key, c.toArray());
            eventbus.$emit('process');
        });

    });
}