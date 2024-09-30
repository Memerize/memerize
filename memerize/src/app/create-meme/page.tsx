"use client";

import Konva from "konva";
import React, { useEffect, useState, useRef } from "react";
import { Stage, Layer, Text, Image, Transformer } from "react-konva";

const CreateMeme: React.FC = () => {
    const [backgroundImageUrl, setBackgroundImageUrl] = useState<string>("https://api.memegen.link/images/awesome.png");
    const [texts, setTexts] = useState<{ id: number; text: string; x: number; y: number; fontSize: number; fill: string; stroke: string; strokeWidth: number; fontFamily: string }[]>([]);
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [clickedOnText, setClickedOnText] = useState<boolean>(false);
    const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number }>({ width: 600, height: 400 });
    const [textColor, setTextColor] = useState<string>("white");
    const [fontFamily, setFontFamily] = useState<string>("Impact");
    const [selectedTextId, setSelectedTextId] = useState<number | null>(null);
    const transformerRef = useRef(null);
    const textRefs = useRef({});
    const stageRef = useRef(null);
    const imgRef = useRef(null);
    const compRef = useRef<HTMLDivElement>(null);
    const [isTransformerActive, setIsTransformerActive] = useState<boolean>(false);

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
                    x: img.width / 2 - 70,
                    y: 20,
                    fontSize: 40,
                    fill: textColor,
                    stroke: "black",
                    strokeWidth: 2,
                    fontFamily: fontFamily,
                },
                {
                    id: 2,
                    text: "Bottom Text",
                    x: img.width / 2 - 100,
                    y: img.height - 60,
                    fontSize: 40,
                    fill: textColor,
                    stroke: "black",
                    strokeWidth: 2,
                    fontFamily: fontFamily,
                },
            ]);
        };
    }, [backgroundImageUrl]);

    // Handle click outside for deselect text
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const isClickInsideCanvas = stageRef.current?.getStage()?.getContainer().contains(e.target);
            const selectedText = textRefs?.current[selectedTextId];

            // Case 1: Click inside canvas but no text clicked, and transformer is active
            if (isClickInsideCanvas && !clickedOnText && isTransformerActive) {
                setIsTransformerActive(false);
                setSelectedTextId(null);
                transformerRef.current.nodes([]);
                transformerRef.current.getLayer().batchDraw();
                return;
            }

            // Case 2: Click outside the canvas
            if (!isClickInsideCanvas) {
                setIsTransformerActive(false);
                setSelectedTextId(null);
                transformerRef.current.nodes([]);
                transformerRef.current.getLayer().batchDraw();
                setClickedOnText(false);
                return;
            }

            // Case 3: If a text was clicked and we want to activate the transformer
            if (transformerRef.current && clickedOnText && selectedText) {
                transformerRef.current.nodes([selectedText]);
                transformerRef.current.getLayer().batchDraw();
                setClickedOnText(false);
                return;
            }
        };

        window.addEventListener('click', handleClickOutside);

        return () => {
            window.removeEventListener('click', handleClickOutside);
        };
    }, [isTransformerActive, selectedTextId, texts, clickedOnText]);

    // Prevent text dragging outside the image
    const preventTextOutOfBounds = (newX: number, newY: number, textWidth: number, textHeight: number) => {
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
    const handleDragEnd = (e: Konva.DragEvent, id: number) => {
        const text = e.target;

        // Coordinates before dragging
        const oldX = text.getAttr('x');
        const oldY = text.getAttr('y');
        console.log(`Before drag - X: ${oldX}, Y: ${oldY}`);

        // Coordinates after dragging
        const newX = text.x();
        const newY = text.y();
        console.log(`After drag - X: ${newX}, Y: ${newY}`);

        const textWidth = text.width();
        const textHeight = text.height();

        // Ensure the text does not go out of bounds
        const newPosition = preventTextOutOfBounds(newX, newY, textWidth, textHeight);

        // Coordinates after applying preventTextOutOfBounds
        console.log(`After filtering (preventTextOutOfBounds) - X: ${newPosition.x}, Y: ${newPosition.y}`);

        // Set the position explicitly to ensure the text stays within bounds
        text.position({
            x: newPosition.x,
            y: newPosition.y,
        });

        // Update the text state with the clamped position
        setTexts((prevTexts) =>
            prevTexts.map((t) => (t.id === id ? { ...t, x: newPosition.x, y: newPosition.y } : t))
        );
    };



    const addText = () => {
        const newTextId = texts.length > 0 ? Math.max(...texts.map((t) => t.id)) + 1 : 1;
        setTexts((prev) => [
            ...prev,
            { id: newTextId, text: `Text ${newTextId}`, x: 100, y: 100, fontSize: 40, fill: textColor, stroke: "black", strokeWidth: 2, fontFamily: fontFamily },
        ]);
        setSelectedTextId(newTextId);
        setIsTransformerActive(true);
    };

    const handleTextClick = (id: number) => {
        setSelectedTextId(id);
        setIsTransformerActive(true);
        setClickedOnText(true)
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
        const updatedText = e.target.value;

        // Update text in canvas
        setTexts((prevTexts) =>
            prevTexts.map((t) => (t.id === id ? { ...t, text: updatedText } : t))
        );
    };

    // New function to remove text
    const removeText = (id: number) => {
        setTexts((prevTexts) => prevTexts.filter((t) => t.id !== id));
        // Reset the transformer if the removed text is selected
        if (selectedTextId === id) {
            setSelectedTextId(null);
            setIsTransformerActive(false);
            transformerRef.current.nodes([]);
            transformerRef.current.getLayer().batchDraw();
        }
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
                <div className="relative justify-center items-center text-center mx-auto bg-base-100 shadow-md rounded-lg p-4">
                    <Stage ref={stageRef} width={imageDimensions.width} height={imageDimensions.height} className="justify-center items-center text-center mx-auto flex overflow-auto">
                        <Layer>
                            {image && (
                                <Image
                                    ref={imgRef}
                                    image={image}
                                    x={0}
                                    y={0}
                                    width={imageDimensions.width}
                                    height={imageDimensions.height}
                                    alt="Meme"
                                />
                            )}
                            {texts.map((text) => (
                                <React.Fragment key={text.id}>
                                    <Text
                                        ref={(el) => (textRefs.current[text.id] = el)}
                                        text={text.text}
                                        x={text.x}
                                        y={text.y}
                                        fontSize={text.fontSize}
                                        draggable
                                        fill={text.fill}
                                        stroke={text.stroke}
                                        strokeWidth={text.strokeWidth}
                                        fontFamily={text.fontFamily}
                                        onClick={() => handleTextClick(text.id)}
                                        onDragEnd={(e) => handleDragEnd(e, text.id)}
                                    />
                                </React.Fragment>
                            ))}
                            <Transformer ref={transformerRef} visible={isTransformerActive} />
                        </Layer>
                    </Stage>
                </div>
            </div>

            {/* Right panel for Controls */}
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

                {/* Text Color Picker */}
                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text">Text Color</span>
                    </label>
                    <input
                        type="color"
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        className="input w-full p-0 h-10 cursor-pointer"
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
                        <option value="Impact">Impact</option>
                        <option value="Arial">Arial</option>
                        <option value="Verdana">Verdana</option>
                        <option value="Times New Roman">Times New Roman</option>
                        <option value="Courier New">Courier New</option>
                    </select>
                </div>

                {/* Button to add Text */}
                <button className="btn btn-primary w-full" onClick={addText}>
                    Add Text
                </button>

                {/* Editable Text Inputs for each Text Element */}
                {texts.map((text) => (
                    <div key={text.id} className="form-control w-full flex items-center space-x-2">
                        <label className="label w-full">
                            <span className="label-text">Text {text.id}</span>
                        </label>
                        <input
                            type="text"
                            value={text.text}
                            onChange={(e) => handleInputChange(e, text.id)}
                            className="input input-bordered w-full"
                        />
                        {/* Remove Button */}
                        <button className="btn btn-error mt-2" onClick={() => removeText(text.id)}>
                            Remove
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );

};

export default CreateMeme;
