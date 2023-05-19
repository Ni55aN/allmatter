<template lang="pug">
img(:width="width+'px'" :height="height+'px'", :src="src", @mousedown.stop="mousedown")
</template>

<script>
import * as Texturity from 'texturity.js';

export default {
    props: ['pushTexture'],
    data() {
        return {
            width: 140,
            height: 140,
            texture: null
        }
    },
    computed: {
        src() {
            if (!this.texture) return '';

            return this.texture2src(this.texture, this.width, this.height)
        }
    },
    methods: {
        setTexture(texture) {
            this.texture = texture;
        },
        texture2src(texture, w, h) {
            const c = new Texturity.Canvas(w, h);

            c.drawTexture(texture, 0, 0, w, h);
            const src = c.toSrc();

            return src;
        },
        mousedown() {
            this.pushTexture(size => ({ src: this.texture2src(this.texture, size, size) }))
        }
    }
}
</script>

<style lang="sass" scoped>

</style>
