<template lang="pug">
img(:width="width+'px'" :height="height+'px'", :src="src", @click="click()", @mousedown.stop="mousedown")
</template>

<script>
import * as Texturity from 'texturity.js';

export default {
    props: ['emitter', 'store'],
    data() {
        return {
            width: 140,
            height: 140,
            canvas: null
        }
    },
    computed: {
        src() {
            if (!this.canvas) return '';

            return this.optimizeCanvasSrc(this.canvas)
        }
    },
    methods: {
        setCanvas(c) {
            this.canvas = c;
        },
        optimizeCanvasSrc(canvas) {
            canvas.save();
            var texture = canvas.toTexture();
            var c = new Texturity.Canvas(this.width, this.height);

            c.drawTexture(texture, 0, 0, this.width, this.height);
            Texturity.disposeTexture(texture);
            var src = c.toSrc();
      
            canvas.restore();
            return src;
        },
        click() {
            // if (this.store.state.texture.el === this.$el) 
            //     this.store.commit('updateTexture', {
            //         el: this.$el,
            //         src: this.canvas.toSrc()
            //     });
        },
        mousedown() {
            console.log(this.src)
            this.store.commit('updateTexture', {src: this.src});
            // this.emitter.$emit('process');
        }
    }
}
</script>

<style lang="sass" scoped>

</style>
