import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
  try {
    // Parse the JSON payload
    const { stock_id } = await request.json();

    if (!stock_id) {
      return NextResponse.json({ error: "stock_id is required" }, { status: 400 });
    }

    // Create the Supabase client instance (server-side)
    const supabase = await createClient();

    // Retrieve the current session to get the authenticated user
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session?.user) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }
    const user_id = session.user.id;

    // Delete the follow record from the user_follows table
    const { error } = await supabase
      .from("user_follows")
      .delete()
      .match({ user_id, stock_id });

    if (error) {
      console.error("Supabase delete error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Unfollowed successfully" });
  } catch (err) {
    console.error("Unexpected error in unfollowStock:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
