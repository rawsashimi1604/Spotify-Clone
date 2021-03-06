import React from "react";
import useSpotify from "../../hooks/useSpotify";
import { millisToMinutesAndSeconds } from "../../lib/time";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { playlistState } from "../../atoms/playlistAtom";
import {
  currentTrackIdState,
  isPlayingState,
  trackElapsedTimeState,
  currentTrackUriState,
} from "../../atoms/songAtom";
import { menuOptionState } from "../../atoms/appAtom";
import { PLAYLIST, TRACK, ALBUM } from "../../lib/constants/uriTypes";

// Song in a playlist...
function Song({ order, track, uriType }) {
  const spotifyApi = useSpotify();
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [currentTrackUri, setCurrentTrackUri] =
    useRecoilState(currentTrackUriState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [selectedMenuOption, setSelectedMenuOption] =
    useRecoilState(menuOptionState);
  const setTimeElapsed = useSetRecoilState(trackElapsedTimeState);
  const playlist = useRecoilValue(playlistState);

  function playSong() {
    setCurrentTrackId(track.track.id);
    setCurrentTrackUri(uriType);
    setIsPlaying(true);
    setTimeElapsed(0);

    switch (uriType) {
      case PLAYLIST: {
        spotifyApi.play({
          context_uri: playlist.uri,
          offset: {
            position: order,
          },
          position_ms: 0,
        });
        break;
      }
      case TRACK: {
        spotifyApi.play({
          uris: [track.track.uri],
        });
        break;
      }
    }
  }

  return (
    <div
      className="grid grid-cols-2 text-gray-500 py-4 px-5 duration-100 ease-in hover:bg-gray-900 rounded-lg cursor-pointer"
      onClick={() => playSong()}
    >
      <div className="flex items-center space-x-4 ">
        <p className="w-4 min-w-4 text-right">{order + 1}</p>
        <img className="h-10 w-10" src={track.track.album.images?.[0]?.url} />
        <div>
          <p className="w-36 lg:w-64 truncate text-white">{track.track.name}</p>
          <p className="w-40">{track.track.artists[0].name}</p>
        </div>
      </div>

      <div className="flex items-center justify-between ml-auto md:ml-0">
        <p className="w-40 hidden md:inline">{track.track.album.name}</p>
        <p>{millisToMinutesAndSeconds(track.track.duration_ms)}</p>
      </div>
    </div>
  );
}

export default Song;
