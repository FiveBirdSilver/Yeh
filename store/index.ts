import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const sessionStorage = typeof window !== "undefined" ? window.sessionStorage : undefined;
const { persistAtom } = recoilPersist({ key: "yeh", storage: sessionStorage });

// 검색 State
const keywordState = atom<string>({
  key: "keywordState",
  default: "",
  effects_UNSTABLE: [persistAtom],
});

export { keywordState };
