import mongoose, { Schema } from 'mongoose';
import mongooseDelete from 'mongoose-delete';

const StoreModelSchema = new Schema(
  {
    appkey: { type: String, required: true },
    handle: { type: String, required: true },
    shop_id: { type: String, required: true },
    merchant_id: { type: String, required: true },
    store_name: { type: String, required: true },
    store: { type: Object, required: true },
    scopes: { type: Array, required: true },
  },
  { timestamps: true },
);

// Indexes
StoreModelSchema.index({ appkey: 1 }, { unique: true });
StoreModelSchema.index({ shop_id: 1 }, { unique: true });

// Soft delete plugin
StoreModelSchema.plugin(mongooseDelete, {
  overrideMethods: true,
  deletedAt: true,
});

export default mongoose.model('Store', StoreModelSchema);
