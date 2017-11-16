<template lang="pug">
.node-editor
  module-stack(:items="names",
     @clickitem="(i) => openModule(modules[i])",
     @renameitem="(i,val) => renameModule(modules[i],val)"
     )
</template>

<script>
import components from "../../editor/components";
import store from "../../store";
import eventbus from "../../eventbus";
import _ from "lodash";
import LocalStorage from "../../localstorage";
import "d3-node-editor/build/d3-node-editor.css";
import * as Texturity from "texturity.js";
import { moduleManager } from "../../editor/module";
import ModuleStack from "./ModuleStack.vue";

var root = { name: "unnamed", data: null };

export default {
  data() {
    return {
      root: root,
      active: root,
      editor: null,
      engine: null,
      modules: [root]
    };
  },
  computed: {
    names() {
      return this.modules.map(m => m.name);
    }
  },
  components: {
    ModuleStack
  },
  methods: {
    async openModule(module) {
      var i = this.modules.indexOf(module);
      if (i >= 0) this.modules.splice(i + 1);
      else this.modules.push(module);

      this.active = module;

      await this.editor.fromJSON(module.data);
      this.editor.view.zoomAt(this.editor.nodes);
      this.process();
    },
    renameModule(module, name) {
      module.name = name;
      this.saveToStorage();
    },
    async process() {
      console.time("process");
      var startId = Object.keys(this.root.data.nodes).find(
        key => this.root.data.nodes[key].title == "Output material"
      );
      
      await this.engine.process(this.root.data, startId?parseInt(startId):null);
      console.timeEnd("process");

      Texturity.disposeTextures();
    },
    saveToStorage() {
      this.active.data = this.editor.toJSON();
      LocalStorage.write("allmatter", this.root);
    },
    restoreFromStorage() {
      var backup = LocalStorage.read("allmatter");

      if (!backup) return;

      this.root.name = backup.name;
      this.root.data = backup.data;
      this.import(this.root.data, this.root.name);
    },
    async import(data, name = "unnamed") {
      this.root.name = this.active.name = name;
      this.root.data = this.active.data = data;
      try {
        await this.editor.fromJSON(data);
      } catch (e) {
        console.warn(e);
        alert(e.message);
      }
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
      Module: {
        Module: components.get("module")
      },
      Output: {
        Material: components.get("output material"),
        Texture: components.get("output texture"),
        Number: components.get("output number"),
        Curve: components.get("output curve"),
        Color: components.get("output color")
      }
    });

    this.editor = new D3NE.NodeEditor(
      store.state.editorIdentifier,
      this.$el,
      components.list,
      menu
    );
    this.editor.view.zoom.translateExtent([[-3000, -3000], [6000, 6000]]);
    this.editor.eventListener.on("nodecreate", (node, p) => {
      if (
        p &&
        node.title === "Output material" &&
        this.data.nodes.find(n => n.title == "Output material")
      ) {
        alert("Output material already exist");
        return false;
      }
    });

    this.editor.eventListener.on("change", (_, p) => {
      if (!p) return;
      this.saveToStorage();
    });

    this.editor.eventListener.on(
      "nodecreate connectioncreate noderemove connectionremove",
      async (_, p) => {
        if (!p) return;
        setTimeout(this.process.bind(this));
      }
    );

    this.engine = new D3NE.Engine(
      store.state.editorIdentifier,
      components.list
    );
    moduleManager.setEngine(this.engine);

    store.watch(
      () => store.getters.textureSize,
      _.debounce(this.process, 1000)
    );

    eventbus.$on("process", this.process.bind(this));

    eventbus.$on("newproject", async () => {
      await this.editor.fromJSON({
        id: store.state.editorIdentifier,
        nodes: {},
        groups: {}
      });
    });

    eventbus.$on("saveproject", callback => {
      callback(this.root);
    });

    eventbus.$on("openproject", this.import.bind(this));

    eventbus.$on("openmodule", this.openModule.bind(this));

    this.restoreFromStorage();

    if (this.editor.nodes.length === 0) {
      fetch("./projects/guide.mtr")
        .then(resp => resp.json())
        .then(proj => this.import(proj.data,proj.name));
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

.module-control 
  position: relative
  button 
    position: absolute
    right: 0
    top: 0
    height: 100%
    background: white
    border: 1px solid #564;

</style>
