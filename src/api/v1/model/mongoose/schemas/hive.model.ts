import mongoose from 'mongoose';
import { ObjectId } from 'mongodb';
import { Hive } from '../../types/Hive';

const schema = new mongoose.Schema<Hive>(
    {
        name: { type: String, required: true },
        location: {
            latitude: { type: Number, required: true },
            longitude: { type: Number, required: true }
        },
        current_status: { type: ObjectId, ref: 'HiveStatus' },
        history: [{ type: ObjectId, ref: 'HiveStatus' }],
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

const HiveModel = mongoose.model<Hive>('Hive', schema);

export default HiveModel;
