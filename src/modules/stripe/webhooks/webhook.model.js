import mongoose from "mongoose";


const webhookLogSchema = new mongoose.Schema({
  stripeEventId: { type: String, required: true, unique: true },
  type: { type: String, required: true }, // e.g., 'invoice.paid'
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  payload: { type: Object }, // Store the whole JSON for debugging
  status: { type: String, enum: ['success', 'failed', 'pending'], default: 'pending' },
  errorMessage: { type: String },
}, { timestamps: true });


const WebhookLog = mongoose.model('WebhookLog', webhookLogSchema);
export default WebhookLog;