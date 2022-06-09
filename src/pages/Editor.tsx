import React, { BaseSyntheticEvent, FunctionComponent, useState } from "react"
import Layout from "../components/Layout"
import { useWebnative } from "../context/webnative"
import * as wn from "webnative"
import { FilePath } from "webnative/path"
import { Feed } from "../utils/feed"
import Button from '../components/button'
import TextInput from '../components/text-input'
import { getId } from '../utils/id'
import { useHistory } from 'react-router-dom';
import './Editor.css'

type EditorProps = {
  feed: Feed,
  index?: number,
  match?: { params: { postId: string } }
}

const Editor: FunctionComponent<EditorProps> = (props) => {
  const { feed, match } = props
  console.log('feed*********', feed)
  const { fs } = useWebnative()
  const { params } = match

  const item = (params && params.postId) ?
    feed.items.find(item => (item.id === params.postId)) :
    null

  const index = (params && params.postId) ?
    feed.items.indexOf(item) :
    null

  console.log('index', index)

  const [resolving, setResolving] = useState<boolean>(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const history = useHistory();

  interface FeedData {
    title: string
    content: string
  }

  async function updateFeed (data: FeedData, { filename, type, size }) {
    if (!fs || !fs.appPath) return

    const tempValue = {
      image: { filename, type, size },
      status: 'draft',
      content_text: data.content,
      title: data.title,
    }

    const msgValue = Object.assign({ id: await getId(tempValue) }, tempValue)
    item ? feed.update(index, msgValue) : feed.addItem(msgValue)

    const feedPath = fs.appPath(wn.path.file('feed.json'))
    return fs.write(feedPath as FilePath, feed.toString())
      .then(() => fs.publish())
  }

  // -----------------------------------------------------------------------

  function getNameFromFile(file: File) {
    const url = URL.createObjectURL(file)
    // blob:http://localhost:3000/83507733-bfb8-42dd-ac10-638e2c28c776
    const slug = url.split("/").pop()
    const ext = file.name.split(".").pop()
    return slug + "." + ext
  }

  const submitter = (ev: BaseSyntheticEvent) => {
    if (!(fs && fs.appPath)) return
    setResolving(true)
    ev.preventDefault()

    const image: File = ev.target.elements.image.files[0]
    console.log("**image", image)

    const data = ["title", "content"].reduce((acc: any, k) => {
      acc[k] = ev.target.elements[k].value
      return acc
    }, {})

    const filename = getNameFromFile(image)
    const { type, size } = image
    const url = URL.createObjectURL(image)
    console.log("*url*", url)

    // first save the image,
    // then update the feed and save the feed
    // (this is a two step process, not atomic)
    fs.write(fs.appPath(wn.path.file(filename)), image)
      .then(() => {
        console.log('fs wrote image')
        return updateFeed(data, { filename, type, size })
      })
      .then(update => {
        console.log('updated feed', update)
        history.push('/')
        setResolving(false)
      })
      .catch(err => {
        console.log('errrrrrrrrrr', err)
        setResolving(false)
      })
  }

  function changer (ev: BaseSyntheticEvent) {
    const image: File = ev.target.files[0]
    console.log("*img*", image)
    const url = URL.createObjectURL(image)
    console.log("*url*", url)
    setPreviewImage(url)
  }

  // -----------------------------------------------------------------------

  return (
    <Layout className="editor">
      <header>
        <h2>{item ? 'Edit post' : 'New Post'}</h2>
      </header>

      <section className="editor">
        <form onSubmit={submitter}>
          {previewImage ? (
            <div className="preview-image">
              <img src={previewImage} />
            </div>
          ) : null}

          <label>
            {'Image '}
            <input
              type="file"
              required={true}
              onChange={changer}
              className="file-input"
              name={"image"}
            />
          </label>

          <TextInput name="title" displayName="title" required={true}
              defaultValue={item ? item.title : null}
          />

          <label className="body-input">
            Body
            <textarea
              defaultValue={item ? item.content_text : null}
              required={true}
              name={"content"}
            ></textarea>
          </label>

          <div>
            <Button type="submit" isSpinning={resolving}>Save</Button>
          </div>
        </form>
      </section>
    </Layout>
  )
}

export default Editor
