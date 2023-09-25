import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
import { LoggingType } from "../lib/interface/user";
import { IKeyword } from "../lib/interface/post";

const sessionStorage = typeof window !== "undefined" ? window.sessionStorage : undefined;
const { persistAtom } = recoilPersist({ key: "yeh", storage: sessionStorage });

// 유저 State
const userState = atom<LoggingType>({
  key: "userState",
  default: { nickname: "", id: "", logging: false },
  effects_UNSTABLE: [persistAtom],
});

// 검색 State
const keywordState = atom<IKeyword>({
  key: "keywordState",
  default: { keyword: "" },
});

export { userState, keywordState };
