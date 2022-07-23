import React, { useState, useEffect } from "react";
import Image from "next/image";
import useSpotify from "../../hooks/useSpotify";
import { useSession } from "next-auth/react";
import Song from "../elements/Song";
import { TRACK } from "../../lib/constants/uriTypes";

function LikedSongs() {
  const spotifyApi = useSpotify();
  const { data: session } = useSession();
  const [userLikedSongs, setUserLikedSongs] = useState([]);

  function fetchUserLikedSongs() {
    console.log("function fired!");
    spotifyApi
      .getMySavedTracks({
        limit: 50,
      })
      .then((data) => {
        setUserLikedSongs(data.body?.items);
      })
      .catch((err) => {});
  }

  useEffect(() => {
    fetchUserLikedSongs();
  }, []);

  return (
    <div className="text-white">
      {/* ALBUM ART and NAME */}
      <section
        className={`flex items-end space-x-7 bg-gradient-to-b to-black from-indigo-500 h-80 text-white p-8`}
      >
        <Image
          className="shadow-2xl"
          src="/images/liked_songs.jpg"
          alt=""
          width="176"
          height="176"
        />

        <div>
          <p>PLAYLIST</p>
          <h1 className="font-bold text-2xl md:text-3xl xl:text-5xl mb-2">
            Liked Songs
          </h1>
          <div className="text-white flex items-center space-x-2">
            {
              <img
                className="rounded-full w-5 h-5"
                src={session?.user?.image}
              />
            }
            <span className="font-semibold">{session?.user?.name}</span>
            <div className="h-1 w-1 bg-white rounded-full" />
            <span>{userLikedSongs.length} songs</span>
          </div>
        </div>
      </section>

      <section>
        <div className="px-8 flex flex-col space-y-1 pb-28 text-white">
          {userLikedSongs.map((track, i) => (
            <Song
              key={track.track.id}
              track={track}
              order={i}
              uriType={TRACK}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

export default LikedSongs;
