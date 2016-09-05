const knox  = require('knox');

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
    if (!file) { return; }

    const name    = this._generateUniqueName(fileName);
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

  _generateUniqueName(name) {
    const pad = (str, len) => '0'.repeat(len - str.length) + str.slice(0, len);

    const date  = new Date();
    const year  = pad(date.getFullYear().toString(), 4);
    const month = pad((date.getMonth() + 1).toString(), 2);
    const day   = pad((date.getDate()).toString(), 2);
    const rand  = pad(Math.floor(Math.random() * 1000).toString(), 4);

    return `${name}-${year}${month}${day}${rand}`;
  }
}

module.exports = AWS;
