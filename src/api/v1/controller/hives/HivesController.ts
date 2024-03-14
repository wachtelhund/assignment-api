import { Request, Response, NextFunction } from "express";
import HiveModel from "../../model/mongoose/schemas/hive.model";
import { RequestError } from "../../../../utils/requestError";
import { Hive } from "../../model/types/Hive";
import HiveStatusModel from "../../model/mongoose/schemas/hiveStatus.model";

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
                        current_status: `/api/v1/hives/${hive.id}/status`
                    }
                };
            });
            if (mappedHives.length > 0) {
                res.status(200).json(mappedHives);
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
                    id: hive.id,
                    name: hive.name,
                    location: hive.location,
                    createdAt: hive.createdAt,
                    updatedAt: hive.updatedAt,
                    _links: {
                        current_status: `/api/v1/hives/${hive.id}/status`
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
            console.log(req.body);
            
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

    public updateHive(req: Request, res: Response, next: NextFunction) {
        res.send('Update Hive');
    }

    public async deleteHive(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id;
            console.log(id);
            
            const hive = await HiveModel.findById(id);
            if (hive) {
                await HiveStatusModel.deleteMany({ parent_hive: hive.id })
                await HiveModel.findByIdAndDelete(id);
                res.status(200).json({ message: 'Hive deleted' });
            } else {
                next(new RequestError('Hive not found', 404));
            }
        } catch (error) {
            next(new RequestError('Error deleting hive', 500));
        }
    }

    public createHarvestReport(req: Request, res: Response, next: NextFunction) {
        res.send('Create Report');
    }

    public getHarvestReport(req: Request, res: Response, next: NextFunction) {
        res.send('Get Report');
    }
}