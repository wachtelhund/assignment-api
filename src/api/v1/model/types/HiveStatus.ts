export interface HiveStatus {
    parent_hive: string;
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