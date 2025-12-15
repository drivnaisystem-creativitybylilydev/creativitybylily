import { createServerClient } from '@/lib/supabase/server';
import Link from 'next/link';
import Image from 'next/image';

export default async function FeaturedEvents() {
  const supabase = createServerClient();
  const now = new Date().toISOString();

  // Get 3-4 featured upcoming events
  const { data: featuredEvents } = await supabase
    .from('events')
    .select('*')
    .gte('start_date', now)
    .eq('is_featured', true)
    .order('start_date', { ascending: true })
    .limit(4);

  // If no featured events, get any upcoming events
  const { data: upcomingEvents } = featuredEvents && featuredEvents.length > 0
    ? { data: null }
    : await supabase
        .from('events')
        .select('*')
        .gte('start_date', now)
        .order('start_date', { ascending: true })
        .limit(4);

  const events = featuredEvents || upcomingEvents || [];

  if (!events || events.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="font-serif text-4xl font-light text-gray-800 mb-4">Upcoming Events</h2>
          <p className="text-gray-600 text-lg">Join us at our pop-up shops, markets, and special events</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {events.map((event: any) => {
            const startDate = new Date(event.start_date);
            const endDate = event.end_date ? new Date(event.end_date) : null;

            return (
              <div
                key={event.id}
                className="bg-[#faf8f5] rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                {event.image_url && (
                  <div className="relative aspect-video w-full bg-gray-100">
                    <Image
                      src={event.image_url}
                      alt={event.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 text-xs font-semibold bg-[color:var(--logo-pink)]/10 text-[color:var(--logo-pink)] rounded-full capitalize">
                      {event.type}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{event.title}</h3>
                  <div className="space-y-1 text-xs text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>
                        {startDate.toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                        {endDate && startDate.toDateString() !== endDate.toDateString() && (
                          <> - {endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</>
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="line-clamp-1">{event.location}</span>
                    </div>
                  </div>
                  {event.link && (
                    <a
                      href={event.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[color:var(--logo-pink)] hover:opacity-80 font-medium"
                    >
                      Learn More →
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <Link
            href="/events"
            className="inline-block border-2 border-[color:var(--logo-pink)] text-[color:var(--logo-pink)] px-8 py-3 rounded-full font-medium hover:bg-[color:var(--logo-pink)] hover:text-white transition-colors"
          >
            View All Events
          </Link>
        </div>
      </div>
    </section>
  );
}





