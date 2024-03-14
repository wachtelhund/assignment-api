import { ObjectId } from "mongoose";
import { HarvestReport } from "./HarvestReport";
import { HiveStatus } from "./HiveStatus";

export interface Hive {
    name: string;
    location: {
        latitude: number;
        longitude: number;
    };
    current_status: HiveStatus | ObjectId;
    harvest_reports?: HarvestReport[];
    createdAt: Date;
    updatedAt: Date;
}