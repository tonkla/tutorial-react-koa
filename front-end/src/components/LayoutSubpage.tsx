import React from 'react'

import Header from './Header'

export default ({ className, children, title }: React.ComponentProps<'div'>) => {
  return (
    <>
      <Header title={title} />
      <div
        className={`p-4 overflow-y-scroll flex flex-col ${className}`}
        style={{ height: 'calc(100vh - 45px)' }}
      >
        {children}
      </div>
    </>
  )
}
