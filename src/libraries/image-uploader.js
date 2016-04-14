import fs from 'fs';
import AWS from 'aws-sdk';
import Promise from 'bluebird';
import config from '../config/config';

export class ImageUploader {

  constructor() {
    AWS.config.update({
      accessKeyId: config.AWS.ACCESS_KEY_ID,
      secretAccessKey: config.AWS.SECRET_ACCESS_KEY,
      region: config.AWS.REGION,
    });
    this.s3 = new AWS.S3({
      params: { Bucket: config.AWS.BUCKET },
    });
  }

  upload(file) {
    const params = {
      Key: file.name,
      Body: '',
      ContentType: file.mimetype,
      ACL: 'public-read',
    };

    return new Promise((resolve, reject) => {
      fs.readFile(file.path, (err, data) => {
        if (err) return reject(err);
        params.Body = data;
        return resolve(params);
      });
    })
    .then(bucketParams => {
      return new Promise((resolve, reject) => {
        this.s3.putObject(bucketParams, (err, data) => {
          if (err) return reject(err);
          return resolve(data);
        });
      });
    });
  }
}
