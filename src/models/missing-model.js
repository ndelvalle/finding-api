import { map } from 'lodash';
import Model from '../libraries/model';
import Missing from '../schemas/missing-schema';
import { missing as queryGenerator } from '../helper/query-helper';
import ImageUploader from '../libraries/image-uploader';

class MissingModel extends Model {
  find(query) {
    const q = queryGenerator(query);
    return Missing.aggregate(q)
    .execAsync()
    .then((docs) => map(docs, (doc) => {
      const mappedDoc = doc;
      mappedDoc.distance = doc.distance.toFixed(1);
      return doc;
    }));
  }

  create(input) {
    const newSchemaModel = new this.SchemaModel(input);
    let missingRef = null;
    return newSchemaModel.saveAsync()
    .then(missing => {
      missingRef = missing;
      const iu = new ImageUploader();
      return input.photos ? iu.multipleUpload(input.photos, missing._id) : Promise.resolve(missing);
    })
    .then(response => {
      if (response._id) return response;
      const photos = response.map(item => {
        const photo = { url: item };
        return photo;
      });
      return this.update(missingRef._id, { photos });
    });
  }
}

export default new MissingModel(Missing);
