const fs = require('then-fs')
const SSH = require('node-ssh')
const AWS = require('aws-sdk')
const config = require('./config')

getFile()

async function getFile () {
  console.log('Attempting to connect to SFTP..')
  const sftp = new SSH()
  const connection = await sftp.connect(config.connection)

  if (connection) {
    console.log('Conencted to SFTP! Attempting to download file..')

    sftp.getFile(config.path.local, config.path.remote).then(() => {
      console.log('File downloaded from SFTP!')
      upload()
    })
  }
}

async function upload () {
  console.log('Uploading to S3..')
  AWS.config.update(config.aws)
  const s3 = new AWS.S3()
  const file = await fs.readFile(config.path.local)

  if (file) {
    const body = Buffer.from(file, 'binary')
    const settings = {
      Bucket: config.aws.bucket,
      Key: config.aws.key,
      Body: body,
      ACL: 'public-read'
    }

    s3.putObject(settings, () => {
      console.log('File uploaded to S3!')
      process.exit()
    })
  }
}
