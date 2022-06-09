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

interface SerializedFeed {
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

export class Feed {
  version = "https://jsonfeed.org/version/1.1"
  title?: string
  home_page_url?: string
  feed_url?: string
  description?: string
  user_comment?: string
  next_url?: string
  icon?: string
  favicon?: string
  authors: Author[] = []
  language?: string
  expired?: boolean
  items: Item[] = []

  constructor(feed: SerializedFeed) {
    Object.assign(this, feed)
  }

  public addItem = (item: Item) => {
    this.items.push(item)
  }
  
  // mutate the given index
  public update = (i: number, newData: Partial<Item>) => {
    const data = Object.assign(this.items[i], newData)
    getId(data).then(id => {
      const _data = Object.assign(data, { id })
      this.items[i] = _data
    })
  }

  public toString = (): string => {
    return JSON.stringify(this)
  }

  static fromString = (str: string): Feed => {
    const feed = JSON.parse(str)
    return new Feed(feed)
  }
}
