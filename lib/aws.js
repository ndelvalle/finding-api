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

  upload(file, awsPath, name, cb = () => {}) {
    const path    = `/photos/${awsPath}/${name || 0}.png`;
    const buffer  = Buffer.from(file.split(',')[1], 'base64');
    const headers = { 'Content-Type': 'image/png', 'x-amz-acl': 'public-read' };

    this.client.putBuffer(buffer, path, headers, (err) => {
      if (err) { return cb(err); }
      const filepath = `https://${this.config.AWS.bucket}.s3.amazonaws.com/${this.config.AWS.bucket}/${path}`;
      cb(null, filepath);
    });
  }
}

module.exports = AWS;
