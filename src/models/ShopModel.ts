import mongoose, { Schema } from 'mongoose';
import mongooseDelete from 'mongoose-delete';

const ShopModelSchema = new Schema(
  {
    id: { type: String, required: true },
    store_id: { type: String, required: true },
    token: { type: String, required: true },
    shop: { type: Object, required: true },
  },
  { timestamps: true },
);

// Indexes
ShopModelSchema.index({ id: 1 }, { unique: true });
ShopModelSchema.index({ shop_id: 1 }, { unique: true });

// Soft delete plugin
ShopModelSchema.plugin(mongooseDelete, {
  overrideMethods: true,
  deletedAt: true,
});

export default mongoose.model('Shop', ShopModelSchema);
