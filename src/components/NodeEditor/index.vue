<template lang="pug">
div
  Modules(ref="modules", @opened="zoomAt(); process()")
  .node-editor(ref="area")
</template>

<script>
import * as Texturity from 'texturity.js';
import { Engine, NodeEditor } from 'rete';
import { ID } from '../../consts';
import { saveAs } from 'file-saver';
import AreaPlugin from 'rete-area-plugin';
import ConnectionPlugin from 'rete-connection-plugin';
import ContextMenuPlugin from 'rete-context-menu-plugin';
import ModulePlugin from 'rete-module-plugin';
import Modules from './Modules.vue';
import ProfilerPlugin from 'rete-profiler-plugin';
import VueRenderPlugin from 'rete-vue-render-plugin';
import _ from 'lodash';
import blobUtil from 'blob-util/dist/blob-util';
import components from '../../editor/components';
import eventbus from '../../eventbus';
import store from '../../store';

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
            Texturity.disposeTextures();
            
            var startId = Object.keys(
                this.$refs.modules.getCurrent().data.nodes
            ).find(
                key =>
                    this.$refs.modules.getCurrent().data.nodes[key].title ==
          'Output material'
            );

            await this.engine.abort();
            await this.engine.process(
                this.editor.toJSON(),
                startId ? parseInt(startId) : null
            );
        }
    },
    mounted() {
        Texturity.initGL('webgl2');
    
        this.editor = new NodeEditor(ID, this.$refs.area);
        this.engine = new Engine(ID);

        this.editor.use(VueRenderPlugin);
        this.editor.use(ConnectionPlugin);
        this.editor.use(AreaPlugin);
        this.editor.use(ContextMenuPlugin, { 
            delay: 100,
            allocate(component) {
                return component.allocation || [];
            }
        });
        this.editor.use(ModulePlugin, {
            engine: this.engine,
            modules: this.$refs.modules.list
        });

        this.engine.use(ProfilerPlugin, { editor: this.editor, enable: true });

        this.editor.on('nodecreate', (node, p) => {
          if (
            p &&
            node.title === 'Output material' &&
            this.data.nodes.find(n => n.title == 'Output material')
          ) {
            alert('Output material already exist');
            return false;
          }
        });

        this.editor.on(
            'process nodecreated connectioncreated noderemoved connectionremoved',
            async () => {
                if (this.editor.silent) return;
                
                this.$refs.modules.sync();
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

        eventbus.$on('process', this.process.bind(this));

        eventbus.$on('newproject', async () => {
            this.$refs.modules.clear();
        });

        eventbus.$on('openproject', modules => {
            this.$refs.modules.clear();
            console.log('clear')
            Object.entries(modules).map(([name, { data }]) => {
                this.$refs.modules.addModule(name, data)
            });
            console.log('openModule')
            this.$refs.modules.openModule(Object.keys(modules)[0]);
        });

        eventbus.$on('saveproject', () => {
            var blob = new Blob([JSON.stringify(this.$refs.modules.list)], {
                type: 'application/json;charset=utf-8'
            });

            saveAs(blob, 'project.mtr');
        });

        eventbus.$on('exportmaps', () => {
            Object.entries(store.state.maps).map(async ([name, map]) => {
                const src = map.replace('data:image/png;base64,', '');
                const blob = await blobUtil.base64StringToBlob(src, 'image/png');

                saveAs(blob, `allmatter_${name}.png`);
            });
        });
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
