import mongoose, { Schema, models } from "mongoose";

export const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
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
  },
  { collection: "User" }
);

const User = models?.User || mongoose.model("User", UserSchema);

export default User;
