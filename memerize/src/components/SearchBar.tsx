import { useState } from 'react';

function SearchBar({ onSearch }: { onSearch: (query: string) => void }) {
  const [query, setQuery] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSearch = () => {
    onSearch(query);
  };

  return (
    <div className="form-control">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Search"
        className="input input-bordered w-24 md:w-auto bg-white text-black"
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSearch();
        }}
      />
    </div>
  );
}

export default SearchBar;
