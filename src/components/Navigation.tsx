import React from "react"
import { Link } from "react-router-dom"
import { useWebnative } from "../context/webnative"
import './Navigation.css'

const Navigation = () => {
  const { logout } = useWebnative()

  return (
    <nav className="min-h-full flex flex-col">
      <h1 className="text-xl">Blog</h1>

      <ul>
        <li>
          <Link to="/posts">Posts</Link>
        </li>
      </ul>

      <button onClick={() => logout()}>Logout</button>
    </nav>
  )
}

export default Navigation
