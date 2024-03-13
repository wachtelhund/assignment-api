import { HiveStatus } from "./HiveStatus";

export interface Hive {
    name: string;
    location: {
        latitude: number;
        longitude: number;
    };
    current_status: HiveStatus;
    history?: HiveStatus[];
    createdAt: Date;
    updatedAt: Date;
}