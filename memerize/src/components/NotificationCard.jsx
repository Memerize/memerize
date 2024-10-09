import { useRouter } from "next/navigation";

export default function NotificationCard({ notification, markAsSeen }) {
  const router = useRouter();

  const handleNotificationClick = async () => {
    await markAsSeen(notification._id);

    router.push(
      `/posts/${notification.postUsername}/${notification.slug}?commentId=${notification.commentId}`
    );
    router.refresh();
  };

  return (
    <li
      className={`flex items-center gap-3 p-3 rounded-md hover:bg-gray-100 cursor-pointer ${
        notification.isSeen ? "bg-gray-50" : "bg-white"
      }`}
      onClick={handleNotificationClick}
    >
      <div className="flex-1">
        <p
          className={`text-sm ${
            notification.isSeen ? "text-gray-500" : "text-black font-bold"
          }`}
        >
          {notification.message}
        </p>
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
