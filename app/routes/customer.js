const controller = require('../controllers/customer')
const validate = require('../controllers/customer.validate')
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

router.get(
  '/all',
  requireAuth,
  AuthController.roleAuthorization(['user', 'admin']),
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
// router.get(
//   '/:id',
//   requireAuth,
//   AuthController.roleAuthorization(['user', 'admin']),
//   trimRequest.all,
//   validate.getItem,
//   controller.getItem
// )
// router.patch(
//   '/:id',
//   requireAuth,
//   AuthController.roleAuthorization(['admin']),
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
