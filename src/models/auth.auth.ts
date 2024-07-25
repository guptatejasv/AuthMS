import { Schema, Document, model, ObjectId } from "mongoose";

export interface IAuth extends Document {
  twoFAOtp?: string;
  twoFAEmailOtp?: string;

  phone?: string;
  email?: string;
  userId: ObjectId;
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
    },
    twoFAEmailOtp: {
      type: String,
    },
    twoFAOtp: {
      type: String,
    },
    email: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const TwoFactorAuth = model<IAuth>("TwoFactorAuth", AuthSchema);
