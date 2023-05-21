import { Slider } from 'antd';

export function TextureSize(props: { min: number, max: number, onChange: (value: number) => void }) {
  return (
    <Slider
      min={props.min}
      max={props.max}
      tooltip={{ formatter: v => 2 ** (v || 0) }}
      defaultValue={props.min + 1}
      onChange={value => props.onChange(2 ** value)}
    />
  )
}
