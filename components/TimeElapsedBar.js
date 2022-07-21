import React, { useState, useEffect } from 'react'
import { useRecoilState } from "recoil";
import { currentTrackIdState, isPlayingState, trackElapsedTimeState } from "../atoms/songAtom";
import { millisToMinutesAndSeconds } from '../lib/time';

function TimeElapsedBar({ songInfo }) {
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [timeElapsed, setTimeElapsed] = useRecoilState(trackElapsedTimeState)
  
  // TIMER to update time elapsed playing the song...
  useEffect(() => {
    if (currentTrackId && isPlaying) {
      const interval = setInterval(() => {
        // spotifyApi.getMyCurrentPlayingTrack().then((data) => {
        //   setTimeElapsed(data.body?.progress_ms);
        // })
        setTimeElapsed(prevTime => prevTime += 1000)
      }, 1000)
      return () => clearInterval(interval);
    }
  })

  return (
    <div className="flex space-x-2 justify-between items-center">
      <span className="text-gray-500 text-sm">{millisToMinutesAndSeconds(timeElapsed)}</span>
      <div className="w-full bg-gray-800 rounded-full h-1.5 dark:bg-gray-700">
        <div 
          className="bg-white h-1.5 rounded-full" 
          style={{width: "45%"}}
        />
      </div>
      <span className="text-gray-500 text-sm">{millisToMinutesAndSeconds(songInfo?.duration_ms)}</span>
    </div>
  )
}

export default TimeElapsedBar