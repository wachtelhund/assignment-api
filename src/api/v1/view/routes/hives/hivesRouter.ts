import express from 'express';
import { HivesController } from '../../../controller/hives/HivesController';
import { router as hivesStatusRouter } from './hivesStatusRouter';

export const router = express.Router();
const controller = new HivesController();

router.get('/', (req, res, next) => controller.getHives(req, res, next));
router.get('/:id', (req, res, next) => controller.getHive(req, res, next));

router.post('/', (req, res, next) => controller.createHive(req, res, next));
router.put('/:id', (req, res, next) => controller.updateHive(req, res, next));
router.delete('/:id', (req, res, next) => controller.deleteHive(req, res, next));

router.post('/:id/harvest-reports', (req, res, next) => controller.createHarvestReport(req, res, next));
router.get('/:id/harvest-reports', (req, res, next) => controller.getHarvestReport(req, res, next));

router.use('/:id/status', hivesStatusRouter)

router.get('**', (req, res) => res.status(404).send('Not Found'));


