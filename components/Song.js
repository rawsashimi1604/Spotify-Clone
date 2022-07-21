import React from "react";
import useSpotify from "../hooks/useSpotify";
import { millisToMinutesAndSeconds } from "../lib/time";
import { useRecoilState, useRecoilValue } from "recoil";
import { playlistState } from "../atoms/playlistAtom";
import { currentTrackIdState, isPlayingState } from "../atoms/songAtom";

// Song in a playlist...
function Song({ order, track }) {
  const spotifyApi = useSpotify();
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const playlist = useRecoilValue(playlistState);

  function playSong() {
    setCurrentTrackId(track.track.id);
    setIsPlaying(true);
    spotifyApi.play({
      context_uri: playlist.uri,
      offset: {
        position: order,
      },
      position_ms: 0,
    });
  }

  return (
    <div
      className="grid grid-cols-2 text-gray-500 py-4 px-5 duration-100 ease-in hover:bg-gray-900 rounded-lg cursor-pointer"
      onClick={playSong}
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
