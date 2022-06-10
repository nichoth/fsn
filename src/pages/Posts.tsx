import React, { useState, useEffect, FunctionComponent } from "react"
import { Link } from "react-router-dom"
import Layout from "../components/Layout"
import { Feed, Item } from "../utils/feed"
import { path } from "webnative"
import { useWebnative, WebnativeContext } from "../context/webnative"
import Trash from "../components/Trash"
import './Posts.css'
import { removeItem } from '../utils/util'

type PostProps = {
  feed: Feed
}

// function getImageFromItem (wn: WebnativeContext, item: Item) {
function getImageFromItem (fs, item: Item) {
  // const { fs } = wn
  if (!fs || !fs.appPath) return
  if (!item.image) return

  var { filename, type } = item.image
  // TODO -- get rid of this after you normalize item props
  filename = filename || item.image

  return fs.cat(fs.appPath(path.file(filename)))
    .then((content) => {
      if (!content) return
      const url = URL.createObjectURL(
        new Blob([content as BlobPart], { type: type || 'image/jpeg' })
      )
      return url
    })
}

const Posts: FunctionComponent<PostProps> = ({ feed }) => {
  const { fs } = useWebnative()
  // const wn = useWebnative()
  // const { fs } = wn
  const [images, setImages] = useState<(string | undefined)[]>([])

  console.log('feed in posts', feed)

  useEffect(() => {
    // get all the image URLs, then set state
    if (!feed) return
    Promise.all(feed.items.map(item => {
      return getImageFromItem(fs, item)
    }))
      .then(imgs => {
        setImages(imgs)
      })
  }, [(feed || {}).items])

  function delItem (item, ev) {
    ev.preventDefault()
    console.log('rm item', item)
    removeItem(feed, fs, item)
  }

  return (
    <Layout className="posts">
      <header>
        <h2>Posts</h2>
        <Link to="/posts/new">
          + New
        </Link>
      </header>

      <section className="post-section">
        <ol className="post-list">
          <li>
            <div>Image</div>
            <div>Title</div>
            <div>Status</div>
            <div>Last Published</div>
          </li>

          {feed?.items.map((item, i) => {
            console.log('item', item)
            const encoded = encodeURIComponent(item.id)
            console.log('encoded', encoded)

            return (<li key={i}>
              <Link className="table-row" to={'/posts/edit/' +
                encodeURIComponent(encoded)}
              >
                <div className="table-cell img-cell">
                  {item.image ?
                    <img src={images[i]} /> :
                    null
                  }
                </div>
                <div>{item.title}</div>
                <div>{item.status || <em>none</em>}</div>
                <div>{item.date_published || <em>n/a</em>}</div>
              </Link>

              <Trash onClick={delItem.bind(null, item)} />
            </li>)
          })}
        </ol>
      </section>
    </Layout>
  )
}

export default Posts
