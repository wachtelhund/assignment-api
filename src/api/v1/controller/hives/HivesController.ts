import { Request, Response, NextFunction } from "express";
import HiveModel from "../../model/mongoose/schemas/hive.model";
import { RequestError } from "../../../../utils/requestError";
import { Hive } from "../../model/types/Hive";
import HiveStatusModel from "../../model/mongoose/schemas/hiveStatus.model";
import HarvestModel from "../../model/mongoose/schemas/harvest.model";
import TemperatureModel from "../../model/mongoose/schemas/temperature.model";
import HumidityModel from "../../model/mongoose/schemas/humidity.model";
import HiveFlowModel from "../../model/mongoose/schemas/hiveFlow.model";
import WeightModel from "../../model/mongoose/schemas/weight.model";
import SubscriberModel from "../../model/mongoose/schemas/subscriber.model";
import { SubscriberLifetime } from "../../model/types/Subscriber";

export class HivesController {
    public async getHives(req: Request, res: Response, next: NextFunction) {
        try {
            const hives = await HiveModel.find({});
            const mappedHives = hives.map(hive => {
                return {
                    id: hive.id,
                    name: hive.name,
                    location: hive.location,
                    createdAt: hive.createdAt,
                    updatedAt: hive.updatedAt,
                    _links: {
                        current_status: `/api/v1/hives/${hive.id}/status`,
                        harvests: `/api/v1/hives/${hive.id}/harvests`
                    }
                };
            });
            if (mappedHives.length > 0) {
                res.status(200).json(
                    {
                        data: {
                            hives: mappedHives
                        }
                    }
                    );
            } else {
                res.status(204).send();
            }
        } catch (error) {
            next(new RequestError('Error getting hives', 500));
        }
    }

    public async getHive(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id;
            const hive = await HiveModel.findById(id);
            if (hive) {
                res.status(200).json({
                    data: {
                        id: hive.id,
                        name: hive.name,
                        location: hive.location,
                        createdAt: hive.createdAt,
                        updatedAt: hive.updatedAt,
                    },
                    _links: {
                        current_status: `/api/v1/hives/${hive.id}/status`,
                        harvests: `/api/v1/hives/${hive.id}/harvests`,
                    }
                });
            } else {
                next(new RequestError('Hive not found', 404));
            }
        } catch (error) {
            next(new RequestError('Error getting hive', 500));
        }

    }

    public async createHive(req: Request, res: Response, next: NextFunction) {
        try {
            const newHive = req.body as Hive;
            const hive = new HiveModel({
                name: newHive.name,
                location: newHive.location,
            });
            await hive.save();
            res.json({hive: hive, message: 'Hive created', _links: {
                self: `/api/v1/hives/${hive.id}`,
            }});
        } catch (error) {
           next(new RequestError('Error creating hive', 500)); 
        }
    }

    public async updateHive(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id;
            const { name, location } = req.body;
            if (!name || !location) {
                next(new RequestError('Missing parameters', 400));
            }

            HiveModel.findByIdAndUpdate(id, { name: name, location: location }).then(() => {
                res.status(200).json({
                    message: 'Hive updated',
                    _links: {
                        self: `/api/v1/hives/${id}`
                    }
                });
            })
            .catch(() => {
                next(new RequestError('Hive not found', 404));
            });
        } catch (error) {
            next(new RequestError('Error updating hive', 500));
        }
    }

    public async deleteHive(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id;
            
            const hive = await HiveModel.findById(id);
            if (hive) {
                await HiveStatusModel.deleteMany({ parent_hive: hive.id })
                await HarvestModel.deleteMany({ parent_hive: hive.id });
                await TemperatureModel.deleteMany({ parent_hive: hive.id });
                await HumidityModel.deleteMany({ parent_hive: hive.id });
                await HiveFlowModel.deleteMany({ parent_hive: hive.id });
                await WeightModel.deleteMany({ parent_hive: hive.id });
                await HiveModel.findByIdAndDelete(id);
                res.status(200).json({
                    message: 'Hive deleted',
                    _links: {
                        hives: '/api/v1/hives'
                    } 
                });
            } else {
                next(new RequestError('Hive not found', 404));
            }
        } catch (error) {
            next(new RequestError('Error deleting hive', 500));
        }
    }

    public async createHarvestReport(req: Request, res: Response, next: NextFunction) {
        try {
            const hiveId = req.params.id;
            const { harvest } = req.body;
            
            if (!harvest) {
                next(new RequestError('Missing parameters', 400));
            }
            const hive = await HiveModel.findById(hiveId);
            if (hive) {
                const harvestReport = new HarvestModel({
                    parent_hive: hiveId,
                    harvest: harvest
                });
                await harvestReport.save();
                SubscriberModel.find({ parent_hive: hiveId }).then(subscribers => {
                    subscribers.forEach(subscriber => {
                        subscriber.notify(harvestReport)
                    });
                });
                res.json({
                    harvest_report: harvestReport,
                    message: 'Harvest report created',
                    _links: {
                        self: `/api/v1/hives/${hiveId}/harvests/${harvestReport.id}`,
                        parent_hive: `/api/v1/hives/${hiveId}`
                    }
                });
            } else {
                next(new RequestError('Parent hive not found', 404));
            }
        } catch (error) {
            next(new RequestError('Error creating harvest report', 500));
        }
    }

    public async getHarvestReports(req: Request, res: Response, next: NextFunction) {
        try {
            const hiveId = req.params.id;
            const harvest = await HarvestModel.find({ parent_hive: hiveId });
            const statusCode = harvest && harvest.length > 0 ? 200 : 204;
            if (harvest) {
                res.status(statusCode).json({
                    data: harvest,
                    _links: {
                        parent_hive: `/api/v1/hives/${hiveId}`
                    }
                });
            } else {
                next(new RequestError('No harvest-reports found', 404));
            }
        } catch (error) {
            next(new RequestError('Error getting harvest reports', 500));
        }
    }

    public async subscribeToHarvestReport(req: Request, res: Response, next: NextFunction) {
        try {
            const hiveId = req.params.id;
            const { lifetime, post_url } = req.body;
            const validLifetime = Object.keys(SubscriberLifetime).includes(lifetime);

            if (!validLifetime || !post_url) {
                next(new RequestError(`Missing parameters lifetime [${Object.keys(SubscriberLifetime).filter(key => isNaN(Number(key)))}] or post_url`, 400));
            }

            const hive = await HiveModel.findById(hiveId);
            if (hive) {
                const hasSubscriber = await SubscriberModel.findOne({ parent_hive: hiveId, post_url: post_url });
                if (hasSubscriber) {
                    next(new RequestError('Subscriber already exists on the same hive with this post_url', 400));
                } else {
                    await SubscriberModel.create({
                        parent_hive: hiveId,
                        lifetime: SubscriberLifetime[lifetime],
                        post_url: post_url
                    });
                    res.status(201).json({
                        message: 'Subscribed to harvest report',
                        _links: {
                            self: `/api/v1/hives/${hiveId}/harvests/subscriptions`,
                            parent_hive: `/api/v1/hives/${hiveId}`
                        }
                    });
                }
            } else {
                next(new RequestError('Parent hive not found', 404));
            }

        } catch (error) {
            next(new RequestError('Error subscribing to harvest report', 500));
        }
    }

    public async unsubscribeToHarvestReports(req: Request, res: Response, next: NextFunction) {
        try {
            const hiveId = req.params.id;
            const { post_url } = req.body;

            if (!post_url) {
                next(new RequestError('Missing parameters post_url', 400));
            }

            const hive = await HiveModel.findById(hiveId);
            if (hive) {
                await SubscriberModel.deleteMany({ parent_hive: hiveId, post_url: post_url });
                res.status(200).json({
                    message: 'Unsubscribed from harvest report',
                    _links: {
                        self: `/api/v1/hives/${hiveId}/harvests/subscriptions`,
                        parent_hive: `/api/v1/hives/${hiveId}`
                    }
                });
            } else {
                next(new RequestError('Parent hive not found', 404));
            }

        } catch (error) {
            next(new RequestError('Error unsubscribing from harvest report', 500));
        }
    }

    public async getHarvestReportSubscriptions(req: Request, res: Response, next: NextFunction) {
        try {
            const hiveId = req.params.id;
            const subscriptions = await SubscriberModel.find({ parent_hive: hiveId });
            const statusCode = subscriptions && subscriptions.length > 0 ? 200 : 204;
            if (subscriptions) {
                res.status(statusCode).json({
                    data: subscriptions.map(subscription => {
                        return {
                            post_url: subscription.post_url,
                            createdAt: subscription.createdAt,
                            expireAt: subscription.expireAt,
                        };
                    }),
                    _links: {
                        parent_hive: `/api/v1/hives/${hiveId}`
                    }
                });
            } else {
                next(new RequestError('No subscriptions found', 404));
            }
        } catch (error) {
            next(new RequestError('Error getting subscriptions', 500));
        }
    }
}