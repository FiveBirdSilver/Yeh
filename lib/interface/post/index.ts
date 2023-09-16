interface Iimage {
  filename: string;
  path: string;
  type: string;
  _id: string;
}

export interface IComments {
  content: string;
  writer: string;
  postId: string;
  writeTime?: Date;
  _id?: string;
}

export interface ILikes {
  username: string;
  postId: string;
  _id?: string;
}

export interface IPost {
  comments: IComments[];
  content: string;
  createTime: any;
  likes: ILikes[];
  title: string;
  view: number;
  writer: string;
  img: Iimage[];
  _id: string;
}
