const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Menu = require('../models/Menu');

// @desc    Create a new menu
// @route   POST /api/menus
// @access  Private/Admin
const createMenu = asyncHandler(async (req, res) => {
  const { category, name, description, time, slot } = req.body;
  const image = req.file.path;
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
  const image = req.file ? req.file.path : req.body.image;

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
