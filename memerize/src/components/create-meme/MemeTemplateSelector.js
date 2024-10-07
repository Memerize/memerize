// memerize/src/components/create-meme/MemeTemplateSelector.js

import Loading from "@/app/loading";
import Image from "next/image";
import React, { useState, useEffect } from "react";

const MemeTemplateSelector = ({
  setBackgroundImageUrl,
  loading,
  setLoading,
}) => {
  const [activeTab, setActiveTab] = useState("memegen");
  const [templates, setTemplates] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (activeTab === "memegen") {
      fetchMemegenTemplates();
    } else if (activeTab === "imgflip") {
      fetchImgflipTemplates();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const fetchMemegenTemplates = async () => {
    try {
      const response = await fetch("https://api.memegen.link/templates/");
      const data = await response.json();
      setTemplates(data);
    } catch (error) {
      console.error("Error fetching Memegen templates:", error);
    }
  };

  const fetchImgflipTemplates = async () => {
    try {
      const response = await fetch("https://api.imgflip.com/get_memes");
      const data = await response.json();
      if (data.success) {
        setTemplates(data.data.memes);
      }
    } catch (error) {
      console.error("Error fetching Imgflip templates:", error);
    }
  };

  const handleTemplateClick = (template) => {
    setLoading(true);
    if (activeTab === "memegen") {
      setBackgroundImageUrl(template.blank);
    } else if (activeTab === "imgflip") {
      setBackgroundImageUrl(template.url);
    }
    setLoading(false);
  };

  return (
    <div className="w-full flex flex-col items-center">
      <h1 className="label">Meme Templates</h1>
      <div className="tabs tabs-bordered mb-4">
        <button
          className={`tab ${activeTab === "memegen" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("memegen")}
          >
          Memegen
        </button>
        <button
          className={`tab ${activeTab === "imgflip" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("imgflip")}
          >
          Imgflip
        </button>
      </div>
      <div className="form-control w-full max-w-xs mb-1">
        <input
          type="text"
          placeholder="Search templates"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input input-bordered w-full"
          />
      </div>
      <div className="flex flex-wrap justify-center overflow-y-auto max-h-32">
        {loading && <Loading />}
        {templates
          .filter((template) => {
            const templateName = template.name || template.id || "";
            return templateName
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
          })
          .map((template, i) => (
            <div
            key={i}
            className="m-2 cursor-pointer"
            onClick={() => handleTemplateClick(template)}
            >
              <Image
                src={activeTab === "memegen" ? template.blank : template.url}
                alt={template.name || template.id}
                width={75}
                height={75}
                layout="intrinsic"
                objectFit="contain"
              />
              <p
                className="text-center text-sm mt-1 truncate"
                style={{ maxWidth: "75px" }}
              >
                {template.name || template.id}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default MemeTemplateSelector;
