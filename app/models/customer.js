const mongoose = require('mongoose')
const bcrypt = require('bcrypt-nodejs')
const validator = require('validator')
const mongoosePaginate = require('mongoose-paginate-v2')

const CustomerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    city: {
      type: String
    },
    userid: {
      required: true,
      type: String,
    },
    balance: {
      required: true,
      type: Number,
      default: 0.0
    },
    accountTotal: {
      required: true,
      type: Number,
      default: 0.0
    },
    isCompany: {
      required: true,
      type: Boolean,
      default: true
    },
    blockExpires: {
      type: Date,
      default: Date.now,
      select: false
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)

CustomerSchema.index({
  email: 'text',
  phone: 'text',
  city: 'text',
  userid:'text'
})
CustomerSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('Customer', CustomerSchema)
