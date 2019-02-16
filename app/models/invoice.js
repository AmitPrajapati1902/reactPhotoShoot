const mongoose = require('mongoose')
const bcrypt = require('bcrypt-nodejs')
const validator = require('validator')
const mongoosePaginate = require('mongoose-paginate-v2')

const InvoiceSchema = new mongoose.Schema(
  {
    customerid: {
      required: true,
      type: String,
    },
    invoiceid: {
      type: String,
      required: true,
    },
    products: [{
      type: String,
      required: true,
    }]
  },
  {
    versionKey: false,
    timestamps: true
  }
)

InvoiceSchema.index({
  amount: 'text',
  paid: 'text',
  customerid: 'text'
})

InvoiceSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('Invoice', InvoiceSchema)
