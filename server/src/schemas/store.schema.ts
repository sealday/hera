import * as mongoose from 'mongoose';

export const StoreSchema = new mongoose.Schema({
  key: String,
  value: String,
}, { timestamps: true });