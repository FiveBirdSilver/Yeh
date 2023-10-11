import mongoose, { Schema, models } from "mongoose";

export const UserSchema = new Schema(
  {
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
    email: {
      type: String,
      unique: true,
      required: true,
    },
  },
  { collection: "User" }
);

const User = models?.User || mongoose.model("User", UserSchema);

export default User;
