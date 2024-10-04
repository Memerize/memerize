import React, { useEffect } from "react";
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
  selectedImageId,
  imageRefs,
  selectedTextId,
}) => {
  // Preload images
  useEffect(() => {
    addedImages.forEach((img) => {
      if (!imageRefs.current[img.id]) {
        const imgObj = new window.Image();
        imgObj.src = img.src;
        imgObj.onload = () => {
          imageRefs.current[img.id] = imgObj;
        };
      }
    });
  }, [addedImages, imageRefs]);

  // Attach transformer to selected element
  useEffect(() => {
    if (isTransformerActive) {
      if (selectedImageId) {
        const selectedNode = imageRefs.current[selectedImageId];
        if (selectedNode) {
          transformerRef.current.nodes([selectedNode]);
          transformerRef.current.getLayer()?.batchDraw();
        }
      } else if (selectedTextId) {
        const selectedNode = textRefs.current[selectedTextId];
        if (selectedNode) {
          transformerRef.current.nodes([selectedNode]);
          transformerRef.current.getLayer()?.batchDraw();
        }
      }
    } else {
      transformerRef.current.nodes([]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [
    isTransformerActive,
    selectedImageId,
    textRefs,
    imageRefs,
    transformerRef,
    selectedTextId,
  ]);
  return (
    <div className="">
      <Stage
        ref={stageRef}
        width={imageDimensions.width}
        height={imageDimensions.height}
        className="justify-center items-center text-center mx-auto flex overflow-auto"
        onMouseDown={(e) => {
          if (e.target === e.target.getStage()) {
            // Deselect handled in parent via click outside
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
            image.src = img.src;
            return (
              <KonvaImage
                key={img.id}
                image={image}
                x={img.x}
                y={img.y}
                scaleX={img.scaleX}
                scaleY={img.scaleY}
                rotation={img.rotation}
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
                onTransformEnd={() => handleTextTransform(text.id)}
              />
            </React.Fragment>
          ))}

          <Transformer
            ref={transformerRef}
            visible={isTransformerActive}
            anchorStroke="#000000"
            borderStroke="#000000"
            anchorFill="#000000"
          />
        </Layer>
      </Stage>
    </div>
  );
};

export default MemeCanvas;
