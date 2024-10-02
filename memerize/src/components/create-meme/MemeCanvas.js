// memerize/src/components/create-meme/MemeCanvas.js

import React from "react";
import { Stage, Layer, Text, Image, Transformer } from "react-konva";

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
}) => {
  return (
    <div className="relative justify-center items-center text-center mx-auto bg-base-100 shadow-md rounded-lg p-4">
      <Stage
        ref={stageRef}
        width={imageDimensions.width}
        height={imageDimensions.height}
        className="justify-center items-center text-center mx-auto flex overflow-auto"
      >
        <Layer>
          {image && (
            <Image
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
          <Transformer ref={transformerRef} visible={isTransformerActive} />
        </Layer>
      </Stage>
    </div>
  );
};

export default MemeCanvas;
