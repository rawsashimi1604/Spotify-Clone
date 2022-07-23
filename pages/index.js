import Script from "next/script";
import { getSession } from "next-auth/react";
import Center from "../components/layouts/Center";
import Sidebar from "../components/layouts/Sidebar";
import Player from "../components/layouts/Player";


export default function Home() {

  return (
    <>
      <div className="bg-black h-screen overflow-hidden">
        <main className="flex">
          <Sidebar />
          <Center />
        </main>

        <div className="sticky bottom-0">
          <Player />
        </div>
      </div>
    </>
  );
}

// Pre rendering the user on the server before it gets to the client
export async function getServerSideProps(context) {
  const session = await getSession(context);

  return {
    props: {
      session,
    },
  };
}
