import React from "react";

export default function News() {
  return (
    <div className="mb-8 bg-slate-100 dark:bg-gray-900 p-6">
      <h2 className="text-xl font-semibold mb-4 text-blue-900 dark:text-blue-300 underline decoration-blue-300 dark:decoration-gray-600 decoration-2 underline-offset-8">
        News
      </h2>
      <div className="flex gap-2 mb-4">
        <button className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full text-sm text-gray-800 dark:text-white">
          Posted at
        </button>
        <button className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full text-sm text-gray-800 dark:text-white">
          Content type
        </button>
        <button className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full text-sm text-gray-800 dark:text-white">
          Author
        </button>
        <button className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full text-sm text-gray-800 dark:text-white">
          Sent to groups
        </button>
      </div>
      <div className="grid gap-4">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="flex bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden p-4"
          >
            <img
              src="https://www.tsinetwork.ca/wp-content/uploads/how-many-stocks-should-I-own.jpg"
              alt="Stock News"
              className="w-32 h-32 object-cover rounded-lg"
            />
            <div className="ml-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                Why read Stocks news?
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                Laborum corporis repellendus dolores eos nostrum. Corrupti
                reprehenderit veritatis aperiam numquam incidunt obcaecati vero
                nostrum amet accusantium explicabo, odio atque nesciunt
                voluptatem.
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
