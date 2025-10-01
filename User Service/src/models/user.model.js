import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 5, // better than min:5
    },
    role: {
      type: String,
      default: "user",
    },
    verification_token: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: {
      type: String, // store reset token for password recovery
    },
    resetPasswordExpire: {
      type: Date, // store expiry of reset token
    },
    playList: [
      {
        type: String,
        default: [],
      },
    ],
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
