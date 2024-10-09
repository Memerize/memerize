export default function ModalNewPosts({ show, onClose, onFetchNewPosts }) {
  if (!show) return null;

  return (
    <div className="fixed top-16 left-0 right-0 z-50 flex justify-center lg:ml-[6rem] xl:ml-[16rem] w-auto">
      <div className="bg-green-500 text-white rounded-full shadow-lg p-3 max-w-md w-auto mx-auto flex items-center justify-between space-x-4">
        <p className="text-sm">New posts are available!</p>
        <div className="flex space-x-3">
          <button
            onClick={onFetchNewPosts}
            className="bg-white text-green-500 px-3 py-1 rounded-full text-xs hover:bg-gray-200 transition-colors"
          >
            Load New Posts
          </button>
          <button
            onClick={onClose}
            className="text-sm text-white hover:text-gray-300 transition-colors"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
