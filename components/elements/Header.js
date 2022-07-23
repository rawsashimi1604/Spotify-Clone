import React from "react";
import { useSession, signOut } from "next-auth/react";
import { ChevronDownIcon } from "@heroicons/react/outline";

function Header() {
  const { data: session } = useSession();

  return (
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
  );
}

export default Header;
