'use client';
import { useRouter } from 'next/navigation';
import SearchBar from '@/components/SearchBar';

export default function Navbar() {
  const router = useRouter();

  const handleLogout = () => {
    document.cookie = 'Authorization=; Max-Age=0; path=/;';
    document.cookie = 'User=; Max-Age=0; path=/;'
    
    router.push('/login');
  };

  const handleSearch = (query) => {
    console.log('Search query:', query);
  };

  return (
    <div className="navbar bg-color4 sticky top-0 z-10 h-16">
      <div className="flex-1">
        <a className="btn hover:bg-color6 btn-ghost text-xl text-black">Memerize</a>
      </div>
      <div className="flex-none gap-2">
        <SearchBar onSearch={handleSearch} />
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar text-black"
          >
            <div className="w-10 rounded-full">
              <img
                alt="Tailwind CSS Navbar component"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-white rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li>
              <a className="justify-between text-color1">Profile</a>
            </li>
            <li>
              <a className="text-color1" onClick={handleLogout}>Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
