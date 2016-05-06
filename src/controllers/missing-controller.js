import Controller from '../libraries/controller';
import MissingModel from '../models/missing-model';

class MissingController extends Controller {
  stats(req, res, next) {
    this.model.stats()
    .then(stats => res.status(200).json(stats))
    .catch(err => next(err));
  }
}

export default new MissingController(MissingModel);
