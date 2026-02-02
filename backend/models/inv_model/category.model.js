
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
  parentCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  description: String,
  image: String,
  displayOrder: {
    type: Number,
    default: 0
  },
  department: {
    type: String,
    enum: ['Men', 'Women', 'Kids', 'Unisex', 'All']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  attributes: [{
    name: String,
    type: {
      type: String,
     // enum: ['text', 'number', 'select', 'color']
    },
    options: [String],
    isRequired: Boolean
  }],
  seo: {
    metaTitle: String,
    metaDescription: String,
    slug: String
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
  suppliers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier'
  }],
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  countryOfOrigin: String,
  seo: {
    metaTitle: String,
    metaDescription: String,
    slug: String
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Tag Schema
const tagSchema = new mongoose.Schema({
  tagName: {
    type: String,
    required: true,
    trim: true
  },
  tagType: {
    type: String,
    enum: ['seasonal', 'style', 'trending', 'custom'],
    default: 'custom'
  },
  colorCode: String,
  isActive: {
    type: Boolean,
    default: true
  },
  appliedToProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});



const Category = mongoose.model('Category', categorySchema);
const Brand = mongoose.model('Brand', brandSchema);
const Tag = mongoose.model('Tag', tagSchema);


module.exports = {
  Category,
  Brand,Tag
};