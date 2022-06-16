import React from "react"
import { Route, Redirect, RouteComponentProps } from "react-router-dom"
import { useWebnative } from "../context/webnative"
import { SerializedFeed } from "../utils/feed"

interface Props {
  component: React.FC<RouteComponentProps>
  path: string
  exact?: boolean
  feed: SerializedFeed | null
  children?: React.ReactNode
  onFeedChange?: Function
}

const AuthRoute = ({ component: Component, ...rest }: Props) => {
  const { state } = useWebnative()

  // here, return either `Component` for authd users,
  // or a *non authenticated view* of the site

  return (
    <Route
      {...rest}
      render={(props) => {
        return state?.authenticated ? (
          <Component {...props} {...rest}>
            {props.children}
          </Component>
        ) : (
          <Redirect to={{ pathname: "/login" }} />
        )
      }}
    />
  )
}

export default AuthRoute
