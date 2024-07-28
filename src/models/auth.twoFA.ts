import { Schema, Document, model, ObjectId } from "mongoose";

export interface IAuth extends Document {
  method: string;
  userId: ObjectId;
  secret: string;
  email: string;
}

const AuthSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "Auth",
      required: true,
    },
    method: {
      type: String,
      required: true,
      default: "phone",
    },
    secret: String,
    email: String,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const TwoFactorAuthMethod = model<IAuth>(
  "TwoFactorAuthMethod",
  AuthSchema
);
