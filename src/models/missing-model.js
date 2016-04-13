import Model from '../libraries/model';
import Missing from '../schemas/missing-schema';
import queryModifier from 'get-query-modifier';
import { missing as queryGenerator } from '../helper/query-generator';

class MissingModel extends Model {
  find(query) {
    const modifier = queryModifier((query));
    return modifier(this.SchemaModel.find(queryGenerator(query)).lean())
      .execAsync();
  }
}

export default new MissingModel(Missing);
