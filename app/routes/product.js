const controller = require('../controllers/product')
const validate = require('../controllers/product.validate')
const AuthController = require('../controllers/auth')
const express = require('express')
const router = express.Router()
require('../../config/passport')
const passport = require('passport')
const requireAuth = passport.authenticate('jwt', {
  session: false
})
const trimRequest = require('trim-request')

/*
 ROUTES
*/

router.get('/all', controller.getAllItems)
router.get(
  '/',
  requireAuth,
  AuthController.roleAuthorization(['admin', 'user']),
  trimRequest.all,
  controller.getItems
)
router.post(
  '/create',
  requireAuth,
  AuthController.roleAuthorization(['user']),
  trimRequest.all,
  validate.createItem,
  controller.createItem
)
router.get(
  '/:id',
  requireAuth,
  AuthController.roleAuthorization(['admin', 'user']),
  trimRequest.all,
  validate.getItem,
  controller.getItem
)
// router.patch(
//   '/:id',
//   requireAuth,
//   AuthController.roleAuthorization(['admin', 'user']),
//   trimRequest.all,
//   validate.updateItem,
//   controller.updateItem
// )
router.delete(
  '/:id',
  requireAuth,
  AuthController.roleAuthorization(['user']),
  trimRequest.all,
  validate.deleteItem,
  controller.deleteItem
)

module.exports = router
