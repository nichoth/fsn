import { getId } from './id'
import { FilePath } from "webnative/path"
import { path } from "webnative"
import * as wn from "webnative"

interface FeedData {
    title: string
    content: string
    status?: string
}

export async function updateFeed (feed, fs, item, index, data: FeedData, {
    filename,
    type,
    size
}) {
    if (!fs || !fs.appPath) return

    const tempValue = {
        image: { filename, type, size },
        status: data.status || 'draft',
        content_text: data.content,
        title: data.title,
    }

    const msgValue = Object.assign({ id: await getId(tempValue) }, tempValue)
    item ? feed.update(index, msgValue) : feed.addItem(msgValue)

    const feedPath = fs.appPath(path.file('feed.json'))
    return fs.write(feedPath as FilePath, feed.toString())
        .then(() => fs.publish())

}

export function removeItem (feed, wn, item) {
    feed.removeItem(item)
    var { filename } = item.image
    filename = filename || item.image
    const feedPath = wn.fs.appPath(path.file('feed.json'))

    console.log('removing item', filename, item)

    console.log('wwwwnnnnnnnn', wn)

    return wn.fs.rm(path.file(filename))
        .then(() => {
            return wn.fs.write(feedPath as FilePath, feed.toString())
                .then(() => wn.fs.publish())
        })
}
