// memerize\src\app\create-meme\page.jsx

"use client";

import React, { useEffect, useState, useRef } from "react";
import MemeCanvas from "../../components/create-meme/MemeCanvas";
import ControlsPanel from "../../components/create-meme/ControlsPanel";
import MemeTemplateSelector from "@/components/create-meme/MemeTemplateSelector";

const fontOptions = [
  { label: "Impact", value: "Impact" },
  { label: "Arial", value: "Arial, sans-serif" },
  { label: "Georgia", value: "Georgia, serif" },
  { label: "Courier New", value: "'Courier New', monospace" },
  { label: "Times New Roman", value: "'Times New Roman', serif" },
];

const CreateMeme = () => {
  // State variables
  const [loading, setLoading] = useState(false);
  const [backgroundImageUrl, setBackgroundImageUrl] = useState(
    "https://api.memegen.link/images/awesome.png"
  );
  const [texts, setTexts] = useState([]);
  const [image, setImage] = useState(null);
  const [clickedOnText, setClickedOnText] = useState(false);
  const [clickedOnImage, setClickedOnImage] = useState(false); // New state
  const [imageDimensions, setImageDimensions] = useState({
    width: 600,
    height: 400,
  });
  const [fontFamily, setFontFamily] = useState("Impact");
  const [selectedTextId, setSelectedTextId] = useState(null);
  const [selectedImageId, setSelectedImageId] = useState(null); // New state
  const [isTransformerActive, setIsTransformerActive] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [addedImages, setAddedImages] = useState([]);
  const [imageURL, setImageURL] = useState("");
  const [addImageUrlError, setAddImageUrlError] = useState("");

  // Refs
  const transformerRef = useRef(null);
  const textRefs = useRef({});
  const imageRefs = useRef({});
  const stageRef = useRef(null);
  const compRef = useRef(null);

  // Toggle dropdown for text options
  const toggleDropdown = (id) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  const handleBackgroundImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setBackgroundImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddImageURL = () => {
    if (imageURL) {
      if (imageURL.startsWith("https://") || imageURL.startsWith("http://")) {
        addImageToCanvas(imageURL);
        setImageURL("");
        setAddImageUrlError("");
      } else {
        setAddImageUrlError("Invalid URL format.");
      }
    } else {
      setAddImageUrlError("Please enter an image URL.");
    }
  };

  // Function to add image to canvas
  const addImageToCanvas = (src) => {
    const newImage = {
      id: Date.now(), // Unique ID for each image
      src: src,
      x: imageDimensions.width / 2 - 50, // Centered horizontally
      y: imageDimensions.height / 2 - 50, // Centered vertically
      scaleX: 1,
      scaleY: 1,
      rotation: 0,
    };
    setAddedImages((prevImages) => [...prevImages, newImage]);
    setTimeout(() => {
      handleImageClick(newImage.id);
      stageRef.current.batchDraw();
    }, 1000);
  };

  // Handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        // setTimeout(() => {
        addImageToCanvas(reader.result); // Send image to canvas handler
        // }, 500);
      };
      reader.readAsDataURL(file); // Convert the image to a base64 string
    }
  };

  // Function to handle image transformations (drag, scale, rotate)
  const handleImageDragEnd = (e, id) => {
    const { x, y } = e.target.position();
    setAddedImages((prevImages) =>
      prevImages.map((img) => (img.id === id ? { ...img, x, y } : img))
    );
  };

  // Function to remove an added image
  const removeImage = (id) => {
    setAddedImages((prevImages) => prevImages.filter((img) => img.id !== id));
    // If the removed image is selected, reset transformer
    if (selectedImageId === id) {
      setSelectedImageId(null);
      setIsTransformerActive(false);
      transformerRef.current?.getLayer()?.batchDraw();
    }
  };

  // Image loading
  useEffect(() => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = backgroundImageUrl;
    img.onload = () => {
      setImage(img);
      let adjustedWidth;
      let adjustedHeight;
      let maxSize = 550;
      if (img.width > maxSize) {
        adjustedWidth = maxSize;
        adjustedHeight = (adjustedWidth / img.width) * img.height;
      } else if (img.height > maxSize) {
        adjustedHeight = maxSize;
        adjustedWidth = (adjustedHeight / img.height) * img.width;
      } else {
        adjustedWidth = img.width;
        adjustedHeight = img.height;
      }
      // console.log(adjustedWidth, adjustedHeight);
      setImageDimensions({ width: adjustedWidth, height: adjustedHeight });
      setTexts([
        {
          id: 1,
          text: "Top Text",
          x: 23,
          y: 20,
          fontSize: 40,
          fill: "#ffffff",
          stroke: "#000000",
          strokeWidth: 2,
          fontFamily: "Impact",
        },
        {
          id: 2,
          text: "Bottom Text",
          x: 23,
          y: adjustedHeight - 60,
          fontSize: 40,
          fill: "#ffffff",
          stroke: "#000000",
          strokeWidth: 2,
          fontFamily: "Impact",
        },
      ]);
    };
  }, [backgroundImageUrl]);

  // Handle click outside for deselect text or image
  useEffect(() => {
    const handleClickOutside = (e) => {
      const isClickInsideCanvas = stageRef.current
        ?.getStage()
        ?.getContainer()
        .contains(e.target);
      const selectedText =
        selectedTextId !== null ? textRefs.current[selectedTextId] : null;
      const selectedImage =
        selectedImageId !== null ? imageRefs.current[selectedImageId] : null;

      // Case 1: Click inside canvas but no element clicked, and transformer is active
      if (
        isClickInsideCanvas &&
        !clickedOnText &&
        !clickedOnImage &&
        isTransformerActive
      ) {
        setIsTransformerActive(false);
        setSelectedTextId(null);
        setSelectedImageId(null);
        transformerRef.current?.nodes([]);
        transformerRef.current?.getLayer()?.batchDraw();
        return;
      }

      // Case 2: Click outside the canvas
      if (!isClickInsideCanvas) {
        setIsTransformerActive(false);
        setSelectedTextId(null);
        setSelectedImageId(null);
        transformerRef.current?.nodes([]);
        transformerRef.current?.getLayer()?.batchDraw();
        setClickedOnText(false);
        setClickedOnImage(false);
        return;
      }

      // Case 3: If a text was clicked and we want to activate the transformer
      if (transformerRef.current && clickedOnText && selectedText) {
        transformerRef.current.nodes([selectedText]);
        transformerRef.current.getLayer()?.batchDraw();
        setClickedOnText(false);
        return;
      }

      // Case 4: If an image was clicked and we want to activate the transformer
      if (transformerRef.current && clickedOnImage && selectedImage) {
        transformerRef.current.nodes([selectedImage]);
        transformerRef.current.getLayer()?.batchDraw();
        setClickedOnImage(false);
        return;
      }
    };
    window.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [
    isTransformerActive,
    selectedTextId,
    selectedImageId,
    texts,
    addedImages,
    clickedOnText,
    clickedOnImage,
  ]);

  // Prevent text dragging outside the image
  const preventTextOutOfBounds = (newX, newY, textWidth, textHeight) => {
    const minX = 0;
    const minY = 0;
    const maxX = imageDimensions.width - textWidth;
    const maxY = imageDimensions.height - textHeight;

    return {
      x: Math.min(Math.max(newX, minX), maxX),
      y: Math.min(Math.max(newY, minY), maxY),
    };
  };

  // Handle drag end with boundary check
  const handleDragEnd = (e, id) => {
    const text = e.target;

    const newX = text.x();
    const newY = text.y();

    const textWidth = text.width();
    const textHeight = text.height();

    const newPosition = preventTextOutOfBounds(
      newX,
      newY,
      textWidth,
      textHeight
    );

    text.position({
      x: newPosition.x,
      y: newPosition.y,
    });

    setTexts((prevTexts) =>
      prevTexts.map((t) =>
        t.id === id ? { ...t, x: newPosition.x, y: newPosition.y } : t
      )
    );
  };

  const addText = () => {
    const newTextId =
      texts.length > 0 ? Math.max(...texts.map((t) => t.id)) + 1 : 1;
    setTexts((prev) => [
      ...prev,
      {
        id: newTextId,
        text: `Text ${newTextId}`,
        x: 23,
        y: imageDimensions.height / 2 - 25,
        fontSize: 40,
        fill: "#ffffff",
        stroke: "#000000",
        strokeWidth: 2,
        fontFamily: "Impact",
      },
    ]);
    setSelectedTextId(newTextId);
    setIsTransformerActive(true);
  };

  const handleTextClick = (id) => {
    setSelectedTextId(id);
    setSelectedImageId(null);
    setIsTransformerActive(true);
    setClickedOnText(true);
  };

  const handleImageClick = (id) => {
    setSelectedImageId(id);
    setSelectedTextId(null);
    setIsTransformerActive(true);
    setClickedOnImage(true);
  };

  const handleInputChange = (e, id) => {
    const updatedText = e.target.value;

    // Update text in canvas
    setTexts((prevTexts) =>
      prevTexts.map((t) => (t.id === id ? { ...t, text: updatedText } : t))
    );

    adjustFontSizeToFit(id);
  };

  const adjustFontSizeToFit = (textId) => {
    const node = textRefs.current[textId];
    if (!node) return;

    const boxWidth = node.width();
    let fontSize = node.fontSize();

    if (node.textWidth > boxWidth - 20 && fontSize > 26) {
      fontSize -= 2;
      node.fontSize(fontSize);
      node.getLayer()?.batchDraw();
    } else if (node.textWidth < boxWidth - 40 && fontSize < 40) {
      fontSize += 2;
      node.fontSize(fontSize);
      node.getLayer()?.batchDraw();
    }

    setTexts((prevTexts) =>
      prevTexts.map((t) => (t.id === textId ? { ...t, fontSize: fontSize } : t))
    );
  };

  // Function to remove text
  const removeText = (id) => {
    setTexts((prevTexts) => prevTexts.filter((t) => t.id !== id));
    // Reset the transformer if the removed text is selected
    if (selectedTextId === id) {
      setSelectedTextId(null);
      setIsTransformerActive(false);
      transformerRef.current?.nodes([]);
      transformerRef.current?.getLayer()?.batchDraw();
    }
  };

  const handleTextTransform = (textId) => {
    const node = textRefs.current[textId];
    if (!node) return;

    node.setAttrs({
      width: node.width() * node.scaleX(),
      height: node.height() * node.scaleY(),
      scaleX: 1,
      scaleY: 1,
    });

    setTexts((prevTexts) =>
      prevTexts.map((t) =>
        t.id === textId ? { ...t, width: node.width() } : t
      )
    );
  };

  return (
    <div className="flex flex-col items-center w-full sm:w-11/12 md:w-10/12 lg:w-9/12 xl:w-8/12 mx-auto">
      <MemeTemplateSelector
        loading={loading}
        setLoading={setLoading}
        setBackgroundImageUrl={setBackgroundImageUrl}
      />
      <div
        className="flex flex-col lg:flex-row lg:justify-center lg:items-start 
    space-y-4 lg:space-y-0 lg:space-x-2 py-2
    w-full
      "
        ref={compRef}
      >
        {/* Left panel for Canvas */}
        <div className="flex-[2] w-full relative justify-center items-center text-center bg-base-100 shadow-md rounded-lg p-4">
          <MemeCanvas
            image={image}
            imageDimensions={imageDimensions}
            texts={texts}
            handleTextClick={handleTextClick}
            handleDragEnd={handleDragEnd}
            handleTextTransform={handleTextTransform}
            isTransformerActive={isTransformerActive}
            transformerRef={transformerRef}
            textRefs={textRefs}
            stageRef={stageRef}
            addedImages={addedImages}
            handleImageDragEnd={handleImageDragEnd}
            handleImageClick={handleImageClick}
            imageRefs={imageRefs}
            setIsTransformerActive={setIsTransformerActive}
            setLoading={setLoading}
          />
        </div>

        {/* Right panel for Controls */}
        <div className="flex-[1] flex flex-col items-center space-y-4 p-4 bg-base-100 shadow-lg rounded-lg w-full">
          <ControlsPanel
            backgroundImageUrl={backgroundImageUrl}
            setBackgroundImageUrl={setBackgroundImageUrl}
            fontFamily={fontFamily}
            setFontFamily={setFontFamily}
            fontOptions={fontOptions}
            addText={addText}
            texts={texts}
            handleInputChange={handleInputChange}
            toggleDropdown={toggleDropdown}
            openDropdown={openDropdown}
            removeText={removeText}
            setTexts={setTexts}
            handleImageUpload={handleImageUpload}
            addedImages={addedImages}
            removeImage={removeImage}
            handleAddImageURL={handleAddImageURL}
            addImageUrlError={addImageUrlError}
            imageURL={imageURL}
            setImageURL={setImageURL}
            handleBackgroundImageUpload={handleBackgroundImageUpload}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateMeme;
