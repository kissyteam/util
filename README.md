# util

a middleware to instrument javascript files using node-jscover

## example

``` javascript
var app = require('express');
app.use('/', require('node-jscover-handler')({
    paths:{
        '/lib/':'/code/lib'
    }
}));
```

navigate to http://localhost/lib/x-coverage.js will output instrumented file content from /code/lib/x.js
