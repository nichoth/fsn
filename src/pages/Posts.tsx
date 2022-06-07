import React, { useState, useEffect, FunctionComponent } from "react"
import { Link } from "react-router-dom"
import Layout from "../components/Layout"
import { Feed, Item } from "../utils/feed"
import { path } from "webnative"
import { useWebnative, WebnativeContext } from "../context/webnative"
import './Posts.css'

type PostProps = {
  feed: Feed
}

function getImageFromItem (wn: WebnativeContext, item: Item) {
  const { fs } = wn
  if (!fs || !fs.appPath) return
  if (!item.image) return
  const fileName = item.image

  return fs.cat(fs.appPath(path.file(fileName)))
    .then((content) => {
      if (!content) return
      const url = URL.createObjectURL(
        new Blob([content as BlobPart], {type: "image/jpeg"})
      )
      return url
    })
}

const Posts: FunctionComponent<PostProps> = ({ feed }) => {
  const wn = useWebnative()
  const [images, setImages] = useState<(string | undefined)[]>([])

  useEffect(() => {
    // use promise.all
    // get all the image URLs,
    // then set state
    if (!feed) return
    Promise.all(feed.items.map(item => {
      return getImageFromItem(wn, item)
    }))
      .then(imgs => {
        setImages(imgs)
      })
  }, [(feed || {}).items])

  return (
    <Layout>
      <header>
        <h1 className="text-xl">Posts</h1>
        <Link to="/posts/new" className="justify-end new">
          + New
        </Link>
      </header>

      <section>
        <ol className="post-list">
          <li>
            <div>Title</div>
            <div>Status</div>
            <div>Last Update</div>
          </li>

          {feed?.items.map((item, i) => {
            return (<li key={i} className="table-row bg-white">
              <div className="table-cell img-cell">
                {item.image ?
                  <img src={images[i]} /> :
                  null
                }
              </div>
              <div className="table-cell py-2 px-4">{item.title}</div>
              <div className="table-cell py-2 px-4">Draft</div>
              <div className="table-cell py-2 px-4">{item.date_published}</div>
            </li>)
          })
          }
        </ol>
      </section>
    </Layout>
  )
}

export default Posts
