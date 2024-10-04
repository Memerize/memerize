import Link from "next/link";
import { FaComment, FaArrowUp, FaRegBookmark, FaShare } from "react-icons/fa";

export default function PostCard({ post }) {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-6 p-6">
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
          <h3 className="text-lg font-bold text-gray-800">{post.title}</h3>
        </div>
      </div>

      <Link href={`/posts/${post.user.username}/${post.slug}`}>
        <div className="bg-gray-200">
          <img
            src={post.image}
            alt={post.title}
            className="object-contain w-full h-96"
          />
        </div>
      </Link>

      <div className="px-6 py-4 flex justify-between items-center">
        <div className="space-x-4 flex items-center">
          <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-800">
            <FaArrowUp />
            <span>{post.likes.length} Upvotes</span>
          </button>
        </div>
        <div className="space-x-4 flex items-center">
          <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-800">
            <FaComment />
            <span>{post.comments.length} Comments</span>
          </button>
        </div>
        <div className="space-x-4 flex items-center">
          <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-800">
            <FaRegBookmark />
            <span>Save</span>
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
