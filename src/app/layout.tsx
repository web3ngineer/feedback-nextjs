
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/context/AuthProvider";
import { Toaster } from "@/components/ui/toaster";
import Head from "next/head";
import { Metadata } from "next/types";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title:{
    default:"Lukka Chhupi",
    template: "%s",
  },
  description: "An anonymous feedback/suggestion giving platform ",
  icons:{
    icon:[
      '/public/favicon.ico?v=1',
    ],
    apple:[
      '/public/apple-touch-icon.png?v=4',
    ],
    shortcut:[
      '/public/apple-touch-icon.png?v=4', // for iOS <  12.3; safari on iOS should get this if they
    ],
  },
  manifest:'/public/site.webmanifest'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" sizes="any"/>
      </Head>
      <body className={inter.className}>
        <AuthProvider>
          <Navbar/>
          {children}
          <Toaster/>
        </AuthProvider>
      </body>
    </html>
  );
}
