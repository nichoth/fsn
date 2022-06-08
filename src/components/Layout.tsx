import React from "react"
import Navigation from "./Navigation"
import './Layout.css'

// interface Props {
//   children?: ReactChild[]
// }

const Layout = ({ children, className }) => {
  const cl = 'layout' + (className ? (' ' + className) : '')

  return (
    <div className={cl}>
      <Navigation />
      <main>
        {children}
      </main>
    </div>
  )
}

export default Layout
