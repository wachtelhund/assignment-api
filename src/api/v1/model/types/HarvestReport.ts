import { ObjectId } from "mongoose";
import { Hive } from "./Hive";

export interface HarvestReport {
    id?: string;
    parent_hive: Hive | ObjectId;
    createdAt: Date;
    updatedAt: Date;
    harvest: number;
}