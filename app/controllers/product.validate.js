const { handleError, buildErrObject } = require('./base')
const { check, validationResult } = require('express-validator/check')

exports.createItem = [
  check('name')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .trim(),
    check('price')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .trim(),
    check('quantity')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .trim(),
    check('type')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .trim(),
    check('measurement')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .trim(),
    check('description')
    .trim(),
    check('stockNumber')
    .trim(),
    check('expireDate'),
    
  (req, res, next) => {
    try {
      validationResult(req).throw()
      return next()
    } catch (err) {
      return handleError(res, buildErrObject(422, err.array()))
    }
  }
]

// exports.updateItem = [
//   check('name')
//     .exists()
//     .withMessage('MISSING')
//     .not()
//     .isEmpty()
//     .withMessage('IS_EMPTY'),
//   check('id')
//     .exists()
//     .withMessage('MISSING')
//     .not()
//     .isEmpty()
//     .withMessage('IS_EMPTY'),
//   (req, res, next) => {
//     try {
//       validationResult(req).throw()
//       return next()
//     } catch (err) {
//       return handleError(res, buildErrObject(422, err.array()))
//     }
//   }
// ]

exports.getItem = [
  check('id')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  (req, res, next) => {
    try {
      validationResult(req).throw()
      return next()
    } catch (err) {
      return handleError(res, buildErrObject(422, err.array()))
    }
  }
]

exports.deleteItem = [
  check('id')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  (req, res, next) => {
    try {
      validationResult(req).throw()
      return next()
    } catch (err) {
      return handleError(res, buildErrObject(422, err.array()))
    }
  }
]
