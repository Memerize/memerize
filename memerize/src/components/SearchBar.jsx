"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const debounceTimeoutRef = useRef(null);

  const fetchUsers = async (searchQuery) => {
    try {
      const response = await fetch(`/api/search?query=${searchQuery}`);
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const results = await response.json();
      return results;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const handleSearch = (searchQuery) => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(async () => {
      const allUsers = await fetchUsers(searchQuery);
      setUsers(allUsers.slice(0, 5));
    }, 200);
  };

  useEffect(() => {
    if (query.length > 0) {
      handleSearch(query);
    } else {
      setUsers([]);
    }
  }, [query]);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleClick = () => {
    setQuery("");
    setUsers([]);
  };

  return (
    <div className="relative form-control">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Search users"
        className="input input-bordered w-24 md:w-auto bg-white text-black"
      />

      {users.length > 0 && (
        <div className="absolute top-12 left-0 w-full bg-white shadow-lg rounded-md z-10">
          <ul className="p-2">
            {users.map((user, index) => (
              <li
                key={index}
                className="p-2 hover:bg-gray-200 hover:rounded-md text-black" // Set the text color to black
                onClick={handleClick}
              >
                <Link href={`/posts/${user.username}`}>{user.username}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
