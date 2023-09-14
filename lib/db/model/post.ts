import mongoose, { Schema, models } from "mongoose";

const ImageSchema = new mongoose.Schema({
  filename: String,
  path: String,
  type: String,
});

const ContentSchema = new mongoose.Schema({
  content: String,
  writer: String,
});

export const PostSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    img: {
      type: [ImageSchema],
    },
    createTime: {
      type: Date,
      required: true,
    },
    writer: {
      type: String,
      required: true,
    },
    view: {
      type: Number,
      required: true,
    },
    comments: {
      type: [ContentSchema] || [],
      required: true,
    },
    likes: {
      type: Number,
      required: true,
    },
    imag: {
      type: Number,
    },
  },
  { collection: "Post" }
);

const Post = models?.Post || mongoose.model("Post", PostSchema);

export default Post;
