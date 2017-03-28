const knox   = require('knox');
const uuidV4 = require('uuid/v4');

class AWS {

  constructor(config) {
    this.config = config;
    this.client = knox.createClient({
      key   : this.config.aws.accessKeyId,
      secret: this.config.aws.secretAccessKey,
      bucket: this.config.aws.bucket
    });
  }

  upload(file, awsPath, cb = () => {}) {
    if (!file) { return cb(null); }

    const name    = `${uuidV4()}`;
    const path    = `/photos/${awsPath}/${name}.png`;
    const buffer  = Buffer.from(file.split(',')[1], 'base64');
    const headers = { 'Content-Type': 'image/png', 'x-amz-acl': 'public-read' };

    this.client.putBuffer(buffer, path, headers, (err) => {
      if (err) { return cb(err); }

      const filepath = `https://s3.amazonaws.com/${this.config.aws.bucket}${path}`;
      cb(null, { url: filepath, name });
    });
  }

  remove(id, photos, cb = () => {}) {
    const awsPaths = photos.map(photo => `/photos/${id}/${photo.name}.png`);
    this.client.deleteMultiple(awsPaths, (err, res) => {
      if (err) { return cb(err); }
      cb(null, res);
    });
  }
}

module.exports = AWS;
