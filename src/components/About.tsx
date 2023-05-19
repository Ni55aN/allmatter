import { Modal } from 'antd';
import logo from '../assets/logo.svg'
import styled from 'styled-components';

const Logo = styled.img`
  height: 4em;
`

export function About({ open, hide }: { open: boolean, hide: () => void }) {
  return (
    <Modal title="About" open={open} footer={null} onCancel={hide}>
      <Logo src={logo} />
      <p>Allmatter is a 3D material authoring tool.</p>
      <p>Author: <a href="https://github.com/Ni55aN" target="_blank">Vitaliy Stoliarov</a></p>
    </Modal>
  )
}
