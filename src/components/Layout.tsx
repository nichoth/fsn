import React from "react"
import Navigation from "./Navigation"
import './Layout.css'

// interface Props {
//   children?: ReactChild[]
// }

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <Navigation />
      <main>
        {children}
      </main>
    </div>
  )
}

export default Layout
