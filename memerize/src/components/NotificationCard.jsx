import Link from "next/link";

export default function NotificationCard({ notification, markAsSeen }) {
  const handleNotificationClick = async (e) => {
    e.preventDefault();

    await markAsSeen(notification._id);

    window.location.href = `/posts/${notification.postUsername}/${notification.slug}`;
  };

  return (
    <li
      className={`flex items-center gap-3 p-3 rounded-md hover:bg-gray-100 cursor-pointer ${
        notification.isSeen ? "bg-gray-50" : "bg-white"
      }`}
    >
      <div className="flex-1">
        <Link
          href={`/posts/${notification.postUsername}/${notification.slug}`}
          onClick={handleNotificationClick}
        >
          <p
            className={`text-sm ${
              notification.isSeen ? "text-gray-500" : "text-black font-bold"
            }`}
          >
            {notification.message}
          </p>
        </Link>
        <p className="text-xs text-gray-400">
          {new Date(notification.createdAt).toLocaleString()}
        </p>
      </div>

      {!notification.isSeen && (
        <span className="flex-shrink-0 w-3 h-3 bg-blue-500 rounded-full"></span>
      )}
    </li>
  );
}
