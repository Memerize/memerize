// src/app/layout.jsx

import localFont from "next/font/local";
import "./globals.css";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Toast from "../components/Toast";
import { UserProvider } from "@/context/UserContext";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Memerize",
  description: "Make and Memorize Your Memes",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <UserProvider>
          <Toast />
          <Navbar />
          <div className="flex">
            <aside className="hidden md:block sticky top-16 h-[calc(100vh-4rem)]">
              <Sidebar />
            </aside>

            <main className="w-full m-8">{children}</main>
          </div>
        </UserProvider>
      </body>
    </html>
  );
}
