# fission powered blog app

[blog-demo.fission.app](https://blog-demo.fission.app/)

A React-based blogging engine powered by [Fission's Webnative SDK](https://github.com/fission-suite/webnative).

This uses [wnfs](https://guide.fission.codes/developers/webnative/file-system-wnfs) to store a JSON file of blog posts, and also saves image blobs to wnfs. `wnfs` is an IPFS node hosted by fission.

* [guide.fission.codes](https://guide.fission.codes/developers/webnative)
* [api reference](https://webnative.fission.app/)

## Development

Fork or clone this repository and then do `npm install`.

### start a dev server
This will start the [vite](https://vitejs.dev/) process.

```
npm start
```

## build
Build a deployable web app
```
npm run build
```

## notes

----------------------------------------------------

https://guide.fission.codes/accounts/account-signup

When you create a Fission Account, it creates a username and email address in the Fission database

> We also create a Fission Web Native File System (WNFS) attached to your account 

That WNFS is where the data of this app is saved

