/* eslint-disable @typescript-eslint/ban-ts-comment */
import { createContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
// @ts-ignore
import * as Texturity from 'texturity.js';
import { Engine, NodeEditor } from 'rete';
// @ts-ignore
import { saveAs } from 'file-saver';
// @ts-ignore
import AreaPlugin from 'rete-area-plugin';
// @ts-ignore
import ConnectionPlugin from 'rete-connection-plugin';
// @ts-ignore
import ContextMenuPlugin from 'rete-context-menu-plugin';
// @ts-ignore
import ModulePlugin from 'rete-module-plugin';
// @ts-ignore
import ProfilerPlugin from 'rete-profiler-plugin';
// @ts-ignore
import VueRenderPlugin from 'rete-vue-render-plugin';
import _ from 'lodash';
// @ts-ignore
import blobUtil from 'blob-util/dist/blob-util';
// @ts-ignore
import getComponents from '../editor/components';
import { ID } from '../consts';
import guideEditor from '../assets/projects/guide.json'
import { useModules } from './Modules';
import { useDebouncedCallback } from 'use-debounce'
import { legacyStore } from '../store';
// import eventbus from '../../eventbus';
// import store from '../../store';


const Container = styled.div`
  width: 100%;
  height: 100%;
  position: relative;

  .node img,canvas {
    box-sizing: content-box;
    border: 1px solid white;
    margin: 2px;
    &:hover {
      border: 3px solid white;
      margin: 0;
    }
  }

  input[type="color"] {
    border-radius: 0;
    padding: 0 2px;
    width: 140px;
    height: 140px;
  }

  .module-control {
    position: relative;
  }
`

export function Editor({ textureSize, changePreview, changeMaterial }: { textureSize: number, changePreview: (src: string) => void, changeMaterial: (maps: Record<string, any>) => void }) {
  const container = useRef(null)
  const editorRef = useRef<NodeEditor>()
  const engineRef = useRef<Engine>()
  const modules = useModules({
    getEditor() {
      if (!editorRef.current) throw new Error('not inited')
      return editorRef.current
    },
    opened() {
      zoomAt()
      process()
    }
  })
  const changePreviewRef = useRef<(src: string) => void>()
  const updateMaterialRef = useRef<any>()
  const processDebounced = useDebouncedCallback(() => process(), 1000)

  useEffect(() => {
    changePreviewRef.current = changePreview
  }, [changePreview])
  useEffect(() => {
    updateMaterialRef.current = changeMaterial
  }, [changeMaterial])
  useEffect(() => {
    processDebounced()
  }, [textureSize, processDebounced])


  function initEditor(container: HTMLElement) {
    const editor = new NodeEditor(ID, container);
    const engine = new Engine(ID);

    editorRef.current = editor
    engineRef.current = engine

    editor.use(VueRenderPlugin);
    editor.use(ConnectionPlugin);
    editor.use(AreaPlugin);
    editor.use(ContextMenuPlugin, {
      delay: 100,
      allocate(component: any) {
        return component.allocation || [];
      }
    });
    editor.use(ModulePlugin, {
      engine: engine,
      modules: modules.list
    });

    // engine.use(ProfilerPlugin, { editor, enable: true });

    editor.on('process nodecreated connectioncreated noderemoved connectionremoved' as any, async () => {
      if (editor.silent) return;

      modules.sync();
      await process();
    });

    getComponents({
      getSize: () => legacyStore.textureSize,
      show: (img: { src: string }) => changePreviewRef.current && changePreviewRef.current(img.src)
    }, (maps: any) => {
      updateMaterialRef.current && updateMaterialRef.current(maps)
    }).list.map((c: any) => {
      editor.register(c);
      engine.register(c);
    });
  }


  async function importModules(target: Record<string, any>) {
    await modules.clear();

    Object.entries(target).map(([name, { data }]) => {
      modules.addModule(name, data)
    });

    await modules.openModule(Object.keys(target)[0]);
  }

  useEffect(() => {
    Texturity.initGL('webgl2');

    if (editorRef.current) {
      editorRef.current.destroy()
    }
    if (container.current) {
      initEditor(container.current)
      importModules(guideEditor);
    }

    // eventbus.$on('process', () => process());

    // eventbus.$on('newproject', async () => {
    //   // this.$refs.modules.clear();
    // });

    // eventbus.$on('openproject', (modules: any[]) => importModules(modules));

    // eventbus.$on('saveproject', () => {
    //   const blob = new Blob([JSON.stringify(this.$refs.modules.list)], {
    //     type: 'application/json;charset=utf-8'
    //   });

    //   saveAs(blob, 'project.mtr');
    // });

    // eventbus.$on('exportmaps', () => {
    //   Object.entries(store.state.maps).map(async ([name, map]) => {
    //     const src = map.replace('data:image/png;base64,', '');
    //     const blob = await blobUtil.base64StringToBlob(src, 'image/png');

    //     saveAs(blob, `allmatter_${name}.png`);
    //   });
    // });
  }, [])

  function zoomAt() {
    AreaPlugin.zoomAt(editorRef.current);
  }

  async function process() {
    if (!engineRef.current || !editorRef.current) return
    Texturity.disposeTextures();

    const mods = modules;
    const startId = Object.keys(mods.getCurrent().data.nodes)
      .find(key => mods.getCurrent().data.nodes[key].title == 'Output material');

    await engineRef.current.abort();
    await engineRef.current.process(editorRef.current.toJSON(), startId ? parseInt(startId) : null)
  }


  return (
    <Container ref={container}>
      {modules.view}
    </Container>
  )
}
