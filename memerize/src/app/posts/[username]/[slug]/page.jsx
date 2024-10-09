"use client";

import { useState, useEffect, useContext } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { MentionsInput, Mention } from "react-mentions";
import {
  FaComment,
  FaRegBookmark,
  FaBookmark,
  FaShare,
  FaArrowUp,
} from "react-icons/fa";
import { BsArrowUpCircle, BsArrowUpCircleFill } from "react-icons/bs";
import Loading from "@/app/loading";
import CommentCard from "@/components/post/CommentCard";
import { mentionStyle } from "@/components/post/MentionStyle";
import { UserContext } from "@/context/UserContext";
import { toast, Toaster } from "sonner";
import { useRouter } from "next/navigation";

export default function PostDetail({ params }) {
  const { username, slug } = params;
  const searchParams = useSearchParams();
  const [commentId] = useState(searchParams.get("commentId"));

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // For comment submission
  const [loadingLike, setLoadingLike] = useState(false); // For like button
  const [loadingSave, setLoadingSave] = useState(false); // For save button
  const [loadingPost, setLoadingPost] = useState(true);
  const [users, setUsers] = useState([]);
  const { user: currentUser } = useContext(UserContext);
  const router = useRouter()

  // New State Variables for Share Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState("");

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/posts/${username}/${slug}`);
      if (!response.ok) {
        throw new Error("Failed to fetch post data.");
      }
      const postData = await response.json();
      setPost(postData);
      setComments(postData.comments || []);
      setLikesCount(postData.likes.length);
      setLiked(postData.likes.includes(currentUser?.username));
      checkIfSaved(postData.slug);
    } catch (error) {
      console.error("Error fetching post:", error);
      toast.error('Error loading post.')
    } finally {
      setLoadingPost(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, []);

  useEffect(() => {
    if (commentId && !loadingPost) {
      setTimeout(() => {
        const element = document.getElementById(commentId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);
    }
  }, [commentId, loadingPost]);

  const checkIfSaved = async (slug) => {
    try {
      const response = await fetch(`/api/saves`);
      if (!response.ok) {
        throw new Error("Failed to fetch saved posts");
      }
      const savedPosts = await response.json();
      const isPostSaved = savedPosts.some(
        (savedPost) => savedPost.slug === slug
      );
      setSaved(isPostSaved);
    } catch (error) {
      console.error("Error checking if post is saved:", error);
    }
  };

  const handleLike = async () => {
    if (!currentUser) {
      toast.error("You need to log in to like this post.");
      
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
      
      return;
    }

    setLoadingLike(true);

    try {
      const response = await fetch(`/api/likes/${slug}`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to like/unlike the post");
      }

      setLiked((prev) => !prev);
      setLikesCount((prev) => (liked ? prev - 1 : prev + 1));
      toast.success(liked ? "Like removed!" : "Post liked!");
    } catch (error) {
      console.error("Error liking post:", error);
      toast.error("Failed to like/unlike the post");
    } finally {
      setLoadingLike(false);
    }
  };

  const handleSave = async () => {
    if (!currentUser) {
      toast.error("You need to log in to save this post.");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
      return // Redirect to login
    }

    if (loadingSave) return;

    setLoadingSave(true);

    setSaved(!saved);

    try {
      const response = await fetch(`/api/saves`, {
        method: "POST",
        body: JSON.stringify({ slug }),
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
        toast.success("Post unsaved!");
      } else {
        setSaved(true);
        toast.success("Post saved!");
      }
    } catch (error) {
      console.error("Error saving/unsaving post:", error);
      toast.error("Failed to save/unsave the post");
      setSaved(!saved);
    } finally {
      setLoadingSave(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(`/api/users`);
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const usersData = await response.json();
      setUsers(usersData);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    setLoading(true);

    try {
      const mentionedUsers = [
        ...newComment.matchAll(/@\[(.*?)\]\((.*?)\)/g),
      ].map((match) => match[2]);

      // Post the comment
      const response = await fetch(`/api/comments/${slug}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: newComment,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add comment");
      }

      const addedComment = await response.json();
      setComments([...comments, addedComment]);
      setNewComment("");

      for (const mentionedUser of mentionedUsers) {
        await fetch(`/api/notifications`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "mention",
            message: `${username} mentioned you in a comment.`,
            slug: slug,
            postUsername: post.user?.username,
            mentionedUsername: mentionedUser,
            commentId: addedComment.commentId,
          }),
        });
      }

      fetchPost();
      toast.success("Comment added!");
    } catch (error) {
      toast.error('You need to log in to comment this post.')
      setTimeout(() => {
        router.push("/login");
      }, 2000);
      return
    } finally {
      setLoading(false);
    }
  };

  const filterUserSuggestions = (search) => {
    if (!search) return [];

    return users
      .filter((user) =>
        user.username.toLowerCase().includes(search.toLowerCase())
      )
      .slice(0, 5)
      .map((user) => ({
        id: user.username,
        display: `@${user.username}`,
      }));
  };

  // Share Modal Functions
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = post.image;
    link.download = `${post.title}.jpg`; // Adjust the extension based on your image type
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = (platform) => {
    const shareUrl = encodeURIComponent(
      `${window.location.origin}/posts/${post.user.username}/${post.slug}`
    );
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
    navigator.clipboard
      .writeText(
        `${window.location.origin}/posts/${post.user.username}/${post.slug}`
      )
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

  if (loadingPost) {
    return <Loading />;
  }

  if (!post) {
    return <div>Error loading post.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8 mt-8">

      <Toaster position="top-right" richColors style={{ marginTop: "40px" }} />
      {/* User Info */}

      <div className="flex items-center space-x-4 mb-6">
        <Link href={`/posts/${post.user.username}`}>
          <img
            src={post.user?.image || "https://via.placeholder.com/50"}
            alt={post.user?.username}
            className="w-12 h-12 rounded-full object-cover"
          />
        </Link>
        <div>
          <h2 className="text-lg font-bold text-gray-800">
            {post.user?.username}
          </h2>
        </div>
      </div>

      {/* Post Title */}
      <h1 className="text-2xl font-bold mb-4 text-black">{post.title}</h1>

      {/* Post Image */}
      <div className="bg-gray-200 w-full mb-6">
        <img
          src={post.image}
          alt={post.title}
          className="object-contain w-full h-full"
        />
      </div>

      {/* Tags */}
      <div className="flex flex-wrap mb-4">
        {post.tags.map((tag, index) => (
          <span
            key={index}
            className="bg-gray-300 text-gray-700 px-3 py-1 rounded-full text-sm mr-2"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between mb-6">
        <button
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
          onClick={handleLike}
          disabled={loadingLike}
        >
          {liked ? <BsArrowUpCircleFill /> : <BsArrowUpCircle />}
          <span>{likesCount} Upvotes</span>
        </button>

        <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-800">
          <FaComment />
          <span>{comments.length} Comments</span>
        </button>

        <button
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
          onClick={handleSave}
          disabled={loadingSave}
        >
          {saved ? <FaBookmark /> : <FaRegBookmark />}
          <span>{saved ? "Saved" : "Save"}</span>
        </button>

        <button
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
          onClick={() => setIsModalOpen(true)}
        >
          <FaShare />
          <span>Share</span>
        </button>
      </div>

      {/* Comments Section */}
      <div className="mt-8 h-96 overflow-y-auto pr-2">
        <h3 className="text-xl font-semibold mb-4 text-black">Comments</h3>
        <div className="space-y-4">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.commentId} id={comment.commentId}>
                {/* Add id to the comment element */}
                <CommentCard
                  comment={comment}
                  slug={slug}
                  postUsername={post.user?.username}
                  onReplyAdded={fetchPost}
                />
              </div>
            ))
          ) : (
            <p className="text-gray-500">No comments yet.</p>
          )}
        </div>
      </div>

      {/* Comment Input */}
      <div className="sticky bottom-0 bg-white p-4 border-t">
        <MentionsInput
          value={newComment}
          onFocus={fetchUsers}
          onChange={(e, newValue) => setNewComment(newValue)}
          placeholder="Write a comment..."
          className="w-full p-2 border rounded-md"
          style={{...mentionStyle, color: 'black'}} 
          allowSuggestionsAboveCursor={true}
        >
          <Mention
            trigger="@"
            data={filterUserSuggestions}
            displayTransform={(id, display) => `${display}`}
          />
        </MentionsInput>

        {error && <p className="text-red-500 mt-2">{error}</p>}

        <button
          onClick={handleAddComment}
          className="mt-2 bg-blue-500 text-white py-1 px-3 rounded"
          disabled={loading}
        >
          {loading ? "Adding comment..." : "Add Comment"}
        </button>
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
