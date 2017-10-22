<template lang="pug">
.preview
</template>

<script>
export class TexturePreview {
  constructor(el) {
    this.el = el;
    this.scale = 1;

    this.position = [0, 0];
    this.mouse = null;

    this.bindElement = null;

    this.el.addEventListener("wheel", e => {
      var d = 0.2 * Math.sign(e.wheelDelta);
      this.scale *= 1 + d;

      this.resize();
    });

    this.el.addEventListener("mousedown", this.handleDown.bind(this));
    window.addEventListener("mousemove", this.handleMove.bind(this));
    window.addEventListener("mouseup", this.handleUp.bind(this));

    this.el.addEventListener("touchstart", this.handleDown.bind(this));
    this.el.addEventListener("touchmove", this.handleMove.bind(this));
    this.el.addEventListener("touchend", this.handleUp.bind(this));
    this.el.addEventListener("touchcancel", this.handleUp.bind(this));

    this.resize();
  }

  extractCoords(e) {
    if (e instanceof TouchEvent)
      return [e.touches[0].clientX, e.touches[0].clientY];

    return [e.clientX, e.clientY];
  }

  handleDown(e) {
    this.mouse = this.extractCoords(e);
  }

  handleMove(e) {
    if (!this.mouse) return;
    e.preventDefault();
    var [x, y] = this.extractCoords(e);

    this.position[0] += x - this.mouse[0];
    this.position[1] += y - this.mouse[1];
    this.translate(...this.position);
    this.mouse = [x, y];
  }

  handleUp(e) {
    this.mouse = null;
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
    else this.el.style.backgroundSize = `${100 * this.scale}% auto`;
  }
}

export default {
  data() {
    return { preview: null };
  },
  mounted() {
    var store = this.$store;
    this.preview = new TexturePreview(this.$el);

    store.watch(
      () => store.getters.texture,
      () => {
        this.preview.update(store.state.texture.src);
      }
    );
    window.addEventListener("resize", this.preview.resize.bind(this.preview));
  },
  beforeDestroy() {
    window.removeEventListener(
      "resize",
      this.preview.resize.bind(this.preview)
    );
  }
};
</script>

<style lang="sass">

</style>

