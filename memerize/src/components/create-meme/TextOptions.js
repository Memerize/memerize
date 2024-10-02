// memerize/src/components/create-meme/TextOptions.js

import React from "react";

const TextOptions = ({ text, fontOptions, setTexts, closeDropdown }) => {
  const handleOptionChange = (e, option) => {
    const value = e.target.value;
    setTexts((prevTexts) =>
      prevTexts.map((t) => (t.id === text.id ? { ...t, [option]: value } : t))
    );
  };

  return (
    <div className="absolute z-10 ml-2 p-4 rounded-md bg-base-200 shadow-lg w-64">
      {/* Konten dropdown */}
      {/* Font Size */}
      <div className="flex items-center space-x-2 mb-2">
        <label className="label-text">Font Size</label>
        <input
          type="number"
          value={text.fontSize}
          min={20}
          max={100}
          onChange={(e) => handleOptionChange(e, "fontSize")}
          className="input input-bordered w-20"
        />
      </div>

      {/* Font Color */}
      <div className="flex items-center space-x-2 mb-2">
        <label className="label-text">Font Color</label>
        <input
          type="color"
          value={text.fill}
          onChange={(e) => handleOptionChange(e, "fill")}
          className="input w-10 h-10 p-0 cursor-pointer"
        />
      </div>

      {/* Stroke Color */}
      <div className="flex items-center space-x-2 mb-2">
        <label className="label-text">Stroke Color</label>
        <input
          type="color"
          value={text.stroke}
          onChange={(e) => handleOptionChange(e, "stroke")}
          className="input w-10 h-10 p-0 cursor-pointer"
        />
      </div>

      {/* Font Selection */}
      <div className="flex items-center space-x-2 mb-2">
        <label className="label-text">Font Family</label>
        <select
          className="select select-bordered w-full"
          value={text.fontFamily}
          onChange={(e) => handleOptionChange(e, "fontFamily")}
        >
          {fontOptions.map((font) => (
            <option key={font.value} value={font.value}>
              {font.label}
            </option>
          ))}
        </select>
      </div>

      {/* Tombol untuk menutup dropdown */}
      <button className="btn btn-secondary mt-2 w-full" onClick={closeDropdown}>
        Close
      </button>
    </div>
  );
};

export default TextOptions;
