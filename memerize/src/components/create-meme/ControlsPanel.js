//memerize\src\components\create-meme\ControlsPanel.js

import React, { useState } from "react";
import TextOptions from "./TextOptions";
import { IoSettings } from "react-icons/io5";
import { FaLink, FaTrashAlt, FaUpload } from "react-icons/fa";
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
  handleAddImageURL,
  addImageUrlError,
  imageURL,
  setImageURL,
  handleBackgroundImageUpload,
}) => {
  const [activeTab, setActiveTab] = useState("upload");
  const [activeBgTab, setActiveBgTab] = useState("url");

  return (
    <div className="w-full">
      <div className="w-full max-w-md mx-auto mt-4">
        <div className="flex">
          <p className="label-text mx-auto">Background Image</p>
        </div>
        <div className="tabs tabs-bordered">
          <button
            className={`tab ${activeBgTab === "upload" ? "tab-active" : ""}`}
            onClick={() => setActiveBgTab("upload")}
          >
            <FaUpload className="mr-2" />
          </button>
          <button
            className={`tab ${activeBgTab === "url" ? "tab-active" : ""}`}
            onClick={() => setActiveBgTab("url")}
          >
            <FaLink />
          </button>
        </div>

        {activeBgTab === "upload" && (
          <div className="form-control w-full mt-4">
            <label className="label">
              <span className="label-text">Upload Background Image</span>
            </label>
            <input
              type="file"
              accept=".jpg,.jpeg,.png"
              onChange={handleBackgroundImageUpload}
              className="file-input file-input-bordered file-input-accent"
            />
          </div>
        )}

        {activeBgTab === "url" && (
          <div className="form-control w-full mt-4">
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
        )}
      </div>
      <div className="w-full max-w-md mx-auto mt-4">
        <div className="flex">
          <p className="label-text mx-auto">Add Image</p>
        </div>
        <div className="tabs tabs-bordered">
          <button
            className={`tab ${activeTab === "upload" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("upload")}
          >
            <FaUpload className="mr-2" />{" "}
          </button>
          <button
            className={`tab ${activeTab === "url" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("url")}
          >
            <FaLink />
          </button>
        </div>

        {activeTab === "upload" && (
          <div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Upload from Local</span>
              </label>
              <input
                type="file"
                accept=".jpg,.jpeg,.png"
                onChange={handleImageUpload}
                className="file-input file-input-bordered file-input-accent"
              />
            </div>
          </div>
        )}

        {activeTab === "url" && (
          <div>
            <div className="form-control w-full">
              <div className="flex flex-row">
                <label className="label">
                  <span className="label-text">Image URL</span>
                </label>
                {addImageUrlError && (
                  <div className="label ml-auto">
                    <p className="text-red-500 label-text">
                      {addImageUrlError}
                    </p>
                  </div>
                )}
              </div>
              <div className="flex flex-row">
                <input
                  type="text"
                  placeholder="Enter image URL"
                  value={imageURL}
                  onChange={(e) => setImageURL(e.target.value)}
                  className="input input-bordered w-full"
                />
                <button
                  onClick={handleAddImageURL}
                  className="btn btn-accent ml-2"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

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
                <button
                  className="btn btn-outline btn-info"
                  onClick={() => toggleDropdown(text.id)}
                >
                  <IoSettings />
                </button>
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
