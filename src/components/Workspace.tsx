import { useEffect, useState } from 'react';
import styled from 'styled-components'

const Styles = styled.div<{ active: 'material' | 'texture' | null }>`
  display: grid;
  grid-template-columns: 1fr 2fr;
  grid-template-rows: 1fr 1fr;
  grid-gap: 1em;
  grid-template-areas: ${props => {
    if (props.active === 'material') return `"A A" "A A"`
    if (props.active === 'texture') return `"B B" "B B"`
    return `"A C" "B C"`;
  }};
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
  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: calc(50vw - 2em) auto;
    grid-template-areas: ${props => {
    if (props.active === 'material') return `"A A" "A A"`
    if (props.active === 'texture') return `"B B" "B B"`
    return `"A B" "C C"`;
  }};
  }
`

const Card = styled.div<{ visible: boolean }>`
  box-shadow: rgba(0, 0, 0, 0.3) 0px 1px 4px;
  border-radius: 5px;
  overflow: hidden;
  display: ${props => props.visible ? '' : 'none'};
`

type Area = 'material' | 'texture' | null

export function Workspace({ materialPreview, texturePreview, editor }: { editor: any, texturePreview: any, materialPreview: any }) {
  const [active, setActive] = useState<Area>(null)

  useEffect(() => {
    setTimeout(() => window.dispatchEvent(new Event('resize')));
  }, [active])

  function switchArea(area: Area) {
    setActive(active === area ? null : area)
  }

  return (
    <Styles active={active}>
      <Card className="material-preview" visible={active === null || active === 'material'} onDoubleClick={() => switchArea('material')}>
        {materialPreview}
      </Card>
      <Card className="texture-preview" visible={active === null || active === 'texture'} onDoubleClick={() => switchArea('texture')}>
        {texturePreview}
      </Card>
      <Card visible={active === null} className="editor">
        {editor}
      </Card>
    </Styles>
  )
}
