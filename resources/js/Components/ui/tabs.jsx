import { useState, Children, isValidElement, cloneElement } from 'react'

export function Tabs({ defaultValue, children, className = '' }) {
  const [value, setValue] = useState(defaultValue)

  const mapped = Children.map(children, (child) => {
    if (!isValidElement(child)) return child

    if (child.type === TabsList) {
      const listChildren = Children.map(child.props.children, (t) => {
        if (!isValidElement(t)) return t
        if (t.type !== TabsTrigger) return t
        return cloneElement(t, {
          onClick: () => setValue(t.props.value),
          active: value === t.props.value,
        })
      })
      return <TabsList {...child.props}>{listChildren}</TabsList>
    }

    if (child.type === TabsContent) {
      if (value !== child.props.value) return null
      return child
    }

    return child
  })

  return (
    <div className={className} data-value={value}>
      {mapped}
    </div>
  )
}

export function TabsList({ children, className = '' }) {
  return <div className={`flex gap-2 ${className}`}>{children}</div>
}

export function TabsTrigger({ children, className = '', active, ...rest }) {
  return (
    <button
      className={`${active ? 'font-semibold' : 'text-gray-500'} ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}

export function TabsContent({ children, className = '' }) {
  return <div className={className}>{children}</div>
}
