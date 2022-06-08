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

            return (<li key={i} className="table-row bg-white">
              <div className="table-cell img-cell">
                {item.image ?
                  <img src={images[i]} /> :
                  null
                }
              </div>
              <div>{item.title}</div>
              <div>{item.status || <em>none</em>}</div>
              <div>{item.date_published || <em>n/a</em>}</div>
            </li>)
          })}
        </ol>
      </section>
    </Layout>
  )
}

export default Posts









        // <table className="post-list">
        //   <tr>
        //       <th scope="col">Image</th>
        //       <th scope="col">Title</th>
        //       <th scope="col">Status</th>
        //       <th scope="col">Last Update</th>
        //   </tr>

        //   {feed?.items.map((item, i) => {
        //     return (<tr key={i}>
        //       {item.image ?
        //         (<td className="img-cell">
        //           <img src={images[i]} />
        //         </td>) :
        //         null
        //       }
        //       <td>{item.title}</td>
        //       <td>Draft</td>
        //       <td>{item.date_published || 'date here'}</td>
        //     </tr>
        //   )
        //   })}
        // </table>



