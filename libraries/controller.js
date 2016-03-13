'use strict';

class Controller {

  constructor(model) {
    this.model = model;
  }

  find(req, res, next) {
    this.model.find()
    .then(function(collection) {
      res.status(200).json(collection);
    })
    .catch(function(err) {
      return next(err);
    });
  }

  findOne(req, res, next) {
    this.model.findOne()
    .then(function(doc) {
      res.status(200).json(doc);
    })
    .catch(function(err) {
      return next(err);
    });
  }

  findById(req, res, next) {
    var id = req.params.id;

    this.model.findById(id)
    .then(function(doc) {
      if (!doc) {
        return next(404);
      }

      res.status(200).json(doc);
    })
    .catch(function(err) {
      return next(err);
    });
  }

  create(req, res, next) {
    var self = this;

    this.model.create(req.body)
    .then(function(doc) {

      res.status(201).json(doc);
    })
    .catch(function(err) {
      return next(err);
    });
  }

  update(req, res, next) {
    var id = req.params.id;
    var input = req.body;

    this.model.update(id, input)
    .then(function(doc) {
      if (!doc) {
        return next(404);
      }

      res.status(200).json(doc);
    })
    .catch(function(err) {
      return next(err);
    });
  }

  remove(req, res, next) {
    var id = req.params.id;

    this.model.remove(id)
    .then(function(doc) {
      if (!doc) {
        return next(404);
      }

      res.sendStatus(204);
    })
    .catch(function(err) {
      return next(err);
    });
  }
}

module.exports = Controller;
