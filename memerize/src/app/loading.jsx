import Image from "next/image";
import React from "react";
import loadingRacoonGif from "../assets/img/pedro_racoon.gif";

const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-black p-4 rounded-full flex items-center justify-center">
        <Image
          src={loadingRacoonGif}
          alt="Loading"
          width={150}
          height={150}
          className="rounded-full shadow-lg object-cover"
        />
      </div>
    </div>
  );
};

export default Loading;
