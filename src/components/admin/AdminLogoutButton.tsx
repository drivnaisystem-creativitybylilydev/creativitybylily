'use client';

import { useRouter } from 'next/navigation';
import { adminSupabase } from '@/lib/supabase/admin-client';

export default function AdminLogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await adminSupabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
    >
      Logout
    </button>
  );
}








