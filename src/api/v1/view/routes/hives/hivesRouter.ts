import express from 'express';
import { HivesController } from '../../../controller/hives/HivesController';
import { router as hivesStatusRouter } from './hivesStatusRouter';
import { verifyJWT } from '../../../../../utils/tokenHandlers';

export const router = express.Router();
const controller = new HivesController();

/**
 * @swagger
 * /api/v1/hives:
 *   get:
 *     tags:
 *      - Hives
 *     summary: Returns a list of hives.
 *     responses:
 *       200:
 *         description: A list of hives.
 */
router.get('/', (req, res, next) => controller.getHives(req, res, next));

/**
 * @swagger
 * /api/v1/hives/{id}:
 *   get:
 *     tags:
 *      - Hives
 *     summary: Returns a single hive.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The id of the hive.
 *     responses:
 *       200:
 *         description: A single hive.
 */
router.get('/:id', (req, res, next) => controller.getHive(req, res, next));

/**
 * @swagger
 * /api/v1/hives:
 *   post:
 *     tags:
 *      - Hives
 *     summary: Create a new hive.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               location:
 *                 type: object
 *                 properties:
 *                   lat:
 *                     type: number
 *                   lng:
 *                     type: number
 *             required:
 *               - name
 *               - location
 *     responses:
 *       201:
 *         description: Hive created
 */
router.post('/', verifyJWT, (req, res, next) => controller.createHive(req, res, next));

/**
 * @swagger
 * /api/v1/hives/{id}:
 *   put:
 *     tags:
 *      - Hives
 *     summary: Update a hive.
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
 *               name:
 *                 type: string
 *               location:
 *                 type: object
 *                 properties:
 *                   lat:
 *                     type: number
 *                   lng:
 *                     type: number
 *             required:
 *               - name
 *               - location
 *     responses:
 *       200:
 *         description: Hive updated
 */
router.put('/:id', verifyJWT, (req, res, next) => controller.updateHive(req, res, next));

/**
 * @swagger
 * /api/v1/hives/{id}:
 *   delete:
 *     tags:
 *      - Hives
 *     summary: Delete a hive.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The id of the hive.
 *     responses:
 *       200:
 *         description: Hive deleted
 */
router.delete('/:id', verifyJWT, (req, res, next) => controller.deleteHive(req, res, next));

/**
 * @swagger
 * /api/v1/hives/{id}/harvests:
 *   post:
 *     tags:
 *      - Hives
 *     summary: Create a new harvest report.
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
 *               harvest:
 *                 type: number
 *             required:
 *               - harvest
 *     responses:
 *       201:
 *         description: Harvest report created
 */
router.post('/:id/harvests', verifyJWT, (req, res, next) => controller.createHarvestReport(req, res, next));

/**
 * @swagger
 * /api/v1/hives/{id}/harvests/subscriptions:
 *   post:
 *     tags:
 *      - Webhooks
 *     summary: Subscribe to harvest report notifications.
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
 *               post_url:
 *                 type: string
 *               lifetime:
 *                 type: string
 *                 enum: ['ONE_HOUR', 'ONE_DAY', 'ONE_WEEK', 'ONE_MONTH']
 *             required:
 *               - post_url
 *               - lifetime
 *     responses:
 *       201:
 *         description: Subscribed to harvest reports
 */
router.post('/:id/harvests/subscriptions', verifyJWT, (req, res, next) => controller.subscribeToHarvestReport(req, res, next));

/**
 * @swagger
 * /api/v1/hives/{id}/harvests/subscriptions:
 *   delete:
 *     tags:
 *      - Webhooks
 *     summary: Unsubscribe from harvest report notifications.
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
 *             $ref: '#/components/schemas/Hive'
 *      
 *     responses:
 *       200:
 *         description: Unsubscribed from harvest reports
 */
router.delete('/:id/harvests/subscriptions', verifyJWT, (req, res, next) => controller.unsubscribeToHarvestReports(req, res, next));

/**
 * @swagger
 * /api/v1/hives/{id}/harvests/subscriptions:
 *   get:
 *     tags:
 *      - Webhooks
 *     summary: Returns a list of harvest report subscriptions.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The id of the hive.
 *     responses:
 *       200:
 *         description: A list of harvest report subscriptions.
 */
router.get('/:id/harvests/subscriptions', verifyJWT, (req, res, next) => controller.getHarvestReportSubscriptions(req, res, next));

/**
 * @swagger
 * /api/v1/hives/{id}/harvests:
 *   get:
 *     tags:
 *      - Hives
 *     summary: Returns a list of harvest reports for a hive.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The id of the hive.
 *     responses:
 *       200:
 *         description: A list of harvest reports.
 */
router.get('/:id/harvests', (req, res, next) => controller.getHarvestReports(req, res, next));

router.use('/:id/status', hivesStatusRouter)

router.get('**', (req, res) => res.status(404).send('Not Found'));


