'use client';

import { useRouter } from 'next/navigation';
import { useRouter as useLocaleRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { adminSupabase } from '@/lib/supabase/admin-client';

export default function PrivacyEasterEggLink() {
  const t = useTranslations('footer');
  const nextRouter = useRouter();
  const localeRouter = useLocaleRouter();

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const {
        data: { session },
      } = await adminSupabase.auth.getSession();
      if (session) {
        const { data: adminCheck } = await adminSupabase
          .from('admin_users')
          .select('id')
          .eq('user_id', session.user.id)
          .single();
        if (adminCheck) {
          nextRouter.push('/admin');
          return;
        }
      }
    } catch {
      // Fall through to privacy
    }
    localeRouter.push('/privacy');
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="text-gray-900 hover:text-[color:var(--logo-pink)] transition-colors text-sm bg-transparent border-none cursor-pointer p-0 font-inherit"
    >
      {t('privacyPolicy')}
    </button>
  );
}
