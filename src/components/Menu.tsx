import { Menu as AntMenu } from 'antd';
import styled from 'styled-components';

export const Menu = styled(AntMenu)`
  flex: 1;
  border: 0;
  margin-left: 1em;
  height: 100%;
  & > .ant-menu-overflow-item {
    padding-inline: 0;
    &::after {
      width: 100%;
      left: 0;
      bottom: unset !important;
      top: 0;
      inset-inline: 0 !important;
    }
  }
  [role="menuitem"] {
    height: 100%;
    display: flex;
    align-items: center;
    padding: 0 1em;
  }
`
