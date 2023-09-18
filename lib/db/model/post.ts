import mongoose, { Schema, models } from "mongoose";

const WriterSchema = new mongoose.Schema({
  id: String,
  nickname: String,
});

const ImageSchema = new mongoose.Schema({
  filename: String,
  path: String,
  type: String,
});

const CommentSchema = new mongoose.Schema({
  userId: String,
  nickname: String,
  content: String,
  writeTime: Date,
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
      type: WriterSchema,
      required: true,
    },
    view: {
      type: Number,
      required: true,
    },
    comments: {
      type: [CommentSchema] || [],
      required: true,
    },
    likes: {
      type: [String] || [],
      required: true,
    },
  },
  { collection: "Post" }
);

const Post = models?.Post || mongoose.model("Post", PostSchema);

export default Post;
