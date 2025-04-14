import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { FaRegCircleUser } from 'react-icons/fa6';
import React from 'react';

export default async function LoginLogoutButton() {
  const supabase = await createClient();
  const session = await supabase.auth.getSession();
  const { data: { user } } = await supabase.auth.getUser();

  if (session.data?.session && session.data.session.user) {
    // Logged in: render a logout form that submits to your API route.
    return (
      <div>
        <form action="/auth/logout" method="POST">
          <button
            type="submit"
            className="p-2 flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
          >
            Sign out
            {user?.user_metadata?.picture ? (
              <img
                src={user.user_metadata.picture}
                alt="User avatar"
                className="w-7 h-7 rounded-full"
              />
            ) : (
                <FaRegCircleUser className="h-5 w-5" />
              )}
          </button>
        </form>
      </div>
    );
  } else {
    // Not logged in: render a login button.
    return (
      <div>
        <Link href="/login">
          <button className="p-2 flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400">
            Sign in
            <FaRegCircleUser className="h-5 w-5" />
          </button>
        </Link>
      </div>
    );
  }
}
