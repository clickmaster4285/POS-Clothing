
const mongoose = require("mongoose");

// Category Schema
const categorySchema = new mongoose.Schema({
  categoryName: {
    type: String,
    required: true,
    trim: true
  },
  categoryCode: {
    type: String,
    unique: true,
    required: true
  },

  description: String,
  image: String,

  department: {
    type: String,
    enum: ['Men', 'Women', 'Kids', 'Unisex', 'All']
  },
  isActive: {
    type: Boolean,
    default: true
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Brand Schema
const brandSchema = new mongoose.Schema({
  brandName: {
    type: String,
    required: true,
    trim: true
  },
  brandCode: {
    type: String,
    unique: true,
    required: true
  },
  logo: String,
  description: String,
  website: String,
  contactEmail: String,
  contactPhone: String,




  isActive: {
    type: Boolean,
    default: true
  },
  countryOfOrigin: String,

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});



const Category = mongoose.model('Category', categorySchema);
const Brand = mongoose.model('Brand', brandSchema);



module.exports = {
  Category,
  Brand,
};