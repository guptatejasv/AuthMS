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
  address: {
    street: string;
    city: string;
    state: string;
    pin: string;
    country: string;
  };
  isTwoFAEnable: boolean;
  isBlocked: boolean;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  emailUpdateToken?: string;
  emailUpdateTokenExpires?: Date;
  role?: "admin" | "superAdmin" | "user";
  isVerified?: boolean;
  isEmailVerified?: boolean;
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

    isTwoFAEnable: {
      type: Boolean,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
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
      street: {
        type: String,
      },
      city: {
        type: String,
      },
      state: {
        type: String,
      },
      pin: {
        type: String,
      },
      country: {
        type: String,
      },
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
    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    emailUpdateToken: String,
    emailUpdateTokenExpires: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Auth = model<IAuth>("Auth", AuthSchema);
