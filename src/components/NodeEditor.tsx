/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useCallback, useEffect, useRef } from 'react';
import styled from 'styled-components';
// @ts-ignore
import * as Texturity from 'texturity.js';
import { useRete } from 'rete-react-render-plugin';
import _ from 'lodash';
import guideEditor from '../assets/projects/guide.json'
import { useModules } from './Modules';
import { createEditor } from '../editor';
import { message } from 'antd';

const Container = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`

const EditorContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;

  input[type="color"] {
    border-radius: 0;
    padding: 0 2px;
    width: 140px;
    height: 140px;
  }
`

export function useEditor({ changePreview, changeMaterial }: { changePreview: (src: string) => void, changeMaterial: (maps: Record<string, any>) => void }) {
  const [messageApi, contextHolder] = message.useMessage();
  const create = useCallback((container: HTMLElement) => createEditor(
    container,
    () => modules.list,
    changeMaterial,
    texture => {
      if (changePreviewRef.current) changePreviewRef.current(texture.src)
    },
    (text, type) => messageApi[type](text)
  ), [changeMaterial, messageApi])
  const [container, editor] = useRete(create)

  const modules = useModules({
    async opened() {
      if (!editor) return

      await editor.layout()
      editor.zoomAt()
      editor.process()
    }
  })
  const changePreviewRef = useRef<(src: string) => void>()

  useEffect(() => {
    changePreviewRef.current = changePreview
  }, [changePreview])
  useEffect(() => {
    editor?.process()
  }, [editor])


  useEffect(() => {
    if (!editor) return
    modules.setDI(editor.di)
    modules.importModules(guideEditor)
  }, [editor])

  return {
    modules,
    process() {
      editor?.process()
    },
    view: (
      <Container>
        {contextHolder}
        <EditorContainer ref={container} data-tour="node-editor"></EditorContainer>
        {modules.view}
      </Container>
    )
  }
}
