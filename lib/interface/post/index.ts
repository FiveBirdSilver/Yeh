export interface IKeyword {
  keyword: string;
}
export interface IPost {
  comments: IComments[];
  content: string;
  createTime: any;
  likes: string[];
  title: string;
  view: number;
  writer: {
    nickname: string;
    id: string;
  };
  img: Iimage[];
  _id: string;
}

export interface IDeletePost {
  postId: string;
}
export interface ILikes {
  id: string;
  postId: string;
}
export interface Iimage {
  filename: string;
  path: string;
  type: string;
  _id: string;
}

export interface IComments {
  content: string;
  userId: string;
  nickname: string;
  postId: string;
  writeTime?: Date;
  _id?: string;
}

export interface IDeleteComments {
  postId: string;
  commentId: string;
}
