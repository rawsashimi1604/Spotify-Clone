import React, { useState, useEffect } from 'react'
import { useRecoilState } from "recoil"
import { currentTrackIdState, isPlayingState } from '../atoms/songAtom' 
import { useSession } from 'next-auth/react'
import useSpotify from '../hooks/useSpotify'
import useSongInfo from '../hooks/useSongInfo'
import { ReplyIcon, SwitchHorizontalIcon } from '@heroicons/react/outline'
import { RewindIcon, PlayIcon, PauseIcon, FastForwardIcon, } from "@heroicons/react/solid"


function Player() {

  const DEFAULT_VOLUME = 50;

  const spotifyApi = useSpotify();
  const { data: session, status } = useSession();
  const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [volume, setVolume] = useState(DEFAULT_VOLUME);

  const songInfo = useSongInfo();

  function fetchCurrentSong() {
    if (!songInfo) {
      spotifyApi.getMyCurrentPlayingTrack().then(data => {
        
        console.log("now playing: " + data.body?.item);
        setCurrentTrackId(data.body?.item?.id);
        
        spotifyApi.getMyCurrentPlaybackState().then((data) => {
          setIsPlaying(data.body?.is_playing)
        })
      })
    }
  }

  useEffect(() => {
    if (spotifyApi.getAccessToken() && !currentTrackId) {
      // Fetch the song info...
      fetchCurrentSong();
      setVolume(DEFAULT_VOLUME);
    }

  }, [currentTrackIdState, spotifyApi, session])

  function handlePlayPause() {
    spotifyApi.getMyCurrentPlaybackState().then((data) => {
      if (data.body.is_playing) {
        spotifyApi.pause();
        setIsPlaying(false);
      } else {
        spotifyApi.play();
        setIsPlaying(true);
      }
    })
  }

  return (
    <div className='grid grid-cols-3 text-xs md:text-base px-2 md:px-8 h-24 bg-gradient-to-b from-black to-gray-900 text-white'>
      
      {/* Left */}
      <div className='flex items-center space-x-4'>
        <img className='hidden md:inline h-10 w-10' src={songInfo?.album.images?.[0].url} alt=""/>

        <div>
          <h2>{songInfo?.name}</h2>
          <p>{songInfo?.artists?.[0]?.name}</p>
        </div>
      </div>

      {/* Center */}
      <div className='flex items-center justify-evenly'>
        <SwitchHorizontalIcon className='button'/>
        <RewindIcon className='button'/>

        {isPlaying ? 
          <PauseIcon onClick={handlePlayPause} className='button w-10 h-10'/> :
          <PlayIcon onClick={handlePlayPause} className='button w-10 h-10'/>  
        }

        <FastForwardIcon className='button' />

        <ReplyIcon className='button'/>

      </div>
    </div>
  )
}

export default Player