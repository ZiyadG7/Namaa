"use client"; // Ensures this component runs on the client side in Next.js App Router

import { useState } from "react"; // Importing React's useState for managing component state
import { supabase } from "@/lib/supabaseClient"; // Importing the Supabase client instance

// Defining the functional component `TestInsertPage`
export default function TestInsertPage() {
  // State variables:
  // `loading` - controls whether the button is disabled while inserting data
  // `message` - stores feedback messages for success or errors
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Function to insert stock data into the Supabase `stocks` table
  const insertStock = async () => {
    setLoading(true); // Set loading to true while the request is in progress  >prevents multiple submissions while the request is in progress.
    setMessage(""); // Clear any previous messages

    // Object containing the stock data to be inserted
    const stockData = { 
      ticker: "AAPLl", // Stock ticker symbol
      company_name: "Apple Inc1.", // Company name
      sector: "Technology" // Stock sector (industry category)
    };

    console.log("Sending Stock Data:", stockData); // Log the data being sent

    // Attempt to insert data into the `stocks` table using Supabase
    const { data, error } = await supabase
      .from("stocks") // Targeting the `stocks` table
      .insert([stockData]); // Inserting stock data

    console.log("Insert Response:", { data, error }); // Log the response from Supabase

    // Handling errors
    if (error) {
      console.error("Insert Error:", JSON.stringify(error, null, 2)); // Log error details
      setMessage(`Error: ${JSON.stringify(error, null, 2)}`); // Display error message to user
    } else {
      console.log("Inserted Data:", data); // Log the successfully inserted data
      setMessage("Stock added successfully!"); // Update message state with success message
    }

    setLoading(false); // Set loading to false after the operation completes
  };

  // Component return - rendering the UI
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">Test Supabase Insert</h1>

      {/* Button to trigger stock insertion */}
      <button
        className="mt-4 px-6 py-2 bg-blue-500 text-white rounded"
        onClick={insertStock} // Calls insertStock when clicked
        disabled={loading} // Disables button while loading
      >
        {loading ? "Adding..." : "Add Test Stock"} 
        {/* Button text changes based on loading state */}
      </button>

      {/* Display the message (success or error) */}
      {message && <p className="mt-4 text-lg">{message}</p>}
    </div>
  );
}
