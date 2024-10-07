/* eslint-disable @next/next/no-img-element */
// memerize/src/components/create-meme/MemeCanvas.js

import Loading from "@/app/loading";
import React, { useState } from "react";
import { FaArrowUp, FaShare } from "react-icons/fa";
import {
  Stage,
  Layer,
  Text,
  Image as KonvaImage,
  Transformer,
} from "react-konva";

const MemeCanvas = ({
  image,
  imageDimensions,
  texts,
  handleTextClick,
  handleDragEnd,
  handleTextTransform,
  isTransformerActive,
  transformerRef,
  textRefs,
  stageRef,
  addedImages,
  handleImageDragEnd,
  handleImageClick,
  imageRefs,
  setIsTransformerActive,
  loading,
  setLoading,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [copySuccess, setCopySuccess] = useState("");

  const handleSaveMeme = async () => {
    setLoading(true);
    setTimeout(() => {
      setIsTransformerActive(false);
      transformerRef.current?.nodes([]);
      transformerRef.current?.getLayer()?.batchDraw();
    }, 1000);
    // Capture the canvas content
    const dataURL = stageRef.current.toDataURL();

    // Convert dataURL to Blob
    const blob = await (await fetch(dataURL)).blob();

    // Create FormData to send to Cloudinary
    const formData = new FormData();
    formData.append("file", blob);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME
    );

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      if (response.ok) {
        setUploadedImageUrl(data.secure_url);
        setIsModalOpen(true);
      } else {
        console.error("Cloudinary Upload Error:", data);
        alert("Failed to upload meme. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Function to handle downloading the image
  const handleDownload = async () => {
    try {
      const response = await fetch(uploadedImageUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", "meme from memerize.png"); // Set the name for the downloaded file
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Error downloading the meme:", error);
      alert("Failed to download the meme. Please try again.");
    }
  };

  // Function to handle sharing to social media
  const handleShare = (platform) => {
    const shareUrl = encodeURIComponent(uploadedImageUrl);
    const shareText = encodeURIComponent("Check out this meme I created!");
    let url = "";

    switch (platform) {
      case "twitter":
        url = `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`;
        break;
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;
        break;
      case "pinterest":
        url = `https://pinterest.com/pin/create/button/?url=${shareUrl}&media=${shareUrl}&description=${shareText}`;
        break;
      case "reddit":
        url = `https://www.reddit.com/submit?url=${shareUrl}&title=${shareText}`;
        break;
      case "gmail":
        url = `mailto:?subject=${shareText}&body=${shareUrl}`;
        break;
      case "mail":
        url = `mailto:?subject=${shareText}&body=${shareUrl}`;
        break;
      default:
        return;
    }

    window.open(url, "_blank", "noopener,noreferrer");
  };

  // Function to handle copying the image link
  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(uploadedImageUrl)
      .then(() => {
        setCopySuccess("Link copied!");
        setTimeout(() => setCopySuccess(""), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
        setCopySuccess("Failed to copy!");
        setTimeout(() => setCopySuccess(""), 2000);
      });
  };

  // Function to handle posting on Memerize
  const handlePostOnMemerize = () => {
    // Redirect to /create-post with the image URL
    window.location.href = `/create-post?meme=${encodeURIComponent(
      uploadedImageUrl
    )}`;
  };

  return (
    <div className="">
      <Stage
        ref={stageRef}
        width={imageDimensions.width}
        height={imageDimensions.height}
        className="justify-center items-center text-center mx-auto flex overflow-auto"
        onMouseDown={(e) => {
          if (e.target === e.target.getStage()) {
            // Optional: Deselect any selected text or image
          }
        }}
      >
        <Layer>
          {image && (
            <KonvaImage
              image={image}
              x={0}
              y={0}
              width={imageDimensions.width}
              height={imageDimensions.height}
              alt="Meme"
            />
          )}

          {/* Render Added Images */}
          {addedImages.map((img) => {
            const image = new window.Image();
            image.crossOrigin = "anonymous";
            image.src = img.src;
            let scale = 1;
            if (
              image.width / imageDimensions.width > 1 ||
              image.height / imageDimensions.height > 1
            ) {
              scale = 4;
            }
            return (
              <KonvaImage
                key={img.id}
                image={image}
                x={img.x}
                y={img.y}
                scaleX={img.scaleX}
                scaleY={img.scaleY}
                rotation={img.rotation}
                width={image.width / scale}
                height={image.height / scale}
                draggable
                onClick={() => handleImageClick(img.id)}
                onDragEnd={(e) => handleImageDragEnd(e, img.id)}
                ref={(node) => {
                  if (node) {
                    imageRefs.current[img.id] = node;
                  }
                }}
              />
            );
          })}

          {/* Render Texts */}
          {texts.map((text) => (
            <React.Fragment key={text.id}>
              <Text
                ref={(el) => (textRefs.current[text.id] = el)}
                text={text.text}
                x={text.x}
                y={text.y}
                width={imageDimensions.width - 50}
                height={40}
                align="center"
                wrap="char"
                fontSize={text.fontSize}
                draggable
                fill={text.fill}
                stroke={text.stroke}
                strokeWidth={text.strokeWidth}
                fontFamily={text.fontFamily}
                onClick={() => handleTextClick(text.id)}
                onDragEnd={(e) => handleDragEnd(e, text.id)}
                onTransform={() => handleTextTransform(text.id)}
              />
            </React.Fragment>
          ))}

          <Transformer
            ref={transformerRef}
            visible={isTransformerActive}
            anchorStroke="#888888"
            borderStroke="#888888"
            anchorFill="#FFFFFF"
          />
        </Layer>
      </Stage>
      {loading && <Loading />}
      <button
        className="float-right mt-4 btn btn-success"
        onClick={handleSaveMeme}
      >
        Download or Post Meme
      </button>
      {/* Modal */}
      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box relative">
            <button
              className="btn btn-sm btn-circle absolute right-2 top-2"
              onClick={() => setIsModalOpen(false)}
            >
              ✕
            </button>
            <h3 className="text-lg font-bold mb-4">Your Meme</h3>
            <img
              src={uploadedImageUrl}
              alt="Final Meme"
              className="w-full mb-4"
            />

            {/* Sharing Options */}
            <div className="flex flex-col space-y-4">
               {/* Post on Memerize Button */}
              <button className="btn btn-accent" onClick={handlePostOnMemerize}>
                Post on Memerize
              </button>
              {/* Download Button */}
              <button className="btn btn-primary" onClick={handleDownload}>
                Download
              </button>

              {/* Share Buttons */}
              <div className="flex flex-wrap gap-2 justify-center">
                <button
                  className="btn btn-secondary flex items-center space-x-2"
                  onClick={() => handleShare("twitter")}
                >
                  <FaArrowUp />
                  <span>Share on Twitter</span>
                </button>
                <button
                  className="btn btn-secondary flex items-center space-x-2"
                  onClick={() => handleShare("facebook")}
                >
                  <FaShare />
                  <span>Share on Facebook</span>
                </button>
                <button
                  className="btn btn-secondary flex items-center space-x-2"
                  onClick={() => handleShare("pinterest")}
                >
                  <FaShare />
                  <span>Share on Pinterest</span>
                </button>
                <button
                  className="btn btn-secondary flex items-center space-x-2"
                  onClick={() => handleShare("reddit")}
                >
                  <FaShare />
                  <span>Share on Reddit</span>
                </button>
                <button
                  className="btn btn-secondary flex items-center space-x-2"
                  onClick={() => handleShare("gmail")}
                >
                  <FaShare />
                  <span>Share via Gmail</span>
                </button>
                <button
                  className="btn btn-secondary flex items-center space-x-2"
                  onClick={() => handleShare("mail")}
                >
                  <FaShare />
                  <span>Share via Mail</span>
                </button>
              </div>

              {/* Image Link and Copy Button */}
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  readOnly
                  value={uploadedImageUrl}
                  className="flex-1 p-2 border border-gray-300 rounded"
                />
                <button
                  className="btn btn-outline btn-secondary"
                  onClick={handleCopyLink}
                >
                  {copySuccess ? copySuccess : "Copy Link"}
                </button>
              </div>

             
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemeCanvas;
