import mongoose, { Schema, models } from "mongoose";

export const UserSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    nickname: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
    },
    authCode: {
      type: Number,
    },
  },
  { collection: "User" }
);

const User = models?.User || mongoose.model("User", UserSchema);

export default User;
