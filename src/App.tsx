import './App.css'
import { Layout, MenuProps } from 'antd';
import styled from 'styled-components'
import { Workspace } from './components/Workspace';
import { useEffect, useState } from 'react';
import { About } from './components/About';
import { legacyStore } from './store';
import { useEditor } from './components/NodeEditor';
import { MaterialPreview } from './components/MaterialPreview';
import { TextureViewer } from './components/TextureViewer';
import { Tour } from './tour';
import { InteractiveMenuItem } from './components/shared/InteractiveMenuItem';
import { Header } from './components/Header';
import { useProjectPicker } from './project-picker';
import { useProjectSaver } from './project-saver';
import { useMapsSaver } from './maps-saver';
import { Model } from './components/settings/Model';
import { TextureSize } from './components/settings/TextureSize';
import { Menu } from './components/Menu';

const Content = styled(Layout.Content)`
  flex: 1%;
  background: white;
  line-height: initial;
  padding: 0.5em;
`

function App() {
  const [openAbout, setOpenAbout] = useState(false)
  const [textureSize, setTextureSize] = useState(legacyStore.textureSize)
  const [modelName, setModelName] = useState('cube')
  const [tour] = useState(new Tour())
  const [open, file] = useProjectPicker()
  const [save] = useProjectSaver('project.json')
  const [saveTextures] = useMapsSaver('allmatter_[name].png')

  useEffect(() => {
    legacyStore.textureSize = textureSize
    editor.process()
  }, [textureSize])

  const [maps, setMaps] = useState<Record<string, any>>({})
  const [preview, setPreview] = useState('')
  const editor = useEditor({ changePreview: setPreview, changeMaterial: setMaps })

  useEffect(() => {
    if (file) editor.modules.importModules(file)
  }, [file])

  const items: MenuProps['items'] = [
    {
      label: 'Project',
      key: 'project',
      children: [
        {
          label: 'New',
          key: 'new',
          onClick() {
            editor.modules.clear()
          }
        },
        {
          label: 'Open',
          key: 'open',
          onClick() {
            open()
          }
        },
        {
          label: 'Save',
          key: 'save',
          onClick() {
            save(editor.modules.list)
          }
        },
        {
          label: 'Export maps',
          key: 'export maps',
          onClick() {
            saveTextures(maps)
          }
        },
      ]
    },
    {
      label: 'Edit',
      key: 'edit',
      children: [
        {
          label: (
            <InteractiveMenuItem label="Texture size">
              <TextureSize min={8} max={12} onChange={setTextureSize} />
            </InteractiveMenuItem>
          ),
          style: {
            height: 'auto',
          },
          key: 'texture-size'
        },
        {
          label: (
            <InteractiveMenuItem label="3D model">
              <Model onChange={setModelName} />
            </InteractiveMenuItem>
          ),
          style: {
            height: 'auto',
          },
          key: '3d-model'
        }
      ]
    },
    {
      label: 'Help',
      key: 'help',
      children: [
        {
          label: 'Guide',
          key: 'guide',
          onClick() {
            tour.start()
          }
        },
        {
          label: 'About',
          key: 'about',
          onClick() {
            setOpenAbout(true)
          }
        }
      ]
    }
  ]

  return (
    <Layout style={{ display: 'flex', height: '100vh' }}>
      <Header
        menu={<Menu mode="horizontal" items={items} data-tour="menu" />}
      />
      <Content>
        <Workspace
          materialPreview={<MaterialPreview geometry={modelName} maps={maps} />}
          texturePreview={<TextureViewer src={preview} />}
          editor={editor.view}
        />
      </Content>
      <About open={openAbout} hide={() => setOpenAbout(false)} />
    </Layout>
  )
}

export default App
