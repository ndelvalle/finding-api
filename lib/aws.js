const knox = require('knox')

class AWS {
  constructor (config) {
    this.config = config
    this.client = knox.createClient({
      key: this.config.aws.accessKeyId,
      secret: this.config.aws.secretAccessKey,
      bucket: this.config.aws.bucket
    })
  }

  upload (file, path, cb = () => {}) {
    if (!file) { return cb(null) }

    const buffer = Buffer.from(file.split(',')[1], 'base64')
    const headers = { 'Content-Type': 'image/png', 'x-amz-acl': 'public-read' }

    this.client.putBuffer(buffer, path, headers, (err) => {
      if (err) { return cb(err) }

      cb(null, `https://${this.config.aws.bucket}.s3.amazonaws.com/${path}`)
    })
  }

  remove (id, photos, cb = () => {}) {
    const paths = photos.map(photo => `/photos/${id}/${photo.name}.png`)

    this.client.deleteMultiple(paths, (err, res) => {
      if (err) { return cb(err) }
      cb(null, res)
    })
  }
}

module.exports = AWS
