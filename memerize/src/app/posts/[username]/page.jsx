import PostCard from "@/components/post/PostCard";

export default async function ProfilePage({ params }) {
  const { username } = params;

  const getUser = await fetch(`http://localhost:3000/api/users/${username}`, {
    next: {
      tags: ["user"],
    },
  });
  const user = await getUser.json();

  const getPosts = await fetch(`http://localhost:3000/api/posts/${username}`, {
    next: {
      tags: ["profile"],
    },
  });
  const posts = await getPosts.json();

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8 mt-8">
      <div className="flex flex-col items-center text-center space-y-4 mb-8">
        <img
          src={user.image || "https://via.placeholder.com/50"}
          alt={user.username}
          className="w-20 h-20 rounded-full object-cover border-2 border-gray-300"
        />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{user.username}</h1>
          <p className="text-lg text-gray-500">
            <span className="font-medium">{user.name}</span>
          </p>
          <p className="text-sm text-gray-500">
            <span className="font-medium">{user.email}</span>
          </p>
          <p className="text-sm text-gray-500">
            Posts: <span className="font-medium">{posts.length}</span>
          </p>
        </div>
      </div>

      <div className="space-y-8">
        {posts.length > 0 ? (
          posts.map((post) => <PostCard key={post._id} post={post} />)
        ) : (
          <p className="text-gray-500">No posts available</p>
        )}
      </div>
    </div>
  );
}
