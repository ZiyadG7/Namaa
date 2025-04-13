"use client"
import React, { useState } from "react";

export default function FutureRoadmap() {
  // State to track upvotes for each feature
  const [votes, setVotes] = useState({
    "ai-insights": 0,
    "data-integration": 0,
    "collaboration": 0,
    "custom-reports": 0
  });
  
  // State to track if a user has already voted for a feature
  const [hasVoted, setHasVoted] = useState({
    "ai-insights": false,
    "data-integration": false,
    "collaboration": false,
    "custom-reports": false
  });
  
  // State for feedback form
  const [feedback, setFeedback] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Handle upvote
  const handleUpvote = (featureId) => {
    if (!hasVoted[featureId]) {
      setVotes({
        ...votes,
        [featureId]: votes[featureId] + 1
      });
      setHasVoted({
        ...hasVoted,
        [featureId]: true
      });
    }
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    //  send this data to email/backend
    console.log("Feedback submitted:", { feedback, email });
    setFeedback("");
    setEmail("");
    setIsSubmitted(true);
    
    // Reset submission status after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
    }, 3000);
  };
  
  return (
    <div className="mb-8 bg-slate-100 dark:bg-gray-900 p-6">
      <h2 className="text-xl font-semibold mb-6 text-blue-900 dark:text-blue-300 underline decoration-blue-300 dark:decoration-gray-600 decoration-2 underline-offset-8">
        Future Roadmap – What's Coming Next?
      </h2>
      
      {/* Introduction */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 shadow-md rounded-lg overflow-hidden p-6 mb-6">
        <p className="text-gray-700 dark:text-gray-300">
          We're constantly working to improve Namaa Insights and add valuable features. 
          Here's what we're planning for upcoming releases. Your feedback helps us 
          prioritize what matters most to you!
        </p>
      </div>
      
      {/* Feature timeline */}
      <div className="relative pb-12 mb-6">
        {/* Timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-1 bg-blue-200 dark:bg-blue-900"></div>
        
        {/* AI Insights Feature */}
        <div className="relative pl-14 mb-8">
          <div className="absolute left-0 w-12 h-12 rounded-full bg-blue-500 dark:bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
            Q2
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 border-l-4 border-blue-500">
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">AI-Powered Insights</h3>
              <button 
                onClick={() => handleUpvote("ai-insights")}
                className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm transition-all ${
                  hasVoted["ai-insights"] 
                    ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" 
                    : "bg-gray-100 hover:bg-blue-100 text-gray-600 hover:text-blue-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-blue-900 dark:hover:text-blue-300"
                }`}
              >
                <span className="text-lg">👍</span>
                <span>{votes["ai-insights"]}</span>
              </button>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Intelligent analysis based on your historical data to predict trends and provide 
              actionable recommendations. Our AI will learn from your data patterns and help you 
              make proactive decisions.
            </p>
            <div className="mt-4 flex items-center">
              <span className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 mr-2">
                Coming Soon
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Top priority release
              </span>
            </div>
          </div>
        </div>
        
        {/* Data Integration Feature */}
        <div className="relative pl-14 mb-8">
          <div className="absolute left-0 w-12 h-12 rounded-full bg-indigo-500 dark:bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
            Q3
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 border-l-4 border-indigo-500">
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">Enhanced Data Integration</h3>
              <button 
                onClick={() => handleUpvote("data-integration")}
                className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm transition-all ${
                  hasVoted["data-integration"] 
                    ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" 
                    : "bg-gray-100 hover:bg-blue-100 text-gray-600 hover:text-blue-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-blue-900 dark:hover:text-blue-300"
                }`}
              >
                <span className="text-lg">👍</span>
                <span>{votes["data-integration"]}</span>
              </button>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Connect with more data sources and platforms with our expanded integration options.
              Import data from additional third-party services to create a complete picture of your business.
            </p>
            <div className="mt-4 flex items-center">
              <span className="px-3 py-1 text-xs rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300 mr-2">
                In Development
              </span>
            </div>
          </div>
        </div>
        
        {/* Team Collaboration Feature */}
        <div className="relative pl-14 mb-8">
          <div className="absolute left-0 w-12 h-12 rounded-full bg-purple-500 dark:bg-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
            Q4
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 border-l-4 border-purple-500">
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">Advanced Team Collaboration</h3>
              <button 
                onClick={() => handleUpvote("collaboration")}
                className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm transition-all ${
                  hasVoted["collaboration"] 
                    ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" 
                    : "bg-gray-100 hover:bg-blue-100 text-gray-600 hover:text-blue-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-blue-900 dark:hover:text-blue-300"
                }`}
              >
                <span className="text-lg">👍</span>
                <span>{votes["collaboration"]}</span>
              </button>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Enhanced collaboration features including commenting, sharing, and real-time notifications
              to keep your entire team aligned and informed about important insights.
            </p>
            <div className="mt-4 flex items-center">
              <span className="px-3 py-1 text-xs rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 mr-2">
                Planning
              </span>
            </div>
          </div>
        </div>
        
        {/* Custom Reports Feature */}
        <div className="relative pl-14">
          <div className="absolute left-0 w-12 h-12 rounded-full bg-green-500 dark:bg-green-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
            Q1
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 border-l-4 border-green-500">
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">Custom Report Builder</h3>
              <button 
                onClick={() => handleUpvote("custom-reports")}
                className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm transition-all ${
                  hasVoted["custom-reports"] 
                    ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" 
                    : "bg-gray-100 hover:bg-blue-100 text-gray-600 hover:text-blue-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-blue-900 dark:hover:text-blue-300"
                }`}
              >
                <span className="text-lg">👍</span>
                <span>{votes["custom-reports"]}</span>
              </button>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Create fully customizable reports with our intuitive drag-and-drop builder.
              Design exactly what you need and schedule automated delivery to stakeholders.
            </p>
            <div className="mt-4 flex items-center">
              <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 mr-2">
                Future Release
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Feedback form */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 shadow-md rounded-lg overflow-hidden p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 text-center">
          Help Shape Our Future
        </h3>
        
        <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">
          Have a feature idea or suggestion? We'd love to hear from you!
        </p>
        
        {isSubmitted ? (
          <div className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 p-4 rounded-lg text-center mb-4">
            Thank you for your feedback! We'll take it into consideration for our roadmap.
          </div>
        ) : null}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Your Suggestion
            </label>
            <textarea
              id="feedback"
              rows="4"
              className="w-full px-3 py-2 text-gray-700 dark:text-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:border-gray-600"
              placeholder="I'd like to see..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              required
            ></textarea>
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email (optional)
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-3 py-2 text-gray-700 dark:text-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:border-gray-600"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              We'll notify you when your suggested feature is implemented.
            </p>
          </div>
          
          <div className="text-center">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Submit Feedback
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}