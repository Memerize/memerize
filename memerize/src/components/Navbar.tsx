export default function Navbar() {
  return (
    <div className="navbar bg-color4 sticky top-0 z-10 h-16">
      <div className="flex-1">
        <a className="btn hover:bg-color6 btn-ghost text-xl">Memerize</a>
      </div>
      <div className="flex-none gap-2 ">
        <div className="form-control ">
          <input
            type="text"
            placeholder="Search"
            className="input input-bordered w-24 md:w-auto bg-white"
          />
        </div>
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
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
            className="menu menu-sm dropdown-content bg-white rounded-box z-[1] mt-3 w-52 p-2 shadow  "
          >
            <li>
              <a className="justify-between text-color1">
                Profile
                <span className="badge text-color1 bg-white ">New</span>
              </a>
            </li>
            <li>
              <a className="text-color1">Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
