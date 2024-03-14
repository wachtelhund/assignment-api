import mongoose from "mongoose";

const schema = new mongoose.Schema(
    {
        parent_hive: { type: mongoose.Schema.Types.ObjectId, ref: 'Hive', required: true },
        temperature: { type: Number, required: true },
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

const TemperatureModel = mongoose.model('Temperature', schema);

export default TemperatureModel;