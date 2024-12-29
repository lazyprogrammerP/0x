import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Ubuntu, Ubuntu_Mono } from "next/font/google";

const sans = Ubuntu({
  weight: ["300", "400", "500", "700"],
  variable: "--font-sans",
  subsets: ["latin"],
});

const mono = Ubuntu_Mono({
  weight: ["400", "700"],
  variable: "--font-mono",
  subsets: ["latin"],
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div
      className={`${sans.variable} ${mono.variable} font-[family-name:var(--font-sans)] antialiased`}
    >
      <Component {...pageProps} />
    </div>
  );
}
