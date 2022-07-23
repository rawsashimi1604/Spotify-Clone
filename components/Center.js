import React, { useState, useEffect } from "react";
import Playlist from "./Playlist";

function Center() {

  return (
    <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide">
      <Playlist />
    </div>
  );
}

export default Center;
