import { Schema, Document, model } from "mongoose";

export interface IAuth extends Document {
  email: string;
  phone: string;
  username: string;
  password: string;
  isVerified?: boolean;
  otp?: string;
}

const AuthSchema: Schema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Auth = model<IAuth>("User", AuthSchema);
