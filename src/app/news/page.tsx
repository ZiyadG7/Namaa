import React from 'react'

export default function News() {
  return (
    <div className='mb-8 bg'>
       <h2 className="text-xl font-semibold mb-4 text-black-900 underline decoration-blue-100 decoration-2 underline-offset-8">
        News
      </h2>
      <div className="flex gap-2 mb-4">
        <button className="bg-white-200 px-3 py-1 rounded-full text-sm">📅 Posted at</button>
        <button className="bg-white-200 px-3 py-1 rounded-full text-sm">📄 Content type</button>
        <button className="bg-white-200 px-3 py-1 rounded-full text-sm">👤 Author</button>
        <button className="bg-white-200 px-3 py-1 rounded-full text-sm">📤 Sent to groups</button>
      </div>
      <div className="grid gap-4">
    {[1, 2, 3].map((item) => (
      <div key={item} className="flex bg-white shadow-md rounded-lg overflow-hidden p-4">
        
        <img
          src="https://via.placeholder.com/150" 
          alt="Stock News"
          className="w-32 h-32 object-cover rounded-lg"
        />
        
        <div className="ml-4">
          <h2 className="text-lg font-semibold text-gray-800">Why read <span className="font-bold">Stocks news?</span></h2>
          <p className="text-gray-600 text-sm mt-1">
            Whether you want a common or preferred stock, we will provide you with the latest news, features, 
            company backgrounds, and analysis to make informed decisions...
          </p>
        </div>
      </div>
    ))}
  </div>
    </div>
  )
}
