import mongoose, { Schema } from 'mongoose';
import mongooseDelete from 'mongoose-delete';

const ShoplazzaShopModelSchema = new Schema({},{timestamps: true});

// Indexes
ShoplazzaShopModelSchema.index({ id: 1 }, { unique: true });
ShoplazzaShopModelSchema.index({ shop_id: 1 }, { unique: true });

// Soft delete plugin
ShoplazzaShopModelSchema.plugin(mongooseDelete, {
    overrideMethods: true,
    deletedAt: true,
});

export default mongoose.model('Shop', ShoplazzaShopModelSchema);