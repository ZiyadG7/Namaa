import React from "react";

export default function WhyNamaa() {
  return (
    <div className="mb-8 bg-slate-100 dark:bg-gray-900 p-6">
      <h2 className="text-xl font-semibold mb-6 text-blue-900 dark:text-blue-300 underline decoration-blue-300 dark:decoration-gray-600 decoration-2 underline-offset-8">
        Why Namaa?
      </h2>
      
      {/* The Smarter Way section - Added animation and design */}
      <div className="bg-gradient-to-r from-white to-blue-50 dark:from-gray-800 dark:to-gray-900 shadow-md rounded-lg overflow-hidden p-6 mb-6 border-l-4 border-blue-500">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
          The Smarter Way to Unlock Insights
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Namaa Insights is designed to help businesses make better decisions by transforming raw data into clear, actionable insights. We believe that understanding data shouldn't be complicated—our platform simplifies analytics so you can focus on what truly matters.
        </p>
      </div>
      
      {/* Problems We Solve - Non-Overlapping Circles - FIXED */}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-5 text-center">
          The Problem We Solve
        </h3>
        
        <p className="text-gray-600 dark:text-gray-300 mb-5 text-center">
          Many businesses struggle with interconnected data challenges:
        </p>
        
        {/* Non-overlapping circles for problems - Fixed positioning */}
        <div className="relative h-72 mb-6">
          {/* First circle - left */}
          <div className="absolute left-1/4 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 hover:bg-red-200 dark:hover:bg-red-900/40 shadow-md hover:shadow-lg">
            <div className="p-4 text-center">
              <div className="text-red-500 dark:text-red-400 mb-1 text-2xl">📊</div>
              <p className="font-semibold text-gray-800 dark:text-white text-sm">
                Messy, overwhelming data
              </p>
            </div>
          </div>
          
          {/* Second circle - right */}
          <div className="absolute left-3/4 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 hover:bg-yellow-200 dark:hover:bg-yellow-900/40 shadow-md hover:shadow-lg">
            <div className="p-4 text-center">
              <div className="text-yellow-500 dark:text-yellow-400 mb-1 text-2xl">⏱️</div>
              <p className="font-semibold text-gray-800 dark:text-white text-sm">
                Slow, manual reporting
              </p>
            </div>
          </div>
          
          {/* Third circle - top */}
          <div className="absolute left-1/2 top-0 transform -translate-x-1/2 w-40 h-40 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 hover:bg-blue-200 dark:hover:bg-blue-900/40 shadow-md hover:shadow-lg">
            <div className="p-4 text-center">
              <div className="text-blue-500 dark:text-blue-400 mb-1 text-2xl">⚡</div>
              <p className="font-semibold text-gray-800 dark:text-white text-sm">
                Lack of real-time insights
              </p>
            </div>
          </div>
          
          {/* Center solution - positioned at bottom to avoid overlapping */}
          <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 w-32 h-32 bg-green-500 dark:bg-green-600 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110">
            <div className="p-2 text-center">
              <p className="font-bold text-white text-sm">
                Namaa Solves These
              </p>
            </div>
          </div>
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 text-center mt-4 mb-0">
          Namaa Insights provides a <span className="font-semibold">user-friendly, intelligent, and fast</span> way to access the information you need.
        </p>
      </div>
      
      {/* What Makes Namaa Different - Enhanced with cards */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 shadow-md rounded-lg overflow-hidden p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-5 text-center">
          What Makes Namaa Different?
        </h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-800/80 p-4 rounded-lg shadow transition-all duration-300 hover:shadow-md">
            <div className="flex items-start">
              <span className="text-green-500 mr-3 text-xl">✅</span> 
              <div>
                <span className="font-semibold block text-gray-800 dark:text-white">Designed for Everyone</span>
                <span className="text-gray-600 dark:text-gray-300 text-sm">Whether you're an analyst, a manager, or an executive, our platform adapts to your needs.</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800/80 p-4 rounded-lg shadow transition-all duration-300 hover:shadow-md">
            <div className="flex items-start">
              <span className="text-green-500 mr-3 text-xl">✅</span> 
              <div>
                <span className="font-semibold block text-gray-800 dark:text-white">Fast & Simple</span>
                <span className="text-gray-600 dark:text-gray-300 text-sm">No complex setups or overwhelming dashboards—just the insights you need, instantly.</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800/80 p-4 rounded-lg shadow transition-all duration-300 hover:shadow-md">
            <div className="flex items-start">
              <span className="text-green-500 mr-3 text-xl">✅</span> 
              <div>
                <span className="font-semibold block text-gray-800 dark:text-white">Customizable & Scalable</span>
                <span className="text-gray-600 dark:text-gray-300 text-sm">Choose what matters most to you and tailor your experience to fit your workflow.</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800/80 p-4 rounded-lg shadow transition-all duration-300 hover:shadow-md">
            <div className="flex items-start">
              <span className="text-green-500 mr-3 text-xl">✅</span> 
              <div>
                <span className="font-semibold block text-gray-800 dark:text-white">Minimal Effort, Maximum Impact</span>
                <span className="text-gray-600 dark:text-gray-300 text-sm">Get the most important insights without digging through endless reports.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Built for You section - Already enhanced */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 shadow-md rounded-lg overflow-hidden p-6 mb-6">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-5 text-center">
          Built for You
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          {/* Decision-Makers Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:scale-103 group">
            <div className="h-2 bg-blue-500 group-hover:bg-blue-600 transition-colors"></div>
            <div className="p-5">
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4 group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors">
                <span className="text-2xl text-blue-500 dark:text-blue-400">👑</span>
              </div>
              <h4 className="font-bold text-gray-800 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                For Decision-Makers
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                Get quick, data-driven answers to fuel growth and make confident decisions faster.
              </p>
            </div>
          </div>
          
          {/* Analysts Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:scale-103 group">
            <div className="h-2 bg-indigo-500 group-hover:bg-indigo-600 transition-colors"></div>
            <div className="p-5">
              <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center mb-4 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-800 transition-colors">
                <span className="text-2xl text-indigo-500 dark:text-indigo-400">📊</span>
              </div>
              <h4 className="font-bold text-gray-800 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                For Analysts
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                Automate repetitive tasks and focus on strategy with powerful analytics tools.
              </p>
            </div>
          </div>
          
          {/* Teams Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:scale-103 group">
            <div className="h-2 bg-purple-500 group-hover:bg-purple-600 transition-colors"></div>
            <div className="p-5">
              <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mb-4 group-hover:bg-purple-200 dark:group-hover:bg-purple-800 transition-colors">
                <span className="text-2xl text-purple-500 dark:text-purple-400">👥</span>
              </div>
              <h4 className="font-bold text-gray-800 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                For Teams
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                Collaborate seamlessly and ensure everyone stays informed with shared insights.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* See the Impact - Enhanced with statistics cards */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-gray-800 dark:to-gray-900 shadow-md rounded-lg overflow-hidden p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-5 text-center">
          See the Impact
        </h3>
        
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">60%</div>
            <div className="font-semibold text-gray-800 dark:text-white">Reduced reporting time</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">⚡</div>
            <div className="font-semibold text-gray-800 dark:text-white">Improved decision-making speed</div>
            <div className="text-gray-500 dark:text-gray-400 text-sm">with real-time alerts</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">📈</div>
            <div className="font-semibold text-gray-800 dark:text-white">Streamlined operations</div>
            <div className="text-gray-500 dark:text-gray-400 text-sm">by focusing on key business drivers</div>
          </div>
        </div>
      </div>
      
      {/* Ready to Experience - Kept the same as requested */}
      <div className="bg-blue-600 text-white shadow-md rounded-lg overflow-hidden p-6 text-center">
        <h3 className="text-lg font-semibold mb-3">
          Ready to Experience Smarter Insights?
        </h3>
        <p className="mb-4">
          Join the growing number of businesses transforming their data with Namaa Insights. <span className="font-semibold">Try it today and see the difference.</span>
        </p>
        <button className="bg-white text-blue-600 px-6 py-2 rounded-full font-semibold hover:bg-blue-50 transition-colors">
          Get Started
        </button>
      </div>
    </div>
  );
}