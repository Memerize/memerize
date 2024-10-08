"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { FaComment, FaShare, FaRegBookmark, FaBookmark } from "react-icons/fa";
import { BsArrowUpCircle, BsArrowUpCircleFill } from "react-icons/bs";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { UserContext } from "@/context/UserContext";

export default function PostCard({ post, savedPosts }) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes.length);
  const [saved, setSaved] = useState(false); // Track save state
  const [loadingLike, setLoadingLike] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false); // Track save action loading state
  const router = useRouter();

  const {
    user: currentUser
  } = useContext(UserContext)

  useEffect(() => {
    if (currentUser) {
      setLiked(post.likes.includes(currentUser.username));
      checkIfSaved(); // Check if the post is saved when the component loads
    }
  }, [savedPosts]);

  const checkIfSaved = () => {
    if (Array.isArray(savedPosts)) {
      const isPostSaved = savedPosts.some(
        (savedPost) => savedPost.slug === post?.slug
      );
      setSaved(isPostSaved);
    } else {
      setSaved(false);
    }
  };

  const refetchPost = async () => {
    try {
      const response = await fetch(
        `/api/posts/${post.user.username}/${post.slug}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch post");
      }
      const updatedPost = await response.json();

      setLikesCount(updatedPost.likes.length);
      setLiked(updatedPost.likes.includes(currentUser.username));
    } catch (error) {
      console.error("Error refetching post:", error);
    }
  };

  const handleLike = async () => {
    if (!currentUser) {
      alert("You need to log in to like this post.");
      return router.push("/login");
    }

    if (loadingLike) return;

    setLoadingLike(true);

    try {
      const response = await fetch(`/api/likes/${post.slug}`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to like/unlike the post");
      }

      await refetchPost();
    } catch (error) {
      console.error("Error liking post:", error);
    } finally {
      setLoadingLike(false);
    }
  };

  const handleSave = async () => {
    if (!currentUser) {
      alert("You need to log in to save this post.");
      return router.push("/login");
    }

    if (loadingSave) return;

    // Optimistically update the UI to reflect the save/unsave change
    setSaved(!saved);
    setLoadingSave(true);

    try {
      const response = await fetch(`/api/saves`, {
        method: "POST",
        body: JSON.stringify({ slug: post.slug }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to save/unsave the post");
      }

      const data = await response.json();
      if (data.message.includes("removed")) {
        setSaved(false);
      } else {
        setSaved(true);
      }
    } catch (error) {
      console.error("Error saving/unsaving post:", error);
      // Revert the save state if there's an error
      setSaved(!saved);
    } finally {
      setLoadingSave(false);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-6 p-6 flex flex-col">
      {/* Header: User Info and Title */}
      <div className="px-6 py-4">
        <div className="flex flex-col justify-start mb-2">
          <div className="flex items-center space-x-4">
            <Link href={`/posts/${post.user.username}`}>
              <img
                src={post.user.image}
                alt={`${post.user.username}'s profile`}
                className="w-10 h-10 rounded-full object-cover"
              />
            </Link>
            <h2 className="text-md font-medium text-gray-800">
              {post.user.username}
            </h2>
          </div>
          <h3 className="text-lg font-bold text-gray-800 mt-2">{post.title}</h3>
        </div>
      </div>

      {/* Image Section */}
      <Link href={`/posts/${post.user.username}/${post.slug}`}>
        <div className="bg-gray-200">
          <img
            src={post.image}
            alt={post.title}
            className="object-contain w-full h-96"
          />
        </div>
      </Link>

      {/* Tags Section */}
      {post.tags && post.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap">
          {post.tags.map((tag) => (
            <Link
              key={tag}
              href={`/posts/tags/${encodeURIComponent(tag)}`}
              className="mr-2 mb-2 inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm hover:bg-blue-200 transition-colors duration-200"
            >
              #{tag}
            </Link>
          ))}
        </div>
      )}

      {/* Action Buttons */}
      <div className="px-6 py-4 flex justify-between items-center mt-auto">
        {/* Left Side: Upvotes */}
        <div className="flex items-center space-x-4">
          <button
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
            onClick={handleLike}
            disabled={loadingLike}
          >
            {liked ? <BsArrowUpCircleFill /> : <BsArrowUpCircle />}
            <span>{likesCount} Upvotes</span>
          </button>
        </div>

        {/* Middle: Comments */}
        <div className="flex items-center space-x-4">
          <Link href={`/posts/${post.user.username}/${post.slug}`}>
            <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-800">
              <FaComment />
              <span>{post.comments.length} Comments</span>
            </button>
          </Link>
        </div>

        {/* Right Side: Save & Share */}
        <div className="flex items-center space-x-4">
          <button
            className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
            onClick={handleSave}
            disabled={loadingSave}
          >
            {saved ? <FaBookmark /> : <FaRegBookmark />}
            <span>{saved ? "Saved" : "Save"}</span>
          </button>
          <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-800">
            <FaShare />
            <span>Share</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}
