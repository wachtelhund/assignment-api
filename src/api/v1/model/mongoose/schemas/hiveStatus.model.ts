import mongoose from "mongoose";
import { HiveStatus } from "../../types/HiveStatus";

const schema = new mongoose.Schema<HiveStatus>({
    temperature: { type: Number, required: true },
    humidity: { type: Number, required: true },
    weight: { type: Number, required: true },
    hive_flow: {
        departures: { type: Number, required: true },
        arrivals: { type: Number, required: true }
    },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true }
}, {
    timestamps: true,
    toJSON: {
        transform: (_doc, ret) => {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        }
    }
});

schema.pre('save', function () {
    this.updatedAt = new Date();
    this.id = this._id.toHexString();
});

const hiveStatus = mongoose.model<HiveStatus>('HiveStatus', schema);

export default hiveStatus;