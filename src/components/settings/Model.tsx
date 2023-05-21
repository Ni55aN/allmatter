import { Select } from 'antd';

const options = [
  {
    label: 'Cube',
    value: 'cube' as const
  },
  {
    label: 'Sphere',
    value: 'sphere' as const
  }
]
type Values = (typeof options)[number]['value']

export function Model(props: { onChange: (value: Values) => void }) {
  return (
    <Select
      style={{ width: '100%' }}
      options={options}
      onChange={props.onChange}
      defaultValue="cube"
    />
  )
}
