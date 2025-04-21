"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ErrorPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the main page (page.tsx) after 3 seconds.
    const timer = setTimeout(() => {
      router.push('/login');
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 dark:bg-gray-900">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Oops!</h1>
      <p className="mt-2 text-gray-600 dark:text-gray-300">
        Wrong Email or Password!
      </p>
    </div>
  );
}
