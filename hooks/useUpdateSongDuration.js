import { useEffect, useState } from "react";
import useSpotify from "./useSpotify";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  currentTrackIdState,
  isPlayingState,
  trackElapsedTimeState,
} from "../atoms/songAtom";

// Updates TimeElapsedBar logic based on duration of song played...
function useUpdateSongDuration(songDuration) {
  const spotifyApi = useSpotify();

  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const isPlaying = useRecoilValue(isPlayingState);
  const [timeElapsed, setTimeElapsed] = useRecoilState(trackElapsedTimeState);
  const [timeElapsedIteration, setTimeElapsedIteration] = useState(0);

  const TRACK_DURATION_REFRESH_COUNT = 5;
  const UPDATE_UI_LOOKAHEAD_DURATION = 500;
  const songDurationBuffer = songDuration % 1000;

  // Sync time elapsed locally or by using spotify's API call...
  useEffect(() => {
    if (currentTrackId && isPlaying) {
      const interval = setInterval(() => {
        // Local Update...
        if (timeElapsedIteration < TRACK_DURATION_REFRESH_COUNT) {
          setTimeElapsed((prevTime) => (prevTime += 1000));
          setTimeElapsedIteration((prev) => prev + 1);
        }

        // Update using Spotify API
        else {
          spotifyApi.getMyCurrentPlaybackState().then((data) => {
            setTimeElapsed(data.body?.progress_ms);
            setCurrentTrackId(data.body?.item?.id);
          });
          setTimeElapsedIteration(0);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  });

  // If current track has finished, update UI using spotify API...
  useEffect(() => {
    if (
      timeElapsed + songDurationBuffer >=
      songDuration + UPDATE_UI_LOOKAHEAD_DURATION
    ) {
      setTimeElapsed(0);
      spotifyApi.getMyCurrentPlayingTrack().then((data) => {
        setCurrentTrackId(data.body?.item?.id);
      });
    }
  }, [timeElapsed]);
}

export default useUpdateSongDuration;
