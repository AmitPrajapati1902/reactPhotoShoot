const { handleError, buildErrObject } = require('./base')
const { check, validationResult } = require('express-validator/check')

exports.createItem = [
  check('customerid')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('invoiceid')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('products')
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

// exports.updateItem = [
//   check('name')
//     .exists()
//     .withMessage('MISSING')
//     .not()
//     .isEmpty()
//     .withMessage('IS_EMPTY'),
//   check('email')
//     .exists()
//     .withMessage('MISSING')
//     .not()
//     .isEmpty()
//     .withMessage('IS_EMPTY')
//     .normalizeEmail(),
//   check('role')
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

// exports.getItem = [
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
