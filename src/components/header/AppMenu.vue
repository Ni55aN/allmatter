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
      span.subitem(@click="exportMaps")
        span Export maps
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
         span Guide
      span.subitem(@click="showAbout")
         span About
</template>

<script>
import vueSlider from "vue-slider-component";
import store from "../../store";
import eventbus from "../../eventbus";
import "./FileDialog.js";
import { saveAs } from "file-saver";
import blobUtil from "blob-util/dist/blob-util";

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
      eventbus.$emit("newproject");
    },
    saveProject() {
      eventbus.$emit("saveproject", data => {
        var blob = new Blob([data], { type: "application/json;charset=utf-8" });

        saveAs(blob, "project.mtr");
      });
    },
    async exportMaps() {
      var maps = store.state.maps;
      for (let name in maps) {
        let src = maps[name].replace("data:image/png;base64,", "");
        let blob = await blobUtil.base64StringToBlob(src, "image/png");
        saveAs(blob, `allmatter_${name}.png`);
      }
    },
    startTour() {
      store.state.tour.start();
    },
    showAbout() {
      eventbus.$emit("showAbout");
    }
  },
  components: {
    vueSlider
  }
};
</script>

<style lang="sass">
@import '../../style/media';

menu
  flex: 1
  display: flex
  height: 100%
  +mobile
    padding-left: 0
  +tablet
    padding-left: 15px
  .item
    font-size: 17px
    cursor: default
    padding: 0 14px
    display: flex
    align-items: center
    color: grey
    text-decoration: none
    position: relative
    +mobile
      padding: 0 6px
      font-size: 13px
    +tablet
      padding: 0 9px
      font-size: 15px
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
        font-size: 15px
        cursor: pointer
        &:hover
          border: 1px solid white
</style>
