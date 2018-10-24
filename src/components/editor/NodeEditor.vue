<template lang="pug">
div
  Modules(ref="modules", @opened="zoomAt(); process()")
  .node-editor(ref="area")
</template>

<script>
import { NodeEditor, Engine } from 'rete';
import VueRenderPlugin from "rete-vue-render-plugin";
import ConnectionPlugin from "rete-connection-plugin";
import AreaPlugin from "rete-area-plugin";
import ContextMenuPlugin from "rete-context-menu-plugin";
import ModulePlugin from "rete-module-plugin/build/module-plugin.debug";
import ProfilerPlugin from "rete-profiler-plugin";
import components from "../../editor/components";
import store from "../../store";
import eventbus from "../../eventbus";
import _ from "lodash";
// import LocalStorage from "../../localstorage";
import * as Texturity from "texturity.js";
import Modules from "./Modules.vue";
import { ID } from "../../consts";

export default {
  provide() {
      return {
      getEditor: () => this.editor,
      zoomAt: this.zoomAt
    };
  },
  data() {
    return {
      editor: null,
      engine: null
    };
  },
  components: {
    Modules
  },
  methods: {
    zoomAt() {
      AreaPlugin.zoomAt(this.editor);
    },
    async process() {
      console.log("process");
      var startId = Object.keys(
        this.$refs.modules.getCurrent().data.nodes
      ).find(
        key =>
          this.$refs.modules.getCurrent().data.nodes[key].title ==
          "Output material"
      );
      await this.engine.abort();
      await this.engine.process(
        this.editor.toJSON(),
        startId ? parseInt(startId) : null
      );

      Texturity.disposeTextures();
    }
    // saveToStorage() {
    //   this.module.data = this.editor.toJSON();
    //   LocalStorage.write("allmatter", this.module);
    // },
    // restoreFromStorage() {
    //   var backup = LocalStorage.read("allmatter");

    //   if (!backup) return;

    //   this.root.name = backup.name;
    //   this.root.data = backup.data;
    //   this.import(this.root.data, this.root.name);
    // },
    //   async import(data, name = "unnamed") {
    //     this.module.name = this.module.name = name;
    //     this.module.data = this.module.data = data;
    //     try {
    //       await this.editor.fromJSON(data);
    //     } catch (e) {
    //       console.warn(e);
    //       alert(e.message);
    //     }
    //     this.zoomAt();
    //     this.process();
    //     this.saveToStorage();
    //   }
  },
  mounted() {
    Texturity.initGL("webgl2");

    // var menu = new Rete.ContextMenu({
    //   Input: {
    //     Texture: components.get("input texture"),
    //     Number: components.get("input number"),
    //     Curve: components.get("input curve"),
    //     Color: components.get("input color")
    //   },
    //   Generator: {
    //     Noise: components.get("noise texture"),
    //     Brick: components.get("brick texture"),
    //     Circle: components.get("circle texture")
    //   },
    //   Texture: {
    //     Transform: components.get("texture transform"),
    //     Lightness: components.get("lightness"),
    //     Normal: components.get("normal map"),
    //     Blur: components.get("blur"),
    //     Gradient: components.get("texture gradient"),
    //     Invert: components.get("invert"),
    //     Blend: components.get("blend")
    //   },
    //   Math: {
    //     Add: components.get("add"),
    //     Subtract: components.get("subtract"),
    //     Distance: components.get("distance"),
    //     Multiply: components.get("multiply"),
    //     Divide: components.get("divide"),
    //     Pow: components.get("pow")
    //   },
    //   Module: {
    //     Module: components.get("module")
    //   },
    //   Output: {
    //     Material: components.get("output material"),
    //     Texture: components.get("output texture"),
    //     Number: components.get("output number"),
    //     Curve: components.get("output curve"),
    //     Color: components.get("output color")
    //   }
    // });

    this.editor = new NodeEditor(ID, this.$refs.area);
    this.engine = new Engine(ID);

    this.editor.use(VueRenderPlugin);
    this.editor.use(ConnectionPlugin);
    this.editor.use(AreaPlugin);
    this.editor.use(ContextMenuPlugin);
    this.editor.use(ModulePlugin, {
      engine: this.engine,
      modules: this.$refs.modules.list
    });

    this.engine.use(ProfilerPlugin, { editor: this.editor, enable: true });

    // this.editor.on("nodecreate", (node, p) => {
    //   if (
    //     p &&
    //     node.title === "Output material" &&
    //     this.data.nodes.find(n => n.title == "Output material")
    //   ) {
    //     alert("Output material already exist");
    //     return false;
    //   }
    // });

    // this.editor.on("process", (__, p) => {
    //   if (!p) return;
    //   this.saveToStorage();
    // });

    this.editor.on(
      "process nodecreated connectioncreated noderemoved connectionremoved",
      async () => {
        if (this.editor.silent) return;
        await this.process();
      }
    );

    components.list.map(c => {
      this.editor.register(c);
      this.engine.register(c);
    });

    store.watch(
      () => store.getters.textureSize,
      _.debounce(this.process, 1000)
    );

    eventbus.$on("process", this.process.bind(this));

    eventbus.$on("newproject", async () => {
      await this.editor.fromJSON({
        id: ID,
        nodes: {},
        groups: {}
      });
    });

    // eventbus.$on("saveproject", callback => {
    //   callback(this.module);
    // });

    // eventbus.$on("openproject", this.import.bind(this));

    // eventbus.$on("openmodule", this.openModule.bind(this));

    // this.restoreFromStorage();

    // if (this.editor.nodes.length === 0) {
    //   fetch("./projects/guide.mtr")
    //     .then(resp => resp.json())
    //     .then(proj => this.import(proj.data,proj.name));
    // }
  }
};
</script>

<style lang="sass">
.node-editor
  width: 100%
  height: 100%

.node
  img,canvas
    box-sizing: content-box
    border: 1px solid white
    margin: 2px
    &:hover
      border: 3px solid white
      margin: 0

  input[type="color"]
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
