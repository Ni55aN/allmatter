<template lang="pug">
.workspace
    .sidebar
      material-preview.region(
        v-on:dblclick.prevent.native="setActive('material')",
        v-show="isVisible('material')"
      )
      texture-preview.region(
        v-on:dblclick.prevent.native="setActive('texture')",
        v-show="isVisible('texture')"
      )
    .editor-wrap.region(v-show="isVisible('')")
      node-editor
</template>

<script>
import NodeEditor from "./NodeEditor.vue";
import TexturePreview from "./TexturePreview.vue";
import MaterialPreview from "./MaterialPreview.vue";

export default {
  data() {
    return {
      active: ""
    };
  },
  methods: {
    setActive(val) {
      this.active = this.active === val ? "" : val;
      setTimeout(() => window.dispatchEvent(new Event("resize")));
    },
    isVisible(val) {
      return this.active === "" || this.active === val;
    }
  },
  components: {
    NodeEditor,
    TexturePreview,
    MaterialPreview
  }
};
</script>

<style lang="sass">
.workspace
  padding: 0.5vh
  margin-top: -1vh;
  display: flex
  align-items: stretch
  height: calc(100% - 40px)
  width: 100%

.region
  overflow: hidden
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4)
  border-radius: 2px
  margin: 1.5vh
  position: relative

.switcher
  position: absolute
  bottom: 0
  right: 0
  background-color: rgba(0, 0, 0, 0.5)
.hiden
  display: none

.sidebar
  display: flex
  flex-direction: column
  flex: 1
  text-align: center
  overflow: hidden
  .night
    background: black
  > *
    flex: 1

.editor-wrap
  flex: 2


@media (orientation: portrait)
  .workspace
    flex-direction: column-reverse
    .sidebar
      flex-direction: row-reverse
      flex: 1.5;
</style>


