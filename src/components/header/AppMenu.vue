<template lang="pug">
menu
  span.item
    span Project
    .dropmenu
      span.subitem(@click="newProject")
        span New
      span.subitem(v-file-dialog='')
        span Open
      span.subitem(@click="saveProject")
        span Save
  span.item
    | Edit
    .dropmenu
      span.subitem
        span Texture size
        vue-slider(v-model="textureSize",:data="sizes",tooltip="hover",width="200")
      span.subitem
        span 3D Model
        select(v-model="selectedGeometry")
          option(v-for="geometry in geometries") {{geometry}}
  span.item
    | Help
    .dropmenu
      span.subitem(@click="startTour")
         span User guide
      span.subitem(@click="showAbout")
         span About
</template>

<script>
import vueSlider from "vue-slider-component";
import store from "../../store";
import "./FileDialog.js";
import { saveAs } from "file-saver";

var geometries = ["Cube", "Sphere"];

export default {
  data() {
    return {
      textureSize: store.state.textureSize,
      sizes: [256, 512, 1024, 2048, 4096],
      selectedGeometry: geometries[0]
    };
  },
  computed: {
    geometries() {
      return geometries;
    }
  },
  watch: {
    selectedGeometry(val) {
      store.commit("setGeometry", val);
    },
    textureSize(val) {
      store.commit("setTextureSize", val);
    }
  },
  methods: {
    newProject() {
      store.state.nodeEditor.fromJSON({
        id: store.state.editorIdentifier,
        nodes: {},
        groups: {}
      });
    },
    saveProject() {
      var data = JSON.stringify(store.state.nodeEditor.toJSON());
      var blob = new Blob([data], { type: "application/json;charset=utf-8" });

      saveAs(blob, "project.mtr");
    },
    startTour() {
      store.state.tour.start();
    },
    showAbout() {
      store.commit("showAbout");
    }
  },
  components: {
    vueSlider
  }
};
</script>


<style lang="sass">
menu
  flex: 1
  display: flex
  height: 100%
  .item
    font-size: 20px
    cursor: default
    padding: 0 14px
    display: flex
    align-items: center
    color: grey
    text-decoration: none
    position: relative
    &:hover,&:active
      transition: .5s
      background: linear-gradient(to top, transparent, rgba(0,0,0.2,0.2));
    &.right
      float: right
    .dropmenu
      visibility: collapse
      padding: 6px 0
      border-radius: 4px
      position: absolute
      left: 0
      top: 100%
      z-index: 1
      min-width: 220px
      background-color: white
      box-shadow: 0px 1px 5px rgba(0, 0, 0, 0.3)
    &:hover .dropmenu, &:active .dropmenu
      visibility: visible
    .subitem
      padding: 10px 16px
      display: block
      white-space: nowrap
      cursor: pointer
      &:hover,&:active
        background: rgba(167, 167, 197, 0.2)
      select
        display: block
        width: 90%
        padding: 4px
        margin: 2% 5%
        border: 1px solid transparent
        background: transparent
        color: #888
        font-size: 16px
        cursor: pointer
        &:hover
          border: 1px solid white
</style>
