import { atom } from "recoil";
export const loadingState = atom<boolean>({
  key: "loadingState",
  default: false,
});

export const currentUserAuth = atom({
  key: "currentUserState",
  default: "",
});
