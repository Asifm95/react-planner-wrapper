## react-planner-wrapper

### Folder structure

```
+-- dist
|   +-- catalog
|   +-- bundle.js           // react-planner-wrapper component
|   +-- [hash].css
+-- node_modules
+-- src
|   +-- catalog            // catalog style generator
|   +-- App.jsx
    +-- index.html.ejs    // HTML template for dev server
|   +-- index.js
+-- .babelrc
+-- webpack.config.js     // builder configuration
+-- package.json

```

### Instructions

1. Copy the react-planner-wrapper to your libraries folder. Eg: Public/iProtectU/ _put_folder_here_

2. `cd` into the react-planner-wrapper and run `npm install`

3. To run and modify library locally run `npm start`

4. To generate a production build run `npm run build-prod` . The build will be generated inside dist folder
