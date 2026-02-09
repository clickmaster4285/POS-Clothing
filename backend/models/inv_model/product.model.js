const mongoose = require("mongoose");

// Product Schema
const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
    trim: true
  },
  sku: {
    type: String,
    required: true,
    unique: true
  },

  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brand',
    //required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  //  required: true
  },

  season: String,
  collection: String,
  description: String,
  longDescription: String,
  careInstructions: String,
  material: String,
  countryOfOrigin: String,
  ageGroup: String,
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Unisex']
  },
  styleType: String,



  variants: [{
    size: String,
    // color: String,
    // quantity: String,
    
    style: String,
    fitType: String,
    length: String,
    variantSku: {
      type: String,
      unique: true
    },
    images: [String],
    price: {
      costPrice: Number,
      retailPrice: Number,
    },
    
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Supplier'
    },
      stockByAttribute: [
        {
            color: String,
            quantity: Number,
        }
    ],

   priceHistory: [
  {
    date: { type: Date },
    price: {
      costPrice: { type: Number },
      retailPrice: { type: Number }
    },
    type: { type: String, enum: ["previous", "update"] },
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  }
]
,
   
   
    stockHistory: [{ 
      date: Date,
      quantityChange: Number,
      reason: String, 
      changedBy: String
    }],

    competitorPrice: Number,
    isActive: {
      type: Boolean,
      default: true
    }
  }],


  supplierInfo: {
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Supplier'
    },
    
  },
  tags: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date
});

productSchema.index({ sku: 1 });
productSchema.index({ brand: 1, category: 1 });
productSchema.index({ department: 1, isActive: 1 });

// Pre-save middleware for variant SKUs
// productSchema.pre('save', function(next) {
//   // Generate variant SKUs if not provided
//   if (this.variants && this.variants.length > 0) {
//     this.variants.forEach((variant, index) => {
//       if (!variant.variantSku) {
//         const sizeCode = variant.size ? variant.size.substring(0, 2).toUpperCase() : 'VR';
//         const colorCode = variant.color ? variant.color.substring(0, 3).toUpperCase() : 'DEF';
//         variant.variantSku = `${this.sku}-${colorCode}-${sizeCode}-${String(index + 1).padStart(2, '0')}`;
//       }
//     });
//   }
  
//   this.updatedAt = new Date();
//   next();
// });

const Product = mongoose.model('Product', productSchema);
module.exports = Product;