import mongoose, { Schema, Document } from 'mongoose';

export interface IConsultationBooking extends Document {
  service: string;
  date: string;
  time: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  message: string;
  budget: string;
  status: 'pending_payment' | 'paid';
  stripeSessionId: string;
  emailsSent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ConsultationBookingSchema = new Schema<IConsultationBooking>(
  {
    service: { type: String, required: true, trim: true },
    date: { type: String, required: true, trim: true },
    time: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true, maxlength: 200 },
    company: { type: String, default: '', trim: true, maxlength: 200 },
    email: { type: String, required: true, trim: true, maxlength: 320 },
    phone: { type: String, default: '', trim: true, maxlength: 80 },
    message: { type: String, required: true, trim: true, maxlength: 8000 },
    budget: { type: String, default: '', trim: true, maxlength: 120 },
    status: {
      type: String,
      enum: ['pending_payment', 'paid'],
      default: 'pending_payment',
    },
    stripeSessionId: { type: String, default: '', trim: true },
    emailsSent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

ConsultationBookingSchema.index({ stripeSessionId: 1 });

export default mongoose.models.ConsultationBooking ||
  mongoose.model<IConsultationBooking>('ConsultationBooking', ConsultationBookingSchema);
