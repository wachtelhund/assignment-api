import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { User } from "../../types/User";

const schema = new mongoose.Schema<User>(
    {
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true },
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
                delete ret.password;
            }
        }
    }
);

schema.pre('save', async function (next) {
    this.updatedAt = new Date();
    this.id = this._id.toHexString();
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSaltSync(10);
    this.password = await bcrypt.hash(this.password, salt);
});

schema.methods.comparePassword = async function (password: string) {
    return await bcrypt.compare(password, this.password);
};

const UserModel = mongoose.model('User', schema);

export default UserModel;