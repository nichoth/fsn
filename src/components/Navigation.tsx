import React from "react"
import { NavLink } from "react-router-dom"
import { useWebnative } from "../context/webnative"
import './Navigation.css'

const Navigation = () => {
  const { logout } = useWebnative()

  return (
    <nav className="navigation">
      <h1>Blog</h1>

      <ul>
        <li>
          <NavLink to="/posts">Posts</NavLink>
        </li>

        <li>
          <NavLink to="/whoami">who am i?</NavLink>
        </li>
      </ul>

      <button onClick={() => logout()}>Logout</button>
    </nav>
  )
}

export default Navigation
