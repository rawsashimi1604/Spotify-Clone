import React, { useState, useEffect, useCallback } from "react";
import { useRecoilState, useSetRecoilState, useRecoilValue } from "recoil";
import {
  currentTrackIdState,
  isPlayingState,
  trackElapsedTimeState,
  currentTrackUriState,
} from "../../atoms/songAtom";
import { menuOptionState } from "../../atoms/appAtom";
import { useSession } from "next-auth/react";
import useSpotify from "../../hooks/useSpotify";
import useSongInfo from "../../hooks/useSongInfo";
import {
  ReplyIcon,
  SwitchHorizontalIcon,
  VolumeOffIcon,
} from "@heroicons/react/outline";
import {
  RewindIcon,
  PlayIcon,
  PauseIcon,
  FastForwardIcon,
  VolumeUpIcon,
} from "@heroicons/react/solid";
import { debounce } from "lodash";
import TimeElapsedBar from "../elements/TimeElapsedBar";
import { PLAYLIST, TRACK, ALBUM } from "../../lib/constants/uriTypes"

function Player() {
  const DEFAULT_VOLUME = 50;

  const spotifyApi = useSpotify();
  const { data: session, status } = useSession();
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [volume, setVolume] = useState(DEFAULT_VOLUME);
  const setTimeElapsed = useSetRecoilState(trackElapsedTimeState);
  const selectedMenuOption = useRecoilValue(menuOptionState);
  const currentTrackUri = useRecoilValue(currentTrackUriState);

  const songInfo = useSongInfo();

  // If there is no song information present, fetch the currently playing song.
  function fetchCurrentSong() {
    if (!songInfo) {
      spotifyApi.getMyCurrentPlayingTrack().then((data) => {
        setCurrentTrackId(data.body?.item?.id);

        spotifyApi.getMyCurrentPlaybackState().then((data) => {
          setIsPlaying(data.body?.is_playing);
        });
      });
    }
  }

  // Initial load up...
  useEffect(() => {
    if (spotifyApi.getAccessToken() && !currentTrackId) {
      // Fetch the song info...
      fetchCurrentSong();
      setVolume(DEFAULT_VOLUME);
    }
  }, [currentTrackId, spotifyApi, session]);

  function handlePlayPause() {
    spotifyApi.getMyCurrentPlaybackState().then((data) => {
      if (data.body.is_playing) {
        spotifyApi.pause();
        setIsPlaying(false);
      } else {
        spotifyApi.play();
        setTimeElapsed(data.body.progress_ms);
        setIsPlaying(true);
      }
    });
  }

  // Debounce get current playing track as some time is needed to update current playing track from Spotify's API server side
  const debouncedGetCurrentPlayingTrack = debounce(() => {
    spotifyApi.getMyCurrentPlayingTrack().then((data) => {
      setCurrentTrackId(data.body?.item?.id);
    });
  }, 500);

  function handleNextTrack() {
    if (currentTrackUri === PLAYLIST) {
      spotifyApi
      .skipToNext()
      .then((res) => {
        debouncedGetCurrentPlayingTrack();
        setIsPlaying(true);
      })
      .catch((err) => {
        console.log("Could not handle next track.");
      });
    }
    
  }

  function handlePreviousTrack() {
    if (currentTrackUri === PLAYLIST) {
      spotifyApi
      .skipToPrevious()
      .then((res) => {
        debouncedGetCurrentPlayingTrack();
        setIsPlaying(true);
      })
      .catch((err) => {
        console.log("Could not handle previous track.");
      });
    }
  }

  // Debounce setVolume API Call to prevent from excessively abusing api call.
  const debounceAdjustVolume = useCallback(
    debounce((volume) => {
      spotifyApi.setVolume(volume).catch((err) => {});
    }, parseInt(500)),
    []
  );

  useEffect(() => {
    if (volume >= 0 && volume <= 100) {
      debounceAdjustVolume(volume);
    }
  }, [volume]);

  return (
    <div className="grid grid-cols-3 text-xs md:text-base px-2 md:px-8 h-24 bg-gradient-to-b from-black to-gray-900 text-white">
      {/* Left */}
      <div className="flex items-center space-x-4">
        <img
          className="hidden md:inline h-10 w-10"
          src={songInfo?.album.images?.[0].url}
          alt=""
        />

        <div>
          <h2>{songInfo?.name}</h2>
          <p>{songInfo?.artists?.[0]?.name}</p>
        </div>
      </div>

      {/* Center */}
      <div className="flex flex-col space-y-2 justify-center">
        {/* Buttons */}
        <div className="flex items-center justify-between md:justify-center md:space-x-6 lg:space-x-8">
          {/* <SwitchHorizontalIcon className="button" /> */}

          <button onClick={handlePreviousTrack} className="button disabled:opacity-70 disabled:pointer-events-none" disabled={currentTrackUri !== PLAYLIST}>
            <RewindIcon  />
          </button>

          {isPlaying ? (
            <PauseIcon onClick={handlePlayPause} className="button w-10 h-10" />
          ) : (
            <PlayIcon onClick={handlePlayPause} className="button w-10 h-10" />
          )}

          <button onClick={handleNextTrack} className="button disabled:text-gray-500 disabled:pointer-events-none" disabled={currentTrackUri !== PLAYLIST}>
            <FastForwardIcon />
          </button>

          {/* <ReplyIcon className="button" /> */}
        </div>

        {/* Timestamp */}
        <TimeElapsedBar songInfo={songInfo} />
      </div>

      {/* Right */}
      <div className="flex items-center space-x-3 md:space-x-4 justify-end pr-5">
        {volume === 0 ? (
          <VolumeOffIcon
            onClick={() => setVolume(DEFAULT_VOLUME)}
            className="button"
          />
        ) : (
          <VolumeUpIcon onClick={() => setVolume(0)} className="button" />
        )}

        <input
          type="range"
          min={0}
          max={100}
          value={volume}
          className="w-14 md:w-28"
          onChange={(e) => setVolume(Number(e.target.value))}
        />
      </div>
    </div>
  );
}

export default Player;
