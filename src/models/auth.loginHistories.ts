import { Schema, Document, model, ObjectId } from "mongoose";

export interface IAuth extends Document {
  userId: ObjectId;
  loginTime: Date;
  ipAdress: string;
  role: string;
}

const AuthSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "Auth", required: true },
    logintime: {
      type: Date,
      default: Date.now,
    },

    ipAddress: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
  },

  {
    timestamps: true,
    versionKey: false,
  }
);

export const LoginHistory = model<IAuth>("LoginHistory", AuthSchema);
