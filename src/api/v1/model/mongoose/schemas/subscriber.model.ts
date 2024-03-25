import mongoose from "mongoose";
import { Subscriber } from "../../types/Subscriber";
import { HarvestReport } from "../../types/HarvestReport";

const schema = new mongoose.Schema<Subscriber>({
        parent_hive: { type: mongoose.Schema.Types.ObjectId, ref: 'Hive', required: true },
        post_url: { type: String, required: true },
        lifetime: { type: Number, required: true },
        expireAt: { type: Date, expires: 0 },
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
    this.expireAt = new Date(Date.now() + this.lifetime * 1000);
});

schema.methods.notify = async function (data: HarvestReport) {
    const body = {
        message: `Hive ${this.parent_hive} has a new harvest of ${data.harvest} grams`,
        data: {
            harvest: data.harvest,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
        },
        _links: {
            harvests: `/api/v1/hives/${this.parent_hive}/harvests`,
            parent_hive: `/api/v1/hives/${this.parent_hive}`
        }
    }
    await fetch(this.post_url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });
};

const SubscriberModel = mongoose.model('Subscriber', schema);

export default SubscriberModel;