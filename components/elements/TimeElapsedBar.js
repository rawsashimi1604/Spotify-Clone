import React, { useState, useEffect } from "react";
import useSpotify from "../../hooks/useSpotify";
import useUpdateSongDuration from "../../hooks/useUpdateSongDuration"
import { useRecoilState, useRecoilValue } from "recoil";
import {
  currentTrackIdState,
  isPlayingState,
  trackElapsedTimeState,
} from "../../atoms/songAtom";
import { millisToMinutesAndSeconds } from "../../lib/time";

function TimeElapsedBar({ songInfo }) {

  const timeElapsed = useRecoilValue(trackElapsedTimeState);
  
  const songDuration = songInfo?.duration_ms;
  
  // Logic for updating song duration...
  useUpdateSongDuration(songDuration);

  function getTimeElapsedPrc() {
    return Math.min((timeElapsed / songDuration) * 100, 100) || 1;
  }

  return (
    <div className="flex space-x-2 justify-between items-center">
      <span className="text-gray-500 text-sm">
        {millisToMinutesAndSeconds(timeElapsed)}
      </span>
      <div className="w-full bg-gray-800 rounded-full h-1.5 dark:bg-gray-700">
        <div
          className="bg-white h-1.5 rounded-full"
          style={{ width: `${getTimeElapsedPrc()}%` }}
        />
      </div>
      <span className="text-gray-500 text-sm">
        {millisToMinutesAndSeconds(songDuration)}
      </span>
    </div>
  );
}

export default TimeElapsedBar;
