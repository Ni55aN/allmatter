import Vue from 'vue';
import evetbus from '../../eventbus';

Vue.directive('file-dialog', {
    inserted: function (el) {
        var input = document.createElement('input');

        input.setAttribute('type', 'file');
        input.setAttribute('accept', '.mtr');
        input.setAttribute('style', 'display: none');

        input.addEventListener('change', () => {
            if (input.files.length === 0) 
                return;
            
            var file = input.files[0];
            var reader = new FileReader();

            reader.onload = (e) => {
                input.value = ''; //clear files
                var data = JSON.parse(e.target.result);

                evetbus.$emit('openproject', data);
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