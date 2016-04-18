import knox from 'knox';
import Promise from 'bluebird';
import config from '../config/config';

export default class ImageUploader {

  constructor() {
    this.client = knox.createClient({
      key: config.AWS.ACCESS_KEY_ID,
      secret: config.AWS.SECRET_ACCESS_KEY,
      bucket: config.AWS.BUCKET,
    });
  }

  multipleUpload(files, missingId) {
    const uploadQueue = files.map((file, index) => this.upload(file, missingId, index));
    return Promise.all(uploadQueue);
  }

  upload(file, missingId, fileName) {
    const path = `/photos/${missingId}/${fileName || 0}.png`;
    const buffer = new Buffer(file.split(',')[1], 'base64');
    const headers = {
      'Content-Type': 'image/png',
      'x-amz-acl': 'public-read',
    };

    return new Promise((resolve, reject) => {
      this.client.putBuffer(buffer, path, headers, (err) => {
        if (err) return reject(err);
        return resolve(`https://${config.AWS.BUCKET}.s3.amazonaws.com/${config.AWS.BUCKET}/${path}`);
      });
    });
  }
}
