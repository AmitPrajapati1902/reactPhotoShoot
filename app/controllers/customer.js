const model = require('../models/customer')
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
  // emailExistsExcludingMyself,
  // customerExists,
  // sendRegistrationEmailMessage
} = require('./base')


/*********************
 * Private functions *
 *********************/

const customerExists = async name => {
  return new Promise((resolve, reject) => {
    model.findOne(
      {
        name
      },
      (err, item) => {
        if (err) {
          reject(buildErrObject(422, err.message))
        }
        if (item) {
          reject(buildErrObject(422, 'NAME_ALREADY_EXISTS'))
        }
        resolve(false)
      }
    )
  })
}

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
    const customer = new model({
      name: req.name,
      city: req.city,
      phone: req.phone,
      userid: userid,
      isCompany: req.isCompany
    })
    customer.save((err, item) => {
      if (err) {
        reject(buildErrObject(422, err.message))
      }
      item = item.toObject()
      delete item.updatedAt
      delete item.createdAt
      resolve(item)
    })
  })
}

const deleteItemFromDB = async (id, userid) => {
  return new Promise((resolve, reject) => {

    model.findOne(
      {_id : id }, 
      (err, item) => {
      if (err) {
        reject(buildErrObject(422, err.message))
      }
      if (!item) {
        reject(buildErrObject(404, 'NOT_FOUND'))
      }
      
      if (item.userid === userid) {
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
        reject(buildErrObject(400, 'CUSTOMER_NOT_FOUND_IN_YOUR_ACCESS'))
      }

    })
  })
}

/********************
 * Public functions *
 ********************/

exports.getItems = async (req, res) => {
  try {
    // console.log(req.user)
    res.status(200).json(await getItemsFromDB(req, req.user.role === 'admin' ? {} : { userid: req.user._id }))
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
    const userid = req.user._id
    req = matchedData(req)
    const doesNameExists = await customerExists(req.name)
    if (!doesNameExists) {
      const item = await createItemInDB(req, userid)
      res.status(201).json(item)
    }
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

exports.customerExistsForID = async customerid => {
  return new Promise((resolve, reject) => {
    model.findOne(
      {
        _id: customerid
      },
      (err, item) => {
        if (err) {
          reject(buildErrObject(422, err.message))
        }
        if (item) {
          resolve(item)
        }
        reject(buildErrObject(400, 'CUSTOMER_NOT_FOUND_IN_YOUR_ACCESS'))
      }
    )
  })
}