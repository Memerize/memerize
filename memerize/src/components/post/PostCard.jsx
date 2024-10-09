"use client";

import Link from "next/link";
import { useState, useEffect, useContext } from "react";
import { FaComment, FaShare, FaRegBookmark, FaBookmark, FaArrowUp } from "react-icons/fa";
import { BsArrowUpCircle, BsArrowUpCircleFill } from "react-icons/bs";
import { useRouter } from "next/navigation";
import { UserContext } from "@/context/UserContext";

export default function PostCard({ post, savedPosts }) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes.length);
  const [saved, setSaved] = useState(false);
  const [loadingLike, setLoadingLike] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState("");
  const router = useRouter();

  const { user: currentUser } = useContext(UserContext);

  useEffect(() => {
    if (currentUser) {
      setLiked(post.likes.includes(currentUser.username));
      checkIfSaved();
    }
  }, [savedPosts, currentUser]);

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
      setSaved(!saved);
    } finally {
      setLoadingSave(false);
    }
  };


  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = post.image;
    link.download = `${post.title}.jpg`; // Adjust the extension based on your image type
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = (platform) => {
    const shareUrl = encodeURIComponent(`${window.location.origin}/posts/${post.user.username}/${post.slug}`);
    const shareText = encodeURIComponent(`Check out this post: ${post.title}`);

    let url = "";

    switch (platform) {
      case "twitter":
        url = `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`;
        break;
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;
        break;
      case "pinterest":
        url = `https://pinterest.com/pin/create/button/?url=${shareUrl}&description=${shareText}`;
        break;
      case "reddit":
        url = `https://www.reddit.com/submit?url=${shareUrl}&title=${shareText}`;
        break;
      case "gmail":
        window.location.href = `mailto:?subject=${shareText}&body=${shareUrl}`;
        return;
      case "mail":
        window.location.href = `mailto:?subject=${shareText}&body=${shareUrl}`;
        return;
      default:
        return;
    }

    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/posts/${post.user.username}/${post.slug}`)
      .then(() => {
        setCopySuccess("Copied!");
        setTimeout(() => setCopySuccess(""), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
        setCopySuccess("Failed to copy");
        setTimeout(() => setCopySuccess(""), 2000);
      });
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
          <button
            className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
            onClick={() => setIsModalOpen(true)}
          >
            <FaShare />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Share Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-11/12 max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
              onClick={() => setIsModalOpen(false)}
            >
              ✕
            </button>
            <h3 className="text-lg font-bold mb-4">Share This Post</h3>
            <img
              src={post.image}
              alt={post.title}
              className="w-full mb-4 object-contain h-64"
            />

            {/* Sharing Options */}
            <div className="flex flex-col space-y-4">
              {/* Download Button */}
              <button
                className="btn btn-primary w-full"
                onClick={handleDownload}
              >
                Download
              </button>

              {/* Share Buttons */}
              <div className="flex flex-wrap gap-2 justify-center">
                <button
                  className="btn btn-secondary flex items-center space-x-2"
                  onClick={() => handleShare("twitter")}
                >
                  <FaArrowUp />
                  <span>Share on Twitter</span>
                </button>
                <button
                  className="btn btn-secondary flex items-center space-x-2"
                  onClick={() => handleShare("facebook")}
                >
                  <FaShare />
                  <span>Share on Facebook</span>
                </button>
                <button
                  className="btn btn-secondary flex items-center space-x-2"
                  onClick={() => handleShare("pinterest")}
                >
                  <FaShare />
                  <span>Share on Pinterest</span>
                </button>
                <button
                  className="btn btn-secondary flex items-center space-x-2"
                  onClick={() => handleShare("reddit")}
                >
                  <FaShare />
                  <span>Share on Reddit</span>
                </button>
                <button
                  className="btn btn-secondary flex items-center space-x-2"
                  onClick={() => handleShare("gmail")}
                >
                  <FaShare />
                  <span>Share via Gmail</span>
                </button>
                <button
                  className="btn btn-secondary flex items-center space-x-2"
                  onClick={() => handleShare("mail")}
                >
                  <FaShare />
                  <span>Share via Mail</span>
                </button>
              </div>

              {/* Image Link and Copy Button */}
              <div className="flex items-center space-x-2 mt-4">
                <input
                  type="text"
                  readOnly
                  value={`${window.location.origin}/posts/${post.user.username}/${post.slug}`}
                  className="flex-1 p-2 border border-gray-300 rounded"
                />
                <button
                  className="btn btn-outline btn-secondary"
                  onClick={handleCopyLink}
                >
                  {copySuccess ? copySuccess : "Copy Link"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
