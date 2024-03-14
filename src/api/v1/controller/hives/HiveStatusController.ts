import { Request, Response, NextFunction } from "express";
import HiveStatusModel from "../../model/mongoose/schemas/hiveStatus.model";
import { RequestError } from "../../../../utils/requestError";
import HiveModel from "../../model/mongoose/schemas/hive.model";
import TemperatureModel from "../../model/mongoose/schemas/temperature.model";
import HumidityModel from "../../model/mongoose/schemas/humidity.model";
import WeightModel from "../../model/mongoose/schemas/weight.model";
import HiveFlowModel from "../../model/mongoose/schemas/hiveFlow.model";
import mongoose from "mongoose";

export class HiveStatusController {
    public async getHiveStatus(req: Request, res: Response, next: NextFunction) {
        try {
            const hiveId = req.params.id;
            const hiveStatus = await HiveStatusModel.findOne({ parent_hive: hiveId }).sort({ createdAt: -1 }).limit(1);
            if (hiveStatus) {
                res.status(200).json({
                    id: hiveStatus.id,
                    temperature: hiveStatus.temperature,
                    humidity: hiveStatus.humidity,
                    weight: hiveStatus.weight,
                    hive_flow: hiveStatus.hive_flow,
                    createdAt: hiveStatus.createdAt,
                    updatedAt: hiveStatus.updatedAt,
                    _links: {
                        self: `/api/v1/hives/${hiveId}/status`,
                        huidity: `/api/v1/hives/${hiveId}/status/humidity`,
                        weight: `/api/v1/hives/${hiveId}/status/weight`,
                        temperature: `/api/v1/hives/${hiveId}/status/temperature`,
                        hive_flow: `/api/v1/hives/${hiveId}/status/hive_flow`,
                        parent_hive: `/api/v1/hives/${hiveId}`
                    }
                });
            } else {
                res.status(204).send();
            }
        } catch (error) {
            next(new RequestError('Error getting hive status', 500));
        }
    }

    public async createHiveStatus(req: Request, res: Response, next: NextFunction) {
        try {
            const hiveId = req.params.id;
            if (!req.body.temperature || !req.body.humidity || !req.body.weight || !req.body.hive_flow) {
                next(new RequestError('Missing parameters', 400));
            }
            
            const hive = await HiveModel.find({ id: hiveId });
            
            if (hive) {
                const hiveStatus = new HiveStatusModel({
                    parent_hive: hiveId,
                    temperature: req.body.temperature,
                    humidity: req.body.humidity,
                    weight: req.body.weight,
                    hive_flow: req.body.hive_flow
                });

                const temperature = new TemperatureModel({
                    temperature: req.body.temperature,
                    parent_hive: hiveId
                });

                const humidity = new HumidityModel({
                    humidity: req.body.humidity,
                    parent_hive: hiveId
                });

                const weight = new WeightModel({
                    weight: req.body.weight,
                    parent_hive: hiveId
                });

                const hiveFlow = new HiveFlowModel({
                    departures: req.body.hive_flow.departures,
                    arrivals: req.body.hive_flow.arrivals,
                    parent_hive: hiveId
                });

                await temperature.save();
                await humidity.save();
                await weight.save();
                await hiveFlow.save();
                await hiveStatus.save();
                res.json({hive_status: hiveStatus, message: 'Hive status created', _links: {
                    self: `/api/v1/hives/${hiveStatus.id}`,
                }});

            } else {
                next(new RequestError('Parent hive not found', 404));
            }
        } catch (error) {
            next(new RequestError('Error creating hive status', 500));
        }
    }

    public async getHiveHumidity(req: Request, res: Response, next: NextFunction) {
        try {
            this.getFromToDates(req, res, HumidityModel, next);
        } catch (error) {
            next(new RequestError('Error getting hive humidity', 500));
        }
    }

    public async getHiveWeight(req: Request, res: Response, next: NextFunction) {
        try {
            this.getFromToDates(req, res, WeightModel, next);
        } catch (error) {
            next(new RequestError('Error getting hive weight', 500));   
        }
    }

    public getHiveTemperature(req: Request, res: Response, next: NextFunction) {
        try {
            this.getFromToDates(req, res, TemperatureModel, next);
        } catch (error) {
            next(new RequestError('Error getting hive temperature', 500));
        }
    }

    public getHiveArrivalDepartureFlow(req: Request, res: Response, next: NextFunction) {
        try {
            this.getFromToDates(req, res, HiveFlowModel, next);
        } catch (error) {
            next(new RequestError('Error getting hive arrival and departure flow', 500));
        }
    }

    private async getFromToDates(req: Request, res: Response, model: mongoose.Model<any, {}>, next: NextFunction) {
        
        const hiveId = req.params.id;
        const from = req.query.from as string;
        const to = req.query.to as string;
        
        let fromDate, toDate;

        if (from) {
            fromDate = new Date(from);
        }
        if (to) {
            toDate = new Date(to);
        }

        if (!to) {
            toDate = new Date();
        }
        if (!from) {
            // last 24 hours
            fromDate = new Date(toDate!.getTime() - 24 * 60 * 60 * 1000);
        }

        if (fromDate && toDate && fromDate > toDate) {
            next(new RequestError('Invalid date range', 400));
        }

        const entries = await model.find({ parent_hive: hiveId, createdAt: { $gte: fromDate, $lte: toDate } });

        if (entries.length > 0) {
            res.status(200).json({
                ...entries,
                _links: {
                    status: `/api/v1/hives/${hiveId}/status`,
                    parent_hive: `/api/v1/hives/${hiveId}`
                }
            });
        } else {
            res.status(204).send();
        }
    }
}