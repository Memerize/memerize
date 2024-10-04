"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userCookie = getCookie("User");
        if (!userCookie) {
          router.push("/login");
          return;
        }

        const userData = JSON.parse(userCookie);
        const response = await fetch(`/api/users/${userData.username}`);

        if (!response.ok) {
          throw new Error("Failed to fetch user profile.");
        }

        const userProfile = await response.json();
        setUser(userProfile);
        setImageUrl(userProfile.image || "");
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError("Error loading profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleImageUpload = async (e) => {
    e.preventDefault();
    if (!imageUrl.trim()) {
      setError("Please enter an image URL.");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const response = await fetch(`/api/users/${user.username}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: imageUrl,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update image.");
      }

      const updatedResponse = await fetch(`/api/users/${user.username}`);
      if (!updatedResponse.ok) {
        throw new Error("Failed to revalidate user after image update.");
      }

      const updatedUser = await updatedResponse.json();
      setUser(updatedUser);
      setImageUrl(updatedUser.image || "");
    } catch (err) {
      console.error("Error updating image:", err);
      setError("Error updating image.");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return <div>Loading profile...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8 mt-8">
      <h1 className="text-3xl font-bold mb-4">User Profile</h1>
      <div className="flex items-center space-x-4 mb-6">
        <img
          src={user.image || "https://via.placeholder.com/150"}
          alt={user.username}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div>
          <h2 className="text-lg font-bold text-gray-800">{user.username}</h2>
          <p className="text-lg text-gray-700">Name: {user.name}</p>
          <p className="text-sm text-gray-500">Email: {user.email}</p>
        </div>
      </div>

      <form onSubmit={handleImageUpload}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Update Profile Image (URL)
          </label>
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="mt-1 block w-full p-2 border rounded-md"
            placeholder="Enter image URL"
          />
        </div>

        {error && <p className="text-red-500">{error}</p>}

        <button type="submit" className="btn btn-primary" disabled={uploading}>
          {uploading ? "Updating..." : "Update Image"}
        </button>
      </form>
    </div>
  );
}
