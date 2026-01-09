const express = require('express');
const router = express.Router();
const {
  registerAdmin,
  authAdmin,
  getAdminProfile,
  updateAdminProfile,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');

/**
 * @swagger
 * components:
 *   schemas:
 *     Admin:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           description: The admin's username
 *         email:
 *           type: string
 *           description: The admin's email
 *         password:
 *           type: string
 *           description: The admin's password
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin management
 */

/**
 * @swagger
 * /api/admin/register:
 *   post:
 *     summary: Register a new admin
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Admin'
 *     responses:
 *       201:
 *         description: The admin was successfully created
 *       400:
 *         description: Invalid admin data
 */
router.post('/register', registerAdmin);

/**
 * @swagger
 * /api/admin/login:
 *   post:
 *     summary: Authenticate an admin and get a token
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: The admin was successfully authenticated
 *       401:
 *         description: Invalid email or password
 */
router.post('/login', authAdmin);

/**
 * @swagger
 * /api/admin/profile:
 *   get:
 *     summary: Get the logged in admin's profile
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The admin's profile
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Admin not found
 *   put:
 *     summary: Update the logged in admin's profile
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: The updated admin's profile
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Admin not found
 */
router
  .route('/profile')
  .get(protect, getAdminProfile)
  .put(protect, updateAdminProfile);

module.exports = router;
