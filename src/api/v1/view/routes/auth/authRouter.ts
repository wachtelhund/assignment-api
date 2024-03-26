import express from "express";

export const router = express.Router();

import { AuthController } from "../../../controller/auth/AuthController";
const controller = new AuthController();

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     tags:
 *      - Auth
 *     summary: Log in.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - username
 *               - password
 *     responses:
 *       200:
 *         description: Logged in.
 */
router.post('/login', (req, res, next) => controller.login(req, res, next));

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     tags:
 *      - Auth
 *     summary: Register.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - username
 *               - password
 *     responses:
 *       201:
 *         description: Registered.
 */
router.post('/register', (req, res, next) => controller.register(req, res, next));

/**
 * @swagger
 * /api/v1/auth/logout:
 *   post:
 *     tags:
 *      - Auth
 *     summary: Log out, requires valid token.
 *     responses:
 *       200:
 *         description: Logged out.
 */
router.post('/logout', (req, res, next) => controller.logout(req, res, next));
