import React, { BaseSyntheticEvent, FunctionComponent, useEffect, useState } from "react"
import Layout from "../components/Layout"
import { useWebnative } from "../context/webnative"
import * as wn from "webnative"
import { path } from "webnative"
// import { FileSystem } from 'webnative'
import { FilePath, Path } from "webnative/path"
import { useHistory } from 'react-router-dom';
import { Feed, SerializedFeed } from "../utils/feed"
import Button from '../components/button'
import TextInput from '../components/text-input'
import { getId } from "../utils/id";
// import { updateFeed } from "../utils/util"
import './Editor.css'

type EditorProps = {
  feed: SerializedFeed,
  onFeedChange: Function,
  index?: number,
  match?: { params: { postId: string } }
}

const Editor: FunctionComponent<EditorProps> = (props) => {
  const { feed, match } = props
  console.log('feed*********', feed)
  const { fs } = useWebnative()
  const params = match ? match.params : null

  if (!feed) return null

  const item = (params && params.postId) ?
    feed.items.find(item => (item.id === params.postId)) :
    null

  const index = item ?
    feed.items.indexOf(item) :
    null

  console.log('index of what you are editing currently', index)

  const [resolving, setResolving] = useState<boolean>(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  useEffect(() => {
    if (!item) return
    const { filename, type } = item.image
    fs.cat(fs.appPath(path.file(filename)))
      .then(content => {
        if (!content) return
        setPreviewImage(URL.createObjectURL(
          new Blob([content as BlobPart], { type: type || 'image/jpeg' })
        ))
      })
  }, [item])

  // var prevImg = null
  // if (item) {
  //   const { filename, type } = item.image
  //   fs.cat(fs.appPath(path.file(filename)))
  //     .then(content => {
  //       if (!content) return
  //       setPreviewImage(URL.createObjectURL(
  //         new Blob([content as BlobPart], { type: type || 'image/jpeg' })
  //       ))

  //       // prevImg = URL.createObjectURL(
  //       //   new Blob([content as BlobPart], { type: type || 'image/jpeg' })
  //       // )
  //     })
  // }

  const history = useHistory();

  interface FeedData {
    title: string
    content: string
  }

  // -----------------------------------------------------------------------

  function getNameFromFile(file: File) {
    const url = URL.createObjectURL(file)
    // blob:http://localhost:3000/83507733-bfb8-42dd-ac10-638e2c28c776
    const slug = url.split("/").pop()
    const ext = file.name.split(".").pop()
    return slug + "." + ext
  }

  const submitter = async (ev: BaseSyntheticEvent) => {
    if (!(fs && fs.appPath)) return
    setResolving(true)
    ev.preventDefault()

    const image: File = ev.target.elements.image.files[0]
    console.log("**image", image)

    const data = ["title", "content"].reduce((acc: any, k) => {
      acc[k] = ev.target.elements[k].value
      return acc
    }, {})

    var imgWrite
    var filename
    if (image) {
      filename = getNameFromFile(image)
      // const { type, size } = image
      const url = URL.createObjectURL(image)
      console.log("*url*", url)
      imgWrite = fs.write(fs.appPath(wn.path.file(filename)), image)
    } else {
      imgWrite = Promise.resolve(null)
    }

    imgWrite.then(async () => {
      // image has been written, now write the log entry
      const newEntry = {
        image: image ?
          {
            filename,
            type: image.type,
            size: image.size
          } :
          item.image,
        status: 'draft',
        content_text: data.content,
        title: data.title
      }

      const msgValue = Object.assign({ id: await getId(newEntry) }, newEntry)
      const newFeed = item ?
        await Feed.update(feed, index, msgValue) :
        await Feed.addItem(feed, msgValue)

      const feedPath = fs.appPath(path.file('feed.json'))
      return fs.write(feedPath as FilePath, Feed.toString(newFeed))
          .then(() => fs.publish())
          .then(update => {
            console.log('updated feed', update)
            history.push('/')
            setResolving(false)
          })
          .catch(err => {
            console.log('errrrrrrrrrr', err)
            setResolving(false)
          })
    })







    // first save the image,
    // then update the feed and save the feed
    // (this is a two step process, not atomic)
    // fs.write(fs.appPath(wn.path.file(filename)), image)
    //   .then(async () => {
    //     console.log('fs wrote image')
    //     // return updateFeed(feed, fs, item, index, data, { filename, type, size })

    //     const tempValue = {
    //       image: { filename, type, size },
    //       status: data.status || 'draft',
    //       content_text: data.content,
    //       title: data.title,
    //     }

    //     const msgValue = Object.assign({ id: await getId(tempValue) }, tempValue)
    //     const newFeed = item ?
    //       await Feed.update(feed, index, msgValue) :
    //       await Feed.addItem(feed, msgValue)

    //     const feedPath = fs.appPath(path.file('feed.json'))
    //     return fs.write(feedPath as FilePath, Feed.toString(newFeed))
    //         .then(() => fs.publish())
    //   })
    //   .then(update => {
    //     console.log('updated feed', update)
    //     history.push('/')
    //     setResolving(false)
    //   })
    //   .catch(err => {
    //     console.log('errrrrrrrrrr', err)
    //     setResolving(false)
    //   })
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
              required={item ? false : true}
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
