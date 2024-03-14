import { ObjectId } from "mongoose";
import { Hive } from "./Hive";

export interface HarvestReport {
    parent_hive: Hive | ObjectId;
    createdAt: Date;
    updatedAt: Date;
    harvest: number;
}