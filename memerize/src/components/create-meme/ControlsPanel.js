import React from "react";
import TextOptions from "./TextOptions";
import { IoSettings } from "react-icons/io5";
import { FaTrashAlt } from "react-icons/fa";
import Image from "next/image";

const ControlsPanel = ({
  backgroundImageUrl,
  setBackgroundImageUrl,
  fontOptions,
  addText,
  texts,
  handleInputChange,
  toggleDropdown,
  openDropdown,
  removeText,
  setTexts,
  handleImageUpload,
  addedImages,
  removeImage,
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
      {/* Image Upload Input */}
      <div className="form-control w-full mt-5">
        <label className="label">
          <span className="label-text">Add Image</span>
        </label>
        <input
          type="file"
          accept=".jpg,.jpeg,.png,.gif"
          onChange={handleImageUpload}
          className="file-input file-input-bordered file-input-accent"
        />
      </div>
      <div className="form-control w-full mt-5">
        <label className="label">
          <span className="label-text">Image URL</span>
        </label>
        <input
          type="text"
          placeholder="Enter image URL"
          onBlur={(e) => {
            if (e.target.value) {
              // addImageFromURL(e.target.value);
              e.target.value = "";
            }
          }}
          className="input input-bordered w-full"
        />
      </div>

      {/* Render Controls for Added Images */}
      <div className="flex flex-row space-x-4 overflow-x-auto">
        {addedImages.map((img) => (
          <div
            key={img.id}
            className="relative form-control flex flex-col items-center mt-4"
          >
            <div className="w-16 h-16 flex items-center justify-center overflow-hidden">
              <Image
                src={img.src}
                alt="Added"
                width={64}
                height={64}
                className="object-cover"
              />
            </div>
            <button
              className="btn btn-error btn-sm mt-2"
              onClick={() => removeImage(img.id)}
            >
              <FaTrashAlt />
            </button>
          </div>
        ))}
      </div>

      {/* Editable Text Inputs for each Text Element */}
      {texts.map((text) => (
        <div
          key={text.id}
          className="relative form-control w-full flex flex-col space-y-2 mt-5"
        >
          <div className="flex flex-col">
            <div className="flex flex-row">
              <label className="label">
                <span className="label-text">Text {text.id}</span>
              </label>
              <div className="ml-auto">
                {/* Trigger button for dropdown popup with gear icon */}
                <button
                  className="btn btn-outline btn-info"
                  onClick={() => toggleDropdown(text.id)}
                >
                  <IoSettings />
                </button>
                {/* Remove Text Button with trash icon */}
                <button
                  className="btn btn-error ml-2"
                  onClick={() => removeText(text.id)}
                >
                  <FaTrashAlt />
                </button>
              </div>
            </div>

            <input
              type="text"
              value={text.text}
              onChange={(e) => handleInputChange(e, text.id)}
              className="input input-bordered w-full mt-2"
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
