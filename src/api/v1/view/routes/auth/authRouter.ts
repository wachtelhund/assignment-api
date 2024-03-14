import express from "express";

export const router = express.Router();

import { AuthController } from "../../../controller/auth/AuthController";
const controller = new AuthController();

router.post('/login', (req, res, next) => controller.login(req, res, next));
router.post('/register', (req, res, next) => controller.register(req, res, next));
router.post('/logout', (req, res, next) => controller.logout(req, res, next));
