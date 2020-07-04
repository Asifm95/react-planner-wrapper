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

5. If the library has been placed in a different directroy, make sure to update the --publicPath in the build sript in package.json

### Update

+ The planner function in `AsbestosMangment.php` Controller

```PHP
        function planner(Request $request, Response $response, $args)
        {
            $report = Asbestos::find(["_id"=>$args["guid"]]);
            $this->view->render($response, 'planner',['report'=>$report,
            'floor'=>$args["floor"],'section'=>$args['section'], 
            'guid' => $args["guid"]]);
        }
```

+ The `<script>` tag inside the  `planner.blade.php`
```HTML
<script>
    window.asbestosReport = {
        report : {!! json_encode($report) !!},
        guid: {!! json_encode($guid) !!},
        floor : {!! json_encode($floor) !!},
        section : {!! json_encode($section) !!},
    };
</script>
```