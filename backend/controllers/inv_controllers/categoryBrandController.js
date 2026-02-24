const {
  Category,
  Brand,
  Tag
} = require('../../models/inv_model/category.model');
const Product = require('../../models/inv_model/product.model');

// Category Controllers
exports.createCategory = async (req, res) => {
  try {
 


    const categoryData = {
      categoryName: req.body.categoryName,
      categoryCode: req.body.categoryCode,
    
      description: req.body.description,
      department: req.body.department,
   
      isActive: req.body.isActive === "true",
     
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
    const { department, includeProducts } = req.query;
    
    let query = { isActive: true };
    if (department) query.department = department;
    
    
    const categories = await Category.find(query)
    
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
  
    const updateData = {
      categoryName: req.body.categoryName,
      categoryCode: req.body.categoryCode,
     
      description: req.body.description,
      department: req.body.department,
    
      isActive: req.body.isActive !== undefined
        ? req.body.isActive === "true"
        : undefined,
 
    };

    // If new image uploaded, replace image
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    // Remove undefined fields
    Object.keys(updateData).forEach(
      key => updateData[key] === undefined && delete updateData[key]
    );



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
console.log('Received brand creation request with data:', req.body);

    const brand = new Brand({
      brandName: req.body.brandName,
      brandCode: req.body.brandCode,
      description: req.body.description,
      website: req.body.website,
      countryOfOrigin: req.body.countryOfOrigin,
     
      isActive: req.body.isActive === "true",
      logo: req.file ? `/uploads/${req.file.filename}` : "",
     
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
    console.log('Received brand update request for ID:', req.params.id, 'with data:', req.body);
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