import { atom } from "recoil";

export const currentTrackIdState = atom({
  key: "currentTrackIdState",
  default: null,
});

export const isPlayingState = atom({
  key: "isPlayingState",
  default: false,
});

export const trackElapsedTimeState = atom({
  key: "trackElapsedTimeState",
  default: 0,
});
