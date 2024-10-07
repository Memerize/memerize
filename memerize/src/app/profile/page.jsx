"use client";

/* eslint-disable @next/next/no-img-element */

import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { refreshCacheByTag } from "@/action";
import { UserContext } from "@/context/UserContext";

export default function ProfilePage() {
  const {
    user,
    updateUser,
    loading,
    error: userError,
  } = useContext(UserContext);

  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  // Fetch user data on component mount
  useEffect(() => {

  }, [router, uploading]);

  // Function to resize the image using Canvas
  const resizeImage = (file) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const canvas = document.createElement("canvas");
      const reader = new FileReader();

      reader.onload = (e) => {
        img.src = e.target.result;
      };

      img.onload = () => {
        const MAX_WIDTH = 300;
        const MAX_HEIGHT = 300;
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions while maintaining aspect ratio
        if (width > height) {
          if (width > MAX_WIDTH) {
            height = (height * MAX_WIDTH) / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = (width * MAX_HEIGHT) / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("Canvas is empty"));
            }
          },
          file.type,
          0.95
        );
      };

      img.onerror = () => {
        reject(new Error("Failed to load image"));
      };

      reader.onerror = () => {
        reject(new Error("Failed to read file"));
      };

      reader.readAsDataURL(file);
    });
  };

  // Handle file selection
  const handleFileChange = (e) => {
    setError(null);
    const file = e.target.files[0];
    if (file) {
      // Validate file type (optional)
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file.");
        return;
      }
      setSelectedFile(file);
    }
  };

  // Handle image upload
  const handleImageUpload = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      setError("Please select an image to upload.");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      // Resize the image
      const resizedBlob = await resizeImage(selectedFile);

      // Create FormData for Cloudinary upload
      const formData = new FormData();
      formData.append("file", resizedBlob);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME
      );

      const cloudinaryResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const cloudinaryData = await cloudinaryResponse.json();

      if (!cloudinaryResponse.ok) {
        throw new Error(
          cloudinaryData.error.message || "Failed to upload image."
        );
      }

      const imageUrl = cloudinaryData.secure_url;

      // Send PATCH request to update user profile
      await updateUser({ image: imageUrl });

      if (userError) {
        toast.error(userError || "Error uploading image.");
      }

      router.refresh();
      refreshCacheByTag("user");
      toast.success("Profile image updated successfully!");
    } catch (err) {
      console.error("Error uploading image:", err);
      setError(err.message || "Error uploading image.");
      toast.error(err.message || "Error uploading image.");
    } finally {
      setUploading(false);
      setSelectedFile(null);
      document.getElementById("profileImage").value = "";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8 mt-8">
      <h1 className="text-3xl text-color1 font-bold mb-6 text-center">
        {user.name}'s Profile
      </h1>
      <div className="flex flex-col items-center space-y-6 mb-8">
        <img
          src={user.image || "https://via.placeholder.com/150"}
          alt={user.username}
          className="w-32 h-32 rounded-full object-cover"
        />
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800">
            {user.username}
          </h2>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
      </div>

      <form onSubmit={handleImageUpload} className="flex flex-col items-center">
        <div className="w-full mb-4">
          <label
            className="block text-sm font-medium text-gray-700 mb-2"
            htmlFor="profileImage"
          >
            Update Profile Image
          </label>
          <input
            type="file"
            id="profileImage"
            accept=".jpg,.jpeg,.png"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className={`w-full px-4 py-2 rounded-md text-white ${
            uploading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Update Image"}
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>
    </div>
  );
}
