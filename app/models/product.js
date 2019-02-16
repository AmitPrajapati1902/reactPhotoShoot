const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    stockNumber: {
      type: String,
      default: 0
    },
    expireDate: {
      type: Date
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    measurement: {
      type: String,
      enum: ['ml', 'gram', 'other'],
    },
    type: {
      type: String,
      enum: ['1', '2', '3', '4'],
    },
  },
  {
    versionKey: false,
    timestamps: true
  }
)
ProductSchema.index({
  name: 'text'
})
ProductSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('Product', ProductSchema)