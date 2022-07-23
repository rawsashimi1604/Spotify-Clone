import {
  HomeIcon,
  SearchIcon,
  LibraryIcon,
  PlusCircleIcon,
  RssIcon,
} from "@heroicons/react/outline";
import { HeartIcon } from "@heroicons/react/solid";

import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import useSpotify from "../../hooks/useSpotify";

import { useRecoilState } from "recoil";
import { playlistIdState } from "../../atoms/playlistAtom";
import { menuOptionState } from "../../atoms/appAtom"

import {HOME,SEARCH,YOUR_LIBRARY,CREATE_PLAYLIST, YOUR_EPISODES, LIKED_SONGS, PLAYLIST} from "../../lib/menu";

function Sidebar() {
  const spotifyApi = useSpotify();
  const { data: session, status } = useSession();
  const [playlists, setPlaylists] = useState([]);
  const [playlistId, setPlaylistId] = useRecoilState(playlistIdState);
  const [selectedMenuOption, setSelectedMenuOption] = useRecoilState(menuOptionState);

  useEffect(() => {
    // If our API has an access token...
    if (spotifyApi.getAccessToken()) {
      spotifyApi.getUserPlaylists().then((data) => {
        setPlaylists(data.body.items);
      });
    }
  }, [session, spotifyApi]);

  return (
    <div className="grow-0 flex-shrink-0 overflow-y-scroll text-gray-500 p-5 text-xs lg:text-sm border-r border-gray-900 h-screen scrollbar-hide sm:w-52 lg:w-72 hidden sm:inline-flex pb-52">
      <div className="space-y-4">
        <button className="flex items-center space-x-2 hover:text-white">
          <HomeIcon className="h-5 w-5" />
          <p>Home</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white">
          <SearchIcon className="h-5 w-5" />
          <p>Search</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white">
          <LibraryIcon className="h-5 w-5" />
          <p>Your Library</p>
        </button>

        <hr className="border-t-[0.1px] border-gray-900" />

        <button className="flex items-center space-x-2 hover:text-white">
          <PlusCircleIcon className="h-5 w-5" />
          <p>Create Playlist</p>
        </button>
        <button 
          className={`flex items-center space-x-2 hover:text-white ${selectedMenuOption === LIKED_SONGS && "text-white"}`}
          onClick={() => setSelectedMenuOption(LIKED_SONGS)}  
        >
          <HeartIcon className="h-5 w-5 text-blue-500" />
          <p>Liked Songs</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white">
          <RssIcon className="h-5 w-5 text-green-500" />
          <p>Your episodes</p>
        </button>

        <hr className="border-t-[0.1px] border-gray-900" />

        {/* Playlists... */}
        {playlists.map((playlist) => (
          <p
            key={playlist.id}
            className={`cursor-pointer hover:text-white truncate ${selectedMenuOption === PLAYLIST && playlist.id === playlistId && "text-white"}`}
            onClick={() => {
              setSelectedMenuOption(PLAYLIST);
              setPlaylistId(playlist.id);
            }}
          >
            {playlist.name}
          </p>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
