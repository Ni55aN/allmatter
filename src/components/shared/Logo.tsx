import styled from 'styled-components';
import logo from '../../assets/logo.svg'

const Img = styled.img`
  height: 2.8em;
  margin-top: 0.5em;
`

export function Logo() {
  return <Img src={logo} />
}
