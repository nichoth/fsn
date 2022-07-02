import { getId } from './id'

/**
 *  Class to implment the JSON Feed format.
 *
 * @see https://jsonfeed.org/version/1.1
 */
export interface Item {
  id: string
  url?: string
  external_url?: string
  title?: string
  status?: string
  content_html?: string
  content_text?: string
  summary?: string
  image?: {
    filename: string,
    type: string,
    size: number
  }
  banner_image?: string
  date_published?: string
  date_modified?: string
  language?: string
}

interface Author {
  name?: string
  url?: string
  avatar?: string
}

export interface SerializedFeed {
  version?: string
  title?: string
  home_page_url?: string
  feed_url?: string
  description?: string
  user_comment?: string
  next_url?: string
  icon?: string
  favicon?: string
  authors: Author[]
  language?: string
  expired?: boolean
  items: Item[]
}


export function Post (opts) : Item {
  return opts
}


export function Feed (opts): SerializedFeed {
  return Object.assign({}, {
    items: [],
    authors: [],
    version: "https://jsonfeed.org/version/1.1"
  }, opts)
}

Feed.fromString = (str:string): SerializedFeed => {
  return Feed(JSON.parse(str))
}

Feed.toString = (feed:SerializedFeed): string => {
  return JSON.stringify(feed)
}

Feed.addItem = (feed:SerializedFeed, item:Item): Promise<SerializedFeed> => {
  feed.items.push(item)
  return Promise.resolve(Object.assign({}, feed))
}

Feed.update = (feed:SerializedFeed, i: number, newData: Partial<Item>): Promise<SerializedFeed> => {
    const data = Object.assign(feed.items[i], newData)
    return getId(data).then(id => {
      const _data = Object.assign(data, { id })
      feed.items[i] = _data
      return feed
    })
}

Feed.removeItem = (feed, item) => {
  console.log('feed.items', feed.items)
  const index = feed.items.findIndex(_item => _item.id === item.id)
  console.log('item, index', item, index)
  const arr = feed.items
  arr.splice(index, 1)
  return Object.assign({}, feed, { items: arr })
}
