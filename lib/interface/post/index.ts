interface Iimage {
  filename: string;
  path: string;
  type: string;
  _id: string;
}
export interface IPost {
  comments: number;
  content: string;
  createTime: any;
  likes: number;
  title: string;
  view: number;
  writer: string;
  img: Iimage[];
  _id: string;
}
