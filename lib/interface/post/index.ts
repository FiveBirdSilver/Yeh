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

export interface IComments {
  content: string;
  writer: string;
  postId: string;
  date?: any;
  _id?: string;
}
