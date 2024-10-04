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
    <div className="w-full">
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
      <div className="form-control w-full flex flex-row">
        <label className="label mr-2">
          <span className="label-text">Font</span>
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

      {/* Editable Text Inputs for each Text Element */}
      {texts.map((text) => (
        <div
          key={text.id}
          className="relative form-control w-full flex flex-col space-y-2"
        >
          <div className="flex flex-col">
            <div className="flex flex-row">
              <label className="label">
                <span className="label-text">Text {text.id}</span>
              </label>
              {/* Trigger button for dropdown popup with gear icon */}
              <button
                className="btn btn-outline btn-info"
                onClick={() => toggleDropdown(text.id)}
              >
                 {/* Font Awesome gear icon */}
              </button>
              {/* Remove Text Button with trash icon */}
              <button
                className="btn btn-error"
                onClick={() => removeText(text.id)}
              >
                 {/* Font Awesome trash icon */}
              </button>
            </div>

            <input
              type="text"
              value={text.text}
              onChange={(e) => handleInputChange(e, text.id)}
              className="input input-bordered w-full"
            />
          </div>
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
      {/* Button to add Text */}
      <button
        className="btn btn-outline btn-accent w-full mt-2"
        onClick={addText}
      >
        Add Text
      </button>
    </div>
  );
};

export default ControlsPanel;
