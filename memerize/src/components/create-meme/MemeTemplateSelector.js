"use client";

/* eslint-disable @next/next/no-img-element */

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
    <div className="bg-base-100 flex w-full flex-col items-center space-y-4 rounded-lg p-1 shadow-md">
      <h1 className="label">Meme Templates</h1>

      {/* Tabs */}
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

      {/* Search */}
      <div className="form-control w-full max-w-xs mb-4">
        <input
          type="text"
          placeholder="Search templates"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input input-bordered w-full"
        />
      </div>

      {/* Templates Grid */}
      <div
        className="flex overflow-x-scroll 2xl:w-[800px] xl:w-[630px] lg:w-[500px] w-[300px]"
        // style={{width:"800px"}}
      >
        {templates
          .filter((template) => {
            const templateName = template.name || template.id || "";
            // console.log(templateName);
            // activeTab === "memegen"
            //   ? console.log(template.blank)
            //   : console.log(template.url);
            return templateName
              .toLowerCase()
              .includes(searchTerm.toLowerCase());
          })
          .map((template, i) => (
            <div
              key={i}
              className="
              m-2 cursor-pointer transform hover:scale-105 transition-transform duration-200
              "
              onClick={() => handleTemplateClick(template)}
            >
              <div className="w-24 h-24 object-cover justify-center align-middle">
                <Image
                  src={
                    template.blank || template.url
                    // activeTab === "memegen" ? template?.blank : template?.url
                  }
                  alt={template.name || template.id}
                  width={100}
                  height={100}
                  className="max-w-24 max-h-24 object-contain"
                />
              </div>
              <p
                className="text-center text-sm mt-1 truncate"
                style={{ maxWidth: "100px" }}
              >
                {template.name || template.id}
              </p>
            </div>
          ))}
      </div>
      {/* No templates found */}
      {!loading &&
        templates.filter((template) => {
          const templateName = template.name || template.id || "";
          return templateName.toLowerCase().includes(searchTerm.toLowerCase());
        }).length === 0 && <p className="text-gray-500">No templates found.</p>}
    </div>
  );
};

export default MemeTemplateSelector;
