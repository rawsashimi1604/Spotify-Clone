import { atom } from "recoil";
import { HOME } from "../lib/menu";

export const selectedComponentState = atom({
  key: "selectedComponentState",
  default: HOME,
});