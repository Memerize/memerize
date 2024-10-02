//memerize/src/app/create-meme/page.jsx

"use client";

import React, { useEffect, useState, useRef } from "react";
import MemeCanvas from "../../components/create-meme/MemeCanvas";
import ControlsPanel from "../../components/create-meme/ControlsPanel";

const fontOptions = [
  { label: "Impact", value: "Impact" },
  { label: "Arial", value: "Arial, sans-serif" },
  { label: "Georgia", value: "Georgia, serif" },
  { label: "Courier New", value: "'Courier New', monospace" },
  { label: "Times New Roman", value: "'Times New Roman', serif" },
];

const CreateMeme = () => {
  // State variables
  const [backgroundImageUrl, setBackgroundImageUrl] = useState(
    "https://api.memegen.link/images/awesome.png"
  );
  const [texts, setTexts] = useState([]);
  const [image, setImage] = useState(null);
  const [clickedOnText, setClickedOnText] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({
    width: 600,
    height: 400,
  });
  const [fontFamily, setFontFamily] = useState("Impact");
  const [selectedTextId, setSelectedTextId] = useState(null);
  const [isTransformerActive, setIsTransformerActive] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  // Refs
  const transformerRef = useRef(null);
  const textRefs = useRef({});
  const stageRef = useRef(null);
  const compRef = useRef(null);

  // Toggle dropdown for text options
  const toggleDropdown = (id) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  // Image loading
  useEffect(() => {
    const img = new window.Image();
    img.src = backgroundImageUrl;
    img.onload = () => {
      setImage(img);
      setImageDimensions({ width: img.width, height: img.height });
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
          y: img.height - 60,
          fontSize: 40,
          fill: "#ffffff",
          stroke: "#000000",
          strokeWidth: 2,
          fontFamily: "Impact",
        },
      ]);
    };
  }, [backgroundImageUrl]);

  // Handle click outside for deselect text
  useEffect(() => {
    const handleClickOutside = (e) => {
      const isClickInsideCanvas = stageRef.current
        ?.getStage()
        ?.getContainer()
        .contains(e.target);
      const selectedText =
        selectedTextId !== null ? textRefs.current[selectedTextId] : null;

      // Case 1: Click inside canvas but no text clicked, and transformer is active
      if (isClickInsideCanvas && !clickedOnText && isTransformerActive) {
        setIsTransformerActive(false);
        setSelectedTextId(null);
        transformerRef.current?.nodes([]);
        transformerRef.current?.getLayer()?.batchDraw();
        return;
      }

      // Case 2: Click outside the canvas
      if (!isClickInsideCanvas) {
        setIsTransformerActive(false);
        setSelectedTextId(null);
        transformerRef.current?.nodes([]);
        transformerRef.current?.getLayer()?.batchDraw();
        setClickedOnText(false);
        return;
      }

      // Case 3: If a text was clicked and we want to activate the transformer
      if (transformerRef.current && clickedOnText && selectedText) {
        transformerRef.current.nodes([selectedText]);
        transformerRef.current.getLayer()?.batchDraw();
        setClickedOnText(false);
        return;
      }
    };

    window.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [isTransformerActive, selectedTextId, texts, clickedOnText]);

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
    setIsTransformerActive(true);
    setClickedOnText(true);
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
    <div
      className="
        flex flex-col lg:flex-row lg:justify-center lg:items-start 
        space-y-4 lg:space-y-0 lg:space-x-6 p-4 
        w-full sm:w-11/12 md:w-10/12 lg:w-9/12 xl:w-8/12 
        mx-auto
      "
      ref={compRef}
    >
      {/* Left panel for Canvas */}
      <div className="flex-1">
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
        />
      </div>

      {/* Right panel for Controls */}
      <div className="flex-1">
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
        />
      </div>
    </div>
  );
};

export default CreateMeme;
