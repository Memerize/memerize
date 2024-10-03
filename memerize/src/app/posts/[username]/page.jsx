import PostCard from "@/components/post/PostCard";

export default async function ProfilePage({ params }) {
  const { username } = params;

  const getPosts = await fetch(`http://localhost:3000/api/posts/${username}`, {
    next: {
      tags: ["profile"],
    },
  });
  const posts = await getPosts.json();

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8 mt-8">
      <div className="flex items-center space-x-4 mb-6">
        <h1 className="text-3xl font-bold">Profile: {username}</h1>
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
