'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [hasToken, setHasToken] = useState(false);
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);

  useEffect(() => {
    // Listen for Supabase auth state changes, including password recovery
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', event, session);
      
      if (event === 'PASSWORD_RECOVERY') {
        // This is the password recovery event - we're in recovery mode
        setIsRecoveryMode(true);
        setHasToken(true);
        setError('');
        return;
      }
    });

    // Also check for token in URL hash (fallback method)
    const checkToken = () => {
      const fullHash = window.location.hash;
      const hash = fullHash.substring(1);
      const hashParams = new URLSearchParams(hash);
      const accessToken = hashParams.get('access_token');
      const type = hashParams.get('type');
      
      const queryToken = searchParams.get('access_token');
      
      console.log('Full URL:', window.location.href);
      console.log('Hash:', fullHash);
      console.log('Access token from hash:', accessToken ? 'Found' : 'Not found');
      console.log('Access token from query:', queryToken ? 'Found' : 'Not found');
      
      if (accessToken || queryToken) {
        setHasToken(true);
        setError('');
      } else if (hash && hash.length > 0) {
        // Hash exists but no token - might be a redirect issue
        setError('Reset token not found in URL. Please try clicking the link from your email again, or request a new reset email.');
      } else {
        // Check if we have a session (user might already be authenticated)
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (session) {
            // User has a session, allow password reset
            setHasToken(true);
            setIsRecoveryMode(true);
            setError('');
          } else {
            setError('No reset token found. Please use the link from your email.');
          }
        });
      }
    };

    checkToken();
    
    // Cleanup
    return () => {
      subscription.unsubscribe();
    };
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    try {
      // Check if we're in recovery mode (from PASSWORD_RECOVERY event)
      if (isRecoveryMode) {
        // User is already in recovery mode, just update the password
        const { error: updateError } = await supabase.auth.updateUser({
          password: formData.password,
        });

        if (updateError) throw updateError;

        setSuccess(true);
        setTimeout(() => {
          router.push('/admin/login');
        }, 2000);
        return;
      }

      // Try to get token from URL (fallback method)
      const hash = window.location.hash.substring(1);
      const hashParams = new URLSearchParams(hash);
      let accessToken = hashParams.get('access_token');
      let refreshToken = hashParams.get('refresh_token');

      if (!accessToken) {
        accessToken = searchParams.get('access_token');
        refreshToken = searchParams.get('refresh_token');
      }

      if (accessToken) {
        // Set the session with the token
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken || '',
        });

        if (sessionError) {
          throw new Error(`Invalid or expired reset link: ${sessionError.message}. Please request a new password reset email.`);
        }
      } else {
        // No token in URL - check if we have a session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (!session || sessionError) {
          throw new Error('No valid reset session found. Please use the link from your email or request a new password reset.');
        }
      }

      // Update the password
      const { error: updateError } = await supabase.auth.updateUser({
        password: formData.password,
      });

      if (updateError) throw updateError;

      setSuccess(true);
      setTimeout(() => {
        router.push('/admin/login');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password. The link may have expired.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-4xl font-light text-gray-900">
            Reset Password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your new password
          </p>
        </div>

        {success ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <p className="text-sm text-green-800">
              Password reset successfully! Redirecting to login...
            </p>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {!hasToken && !error && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  Loading reset token...
                </p>
              </div>
            )}

            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label htmlFor="password" className="sr-only">
                  New Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-[color:var(--logo-pink)] focus:border-[color:var(--logo-pink)] focus:z-10 sm:text-sm"
                  placeholder="New Password"
                  disabled={!hasToken}
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="sr-only">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-[color:var(--logo-pink)] focus:border-[color:var(--logo-pink)] focus:z-10 sm:text-sm"
                  placeholder="Confirm Password"
                  disabled={!hasToken}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading || !hasToken}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-full text-white bg-[color:var(--logo-pink)] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[color:var(--logo-pink)] disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
              >
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </button>
            </div>

            <div className="text-center">
              <Link
                href="/admin/login"
                className="text-sm text-gray-600 hover:text-[color:var(--logo-pink)]"
              >
                ← Back to login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}

