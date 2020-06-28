import React from 'react'
import { useHistory } from 'react-router-dom'
import { LeftOutlined } from '@ant-design/icons'

export default ({ title }: React.ComponentProps<'div'>) => {
  const history = useHistory()
  return (
    <div
      className="p-2 text-lg bg-white relative cursor-pointer flex items-center"
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)', height: 45 }}
    >
      <div
        className="absolute top-0 left-0 p-2 flex items-center"
        style={{ color: '#1890ff', height: 45 }}
        onClick={() => history.goBack()}
      >
        <LeftOutlined />
        <span>Back</span>
      </div>
      {title && <div className="flex-grow flex justify-center">{title}</div>}
    </div>
  )
}
