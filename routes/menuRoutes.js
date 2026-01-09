const express = require('express');
const router = express.Router();
const {
  createMenu,
  getMenus,
  getMenuById,
  updateMenu,
  deleteMenu,
  getMenusByCategory,
} = require('../controllers/menuController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

/**
 * @swagger
 * components:
 *   schemas:
 *     Menu:
 *       type: object
 *       required:
 *         - category
 *         - name
 *         - description
 *       properties:
 *         category:
 *           type: string
 *           description: The ID of the category this menu item belongs to
 *         name:
 *           type: string
 *           description: The name of the menu item
 *         description:
 *           type: string
 *           description: A description of the menu item
 *         time:
 *           type: number
 *           description: The preparation time in minutes
 *         slot:
 *           type: number
 *           description: The number of available slots
 */

/**
 * @swagger
 * tags:
 *   name: Menus
 *   description: Menu management
 */

/**
 * @swagger
 * /api/menus:
 *   post:
 *     summary: Create a new menu item
 *     tags: [Menus]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               category:
 *                 type: string
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               time:
 *                 type: number
 *               slot:
 *                 type: number
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: The menu item was successfully created
 *       400:
 *         description: Invalid menu data
 *       401:
 *         description: Not authorized
 *   get:
 *     summary: Get all menu items
 *     tags: [Menus]
 *     parameters:
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: Keyword to search for in menu names
 *     responses:
 *       200:
 *         description: A list of menu items
 */
router.route('/').post(protect, upload.single('image'), createMenu).get(getMenus);

/**
 * @swagger
 * /api/menus/category/{categoryId}:
 *   get:
 *     summary: Get all menu items by category
 *     tags: [Menus]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the category
 *     responses:
 *       200:
 *         description: A list of menu items
 *       404:
 *         description: Category not found
 */
router.route('/category/:categoryId').get(getMenusByCategory);

/**
 * @swagger
 * /api/menus/{id}:
 *   get:
 *     summary: Get a menu item by ID
 *     tags: [Menus]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The menu item ID
 *     responses:
 *       200:
 *         description: The menu item data
 *       404:
 *         description: Menu item not found
 *   put:
 *     summary: Update a menu item
 *     tags: [Menus]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The menu item ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               category:
 *                 type: string
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               time:
 *                 type: number
 *               slot:
 *                 type: number
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: The updated menu item data
 *       400:
 *         description: Invalid menu data
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Menu item not found
 *   delete:
 *     summary: Delete a menu item
 *     tags: [Menus]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The menu item ID
 *     responses:
 *       200:
 *         description: Menu item removed
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Menu item not found
 */
router
  .route('/:id')
  .get(getMenuById)
  .put(protect, upload.single('image'), updateMenu)
  .delete(protect, deleteMenu);

module.exports = router;
