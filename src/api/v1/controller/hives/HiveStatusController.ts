import { Request, Response, NextFunction } from "express";

export class HiveStatusController {
    public getHiveStatus(req: Request, res: Response, next: NextFunction) {
        res.send('Hive Status');
    }

    public createHiveStatus(req: Request, res: Response, next: NextFunction) {
        res.send('Create Hive Status');
    }

    public getHiveHumidity(req: Request, res: Response, next: NextFunction) {
        res.send('Hive Humidity');
    }

    public getHiveWeight(req: Request, res: Response, next: NextFunction) {
        res.send('Hive Weight');
    }

    public getHiveTemperature(req: Request, res: Response, next: NextFunction) {
        res.send('Hive Temperature');
    }

    public getHiveArrivalDepartureFlow(req: Request, res: Response, next: NextFunction) {
        res.send('Hive Arrival Departure Flow');
    }
}