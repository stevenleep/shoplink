import { ManifestFileProcess } from '@/types/Manifest';
import mongoose, { Schema } from 'mongoose';
import mongooseDelete from 'mongoose-delete';

const ManifestSchema = new Schema(
  {
    id: { type: String, required: true },
    created_at: { type: Date, required: true },
    shop_id: { type: String, required: true },
    manifest_id: { type: String, required: true },
    process: { type: String, required: false, default: ManifestFileProcess.PENDING },
    config_type: { type: String, required: true },
    file_name: { type: String, required: true },
    type: { type: String, required: false, default: 'json' },
    path: { type: String, required: true },
    manifest: { type: Object, required: true, default: {} },
  },
  {
    timestamps: true,
  },
);

// Indexes
ManifestSchema.index({ id: 1 }, { unique: true });
ManifestSchema.index({ shop_id: 1 }, { unique: true });
ManifestSchema.index({ manifest_id: 1 }, { unique: true });

// Soft delete plugin
ManifestSchema.plugin(mongooseDelete, {
  overrideMethods: true,
  deletedAt: true,
});

export default mongoose.model('Manifest', ManifestSchema);
