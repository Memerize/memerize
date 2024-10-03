'use client'

import React, { useState, useEffect } from "react";

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");

  const fetchComments = async () => {
    const response = await fetch(`/api/comments?postId=${postId}`);
    const data = await response.json();
    setComments(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting comment:", { postId, username: "username test", content });

    const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId, username: "username test", content }),
    });

    if (response.ok) {
        setContent("");
        fetchComments(); // Refresh comments after adding a new one
    }
};

  useEffect(() => {
    fetchComments();
  }, [postId]);

  return (
    <div>
      <h3>Comments</h3>
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a comment..."
        />
        <button type="submit">Submit</button>
      </form>
      <ul>
        {comments.map((comment) => (
          <li key={comment._id}>
            <strong>{comment.username}</strong>: {comment.content}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CommentSection;
