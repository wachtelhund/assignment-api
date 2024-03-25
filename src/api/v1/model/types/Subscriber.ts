import { ObjectId } from "mongoose";
import { Hive } from "./Hive";

export interface Subscriber {
    post_url: string;
    lifetime: number;
    parent_hive: Hive | ObjectId;
    createdAt: Date;
    updatedAt: Date;
    expireAt: Date;
    notify: (data: any) => Promise<void>;
}

export enum SubscriberLifetime {
    ONE_HOUR = 3600,
    ONE_DAY = 86400,
    ONE_WEEK = 604800,
    ONE_MONTH = 2592000
}