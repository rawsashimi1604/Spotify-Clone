import React, { useState, useEffect } from "react";
import {HOME,SEARCH,YOUR_LIBRARY,CREATE_PLAYLIST, YOUR_EPISODES, LIKED_SONGS, PLAYLIST} from "../lib/menu";
import { useRecoilState } from "recoil";
import { menuOptionState } from "../atoms/appAtom";

import LikedSongs from "./LikedSongs";
import Playlist from "./Playlist";

function Center() {

  const [selectedMenuOption, setSelectedMenuOption] = useRecoilState(menuOptionState);

  function renderSelectedMenuOption() {
    switch (selectedMenuOption) {
      case LIKED_SONGS: return <LikedSongs />
      case PLAYLIST: return <Playlist />
      default: return <LikedSongs />
    }
  }

  return (
    <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide">
      {renderSelectedMenuOption()}
    </div>
  );
}

export default Center;
