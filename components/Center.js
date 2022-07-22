import React, { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { ChevronDownIcon, DotsCircleHorizontalIcon, DotsHorizontalIcon } from "@heroicons/react/outline";
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
  const [ownerDetails, setOwnerDetails] = useState(null);
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

  useEffect(() => {
    const ownerId = playlist?.owner?.id;
    spotifyApi.getUser(ownerId).then((data) => {
      setOwnerDetails(prevOwnerDetails => {
        return {
          img: data.body?.images?.[0]?.url,
          name: data.body?.display_name,
        }
      })
    })
  }, [playlist])

  console.log(playlist)
  
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
          <h1 className="font-bold text-2xl md:text-3xl xl:text-5xl mb-2">
            {playlist?.name}
          </h1>
          <h2 className="text-gray-300 text-sm md:text-base xl:text-lg mb-2">
            {playlist?.description}
          </h2>
          <div className="text-white flex items-center space-x-2">
            {
              ownerDetails?.img &&
              <img className="rounded-full w-5 h-5" src={ownerDetails?.img}/>
            }
            <span className="font-semibold">{ownerDetails?.name}</span>
            <div className="h-1 w-1 bg-white rounded-full"/>
            <span>{playlist?.followers?.total} likes</span>
            <div className="h-1 w-1 bg-white rounded-full"/>
            <span>{playlist?.tracks?.items?.length} songs</span>
          </div>
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
