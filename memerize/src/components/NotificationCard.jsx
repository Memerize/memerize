import { useRouter } from "next/navigation";

export default function NotificationCard({
  notification,
  markAsSeen,
  refetchData,
}) {
  const router = useRouter(); // Using Next.js router for manual navigation

  const handleNotificationClick = async () => {
    // Mark the notification as seen
    await markAsSeen(notification._id);

    // Ensure data is re-fetched
    if (typeof refetchData === "function") {
      await refetchData(); // Call the refetch function if provided
    }

    // Use router.push to navigate, this ensures query params are passed correctly
    router.push(
      `/posts/${notification.postUsername}/${notification.slug}?commentId=${notification.commentId}`
    );
  };

  return (
    <li
      className={`flex items-center gap-3 p-3 rounded-md hover:bg-gray-100 cursor-pointer ${
        notification.isSeen ? "bg-gray-50" : "bg-white"
      }`}
      onClick={handleNotificationClick} // Trigger navigation and mark as seen on click
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
