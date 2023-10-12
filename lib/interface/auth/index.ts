export interface ISignUP {
  confirmPassword: string;
  email: string;
  nickname: string;
  password: string;
}
export interface ISignIn {
  email: string;
  password: string;
}

export interface LoggingType {
  nickname: string;
}
export interface IConfirm {
  message: string;
  nickname: string;
}
export interface ISendEmail {
  email: string;
}
