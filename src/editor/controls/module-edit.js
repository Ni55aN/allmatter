import eventbus from '../../eventbus';

export default function (module) {
    return new Rete.Control('<div class="module-control"><input readonly type="text"><button>Edit</button></div>', (el, control) => {
      
        el.querySelector('input').value = module.name;
        el.querySelector('button').onmousedown = () => {
            eventbus.$emit('openmodule', module);
        };
    });
}