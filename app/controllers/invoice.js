const model = require('../models/invoice')
const product = require('../models/product')
const customer = require('../models/customer')
const uuid = require('uuid')
const { matchedData } = require('express-validator/filter')
const {
  isIDGood,
  buildSuccObject,
  buildErrObject,
  handleError,
  listInitOptions,
  cleanPaginationID,
  checkQueryString,
  emailExistsExcludingMyself
  // customerExists,
  // sendRegistrationEmailMessage
} = require('./base')

const {
  verifyCustomer
} = require('./auth')

const {
  customerExistsForID
} = require('./customer')

/*********************
 * Private functions *
 *********************/

// const customerExists = async name => {
//   return new Promise((resolve, reject) => {
//     model.findOne(
//       {
//         name
//       },
//       (err, item) => {
//         if (err) {
//           reject(buildErrObject(422, err.message))
//         }
//         if (item) {
//           reject(buildErrObject(422, 'NAME_ALREADY_EXISTS'))
//         }
//         resolve(false)
//       }
//     )
//   })
// }

const getItemsFromDB = async (req, query) => {
  const options = await listInitOptions(req)
  return new Promise((resolve, reject) => {
    model.paginate(query, options, (err, items) => {
      if (err) {
        reject(buildErrObject(422, err.message))
      }
      resolve(cleanPaginationID(items))
    })
  })
}

// const updateItemInDB = async (id, req) => {
//   return new Promise((resolve, reject) => {
//     model.findByIdAndUpdate(
//       id,
//       req,
//       {
//         new: true,
//         runValidators: true
//       },
//       (err, item) => {
//         if (err) {
//           reject(buildErrObject(422, err.message))
//         }
//         if (!item) {
//           reject(buildErrObject(404, 'NOT_FOUND'))
//         }
//         resolve(item)
//       }
//     )
//   })
// }

// const getItemFromDB = async id => {
//   return new Promise((resolve, reject) => {
//     model.findById(id, (err, item) => {
//       if (err) {
//         reject(buildErrObject(422, err.message))
//       }
//       if (!item) {
//         reject(buildErrObject(404, 'NOT_FOUND'))
//       }
//       resolve(item)
//     })
//   })
// }

const createItemInDB = async (req, userid) => {
  return new Promise((resolve, reject) => {
    const invoice = new model({
      customerid: req.customerid,
      invoiceid: req.invoiceid,
      products: req.products,
      userid: userid
    })
    invoice.save((err, item) => {
      if (err) {
        reject(buildErrObject(422, err.message))
      }
      item = item.toObject()
      delete item.updatedAt
      delete item.createdAt
      // update in customer 

      customer.findOneAndUpdate(
        { _id: item.customerid },
        { $inc: { "balance": 100 } },
        { strict: false },
        (err, item) => {
          console.log(err)
        })

      // resolved 
      resolve(item)
    })
  })
}

// const deleteItemFromDB = async id => {
//   return new Promise((resolve, reject) => {
//     model.findByIdAndRemove(id, (err, item) => {
//       if (err) {
//         reject(buildErrObject(422, err.message))
//       }
//       if (!item) {
//         reject(buildErrObject(404, 'NOT_FOUND'))
//       }
//       resolve(buildSuccObject('DELETED'))
//     })
//   })
// }

const deleteItemFromDB = async (id, userid) => {
  console.log("useri:d1 " + userid)
  return new Promise((resolve, reject) => {
    model.findOne(
      { _id: id },
      (err, item) => {
        if (err) {
          reject(buildErrObject(422, err.message))
        }
        if (!item) {
          reject(buildErrObject(404, 'NOT_FOUND'))
        }
        /// 

        customer.findOne(
          { _id: item.customerid },
          (err, customerFound) => {
            if (err) {
              reject(buildErrObject(422, err.message))
            }
            if (!customerFound) {
              reject(buildErrObject(404, 'INVOICE_NOT_FOUND_IN_YOUR_ACCESS'))
            }

            if (customerFound.userid === userid) {
              model.findByIdAndRemove(id, (err, item) => {
                if (err) {
                  reject(buildErrObject(422, err.message))
                }
                if (!item) {
                  reject(buildErrObject(404, 'NOT_FOUND'))
                }
                resolve(buildSuccObject('DELETED'))
              })
            } else {
              reject(buildErrObject(400, 'INVOICE_NOT_FOUND_IN_YOUR_ACCESS'))
            }

          })
      })
  })
}

const invoiceValidation = req => {

  const products = req.products
  console.log(products.length)
  console.log(products)
  if (products.length > 0) {
    product.find({
      _id: {
        $in: [products]
      }
    }, (err, items) => {
      if (err) {
        console.log(err)
        return false
      } else {
        console.log(items)
        return true
      }
    });
  } else {
    console.log("as")
    return false
  }
}

/********************
 * Public functions *
 ********************/

exports.getItems = async (req, res) => {
  try {
    var query = {}
    if (req.user.role !== 'admin') {
      const customer = await customerExistsForID(req.query.customerid)
      if (customer) {
        if (customer.userid == req.user.id) {
          query = { customerid: req.query.customerid }
        } else {
          res.status(201).json(buildErrObject(400, 'CUSTOMER_NOT_FOUND_IN_YOUR_ACCESS'))
          return
        }
      }
    }
    res.status(200).json(await getItemsFromDB(req, query))
  } catch (error) {
    handleError(res, error)
  }
}

// exports.getItem = async (req, res) => {
//   try {
//     req = matchedData(req)
//     const id = await isIDGood(req.id)
//     res.status(200).json(await getItemFromDB(id))
//   } catch (error) {
//     handleError(res, error)
//   }
// }

// exports.updateItem = async (req, res) => {
//   try {
//     req = matchedData(req)
//     const id = await isIDGood(req.id)
//     const doesEmailExists = await emailExistsExcludingMyself(id, req.email)
//     if (!doesEmailExists) {
//       res.status(200).json(await updateItemInDB(id, req))
//     }
//   } catch (error) {
//     handleError(res, error)
//   }
// }

exports.createItem = async (req, res) => {
  try {
    const userid = await isIDGood(req.user._id)
    req = matchedData(req)
    const customer = await verifyCustomer(req, userid, res)
    if (!customer) {
      return res.status(201).json(customer)
    }
    const validate = await invoiceValidation(req)
    if (validate == true) {
      res.status(200).json(buildErrObject(400, 'PAID_AMOUNT_IS_GRETTER_THEN_BASE_AMOUNT'))
      return
    }
    const item = await createItemInDB(req, userid)
    res.status(201).json(item)
  } catch (error) {
    handleError(res, error)
  }
}

exports.deleteItem = async (req, res) => {
  try {
    const userid = req.user.id
    req = matchedData(req)
    const id = await isIDGood(req.id)
    res.status(200).json(await deleteItemFromDB(id, userid))
  } catch (error) {
    handleError(res, error)
  }
}

