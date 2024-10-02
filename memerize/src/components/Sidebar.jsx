import Link from "next/link";

export default function Sidebar({ closeSidebar }) {
  return (
    <ul className="menu bg-color3 h-full p-4 w-16 md:w-24 lg:w-24 xl:w-64 space-y-2">
      <li>
        <Link
          className="block text-md text-color2 focus:text-color2 hover:bg-color5 focus:bg-color5 rounded px-3 py-2"
          href="/"
          onClick={closeSidebar}
        >
          Home
        </Link>
      </li>
      <li>
        <Link
          className="block text-md text-color2 focus:text-color2 hover:bg-color5 focus:bg-color5 rounded px-3 py-2"
          href="/tags"
          onClick={closeSidebar}
        >
          Tags
        </Link>
      </li>
      <li>
        <Link
          className="block text-md text-color2 focus:text-color2 hover:bg-color5 focus:bg-color5 rounded px-3 py-2"
          href="/create-meme"
          onClick={closeSidebar}
        >
          Create Meme
        </Link>
      </li>
      <li>
        <Link
          className="block text-md text-color2 focus:text-color2 hover:bg-color5 focus:bg-color5 rounded px-3 py-2"
          href="/create-post"
          onClick={closeSidebar}
        >
          Create Post
        </Link>
      </li>
    </ul>
  );
}
