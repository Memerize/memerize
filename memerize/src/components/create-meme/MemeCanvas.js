//memerize\src\components\create-meme\MemeCanvas.js


import React from "react";
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
}) => {
  return (
    <div className="">
      <Stage
        ref={stageRef}
        width={imageDimensions.width}
        height={imageDimensions.height}
        className="justify-center items-center text-center mx-auto flex overflow-auto"
        onMouseDown={(e) => {
          if (e.target === e.target.getStage()) {
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
    </div>
  );
};

export default MemeCanvas;
