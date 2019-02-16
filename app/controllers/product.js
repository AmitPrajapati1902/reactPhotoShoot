const model = require('../models/product')
const { matchedData } = require('express-validator/filter')
const {
  isIDGood,
  buildSuccObject,
  buildErrObject,
  handleError,
  listInitOptions,
  cleanPaginationID,
  checkQueryString
} = require('./base')

/*********************
 * Private functions *
 *********************/

const cityExistsExcludingItself = async (id, name) => {
  return new Promise((resolve, reject) => {
    model.findOne(
      {
        name,
        _id: {
          $ne: id
        }
      },
      (err, item) => {
        if (err) {
          reject(buildErrObject(422, err.message))
        }
        if (item) {
          reject(buildErrObject(422, 'CITY_ALREADY_EXISTS'))
        }
        resolve(false)
      }
    )
  })
}

const productExists = async name => {
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
          reject(buildErrObject(422, 'PRODUCT_ALREADY_EXISTS'))
        }
        resolve(false)
      }
    )
  })
}

const getAllItemsFromDB = async () => {
  return new Promise((resolve, reject) => {
    model.find(
      {},
      '-updatedAt -createdAt',
      {
        sort: {
          name: 1
        }
      },
      (err, items) => {
        if (err) {
          reject(buildErrObject(422, err.message))
        }
        resolve(items)
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

const getItemFromDB = async id => {
  return new Promise((resolve, reject) => {
    model.findById(id, (err, item) => {
      if (err) {
        reject(buildErrObject(422, err.message))
      }
      if (!item) {
        reject(buildErrObject(404, 'NOT_FOUND'))
      }
      resolve(item)
    })
  })
}

const updateItemInDB = async (id, req) => {
  return new Promise((resolve, reject) => {
    model.findByIdAndUpdate(
      id,
      req,
      {
        new: true
      },
      (err, item) => {
        if (err) {
          reject(buildErrObject(422, err.message))
        }
        if (!item) {
          reject(buildErrObject(404, 'NOT_FOUND'))
        }
        resolve(item)
      }
    )
  })
}

const createItemInDB1 = async req => {
  return new Promise((resolve, reject) => {
    model.create(req, (err, item) => {
      if (err) {
        reject(buildErrObject(422, err.message))
      }
      resolve(item)
    })
  })
}

const createItemInDB = async req => {
  console.log(req)
  return new Promise((resolve, reject) => {
    const product = new model({
      name: req.name,
      description: req.description,
      stockNumber: req.stockNumber,
      expireDate: req.expireDate,
      price: req.price,
      quantity: req.quantity,
      measurement: req.measurement,
      type: req.type,
    })
    product.save((err, item) => {
      if (err) {
        reject(buildErrObject(422, err.message))
      }
      item = item.toObject()
      resolve(item)
    })
  })
}

const deleteItemFromDB = async id => {
  return new Promise((resolve, reject) => {
    model.findByIdAndRemove(id, (err, item) => {
      if (err) {
        reject(buildErrObject(422, err.message))
      }
      if (!item) {
        reject(buildErrObject(404, 'NOT_FOUND'))
      }
      resolve(buildSuccObject('DELETED'))
    })
  })
}

/********************
 * Public functions *
 ********************/

exports.getAllItems = async (req, res) => {
  try {
    res.status(200).json(await getAllItemsFromDB())
  } catch (error) {
    handleError(res, error)
  }
}

exports.getItems = async (req, res) => {
  try {
    const query = await checkQueryString(req.query.filter)
    res.status(200).json(await getItemsFromDB(req, query))
  } catch (error) {
    handleError(res, error)
  }
}

exports.getItem = async (req, res) => {
  try {
    req = matchedData(req)
    const id = await isIDGood(req.id)
    res.status(200).json(await getItemFromDB(id))
  } catch (error) {
    handleError(res, error)
  }
}

// exports.updateItem = async (req, res) => {
//   try {
//     req = matchedData(req)
//     const id = await isIDGood(req.id)
//     const doesCityExists = await cityExistsExcludingItself(id, req.name)
//     if (!doesCityExists) {
//       res.status(200).json(await updateItemInDB(id, req))
//     }
//   } catch (error) {
//     handleError(res, error)
//   }
// }

exports.createItem = async (req, res) => {
  try {
    req = matchedData(req)
    const doesCityExists = await productExists(req.name)
    if (!doesCityExists) {
      res.status(201).json(await createItemInDB(req))
    }
  } catch (error) {
    handleError(res, error)
  }
}

exports.deleteItem = async (req, res) => {
  try {
    req = matchedData(req)
    const id = await isIDGood(req.id)
    res.status(200).json(await deleteItemFromDB(id))
  } catch (error) {
    handleError(res, error)
  }
}
