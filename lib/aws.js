const knox   = require('knox');
const uuidV4 = require('uuid/v4');

class AWS {

  constructor(config) {
    this.config = config;
    this.client = knox.createClient({
      key   : this.config.AWS.accessKeyId,
      secret: this.config.AWS.secretAccessKey,
      bucket: this.config.AWS.bucket
    });
  }

  upload(file, awsPath, fileName, cb = () => {}) {
    if (!file) { return cb(null); }

    const name    = `fileName-${uuidV4()}`;
    const path    = `/photos/${awsPath}/${name}.png`;
    const buffer  = Buffer.from(file.split(',')[1], 'base64');
    const headers = { 'Content-Type': 'image/png', 'x-amz-acl': 'public-read' };

    this.client.putBuffer(buffer, path, headers, (err) => {
      if (err) { return cb(err); }

      const filepath = `https://s3.amazonaws.com/${this.config.AWS.bucket}${path}`;
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
