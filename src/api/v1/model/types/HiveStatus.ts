import { ObjectId } from "mongoose";
import { Hive } from "./Hive";

export interface HiveStatus {
    parent_hive: Hive | ObjectId;
    temperature: number;
    humidity: number;
    weight: number;
    hive_flow: number;
    createdAt: Date;
    updatedAt: Date;
}