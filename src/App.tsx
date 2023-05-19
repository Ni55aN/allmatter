import './App.css'
import { Layout, Menu as AntMenu, MenuProps, Slider, Select } from 'antd';
import styled from 'styled-components'
import logo from './assets/logo.svg'
import { InteractiveMenuItem } from './components/InteractiveMenuItem';
import { Workspace } from './components/Workspace';
import { useEffect, useState } from 'react';
import { About } from './components/About';
import { legacyStore } from './store';

const Header = styled(Layout.Header)`
  background: white;
  line-height: initial;
  padding: 0 2em;
  display: flex;
  align-items: center;
  height: 4em;
`

const Content = styled(Layout.Content)`
  flex: 1%;
  background: white;
  line-height: initial;
  padding: 0.5em;
`

const Logo = styled.img`
  height: 2.8em;
  margin-top: 0.5em;
`

const Menu = styled(AntMenu)`
  flex: 1;
  border: 0;
  margin-left: 1em;
  height: 100%;
  & > .ant-menu-overflow-item {
    padding-inline: 0;
    &::after {
      width: 100%;
      left: 0;
      bottom: unset !important;
      top: 0;
      inset-inline: 0 !important;
    }
  }
  [role="menuitem"] {
    height: 100%;
    display: flex;
    align-items: center;
    padding: 0 1em;
  }
`

function App() {
  const [openAbout, setOpenAbout] = useState(false)
  const [textureSize, setTextureSize] = useState(legacyStore.textureSize)
  const [modelName, setModelName] = useState('cube')
  const items: MenuProps['items'] = [
    {
      label: 'Project',
      key: 'project',
      children: [
        {
          label: 'New',
          key: 'new'
        },
        {
          label: 'Open',
          key: 'open'
        },
        {
          label: 'Save',
          key: 'save'
        },
        {
          label: 'Export maps',
          key: 'export maps'
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
              <Slider
                min={8}
                max={12}
                tooltip={{ formatter: v => 2 ** (v || 0) }}
                defaultValue={9}
                onChange={value => setTextureSize(2 ** value)}
              />
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
              <Select
                style={{ width: '100%' }}
                options={[
                  {
                    label: 'Cube',
                    value: 'cube'
                  },
                  {
                    label: 'Sphere',
                    value: 'sphere'
                  }
                ]}
                onChange={setModelName}
                defaultValue="cube"
              />
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
          key: 'guide'
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

  useEffect(() => {
    legacyStore.textureSize = textureSize
  }, [textureSize])

  return (
    <Layout style={{ display: 'flex', height: '100vh' }}>
      <Header>
        <Logo src={logo} />
        <Menu mode="horizontal" items={items} />
      </Header>
      <Content>
        <Workspace textureSize={textureSize} modelName={modelName} />
      </Content>
      <About open={openAbout} hide={() => setOpenAbout(false)} />
    </Layout>
  )
}

export default App
