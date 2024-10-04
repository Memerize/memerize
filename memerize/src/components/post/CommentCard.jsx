export default function CommentCard({ comment }) {
  return (
    <div className="bg-gray-100 p-4 rounded-md shadow">
      <div className="flex items-center space-x-4 mb-2">
        <img
          src={comment.userImage?.image || "https://via.placeholder.com/50"}
          alt={comment.username}
          className="w-8 h-8 rounded-full object-cover"
        />
        <div>
          <p className="font-semibold text-gray-800">{comment.username}</p>
          <span className="text-sm text-gray-500">
            {new Date(comment.createdAt).toLocaleString()}
          </span>
        </div>
      </div>
      <p className="text-gray-700">{comment.content}</p>
    </div>
  );
}
