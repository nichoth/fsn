import React, { useEffect, useState } from "react"
import { path } from "webnative"
import {
  HashRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom"
import * as wn from "webnative"
import { FilePath } from "webnative/path"
import AuthRoute from "./components/AuthRoute"
import Editor from "./pages/Editor"
import Login from "./pages/Login"
import Posts from "./pages/Posts"
import Whoami from "./pages/Whoami"
import { Feed, SerializedFeed } from "./utils/feed"
import { useWebnative } from "./context/webnative"
import './App.css'

function App() {
  const { fs, username } = useWebnative()
  const [feed, setFeed] = useState<SerializedFeed | null>(null)

  useEffect(() => {
    async function loadFeed() {
      if (!username || !fs || !fs.appPath) return

      const feedPath = fs.appPath(wn.path.file("feed.json"))
      if (await fs.exists(feedPath)) {
        console.log("✅ feed file exists")
        const content = await fs.read(feedPath as FilePath)
        // console.log('content', content)
        try {
          setFeed(Feed.fromString(content as string))
        } catch (err) {
          // this error means that the given content was not valid JSON
          console.log("err in here", err)
          // if there's a json error, then just write over the existing path
          // with a new feed
          const feedPath = fs.appPath(path.file('feed.json'))
          const newFeed = await createFeed(feedPath)
          console.log('new feed', newFeed)
          setFeed(newFeed)
        }
      } else {
        console.log("❌ need to create feed")
        const _feed = await createFeed(feedPath)
        setFeed(_feed)
      }
    }

    loadFeed()
  }, [fs, username])

  function createFeed (feedPath:FilePath) {
    if (!fs) return null

    const newFeed = Feed({
      title: `${username}'s blog`,
      authors: [{ name: username }],
      items: []
    })
    return fs.write(feedPath as FilePath, Feed.toString(newFeed))
      .then(() => fs.publish())
      .then(() => newFeed)
  }

  function handleFeedChange (newFeed) {
    setFeed(newFeed)
  }

  return (
    <Router>
      <Switch>
        <Redirect from="/" to="/posts" exact />
        <AuthRoute path="/posts" component={Posts} exact feed={feed}
          onFeedChange={handleFeedChange}
        />
        <AuthRoute path="/posts/new" component={Editor} exact feed={feed}
          onFeedChange={handleFeedChange}
        />
        <AuthRoute path="/posts/edit/:postId" component={Editor} feed={feed} />
        <Route path="/login" component={Login} />
        <Route path="/whoami" component={Whoami} />
      </Switch>
    </Router>
  )
}

export default App
