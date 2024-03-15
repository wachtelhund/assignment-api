import mongoose from "mongoose";
import { ObjectId } from "mongodb";
import { HiveStatus } from "../../types/HiveStatus";

const schema = new mongoose.Schema<HiveStatus>(
    {
        temperature: { type: Number, required: true },
        humidity: { type: Number, required: true },
        weight: { type: Number, required: true },
        hive_flow: { type: Number, required: true },
        parent_hive: { type: ObjectId, ref: 'Hive', required: true },
        createdAt: { type: Date },
        updatedAt: { type: Date }
    },
    {
        timestamps: true,
        toJSON: {
            transform: (_doc, ret) => {
                ret.id = ret._id;
                delete ret._id;
                delete ret.__v;
            }
        }
    }
);

schema.pre('save', function () {
    this.updatedAt = new Date();
    this.id = this._id.toHexString();
});

const HiveStatusModel = mongoose.model<HiveStatus>('HiveStatus', schema);

export default HiveStatusModel;