import { Schema, Document, model } from "mongoose";

export interface IAuth extends Document {
  email: string;
  phone: string;
  username: string;
  password: string;
  profile: {
    firstName: string;
    lastName: string;
  };
  dob: Date;
  address: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  role?: "admin" | "superAdmin" | "user";
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
    profile: {
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "superAdmin", "user"],
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Auth = model<IAuth>("Auth", AuthSchema);
