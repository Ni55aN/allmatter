<template lang="pug">
.node-editor
</template>

<script>
import components from "../editor/components";
import store from "../store";
import eventbus from "../eventbus";
import _ from "lodash";
import LocalStorage from "../localstorage";
import { D3NE } from "d3-node-editor";
import "d3-node-editor/build/d3-node-editor.css";
import * as Texturity from "texturity.js";

export default {
  data() {
    return {
      editor: null,
      engine: null,
      allowProcess: false
    };
  },
  methods: {
    async process() {
      console.time("process");
      var data = this.editor.toJSON();
      var startId = Object.keys(data.nodes).filter(
        key => data.nodes[key].title == "Output material"
      )[0];

      await this.engine.process(data, startId);
      console.timeEnd("process");

      Texturity.disposeTextures();
    },
    saveToStorage() {
      LocalStorage.write("allmatter", this.editor.toJSON());
    },
    restoreFromStorage() {
      var data = LocalStorage.read("allmatter");
      if (data) this.import(data);
    },
    import(data) {
      this.allowProcess = false;
      try{
        this.editor.fromJSON(data);
      }catch(e){
        console.warn(e);
        alert(e.message);
      }
      this.allowProcess = true;
      this.editor.view.zoomAt(this.editor.nodes);
      this.process();
      this.saveToStorage();
    }
  },
  mounted() {
    Texturity.initGL("webgl2");

    var menu = new D3NE.ContextMenu({
      Input: {
        Texture: components.get("input texture"),
        Number: components.get("input number"),
        Curve: components.get("input curve"),
        Color: components.get("input color")
      },
      Generator: {
        Noise: components.get("noise texture"),
        Brick: components.get("brick texture"),
        Circle: components.get("circle texture")
      },
      Texture: {
        Transform: components.get("texture transform"),
        Lightness: components.get("lightness"),
        Normal: components.get("normal map"),
        Blur: components.get("blur"),
        Gradient: components.get("texture gradient"),
        Invert: components.get("invert"),
        Blend: components.get("blend")
      },
      Math: {
        Add: components.get("add"),
        Subtract: components.get("subtract"),
        Distance: components.get("distance"),
        Multiply: components.get("multiply"),
        Divide: components.get("divide"),
        Pow: components.get("pow")
      },
      Output: {
        Material: components.get("output material")
      }
    });

    this.editor = new D3NE.NodeEditor(
      store.state.editorIdentifier,
      this.$el,
      components.list,
      menu
    );
    this.editor.view.zoom.translateExtent([[-3000, -3000], [6000, 6000]]);
    this.editor.eventListener.on("nodecreate", node => {
      if (
        node.title === "Output material" &&
        this.editor.nodes.filter(n => n.title == "Output material").length === 1
      ) {
        alert("Output material already exist");
        return false;
      }
    });

    this.editor.eventListener.on("change", () => {
      if (!this.allowProcess) return;
      this.saveToStorage();
    });

    this.editor.eventListener.on(
      "nodecreate connectioncreate noderemove connectionremove",
      async i => {
        if (!this.allowProcess) return;
        setTimeout(this.process.bind(this));
      }
    );

    this.engine = new D3NE.Engine(
      store.state.editorIdentifier,
      components.list
    );

    store.watch(
      () => store.getters.textureSize,
      _.debounce(this.process, 1000)
    );

    eventbus.$on("process", this.process.bind(this));

    eventbus.$on("newproject", () => {
      this.editor.fromJSON({
        id: store.state.editorIdentifier,
        nodes: {},
        groups: {}
      });
    });

    eventbus.$on("saveproject", callback => {
      var data = this.editor.toJSON();
      callback(data);
    });

    eventbus.$on("openproject", this.import.bind(this));

    this.restoreFromStorage();

    if (this.editor.nodes.length === 0) {
      fetch("./projects/guide.mtr")
        .then(resp => resp.json())
        .then(this.import.bind(this));
    }
  }
};
</script>

<style lang="sass">
.socket
  &.number 
    background: #96b38a
  &.image
    background: #cc2a6a

  &.value
    background: #848795

  &.curve
    background: #dfea04

  &.color
    background: #279ff2

.node img,
.node canvas
	box-sizing: content-box
	border: 1px solid white
  margin: 2px


.node img:hover,
.node canvas:hover
	border: 3px solid white


.node input[type="color"]
	border-radius: 0
	padding: 0 2px
	width: 140px
	height: 140px

</style>
