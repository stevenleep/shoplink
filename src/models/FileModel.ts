import mongoose, { Schema } from 'mongoose';
import mongooseDelete from 'mongoose-delete';

const FileSchema = new Schema({
    id: { type: String, required: true },
    version: { type: String, required: true },
    file_id: { type: String, required: true },
    name: { type: String, required: true },
    size: { type: Number, required: true },
    status: { type: String, required: true },
    file_path: { type: String, required: true },
    type: { type: String, required: true },
    file_type: { type: String, required: true },
},
    { timestamps: true }
);

// Indexes
FileSchema.index({ id: 1 }, { unique: true });
FileSchema.index({ file_id: 1 }, { unique: true });

// Soft delete plugin
FileSchema.plugin(mongooseDelete, {
    overrideMethods: true,
    deletedAt: true,
});

export default mongoose.model('File', FileSchema);