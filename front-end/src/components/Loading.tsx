import React from 'react'
import { Spin } from 'antd'

export default () => {
  return (
    <div className="mt-4 flex justify-center">
      <Spin tip="Loading..." />
    </div>
  )
}
