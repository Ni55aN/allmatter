import { Button, Input } from 'antd'
import { useEffect, useState } from 'react'
import { Drag } from 'rete-react-render-plugin'

type Props = {
  name: string
  select: (name: string) => void
  rename: (params: { from: string, to: string }) => void
  children: any
}

export function ModuleItem({ name, select, rename }: Props) {
  const [editMode, setEditMode] = useState(false)
  const [editedName, setEditedName] = useState('')

  useEffect(() => {
    setEditedName(name)
  }, [name])

  function enter() {
    setEditMode(true)
  }
  function exit() {
    setEditMode(false)
    rename({ from: name, to: editedName })
  }

  return (
    <Drag.NoDrag>
      <Button
        onClick={e => {
          e.preventDefault()
          select(name)
        }}
        onContextMenu={e => {
          e.preventDefault()
          e.stopPropagation()
          enter()
        }}
        onKeyDown={e => {
          if (e.key === 'Enter') enter()
        }}
        style={{ width: '100%' }}
      >
        {editMode && <Input
          className='text'
          autoFocus
          size='small'
          value={editedName}
          onClick={e => e.stopPropagation()}
          onChange={e => setEditedName((e.target as HTMLInputElement).value)}
          onBlur={() => exit()}
        />}
        {!editMode && <div className='text'>{name}</div>}

      </Button>
    </Drag.NoDrag>
  )
}
