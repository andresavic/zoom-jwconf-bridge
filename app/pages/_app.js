import '../styles/globals.css'
import { withPasswordProtect } from "@storyofams/next-password-protect";

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}


export default process.env.PASSWORD_PROTECT
  ? withPasswordProtect(MyApp, {
    loginApiPath: "/login",
    cookieName: "authorization",
  })
  : MyApp;
