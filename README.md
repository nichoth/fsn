# password and form demo

[![Netlify Status](https://api.netlify.com/api/v1/badges/82455868-eb09-47e6-b705-a3c26c44ef6f/deploy-status)](https://app.netlify.com/sites/password-demo/deploys)

This is using [vite](https://vitejs.dev/) as a development tool. Vite compiles the react `jsx` code into valid Javascript, and runs a local development server.

It also compiles the various css files into a deployable css file.

## see a live version

Visit [password-demo.netlify.app](https://password-demo.netlify.app/)


## build
```
% npm run build
```

This will create a directory `/dist` and write files to it that are a deployable website.

## develop
```
% npm start
```

This will start a local server that automatically compiles the code and serves it.

## test
```
% npm test
```
Run tests for the password validation logic in node.js.

## test with cypress
```
% npm run cypress-test
```

This will run the `vite` local server and open cypress. This is where we can do end-to-end tests, so testing things like the DOM elements, etc, not just the logic, which is what the `npm test` script is for.

## deploy
This is visible on [netlify](https://password-demo.netlify.app/). Any push to the `main` branch on github will deploy a new version.


## lifecycle hooks
We are using `preversion` and `postversion` hooks via `npm`.

```
    "preversion": "npm test",
    "postversion": "git push && git push --tags",
```
