import styled from 'styled-components'
import { Editor } from './NodeEditor'
import { TextureViewer } from './TextureViewer'
import { useState } from 'react'
import { MaterialPreview } from './MaterialPreview'

const Styles = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  grid-template-rows: 1fr 1fr;
  grid-gap: 1em;
  grid-template-areas:
    "A C"
    "B C";
  height: 100%;
  .material-preview {
    grid-area: A;
  }
  .texture-preview {
    grid-area: B;
  }
  .editor {
    grid-area: C;
  }
`

const Card = styled.div`
  box-shadow: rgba(0, 0, 0, 0.3) 0px 1px 4px;
  border-radius: 5px;
  overflow: hidden;
`

export function Workspace({ textureSize, modelName }: { textureSize: number, modelName: string }) {
  const [maps, setMaps] = useState({})
  const [preview, setPreview] = useState('')

  return (
    <Styles>
      <Card className="material-preview">
        <MaterialPreview geometry={modelName} maps={maps} />
      </Card>
      <Card className="texture-preview">
        <TextureViewer src={preview} />
      </Card>
      <Card className="editor">
        <Editor textureSize={textureSize} changePreview={setPreview} changeMaterial={setMaps} />
      </Card>
    </Styles>
  )
}
