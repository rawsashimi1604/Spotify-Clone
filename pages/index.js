import { getSession } from "next-auth/react"
import Center from "../components/Center"
import Sidebar from "../components/Sidebar"

export default function Home() {
  return (
    <div className="bg-black h-screen overflow-hidden">
      <main className="flex">
        <Sidebar />
        <Center />
      </main>

      <div>
        {/* Player */}
      </div>
    </div>
  )
}

// Pre rendering the user on the server before it gets to the client
export async function getServerSideProps(context) {
  const session = await getSession(context);

  return {
    props: {
      session
    }
  }
}