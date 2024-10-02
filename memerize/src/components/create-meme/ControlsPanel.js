//memerize/src/components/create-meme/ControlsPanel.js

import React from "react";
import TextOptions from "./TextOptions";

const ControlsPanel = ({
  backgroundImageUrl,
  setBackgroundImageUrl,
  fontFamily,
  setFontFamily,
  fontOptions,
  addText,
  texts,
  handleInputChange,
  toggleDropdown,
  openDropdown,
  removeText,
  setTexts,
}) => {
  return (
    <div className="flex flex-col items-start space-y-4 p-4 bg-base-100 shadow-lg rounded-lg w-full lg:w-80">
      {/* Image URL Input */}
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">Background Image URL</span>
        </label>
        <input
          type="text"
          value={backgroundImageUrl}
          onChange={(e) => setBackgroundImageUrl(e.target.value)}
          placeholder="Enter background image URL"
          className="input input-bordered w-full"
        />
      </div>

      {/* Font Family Selector */}
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">Font Family</span>
        </label>
        <select
          value={fontFamily}
          onChange={(e) => setFontFamily(e.target.value)}
          className="select select-bordered w-full"
        >
          {fontOptions.map((font) => (
            <option key={font.value} value={font.value}>
              {font.label}
            </option>
          ))}
        </select>
      </div>

      {/* Button to add Text */}
      <button className="btn btn-outline btn-accent w-full" onClick={addText}>
        Add Text
      </button>

      {/* Editable Text Inputs for each Text Element */}
      {texts.map((text) => (
        <div
          key={text.id}
          className="relative form-control w-full flex flex-col space-y-2"
        >
          <label className="label w-full">
            <span className="label-text">Text {text.id}</span>
          </label>

          <input
            type="text"
            value={text.text}
            onChange={(e) => handleInputChange(e, text.id)}
            className="input input-bordered w-full"
          />

          {/* Trigger button for dropdown popup */}
          <button
            className="btn btn-outline btn-info w-full"
            onClick={() => toggleDropdown(text.id)}
          >
            Edit Text Options
          </button>
          {/* Remove Text Button */}
          <button
            className="btn btn-error mt-2 w-full"
            onClick={() => removeText(text.id)}
          >
            Remove
          </button>

          {/* Dropdown for text options */}
          {openDropdown === text.id && (
            <TextOptions
              text={text}
              fontOptions={fontOptions}
              setTexts={setTexts}
              closeDropdown={() => toggleDropdown(text.id)}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default ControlsPanel;
