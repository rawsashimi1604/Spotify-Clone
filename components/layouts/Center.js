import React, { useState, useEffect } from "react";
import {
  HOME,
  SEARCH,
  YOUR_LIBRARY,
  CREATE_PLAYLIST,
  YOUR_EPISODES,
  LIKED_SONGS,
  PLAYLIST,
} from "../../lib/constants/menu";
import { useRecoilState } from "recoil";
import { menuOptionState } from "../../atoms/appAtom";

import Header from "../elements/Header";
import LikedSongs from "../pages/LikedSongs";
import Playlist from "../pages/Playlist";

function Center() {
  const [selectedMenuOption, setSelectedMenuOption] =
    useRecoilState(menuOptionState);

  // Render Center screen based on which menu option is selected.
  function renderSelectedMenuOption() {
    switch (selectedMenuOption) {
      case LIKED_SONGS:
        return <LikedSongs />;
      case PLAYLIST:
        return <Playlist />;
      default:
        return <LikedSongs />;
    }
  }

  return (
    <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide">
      <Header />
      {renderSelectedMenuOption()}
    </div>
  );
}

export default Center;
