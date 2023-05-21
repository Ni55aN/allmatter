import { useEffect, useRef, useState } from 'react'

import { ColorPicker } from './color-picker';
import { Drag } from 'rete-react-render-plugin';
import styled from 'styled-components';

const Input = styled.input<{ styles?: (props: any) => any }>`
  width: 100%;
  border-radius: 30px;
  background-color: white;
  padding: 2px 6px;
  border: 1px solid #999;
  font-size: 110%;
  box-sizing: border-box;
  ${props => props.styles && props.styles(props)}
`

export function ColorPickerUI(props: { data: ColorPicker }) {
    const [value, setValue] = useState(props.data.value)
    const ref = useRef(null)

    Drag.useNoDrag(ref)

    useEffect(() => {
        setValue(props.data.value)
    }, [props.data.value])

    return (
        <Input
            value={value}
            type='color'
            ref={ref}
            onChange={e => {
                const val = e.target.value

                setValue(val)
                props.data.setValue(val)
            }}
        />
    )
}
