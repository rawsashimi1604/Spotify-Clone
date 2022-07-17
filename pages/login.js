import { sign } from "crypto";
import { getProviders, signIn } from "next-auth/react";

function Login({ providers }) {
  return (
    <div className="flex flex-col items-center min-h-screen bg-black justify-center">
      <img className="w-52 mb-5" src="https://links.papareact.com/9xl" alt="" />
      {Object.values(providers).map((provider) => {
        return (
          <div key={provider.name}>
            <button
              className="text-white p-5 rounded-full duration-100 ease-in hover:opacity-70"
              style={{ backgroundColor: "#18d860" }}
              onClick={() => signIn(provider.id, { callbackUrl: "/" })}
            >
              Login with {provider.name}
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default Login;

// Before every page load (SSR)
export async function getServerSideProps() {
  const providers = await getProviders();

  return {
    props: {
      providers,
    },
  };
}
