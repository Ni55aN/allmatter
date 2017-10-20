<template lang="pug">
.preview
</template>

<script>
export class TexturePreview {

    constructor(el) {

        this.el = el;
        this.scale = 1;

        var x = 0;
        var y = 0;

        var mouse = null;

        this.bindElement = null;

        this.el.addEventListener('wheel', (e) => {
            var d = 0.2 * Math.sign(e.wheelDelta);
            this.scale *= 1 + d;

            this.resize();
        });

        this.el.addEventListener('mousedown', (e) => {
            mouse = [e.clientX, e.clientY];
        });

        window.addEventListener('mousemove', (e) => {
            if (!mouse)
                return;
            e.preventDefault();
            x += e.clientX - mouse[0];
            y += e.clientY - mouse[1];
            this.translate(x, y);
            mouse = [e.clientX, e.clientY];

        });

        window.addEventListener('mouseup', () => {
            mouse = null
        });

        this.resize();
    }

    update(src) {

        this.el.style.backgroundImage = `url('${src}')`;
        this.resize();
    }

    translate(x, y) {
        this.el.style.backgroundPosition = `${x}px ${y}px`;
    }

    resize() {
        if (this.el.clientWidth > this.el.clientHeight)
            this.el.style.backgroundSize = `auto ${100 * this.scale}%`;
        else
            this.el.style.backgroundSize = `${100 * this.scale}% auto`;
    }

}

export default {
    data() {
        return { preview: null }
    },
    mounted() {
        var store = this.$store;
        this.preview = new TexturePreview(this.$el);

        store.watch(() => store.getters.texture, () => {
            this.preview.update(store.state.texture.src);
        });
        window.addEventListener('resize', this.preview.resize.bind(this.preview));
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.preview.resize.bind(this.preview));
    }
}
</script>

<style lang="sass">

</style>

