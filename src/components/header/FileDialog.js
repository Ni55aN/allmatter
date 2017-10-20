import Vue from 'vue';
import store from '../../store';

Vue.directive('file-dialog', {
    inserted: function (el) {
        var input = document.createElement('input');

        input.setAttribute('type', 'file');
        input.setAttribute('accept', '.mtr');
        input.setAttribute('style', 'display: none');

        input.addEventListener('change', () => {
            if (input.files.length === 0) 
                return;
            
            var editor = store.state.nodeEditor;
            var file = input.files[0];
            var reader = new FileReader();

            reader.onload = (e) => {
                input.value = ''; //clear files
                var data = JSON.parse(e.target.result);

                store.commit('denyProcess');
                try {
                    editor.fromJSON(data);
                } catch (e) {
                    alert(e.message);
                }
                store.commit('allowProcess');
                editor
                    .eventListener
                    .trigger('change');
                editor
                    .view
                    .zoomAt(editor.nodes);
            };
            reader.onabort = (e) => {
                alert(e.message);
            }
            reader.readAsText(file);
        });

        el
            .parentElement
            .appendChild(input);
        el.addEventListener('click', () => input.click());
    }
})