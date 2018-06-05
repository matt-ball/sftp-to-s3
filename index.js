const fs = require('then-fs')
const SSH = require('node-ssh')
const AWS = require('aws-sdk')
const config = require('./config')
const localDest = process.argv[2] || config.path.local
const remoteSource = process.argv[3] || config.path.remote
const s3Key = process.argv[4] || config.aws.key

getFile()

async function getFile () {
  console.log('Attempting to connect to SFTP..')
  const sftp = new SSH()
  const connection = await sftp.connect(config.connection)

  if (connection) {
    console.log('Conencted to SFTP! Attempting to download file..')

    sftp.getFile(localDest, remoteSource).then(() => {
      console.log('File downloaded from SFTP!')
      upload()
    })
  }
}

async function upload () {
  console.log('Uploading to S3..')
  AWS.config.update(config.aws)
  const s3 = new AWS.S3()
  const file = await fs.readFile(localDest)

  if (file) {
    const body = Buffer.from(file, 'binary')
    const settings = {
      Bucket: config.aws.bucket,
      Key: s3Key,
      Body: body,
      ACL: 'public-read'
    }

    s3.putObject(settings, () => {
      console.log('File uploaded to S3!')
      process.exit()
    })
  }
}
