import mongoose, { Schema } from 'mongoose';
import mongooseDelete from 'mongoose-delete';

const ScriptSchema = new Schema(
  {
    id: { type: String, required: true },
    store_id: { type: String, required: true },
    name: { type: String, required: true },
    src: { type: String, required: true },
    display_scope: { type: String, required: true },
    event_type: { type: String, required: true },
    status: { type: String, required: false, default: 'active' },
  },
  {
    timestamps: true,
  },
);

// Indexes
ScriptSchema.index({ id: 1 }, { unique: true });
ScriptSchema.index({ store_id: 1 }, { unique: true });

// Soft delete plugin
ScriptSchema.plugin(mongooseDelete, {
  overrideMethods: true,
  deletedAt: true,
});

export default mongoose.model('Script', ScriptSchema);
