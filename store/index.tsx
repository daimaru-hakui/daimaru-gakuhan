import { atom } from "recoil";
export const loadingState = atom<boolean>({
  key: "loadingState",
  default: false,
});

export const currentUserState = atom({
  key: "currentUserState",
  default: "",
});

export const projectsState = atom({
  key: "projectsState",
  default: [],
});
