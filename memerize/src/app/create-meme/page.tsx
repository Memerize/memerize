"use client";

import Konva from "konva";
import React, { useEffect, useState, useRef } from "react";
import { Stage, Layer, Text, Image, Transformer } from "react-konva";

const fontOptions = [
    { label: "Impact", value: "Impact" },
    { label: "Arial", value: "Arial, sans-serif" },
    { label: "Georgia", value: "Georgia, serif" },
    { label: "Courier New", value: "'Courier New', monospace" },
    { label: "Times New Roman", value: "'Times New Roman', serif" },
];

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
    const [openDropdown, setOpenDropdown] = useState(null);

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

        const newX = text.x();
        const newY = text.y();
        console.log(`After drag - X: ${newX}, Y: ${newY}`);

        const textWidth = text.width();
        const textHeight = text.height();

        const newPosition = preventTextOutOfBounds(newX, newY, textWidth, textHeight);

        console.log(`After filtering (preventTextOutOfBounds) - X: ${newPosition.x}, Y: ${newPosition.y}`);

        text.position({
            x: newPosition.x,
            y: newPosition.y,
        });

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

        adjustFontSizeToFit(id);
    };

    const adjustFontSizeToFit = (textId: number) => {
        const node = textRefs.current[textId];
        const boxWidth = node.width();
        let fontSize = node.fontSize();

        if (node.textWidth > (boxWidth - 20) && fontSize > 26) {
            fontSize -= 2;
            node.fontSize(fontSize);
            node.getLayer().batchDraw();
        } else if (node.textWidth < (boxWidth - 40) && fontSize < 40) {
            fontSize += 2;
            node.fontSize(fontSize);
            node.getLayer().batchDraw();
        }

        setTexts((prevTexts) =>
            prevTexts.map((t) =>
                t.id === textId
                    ? { ...t, fontSize: fontSize }
                    : t
            )
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

    const handleTextTransform = (textId: number) => {
        const node = textRefs.current[textId];

        node.setAttrs({
            width: node.width() * node.scaleX(),
            height: node.height() * node.scaleY(),
            scaleX: 1,
            scaleY: 1,
        });

        setTexts((prevTexts) =>
            prevTexts.map((t) =>
                t.id === textId
                    ? {
                        ...t,
                        width: node.width(),
                    }
                    : t
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

                            />
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
                    <div key={text.id} className="form-control w-full flex flex-col space-y-2">
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
                            className="btn btn-secondary w-full"
                            onClick={() => toggleDropdown(text.id)}
                        >
                            Edit Text Options
                        </button>

                        {/* Dropdown for text options */}
                        {openDropdown === text.id && (
                            <div className="dropdown-content p-4 mt-2 rounded-md bg-base-200 shadow-lg">
                                {/* Font Size */}
                                <div className="flex items-center space-x-2 mb-2">
                                    <label className="label-text">Font Size</label>
                                    <input
                                        type="number"
                                        value={text.fontSize}
                                        min={5}
                                        max={100}
                                        onChange={(e) => {
                                            const newFontSize = parseInt(e.target.value);
                                            setTexts((prevTexts) =>
                                                prevTexts.map((t) =>
                                                    t.id === text.id ? { ...t, fontSize: newFontSize } : t
                                                )
                                            );
                                        }}
                                        className="input input-bordered w-20"
                                    />
                                </div>

                                {/* Font Color */}
                                <div className="flex items-center space-x-2 mb-2">
                                    <label className="label-text">Font Color</label>
                                    <input
                                        type="color"
                                        value={text.fill}
                                        onChange={(e) => {
                                            const newColor = e.target.value;
                                            setTexts((prevTexts) =>
                                                prevTexts.map((t) =>
                                                    t.id === text.id ? { ...t, fill: newColor } : t
                                                )
                                            );
                                        }}
                                        className="input w-10 h-10 p-0 cursor-pointer"
                                    />
                                </div>

                                {/* Stroke Color */}
                                <div className="flex items-center space-x-2 mb-2">
                                    <label className="label-text">Stroke Color</label>
                                    <input
                                        type="color"
                                        value={text.stroke}
                                        onChange={(e) => {
                                            const newStrokeColor = e.target.value;
                                            setTexts((prevTexts) =>
                                                prevTexts.map((t) =>
                                                    t.id === text.id ? { ...t, stroke: newStrokeColor } : t
                                                )
                                            );
                                        }}
                                        className="input w-10 h-10 p-0 cursor-pointer"
                                    />
                                </div>

                                {/* Font Selection */}
                                <div className="flex items-center space-x-2 mb-2">
                                    <label className="label-text">Font Family</label>
                                    <select
                                        className="select select-bordered w-full"
                                        value={text.fontFamily}
                                        onChange={(e) => {
                                            const newFontFamily = e.target.value;
                                            setTexts((prevTexts) =>
                                                prevTexts.map((t) =>
                                                    t.id === text.id ? { ...t, fontFamily: newFontFamily } : t
                                                )
                                            );
                                        }}
                                    >
                                        {fontOptions.map((font) => (
                                            <option key={font.value} value={font.value}>
                                                {font.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Remove Text Button */}
                                <button
                                    className="btn btn-error mt-2 w-full"
                                    onClick={() => removeText(text.id)}
                                >
                                    Remove
                                </button>
                            </div>
                        )}
                    </div>
                ))}

            </div>
        </div>
    );

};

export default CreateMeme;
