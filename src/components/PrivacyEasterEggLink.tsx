'use client';

import { useRouter } from 'next/navigation';
import { adminSupabase } from '@/lib/supabase/admin-client';

export default function PrivacyEasterEggLink() {
  const router = useRouter();

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const { data: { session } } = await adminSupabase.auth.getSession();
      if (session) {
        const { data: adminCheck } = await adminSupabase
          .from('admin_users')
          .select('id')
          .eq('user_id', session.user.id)
          .single();
        if (adminCheck) {
          router.push('/admin');
          return;
        }
      }
    } catch {
      // Fall through to privacy
    }
    router.push('/privacy');
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="text-gray-900 hover:text-[color:var(--logo-pink)] transition-colors text-sm bg-transparent border-none cursor-pointer p-0 font-inherit"
    >
      Privacy Policy
    </button>
  );
}
