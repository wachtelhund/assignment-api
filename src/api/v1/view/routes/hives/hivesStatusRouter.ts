import express from 'express';
import { HiveStatusController } from '../../../controller/hives/HiveStatusController'
import { verifyJWT } from '../../../../../utils/tokenHandlers';

export const router = express.Router({ mergeParams: true });

const controller = new HiveStatusController();

/**
 * @swagger
 * /api/v1/hives/status:
 *   get:
 *     tags:
 *      - HiveStatus
 *     summary: Returns the status of a hive.
 *     responses:
 *       200:
 *         description: The status of a hive.
 */
router.get('/', (req, res, next) => controller.getHiveStatus(req, res, next));

/**
 * @swagger
 * /api/v1/hives/{id}/status:
 *   post:
 *     tags:
 *      - HiveStatus
 *     summary: Create a new hive status.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The id of the hive.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               temperature:
 *                 type: number
 *               humidity:
 *                 type: number
 *               weight:
 *                 type: number
 *               hive_flow:
 *                 type: number
 *             required:
 *               - temperature
 *               - humidity
 *               - weight
 *               - hive_flow
 *     responses:
 *       201:
 *         description: Hive status created
 */
router.post('/', verifyJWT, (req, res, next) => controller.createHiveStatus(req, res, next));

/**
 * @swagger
 * /api/v1/hives/status/humidity:
 *   get:
 *     tags:
 *      - HiveStatus
 *     summary: Returns the humidity of a hive.
 *     responses:
 *       200:
 *         description: The humidity of a hive.
 */
router.get('/humidity', (req, res, next) => controller.getHiveHumidity(req, res, next));

/**
 * @swagger
 * /api/v1/hives/status/weight:
 *   get:
 *     tags:
 *      - HiveStatus
 *     summary: Returns the weight of a hive.
 *     responses:
 *       200:
 *         description: The weight of a hive.
 */
router.get('/weight', (req, res, next) => controller.getHiveWeight(req, res, next));

/**
 * @swagger
 * /api/v1/hives/status/temperature:
 *   get:
 *     tags:
 *      - HiveStatus
 *     summary: Returns the temperature of a hive.
 *     responses:
 *       200:
 *         description: The temperature of a hive.
 */
router.get('/temperature', (req, res, next) => controller.getHiveTemperature(req, res, next));

/**
 * @swagger
 * /api/v1/hives/status/hive-flow:
 *   get:
 *     tags:
 *      - HiveStatus
 *     summary: Returns the arrival and departure flow of a hive.
 *     responses:
 *       200:
 *         description: The arrival and departure flow of a hive.
 */
router.get('/hive-flow', (req, res, next) => controller.getHiveArrivalDepartureFlow(req, res, next));
