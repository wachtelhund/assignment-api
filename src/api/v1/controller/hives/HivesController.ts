import { Request, Response, NextFunction } from "express";

export class HivesController {
    public getHives(req: Request, res: Response, next: NextFunction) {
        res.send('All Hives');
    }

    public getHive(req: Request, res: Response, next: NextFunction) {
        res.send('Get Hive');
    }

    public createHive(req: Request, res: Response, next: NextFunction) {
        res.send('Create Hive');
    }

    public updateHive(req: Request, res: Response, next: NextFunction) {
        res.send('Update Hive');
    }

    public deleteHive(req: Request, res: Response, next: NextFunction) {
        res.send('Delete Hive');
    }

    public createHarvestReport(req: Request, res: Response, next: NextFunction) {
        res.send('Create Report');
    }

    public getHarvestReport(req: Request, res: Response, next: NextFunction) {
        res.send('Get Report');
    }
}