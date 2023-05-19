import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

const $padd = 8
const $marg = 20
const $fcolor = '#afa2c4'

const Styles = styled.div`
padding: 4px;
width: 140px;
.text {
  font-size: 1rem;
  margin-right: ${$marg}px;
  cursor: pointer;
  color: ${$fcolor};
  padding: ${$padd * 0.7}px ${$padd}px;
  border: 1px solid #bbb;
  border-radius: ${$padd * 2}px;
  background: rgba(255,255,255,0.8);
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  &:hover {
    color: grey;
    cursor: pointer;
  }
}
`

type Props = {
  name: string
  select: (name: string) => void
  rename: (params: { from: string, to: string }) => void
  children: any
}

export function ModuleItem({ name, select, rename }: Props) {
  const [editMode, setEditMode] = useState(false)
  const ref = useRef<HTMLInputElement>(null)
  const [editedName, setEditedName] = useState('')

  useEffect(() => {
    setEditedName(name)
  }, [name])

  function enter() {
    setEditMode(true)
  }
  function exit(e: React.FocusEvent<HTMLInputElement, Element>) {
    setEditMode(false)
    rename({ from: name, to: editedName })
  }

  useEffect(() => {
    ref.current?.focus()
  }, [ref.current])

  return (
    <Styles
      onClick={e => {
        e.preventDefault()
        select(name)
      }}
      onDoubleClick={e => {
        e.nativeEvent.stopPropagation()
        enter()
      }}
      onKeyDown={e => {
        if (e.key === 'Enter') enter()
      }}
    >
      {editMode && <input className='text' ref={ref} value={editedName} onChange={e => setEditedName((e.target as HTMLInputElement).value)} onBlur={e => exit(e)} />}
      {!editMode && <div className='text'>{name}</div>}

    </Styles>
  )
}
