
import { Layout } from 'antd';
import { GithubFilled } from '@ant-design/icons'
import patreon from '../assets/patreon.svg'
import styled from 'styled-components';
import { Logo } from './shared/Logo';
import { Social } from './shared/Social';
import React from 'react';

const Styles = styled(Layout.Header)`
  background: white;
  line-height: initial;
  padding: 0 2em;
  display: flex;
  align-items: center;
  height: 4em;
  @media (max-width: 600px) {
    padding: 0 1em;
  }
`

export function Header(props: { menu: React.ReactNode }) {
  return (
    <Styles>
      <Logo />
      {props.menu}
      <Social
        title="GitHub"
        link='https://github.com/Ni55aN/allmatter'
        icon={<GithubFilled />}
        data-tour="github"
      />
      <Social
        title="Patreon"
        link='https://www.patreon.com/bePatron?u=7890937'
        icon={<img src={patreon} className='anticon' style={{ width: '1em' }} />}
        data-tour="patreon"
      />
    </Styles>
  )
}
