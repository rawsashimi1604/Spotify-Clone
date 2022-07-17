import React, { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { ChevronDownIcon } from "@heroicons/react/outline";
import { shuffle } from "lodash";

import Songs from "../components/Songs";

import useSpotify from "../hooks/useSpotify";
import { useRecoilValue, useRecoilState } from "recoil";
import { playlistState, playlistIdState } from "../atoms/playlistAtom";

const colors = [
  "from-indigo-500",
  "from-blue-500",
  "from-green-500",
  "from-red-500",
  "from-yellow-500",
  "from-pink-500",
  "from-purple-500",
];

function Center() {
  const spotifyApi = useSpotify();
  const { data: session } = useSession();
  const [color, setColor] = useState(null);
  const playlistId = useRecoilValue(playlistIdState);
  const [playlist, setPlaylist] = useRecoilState(playlistState);

  useEffect(() => {
    setColor(shuffle(colors).pop());
  }, [playlistId]);

  // Whenever playlistId or Tokens change, set playlist data...
  useEffect(() => {
    spotifyApi
      .getPlaylist(playlistId)
      .then((data) => {
        setPlaylist(data.body);
      })
      .catch((err) => console.log("Something went wrong!", err));
  }, [spotifyApi, playlistId]);

  console.log(playlist);

  return (
    <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide">
      <header className="absolute top-5 right-8" onClick={signOut}>
        <div className="flex items-center bg-black text-white space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full p-1 pr-2">
          <img
            className="rounded-full w-10 h-10"
            src={session?.user?.image}
            alt=""
          />
          <h2>{session?.user?.name}</h2>
          <ChevronDownIcon className="h-5 w-5" />
        </div>
      </header>

      {/* ALBUM ART and NAME */}
      <section
        className={`flex items-end space-x-7 bg-gradient-to-b to-black ${color} h-80 text-white p-8`}
      >
        <img
          className="w-44 h-44 shadow-2xl"
          src={playlist?.images?.[0]?.url}
          alt=""
        />

        <div>
          <p>PLAYLIST</p>
          <h1 className="font-bold text-2xl md:text-3xl xl:text-5xl">
            {playlist?.name}
          </h1>
        </div>
      </section>

      {/* SONGS */}
      <section>
        <Songs />
      </section>
    </div>
  );
}

export default Center;
