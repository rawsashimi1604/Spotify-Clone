import { useEffect, useState } from "react";
import useSpotify from "./useSpotify";
import { useRecoilState } from "recoil";
import {
  currentTrackIdState,
  isPlayingState,
  trackElapsedTimeState,
} from "../atoms/songAtom";

function useSongInfo() {
  const spotifyApi = useSpotify();
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [songInfo, setSongInfo] = useState(null);
  const [timeElapsed, setTimeElapsed] = useRecoilState(trackElapsedTimeState);

  useEffect(() => {
    const fetchSongInfo = async () => {
      if (currentTrackId) {
        const trackInfo = await fetch(
          `https://api.spotify.com/v1/tracks/${currentTrackId}`,
          {
            headers: {
              Authorization: `Bearer ${spotifyApi.getAccessToken()}`,
            },
          }
        ).then((res) => res.json());

        setTimeElapsed(0);
        setSongInfo(trackInfo);
      }
    };

    fetchSongInfo();
  }, [currentTrackId, spotifyApi]);

  return songInfo;
}

export default useSongInfo;
