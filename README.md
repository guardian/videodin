# [Odin](https://en.wikipedia.org/wiki/Odin)
Consulting the [knowledgeable head](https://en.wikipedia.org/wiki/M%C3%ADmir).
 
## Setup
You will need to create some config files with some help of your local friendly developer:

* `config/aws.js`
  
  ```JavaScript
  exports.s3dataBucket = '...';
  exports.profile = '...';
  ```
* `config/presto.js`
  
  ```JavaScript
  exports.connection = {catalog: '...', schema: '...', host: '...', port: '...'};
  ```
    
You can then fill your `./sql` folder up with queries that will then fill up your S3 bucket with information.

The data format is:
```JSON
[
  {
    "col1Name": "row1 col1 data",
    "col2Name": "row1 col2 data",
    "col3Name": "row1 col3 data",
    "col4Name": "row1 col4 data"
  },
  {
    "col1Name": "row2 col1 data",
    "col2Name": "row2 col2 data",
    "col3Name": "row2 col3 data",
    "col4Name": "row2 col4 data"
  }
]
```

# TODO
* Lambdaify
