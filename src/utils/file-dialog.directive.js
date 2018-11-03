export default {
    inserted: function (el, binding) {
        const openProject = binding.value;
        const input = document.createElement('input');

        input.setAttribute('type', 'file');
        input.setAttribute('accept', '.mtr');
        input.setAttribute('style', 'display: none');

        input.addEventListener('change', () => {
            if (input.files.length === 0) 
                return;
            
            const file = input.files[0];
            const reader = new FileReader();

            reader.onload = (e) => {
                input.value = ''; //clear files
                const project = JSON.parse(e.target.result);

                openProject(project);
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
}