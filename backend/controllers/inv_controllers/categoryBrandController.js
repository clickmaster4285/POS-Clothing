const {
  Category,
  Brand,
  Tag
} = require('../../models/inv_model/category.model');
const Product = require('../../models/inv_model/product.model');

// Category Controllers
exports.createCategory = async (req, res) => {
  try {
    // ✅ Parse JSON fields from FormData
    const attributes = req.body.attributes
      ? JSON.parse(req.body.attributes)
      : [];

    const seo = req.body.seo
      ? JSON.parse(req.body.seo)
      : {};

    const categoryData = {
      categoryName: req.body.categoryName,
      categoryCode: req.body.categoryCode,
      parentCategory: req.body.parentCategory || null,
      description: req.body.description,
      department: req.body.department,
      displayOrder: Number(req.body.displayOrder || 0),
      isActive: req.body.isActive === "true",
      attributes,
      seo,
      image: req.file
        ? `/uploads/${req.file.filename}`
        : null,
      createdBy: req.user.id,
    };

    const category = new Category(categoryData);
    await category.save();

    res.status(201).json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};



exports.getCategories = async (req, res) => {
  try {
    const { department, parentCategory, includeProducts } = req.query;
    
    let query = { isActive: true };
    if (department) query.department = department;
    if (parentCategory) {
      query.parentCategory = parentCategory;
    } else if (parentCategory === null) {
      query.parentCategory = { $exists: false };
    }
    
    const categories = await Category.find(query)
      .populate('parentCategory', 'categoryName')
      .populate('createdBy', 'name')
     
    
   
    
    res.json({
      success: true,
      data: categories,
    
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Parse JSON fields (same as create)
    const attributes = req.body.attributes
      ? JSON.parse(req.body.attributes)
      : undefined;

    const seo = req.body.seo
      ? JSON.parse(req.body.seo)
      : undefined;

    const updateData = {
      categoryName: req.body.categoryName,
      categoryCode: req.body.categoryCode,
      parentCategory: req.body.parentCategory || null,
      description: req.body.description,
      department: req.body.department,
      displayOrder: req.body.displayOrder !== undefined
        ? Number(req.body.displayOrder)
        : undefined,
      isActive: req.body.isActive !== undefined
        ? req.body.isActive === "true"
        : undefined,
      attributes,
      seo
    };

    // If new image uploaded, replace image
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    // Remove undefined fields
    Object.keys(updateData).forEach(
      key => updateData[key] === undefined && delete updateData[key]
    );

    // Prevent circular reference
    if (updateData.parentCategory === id) {
      return res.status(400).json({
        success: false,
        message: "Category cannot be its own parent"
      });
    }

    const category = await Category.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }

    res.json({
      success: true,
      data: category
    });

  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};


exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    // Check if category has sub-categories
    const subCategories = await Category.countDocuments({ parentCategory: id });
    if (subCategories > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete category with sub-categories'
      });
    }
    
    // Check if category has products
    const productCount = await Product.countDocuments({ category: id });
    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete category with associated products'
      });
    }
    
    // Soft delete
    category.isActive = false;
    await category.save();
    
    res.json({
      success: true,
      message: 'Category deactivated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Brand Controllers
exports.createBrand = async (req, res) => {
  try {


    const brand = new Brand({
      brandName: req.body.brandName,
      brandCode: req.body.brandCode,
      description: req.body.description,
      website: req.body.website,
      countryOfOrigin: req.body.countryOfOrigin,
      categories: req.body.categories
        ? JSON.parse(req.body.categories)
        : [],
      isActive: req.body.isActive === "true",
      logo: req.file ? `/uploads/${req.file.filename}` : "",
      seo: req.body.seo ? JSON.parse(req.body.seo) : {},
    });

    await brand.save();
    res.status(201).json({ success: true, data: brand });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};



exports.getBrands = async (req, res) => {
  try {
    const { activeOnly, includeProducts, search } = req.query;
    
    let query = {isActive: true};
    if (activeOnly === 'true') query.isActive = true;
    if (search) {
      query.$or = [
        { brandName: { $regex: search, $options: 'i' } },
        { brandCode: { $regex: search, $options: 'i' } }
      ];
    }
    
    const brands = await Brand.find(query)
     
      .populate('categories', 'categoryName')
      .populate('createdBy', 'name')
      .sort({ brandName: 1 });
    
    // Include product counts if requested
    if (includeProducts === 'true') {
      for (let brand of brands) {
        const productCount = await Product.countDocuments({ 
          brand: brand._id,
          isActive: true 
        });
        brand.productCount = productCount;
      }
    }
    
    res.json({
      success: true,
      data: brands
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateBrand = async (req, res) => {
  try {
    const { id } = req.params;

    const updateData = {
      brandName: req.body.brandName,
      brandCode: req.body.brandCode,
      description: req.body.description,
      website: req.body.website,
      countryOfOrigin: req.body.countryOfOrigin,
      isActive: req.body.isActive !== undefined
        ? req.body.isActive === "true"
        : undefined,
      categories: req.body.categories
        ? JSON.parse(req.body.categories)
        : undefined,
      seo: req.body.seo
        ? JSON.parse(req.body.seo)
        : undefined,
    };

    // If new logo uploaded
    if (req.file) {
      updateData.logo = `/uploads/${req.file.filename}`;
    }

    // Remove undefined keys
    Object.keys(updateData).forEach(
      key => updateData[key] === undefined && delete updateData[key]
    );

    const brand = await Brand.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: "Brand not found"
      });
    }

    res.json({
      success: true,
      data: brand
    });

  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};


exports.deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;
    
    const brand = await Brand.findById(id);
    if (!brand) {
      return res.status(404).json({
        success: false,
        message: 'Brand not found'
      });
    }
    
    // Check if brand has products
    const productCount = await Product.countDocuments({ brand: id });
    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete brand with associated products'
      });
    }
    
    // Soft delete
    brand.isActive = false;
    await brand.save();
    
    res.json({
      success: true,
      message: 'Brand deactivated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Tag Controllers
exports.createTag = async (req, res) => {
  try {
    const tag = new Tag({
      ...req.body,
      createdBy: req.user.id
    });
    
    await tag.save();
    
    res.status(201).json({
      success: true,
      data: tag
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.getTags = async (req, res) => {
  try {
    const { tagType, activeOnly } = req.query;
    
    let query = {};
    if (tagType) query.tagType = tagType;
    if (activeOnly === 'true') query.isActive = true;
    
    const tags = await Tag.find(query)
      .populate('createdBy', 'name')
      .sort({ tagType: 1, tagName: 1 });
    
    // Add product counts
    for (let tag of tags) {
      const productCount = tag.appliedToProducts ? tag.appliedToProducts.length : 0;
      tag.productCount = productCount;
    }
    
    res.json({
      success: true,
      data: tags
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.applyTagToProduct = async (req, res) => {
  try {
    const { tagId, productId } = req.params;
    
    const tag = await Tag.findById(tagId);
    if (!tag) {
      return res.status(404).json({
        success: false,
        message: 'Tag not found'
      });
    }
    
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Check if tag already applied
    if (tag.appliedToProducts.includes(productId)) {
      return res.status(400).json({
        success: false,
        message: 'Tag already applied to this product'
      });
    }
    
    tag.appliedToProducts.push(productId);
    await tag.save();
    
    // Add tag to product if not already present
    if (!product.tags.includes(tag.tagName)) {
      product.tags.push(tag.tagName);
      await product.save();
    }
    
    res.json({
      success: true,
      message: 'Tag applied successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.removeTagFromProduct = async (req, res) => {
  try {
    const { tagId, productId } = req.params;
    
    const tag = await Tag.findById(tagId);
    if (!tag) {
      return res.status(404).json({
        success: false,
        message: 'Tag not found'
      });
    }
    
    // Remove product from tag
    tag.appliedToProducts = tag.appliedToProducts.filter(
      id => id.toString() !== productId
    );
    await tag.save();
    
    // Remove tag from product
    const product = await Product.findById(productId);
    if (product) {
      product.tags = product.tags.filter(
        tagName => tagName !== tag.tagName
      );
      await product.save();
    }
    
    res.json({
      success: true,
      message: 'Tag removed successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.getCategoryBrandAnalytics = async (req, res) => {
  try {
    // Get category-wise product counts
    const categoryStats = await Product.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$category',
          productCount: { $sum: 1 },
          variantCount: { $sum: { $size: '$variants' } }
        }
      },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'category'
        }
      },
      { $unwind: '$category' },
      {
        $project: {
          categoryName: '$category.categoryName',
          productCount: 1,
          variantCount: 1
        }
      },
      { $sort: { productCount: -1 } }
    ]);
    
    // Get brand-wise product counts
    const brandStats = await Product.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$brand',
          productCount: { $sum: 1 },
          variantCount: { $sum: { $size: '$variants' } }
        }
      },
      {
        $lookup: {
          from: 'brands',
          localField: '_id',
          foreignField: '_id',
          as: 'brand'
        }
      },
      { $unwind: '$brand' },
      {
        $project: {
          brandName: '$brand.brandName',
          productCount: 1,
          variantCount: 1
        }
      },
      { $sort: { productCount: -1 } }
    ]);
    
    // Get department-wise distribution
    const departmentStats = await Product.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$department',
          productCount: { $sum: 1 }
        }
      },
      { $sort: { productCount: -1 } }
    ]);
    
    // Get tag usage statistics
    const tagStats = await Tag.aggregate([
      {
        $project: {
          tagName: 1,
          tagType: 1,
          productCount: { $size: { $ifNull: ['$appliedToProducts', []] } }
        }
      },
      { $sort: { productCount: -1 } }
    ]);
    
    res.json({
      success: true,
      data: {
        categoryStats,
        brandStats,
        departmentStats,
        tagStats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};