# SFTP to S3

## Overview

Use to take a single file from an SFTP server and upload to an S3 bucket.

## Setup

1. `npm install`

2. Copy `config.sample.js` to `config.js`. Populate accordingly. See dummy details as an example:

```js
module.exports = {
  connection: {
    host: 'matt-ball.uk',
    username: 'matt-ball',
    port: 22,
    password: 'password'
  },
  path: {
    local: '/Users/mattball/Documents/file.js', // where to save file from SFTP server
    remote: '/var/www/website/file.js' // location of file on SFTP server
  },
  aws: {
    bucket: 'matt-ball',
    key: 'my-directory/file.js',
    accessKeyId: 'your aws access key',
    secretAccessKey: 'your aws secret'
  }
}
```

3. Run - `node index.js`
