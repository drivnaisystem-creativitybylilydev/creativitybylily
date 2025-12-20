'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';

export default function ConfirmEmailPage() {
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Supabase sends tokens in the URL hash fragment (after #)
        // Format: #access_token=xxx&type=signup&expires_in=3600
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const type = hashParams.get('type');

        // Also check query params (some Supabase configs use query params)
        const urlParams = new URLSearchParams(window.location.search);
        const tokenHash = urlParams.get('token_hash');
        const queryType = urlParams.get('type');

        // Try hash fragment first (most common - Supabase sends tokens in hash)
        if (accessToken && type) {
          // Supabase sends access_token in hash, use setSession to verify
          const refreshToken = hashParams.get('refresh_token') || '';
          
          if (refreshToken) {
            const { data, error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });

            if (error) {
              throw error;
            }

            if (data.session) {
              setStatus('success');
              setMessage('Email verified successfully! Redirecting...');
              setTimeout(() => {
                router.push('/account');
              }, 2000);
              return;
            }
          } else {
            // If no refresh token, try using the access token directly
            // Sometimes Supabase only sends access_token
            const { data: { session }, error } = await supabase.auth.getSession();
            if (session) {
              setStatus('success');
              setMessage('Email verified! Redirecting...');
              setTimeout(() => {
                router.push('/account');
              }, 2000);
              return;
            }
            if (error) {
              throw error;
            }
          }
        }

        // Try query params with token_hash (alternative method)
        if (tokenHash && queryType) {
          const { error } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: queryType as any,
          });

          if (error) {
            throw error;
          }

          setStatus('success');
          setMessage('Email verified successfully! Redirecting...');
          setTimeout(() => {
            router.push('/account');
          }, 2000);
          return;
        }

        // If we get here, check if user is already logged in (might have auto-verified)
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setStatus('success');
          setMessage('Email verified! Redirecting...');
          setTimeout(() => {
            router.push('/account');
          }, 2000);
          return;
        }

        // No valid token found
        setStatus('error');
        setMessage('Invalid or expired verification link. Please try signing up again or request a new verification email.');
      } catch (error: any) {
        console.error('Email verification error:', error);
        setStatus('error');
        setMessage(error.message || 'Failed to verify email. The link may have expired. Please try signing up again.');
      }
    };

    verifyEmail();
  }, [router]);

  return (
    <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {status === 'loading' && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[color:var(--logo-pink)] mx-auto mb-4"></div>
            <p className="text-gray-600">{message}</p>
          </div>
        )}

        {status === 'success' && (
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="font-serif text-2xl font-light text-gray-900 mb-2">Email Verified!</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <Link
              href="/login"
              className="inline-block bg-[color:var(--logo-pink)] text-white px-8 py-3 rounded-full font-medium hover:opacity-90 transition-opacity"
            >
              Go to Login
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="font-serif text-2xl font-light text-gray-900 mb-2">Verification Failed</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="space-y-3">
              <Link
                href="/signup"
                className="block bg-[color:var(--logo-pink)] text-white px-8 py-3 rounded-full font-medium hover:opacity-90 transition-opacity"
              >
                Try Signing Up Again
              </Link>
              <Link
                href="/login"
                className="block text-gray-600 hover:text-[color:var(--logo-pink)] transition-colors"
              >
                Back to Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}



