import React, { useState, useEffect, FunctionComponent } from "react"
import { Link } from "react-router-dom"
import Layout from "../components/Layout"
import { Feed, Item, SerializedFeed } from "../utils/feed"
import { path } from "webnative"
import { FilePath } from "webnative/path"
import { useWebnative } from "../context/webnative"
import Trash from "../components/Trash"
import './Posts.css'

type PostProps = {
  feed: SerializedFeed,
  onFeedChange: Function
}

function getImageFromItem (fs, item: Item) {
  if (!fs || !fs.appPath) return
  if (!item.image) return

  const { filename, type } = item.image
  return fs.cat(fs.appPath(path.file(filename)))
    .then((content) => {
      if (!content) return
      const url = URL.createObjectURL(
        new Blob([content as BlobPart], { type: type || 'image/jpeg' })
      )
      return url
    })
    .catch(err => {
      console.log('errrrrr', err)
      return null
    })
}

const Posts: FunctionComponent<PostProps> = ({ feed, onFeedChange }) => {
  const { fs } = useWebnative()
  if (!fs || !fs.appPath) return null
  const [images, setImages] = useState({})
  const [delResolving, setDelResolving] = useState<boolean>(false)

  console.log('**posts in posts**', feed)

  useEffect(() => {
    // get all the image URLs, then set state
    if (!feed) return

    Promise.all(feed.items.map(item => {
      return getImageFromItem(fs, item)
    }))
      .then(imgUrls => {
        const map = imgUrls.reduce((acc, imgUrl, i) => {
          acc[feed.items[i].id] = imgUrl
          return acc
        }, {})

        setImages(map)
      })
  }, [(feed || {}).items])

  const feedPath = fs.appPath(path.file('feed.json'))

  function delItem (item:Item, ev:Event) {
    if (!fs || !fs.appPath) return
    if (!item.image) return

    ev.preventDefault()
    console.log('rm item', item)
    const newFeed = Feed.removeItem(feed, item)
    setDelResolving(true)
    // first we update IPFS with new json, then we update app state
    return fs.rm(fs.appPath(path.file(item.image.filename)))
      .then(() => {
        return fs.write(feedPath as FilePath, Feed.toString(newFeed))
      })
      .then(() => {
        return fs.publish()
      })
      .then(() => {
        setDelResolving(false)
        onFeedChange(newFeed)
      })
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
            const encoded = encodeURIComponent(item.id)

            return (<li key={i}>
              <Link className="table-row" to={'/posts/edit/' +
                encodeURIComponent(encoded)}
              >
                <div className="table-cell img-cell">
                  {item.image ?
                    <img src={images[item.id]} /> :
                    null
                  }
                </div>
                <div>{item.title}</div>
                <div>{item.status || <em>none</em>}</div>
                <div>{item.date_published || <em>n/a</em>}</div>
              </Link>

              <Trash className={delResolving ? 'resolving' : null}
                onClick={delItem.bind(null, item)}
                title="delete"
              />
            </li>)
          })}
        </ol>
      </section>
    </Layout>
  )
}

export default Posts
