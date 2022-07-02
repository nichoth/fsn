import React, { useState, useEffect, FunctionComponent } from "react"
import { Link } from "react-router-dom"
import Layout from "../components/Layout"
import { Item, SerializedFeed } from "../utils/feed"
import { useWebnative } from "../context/webnative"
import * as wn from "webnative"
import Trash from "../components/Trash"
import './Posts.css'

type PostProps = {
  feed: SerializedFeed,
  items: Item[],
  onFeedChange: Function
}

// function getImageFromItem (fs, item: Item) {
//   if (!fs || !fs.appPath) return
//   if (!item.image) return

//   const { filename, type } = item.image
//   console.log('filename', filename)

//   return fs.cat(fs.appPath(wn.path.file(filename)))
//     .then((content) => {
//       if (!content) return
//       const url = URL.createObjectURL(
//         new Blob([content as BlobPart], { type: type || 'image/jpeg' })
//       )
//       return url
//     })
//     .catch(err => {
//       console.log('errrrrr', err, filename)
//       return null
//     })
// }

const Posts: FunctionComponent<PostProps> = ({ items, feed, onFeedChange }) => {
  const { fs } = useWebnative()
  if (!fs || !fs.appPath) return null
  const [images, setImages] = useState({})
  const [delResolving, setDelResolving] = useState<boolean>(false)

  console.log('items', items)

  const feedDir = fs.appPath(wn.path.directory('feed'))

  useEffect(() => {
    // read the file content here
    if (!items) return

    Promise.all(Object.keys(items).map(async key => {
      // return getImageFromItem(fs, item)

      const item = items[key]
      console.log('item', item)
      return item

      // const filePath = wn.path.combine(feedDir, wn.path.file(item.name))
      // const content = JSON.parse(await fs.read(filePath) as string)
      // return content

      // const readFiles = (await Promise.all(
      //   Object.keys(files).map(async key => {
      //     const file = files[key]
      //     if (!file.isFile) return null
      //     const filePath = path.combine(feedDir, path.file(file.name))
      //     const content = JSON.parse(await fs.read(filePath) as string)
      //     return content
      //   })
      // )).filter(Boolean)

      // console.log('read files', readFiles)
      // setFiles(readFiles)

    }))
      .then(contents => {
        
      })
      // .then(imgUrls => {
      //   const map = imgUrls.reduce((acc, imgUrl, i) => {
      //     acc[items[i].id] = imgUrl
      //     return acc
      //   }, {})

      //   setImages(map)
      // })
  }, [items])

  function delItem (item:Item, ev:Event) {
    if (!fs || !fs.appPath) return
    if (!item.image) return

    ev.preventDefault()
    console.log('rm item', item)
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

          {(Object.keys(items || {}) || []).map((key, i) => {
            const item = items[key]
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
                <div className="item-title">{item.name}</div>
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
