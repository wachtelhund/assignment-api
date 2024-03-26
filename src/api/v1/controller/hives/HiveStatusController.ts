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
                    data: {
                        id: hiveStatus.id,
                        temperature: hiveStatus.temperature,
                        humidity: hiveStatus.humidity,
                        weight: hiveStatus.weight,
                        hive_flow: hiveStatus.hive_flow,
                        createdAt: hiveStatus.createdAt,
                        updatedAt: hiveStatus.updatedAt,
                    },
                    _links: {
                        self: {
                            href: `/api/v1/hives/${hiveId}/status`,
                            method: 'GET',
                            title: 'Get hive status'
                        },
                        create_status: {
                            href: `/api/v1/hives/${hiveId}/status`,
                            method: 'POST',
                            title: 'Create hive status'
                        },
                        humidity: {
                            href: `/api/v1/hives/${hiveId}/status/humidity`,
                            method: 'GET',
                            title: 'Get hive humidity'
                        },
                        weight: {
                            href: `/api/v1/hives/${hiveId}/status/weight`,
                            method: 'GET',
                            title: 'Get hive weight'
                        },
                        temperature: {
                            href: `/api/v1/hives/${hiveId}/status/temperature`,
                            method: 'GET',
                            title: 'Get hive temperature'
                        },
                        hive_flow: {
                            href: `/api/v1/hives/${hiveId}/status/hive_flow`,
                            method: 'GET',
                            title: 'Get hive arrival and departure flow'
                        },
                        parent_hive: {
                            href: `/api/v1/hives/${hiveId}`,
                            method: 'GET',
                            title: 'Get hive'
                        },
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

                const foundHiveStatus = await HiveStatusModel.findOneAndUpdate(
                    { parent_hive: hiveId },
                    { 
                        temperature: req.body.temperature,
                        humidity: req.body.humidity,
                        weight: req.body.weight,
                        hive_flow: req.body.hive_flow
                    }
                );
                
                if (!foundHiveStatus) {
                    const hiveStatus = new HiveStatusModel({
                        parent_hive: hiveId,
                        temperature: req.body.temperature,
                        humidity: req.body.humidity,
                        weight: req.body.weight,
                        hive_flow: req.body.hive_flow
                    });

                    await hiveStatus.save();
                }

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
                    hive_flow: req.body.hive_flow,
                    parent_hive: hiveId
                });

                await temperature.save();
                await humidity.save();
                await weight.save();
                await hiveFlow.save();

                res.status(201).json({
                    message: 'Hive status created',
                    _links: {
                        self: {
                            href: `/api/v1/hives/${hiveId}/status`,
                            method: 'GET',
                            title: 'Get hive status'
                        },
                        parent_hive: {
                            href: `/api/v1/hives/${hiveId}`,
                            method: 'GET',
                            title: 'Get hive'
                        },
                        hives: {
                            href: '/api/v1/hives',
                            method: 'GET',
                            title: 'Get hives'
                        },
                        home: {
                            href: '/api/v1',
                            method: 'GET',
                            title: 'Home'
                        }
                    }
                });
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
        try {
            const hiveId = req.params.id;
            const from = req.query.from as string;
            const to = req.query.to as string;
            
            let toDate = to !== undefined ? new Date(to) : new Date();
            let fromDate = from !== undefined ? new Date(from) : new Date(toDate!.getTime() - 24 * 60 * 60 * 1000);

            console.log(fromDate, toDate);

            await model.find({
                parent_hive: hiveId,
                createdAt: { $gte: fromDate, $lte: toDate }
            }).then(entries => {
                res.setHeader('Content-Type', 'application/json');
                const statusCode = entries.length > 0 ? 200 : 204;
                res.status(statusCode).json({
                    data: entries,
                    _links: {
                        status: {
                            href: `/api/v1/hives/${hiveId}/status`,
                            method: 'GET',
                            title: 'Get hive status'
                        },
                        parent_hive: {
                            href: `/api/v1/hives/${hiveId}`,
                            method: 'GET',
                            title: 'Get hive'
                        },
                        hives: {
                            href: '/api/v1/hives',
                            method: 'GET',
                            title: 'Get hives'
                        },
                        home: {
                            href: '/api/v1',
                            method: 'GET',
                            title: 'Home'
                        }
                    }
                });
            })
            .catch(error => {
                next(new RequestError('Error getting entries', 500));
            });
        } catch (error) {
            
        }
    }
}