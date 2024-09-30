import React from 'react';

const MemePostForm = () => {
  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-200">
      <div className="bg-gray-400 p-6 rounded-md w-96">
        <form>
          {/* Title Input */}
          <div className="mb-4">
            <label htmlFor="title" className="block mb-2 text-sm font-medium ">
              Title
            </label>
            <input
              type="text"
              id="title"
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Title"
            />
          </div>

          {/* Meme Text Area */}
          <div className="mb-4 ">
            <label htmlFor="meme" className="block mb-2 text-sm font-medium">
              Meme
            </label>
            <textarea
              id="meme"
              rows={5}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Meme"
            ></textarea>
          </div>

          {/* Tag Input */}
          <div className="mb-4 flex items-center">
            <label htmlFor="tag" className="mr-2 text-sm font-medium">
              Tag
            </label>
            <input type="checkbox" id="tag" className="form-checkbox h-5 w-5" />
          </div>

          {/* Post Button */}
          <button
            type="submit"
            className="w-full bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
          >
            Post
          </button>
        </form>
      </div>
    </div>
  );
};

export default MemePostForm;
