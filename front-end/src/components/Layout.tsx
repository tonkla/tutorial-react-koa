import React from 'react'

export default ({ className, children }: React.ComponentProps<'div'>) => (
  <div className={`p-4 bg-white h-screen flex flex-col ${className}`}>{children}</div>
)
