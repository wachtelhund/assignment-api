import { ObjectId } from "mongoose";
import { Hive } from "./Hive";

export interface HiveStatus {
    parent_hive: Hive | ObjectId;
    temperature: number;
    humidity: number;
    weight: number;
    hive_flow: FlowInstance;
    createdAt: Date;
    updatedAt: Date;
}

export interface FlowInstance {
    departures: number;
    arrivals: number;
}