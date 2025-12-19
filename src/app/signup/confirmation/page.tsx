'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';

export default function SignupConfirmationPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string>('');

  useEffect(() => {
    // Get the user's email from session
    const getEmail = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email) {
        setUserEmail(session.user.email);
      }
    };
    getEmail();
  }, []);

  return (
    <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          {/* Success Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <svg
              className="h-10 w-10 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          {/* Title */}
          <h1 className="font-serif text-3xl font-light text-gray-900 mb-3">
            Account Created Successfully!
          </h1>

          {/* Message */}
          <p className="text-gray-600 mb-2">
            We've sent a verification email to
          </p>
          {userEmail && (
            <p className="text-[color:var(--logo-pink)] font-medium mb-6">
              {userEmail}
            </p>
          )}
          <p className="text-gray-600 mb-8">
            Please check your inbox and click the verification link to activate your account.
          </p>

          {/* Help Text */}
          <div className="bg-[color:var(--soft-pink)] border border-[color:var(--accent-pink)] rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-gray-700">
              <strong className="font-semibold">Didn't receive the email?</strong>
            </p>
            <ul className="text-sm text-gray-600 mt-2 space-y-1 list-disc list-inside">
              <li>Check your spam or junk folder</li>
              <li>Make sure you entered the correct email address</li>
              <li>Wait a few minutes and check again</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link
              href="/login"
              className="block w-full bg-[color:var(--logo-pink)] text-white px-6 py-3 rounded-full font-medium hover:opacity-90 transition-opacity"
            >
              Go to Sign In
            </Link>
            <Link
              href="/"
              className="block w-full border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-full font-medium hover:bg-gray-50 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
