export default function PostCard({ post }) {
  return (
    <div className="flex justify-center">
      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6 w-full md:w-1/2">
        <div className="px-6 py-4">
          <div className="flex flex-col justify-start mb-2">
            <div className="flex items-center space-x-4">
              <img
                src={post.user.image}
                alt={`${post.user.username}'s profile`}
                className="w-10 h-10 rounded-full object-cover"
              />
              <h2 className="text-md font-medium text-gray-800">
                {post.user.username}
              </h2>
            </div>
            <h3 className="text-lg font-bold text-gray-800">{post.title}</h3>
          </div>
        </div>

        <div className="bg-gray-200">
          <img
            src={post.image}
            alt={post.title}
            className="object-contain w-full h-96"
          />
        </div>

        <div className="px-6 py-4 flex justify-between items-center">
          <div className="space-x-4">
            <button className="text-blue-600 hover:text-blue-800">
              {post.likes.length} Upvotes
            </button>
            <button className="text-blue-600 hover:text-blue-800">
              {post.comments.length} Comments
            </button>
          </div>
          <div className="space-x-4">
            <button className="text-blue-600 hover:text-blue-800">Save</button>
            <button className="text-blue-600 hover:text-blue-800">Share</button>
          </div>
        </div>
      </div>
    </div>
  );
}
