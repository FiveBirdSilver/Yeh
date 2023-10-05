import mongoose, { Schema, models } from "mongoose";

export const UserSchema = new Schema(
  {
    userId: {
      type: String,
      unique: true,
      required: true,
    },
    nickname: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
  },
  { collection: "User" }
);

const User = models?.User || mongoose.model("User", UserSchema);

export default User;
