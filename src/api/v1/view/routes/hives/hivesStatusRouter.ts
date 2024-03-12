import express from 'express';
import { HiveStatusController } from '../../../controller/hives/HiveStatusController'

export const router = express.Router();

const controller = new HiveStatusController();

router.get('/', (req, res, next) => controller.getHiveStatus(req, res, next));
router.post('/', (req, res, next) => controller.createHiveStatus(req, res, next));

router.get('/humidity', (req, res, next) => controller.getHiveHumidity(req, res, next));
router.get('/weight', (req, res, next) => controller.getHiveWeight(req, res, next));
router.get('/temperature', (req, res, next) => controller.getHiveTemperature(req, res, next));
router.get('/arrival-departure-flow', (req, res, next) => controller.getHiveArrivalDepartureFlow(req, res, next));
