import { atom } from "recoil";
import {
  HOME,
  SEARCH,
  YOUR_LIBRARY,
  CREATE_PLAYLIST,
  YOUR_EPISODES,
  LIKED_SONGS,
  PLAYLIST,
} from "../lib/constants/menu";

export const menuOptionState = atom({
  key: "menuOptionState",
  default: LIKED_SONGS,
});
