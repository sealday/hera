import * as mongoose from 'mongoose';

export const CounterSchema = new mongoose.Schema({
    _id: String,
    seq: { type: Number, default: 0 },
}, { timestamps: true });