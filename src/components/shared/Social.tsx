import React from 'react';
import { Button, Tooltip } from 'antd';

export function Social({ title, link, icon, ...rest }: { title: string, link: string, icon: React.ReactNode }) {
  return (
    <Tooltip placement='bottom' title={title}>
      <Button
        href={link}
        target='_blank'
        type="text"
        size='large'
        icon={icon}
        {...rest}
      />
    </Tooltip>
  )
}
