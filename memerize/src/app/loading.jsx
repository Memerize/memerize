import Image from "next/image";
import React from "react";
import loadingRacoonGif from "../assets/img/pedro_racoon.gif";

const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-black p-4 rounded-full flex flex-col items-center justify-center">
        <Image
          src={loadingRacoonGif}
          alt="Loading"
          width={150}
          height={150}
          className="rounded-full shadow-lg object-cover"
        />
        {/* <h1 className="font-impact">Loading...</h1> */}
      </div>
    </div>
  );
};

export default Loading;
