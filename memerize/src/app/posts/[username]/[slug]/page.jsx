import Link from "next/link";
import { FaArrowUp, FaComment, FaRegBookmark, FaShare } from "react-icons/fa";

export default async function PostDetail({ params }) {
  const { username, slug } = params;

  const getPost = await fetch(
    `http://localhost:3000/api/posts/${username}/${slug}`,
    {
      next: {
        tags: ["post"],
      },
    }
  );
  const post = await getPost.json();

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8 mt-8">
      <div className="flex items-center space-x-4 mb-6">
        <img
          src={post.user?.image || "https://via.placeholder.com/50"}
          alt={post.user?.username}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <h2 className="text-lg font-bold text-gray-800">
            {post.user?.username}
          </h2>
          <p className="text-sm text-gray-600">{post.user?.email}</p>
        </div>
      </div>

      <h1 className="text-2xl font-bold mb-4 text-black">{post.title}</h1>

      <div className="bg-gray-200 w-full h-96 mb-6">
        <img
          src={post.image}
          alt={post.title}
          className="object-contain w-full h-full"
        />
      </div>

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

      <div className="flex items-center justify-between mb-6">
        <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-800">
          <FaArrowUp />
          <span>{post.likes.length} Upvotes</span>
        </button>

        <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-800">
          <FaComment />
          <span>{post.comments.length} Comments</span>
        </button>

        <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-800">
          <FaRegBookmark />
          <span>Save</span>
        </button>

        <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-800">
          <FaShare />
          <span>Share</span>
        </button>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Comments</h3>
        <div className="space-y-4">
          {post.comments.length > 0 ? (
            post.comments.map((comment, index) => (
              <div key={index} className="bg-gray-100 p-4 rounded-md shadow">
                <p className="text-gray-700">{comment.content}</p>
                <span className="text-sm text-gray-500">
                  {new Date(comment.createdAt).toLocaleString()}
                </span>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No comments yet.</p>
          )}
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <Link href="/">
          <button className="btn btn-neutral">Back</button>
        </Link>
      </div>
    </div>
  );
}
