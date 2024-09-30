import Link from "next/link";

export default function Sidebar() {
  return (
    <ul className="menu bg-color3 w-64 h-full">
      <li>
        <Link
          className="text-md text-color2 focus:text-color2 hover:bg-color5 focus:bg-color5"
          href={"/"}
        >
          Home
        </Link>
      </li>
      <li>
        <Link
          className="text-md text-color2 focus:text-color2 hover:bg-color5 focus:bg-color5"
          href={"/"}
        >
          Tags
        </Link>
      </li>
      <li>
        <Link
          className="text-md text-color2 focus:text-color2 hover:bg-color5 focus:bg-color5"
          href={"/"}
        >
          Create Meme
        </Link>
      </li>
      <li>
        <Link
          className="text-md text-color2 focus:text-color2 hover:bg-color5 focus:bg-color5"
          href={"/"}
        >
          Create Post
        </Link>
      </li>
    </ul>
  );
}
