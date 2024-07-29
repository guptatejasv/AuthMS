import { Schema, Document, model, ObjectId } from "mongoose";

export interface IAuth extends Document {
  otp: string;
  userId: ObjectId;
  phone: string;
  updateEmailOtp?: string;
  updatePhoneOtp?: string;
}

const AuthSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "Auth",
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
    },
    updateEmailOtp: {
      type: String,
    },
    updatePhoneOtp: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Verification = model<IAuth>("Verification", AuthSchema);
