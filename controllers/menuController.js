const asyncHandler = require('express-async-handler');
const path = require('path');
const mongoose = require('mongoose');
const cloudinaryLib = (() => {
  try {
    return require('cloudinary').v2;
  } catch (e) {
    return null;
  }
})();
if (cloudinaryLib && process.env.CLOUDINARY_URL) {
  cloudinaryLib.config({ url: process.env.CLOUDINARY_URL });
}
async function uploadImageBuffer(file) {
  return new Promise((resolve, reject) => {
    cloudinaryLib.uploader.upload_stream(
      { resource_type: 'image', folder: 'menuapp' },
      (err, result) => {
        if (err) reject(err);
        else resolve(result.secure_url);
      }
    ).end(file.buffer);
  });
}
function getBaseUrl(req) {
  return (
    process.env.PUBLIC_BASE_URL ||
    process.env.SWAGGER_BASE_URL ||
    `${req.protocol}://${req.get('host')}`
  );
}
function resolveLocalImageUrl(req, filePath) {
  const rel = `/uploads/${path.basename(filePath)}`;
  return `${getBaseUrl(req)}${rel}`;
}
const Menu = require('../models/Menu');

// @desc    Create a new menu
// @route   POST /api/menus
// @access  Private/Admin
const createMenu = asyncHandler(async (req, res) => {
  const { category, name, description, time, slot } = req.body;
  let image = null;
  if (req.file && req.file.buffer && cloudinaryLib) {
    image = await uploadImageBuffer(req.file);
  } else if (req.file && req.file.path) {
    image = resolveLocalImageUrl(req, req.file.path);
  }
  if (!mongoose.Types.ObjectId.isValid(category)) {
    res.status(400);
    throw new Error('Invalid category ID');
  }

  const menu = new Menu({
    category,
    name,
    description,
    image,
    time,
    slot,
  });

  const createdMenu = await menu.save();
  res.status(201).json(createdMenu);
});

// @desc    Get all menus
// @route   GET /api/menus
// @access  Public
const getMenus = asyncHandler(async (req, res) => {
  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {};

  const menus = await Menu.find({ ...keyword }).populate('category');
  res.json(menus);
});

// @desc    Get menu by ID
// @route   GET /api/menus/:id
// @access  Public
const getMenuById = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error('Invalid ID');
  }
  const menu = await Menu.findById(req.params.id).populate('category');

  if (menu) {
    res.json(menu);
  } else {
    res.status(404);
    throw new Error('Menu not found');
  }
});

// @desc    Update a menu
// @route   PUT /api/menus/:id
// @access  Private/Admin
const updateMenu = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error('Invalid ID');
  }
  const { category, name, description, time, slot } = req.body;
  let image = req.body.image;
  if (req.file && req.file.buffer && cloudinaryLib) {
    image = await uploadImageBuffer(req.file);
  } else if (req.file && req.file.path) {
    image = resolveLocalImageUrl(req, req.file.path);
  }

  const menu = await Menu.findById(req.params.id);

  if (menu) {
    menu.category = category;
    menu.name = name;
    menu.description = description;
    menu.image = image;
    menu.time = time;
    menu.slot = slot;

    const updatedMenu = await menu.save();
    res.json(updatedMenu);
  } else {
    res.status(404);
    throw new Error('Menu not found');
  }
});

// @desc    Delete a menu
// @route   DELETE /api/menus/:id
// @access  Private/Admin
const deleteMenu = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error('Invalid ID');
  }
  const menu = await Menu.findByIdAndDelete(req.params.id);

  if (menu) {
    res.json({ message: 'Menu removed' });
  } else {
    res.status(404);
    throw new Error('Menu not found');
  }
});

const getMenusByCategory = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.categoryId)) {
    res.status(400);
    throw new Error('Invalid category ID');
  }
  const menus = await Menu.find({ category: req.params.categoryId }).populate(
    'category'
  );
  res.json(menus);
});

module.exports = {
  createMenu,
  getMenus,
  getMenuById,
  updateMenu,
  deleteMenu,
  getMenusByCategory,
};
