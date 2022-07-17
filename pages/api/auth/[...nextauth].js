import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import spotifyApi, { LOGIN_URL } from "../../../lib/spotify";

async function refreshAccessToken(token) {
  try {
    spotifyApi.setAccessToken(token.accessToken);
    spotifyApi.setRefreshToken(token.refreshToken);

    // send a request to spotify API, to refresh our access token...
    const { body: refreshedToken } = await spotifyApi.refreshAccessToken();

    console.log("REFRESHED TOKEN IS: " + refreshedToken);

    return {
      ...token,
      accessToken: refreshedToken.access_token, // OUR NEW TOKEN
      accessTokenExpires: Date.now + refreshedToken.expires_in * 1000, // 1 hour as 3600 returns from spotify API
      refreshToken: refreshedToken.refresh_token ?? token.refreshToken, // If new refresh token exists use it, else fall back to old refresh token.
    };
  } catch (error) {
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    SpotifyProvider({
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
      authorization: LOGIN_URL,
    }),

    // ...add more providers here
  ],

  secret: process.env.JWT_SECRET,

  pages: {
    signIn: "/login",
  },

  callbacks: {
    async jwt({ token, account, user }) {
      // If it was initial sign in
      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          username: account.providerAccountId,
          accessTokenExpires: account.expires_at * 1000, // Handling in milliseconds, hence * 1000
        };
      }

      // If access token has not expired.. return previous token
      else if (Date.now() < token.accessTokenExpires) {
        console.log("EXISTING ACCESS TOKEN TOKEN IS VALID");
        return token;
      }

      // Else access token has expired, try to update it...
      console.log("ACCESS TOKEN HAS EXPIRED!!!");
      return await refreshAccessToken(token);
    },

    // What the client can see in the session...
    async session({ session, token }) {
      session.user.accessToken = token.accessToken;
      session.user.refreshToken = token.refreshToken;
      session.user.username = token.username;

      return session;
    },
  },
});
