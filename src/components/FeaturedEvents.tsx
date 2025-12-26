import { createServerClient } from '@/lib/supabase/server';
import Link from 'next/link';
import Image from 'next/image';

// Force dynamic rendering to prevent stale cache
export const dynamic = 'force-dynamic';
export const revalidate = 0;

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

  // Calculate days until event for the first event
  const firstEvent = events[0];
  const daysUntilEvent = firstEvent ? Math.ceil(
    (new Date(firstEvent.start_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  ) : null;

  return (
    <section className="py-20 bg-gradient-to-b from-white to-[#faf8f5] relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-[color:var(--logo-pink)] blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-[color:var(--logo-pink)] blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header with countdown for first event */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[color:var(--logo-pink)]/10 rounded-full mb-4">
            <svg className="w-5 h-5 text-[color:var(--logo-pink)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm font-semibold text-[color:var(--logo-pink)]">Upcoming Events</span>
          </div>
          <h2 className="font-serif text-5xl font-light text-gray-900 mb-4">
            Join Us at Our Next Event
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Meet us in person at pop-up shops, markets, and special events throughout Cape Cod
          </p>
          {daysUntilEvent !== null && daysUntilEvent >= 0 && (
            <div className="mt-6 inline-flex items-center gap-3 px-6 py-3 bg-white rounded-full shadow-md border border-gray-200">
              <span className="text-sm text-gray-600">Next event in</span>
              <span className="text-2xl font-bold text-[color:var(--logo-pink)]">
                {daysUntilEvent === 0 ? 'Today!' : daysUntilEvent === 1 ? 'Tomorrow!' : `${daysUntilEvent} days`}
              </span>
            </div>
          )}
        </div>

        {/* Events Grid - Improved Design */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {events.map((event: any, index: number) => {
            const startDate = new Date(event.start_date);
            const endDate = event.end_date ? new Date(event.end_date) : null;
            const isFirst = index === 0;

            return (
              <Link
                key={event.id}
                href={`/events/${event.id}`}
                className={`group bg-white rounded-2xl shadow-sm border-2 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
                  isFirst ? 'md:col-span-2 lg:col-span-1 border-[color:var(--logo-pink)]/30' : 'border-gray-200'
                }`}
              >
                {event.image_url ? (
                  <div className={`relative bg-gray-100 ${isFirst ? 'aspect-[16/9]' : 'aspect-video'}`}>
                    <Image
                      src={event.image_url}
                      alt={event.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes={isFirst ? "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
                    />
                    {isFirst && (
                      <div className="absolute top-4 right-4 bg-[color:var(--logo-pink)] text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                        Featured
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                ) : (
                  <div className={`relative ${isFirst ? 'aspect-[16/9]' : 'aspect-video'} bg-gradient-to-br from-[color:var(--logo-pink)]/20 to-pink-100 flex items-center justify-center`}>
                    <svg className="w-16 h-16 text-[color:var(--logo-pink)]/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                <div className={`p-6 ${isFirst ? 'lg:p-8' : ''}`}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${
                      event.type === 'popup' 
                        ? 'bg-blue-100 text-blue-700' 
                        : event.type === 'market'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-[color:var(--logo-pink)]/10 text-[color:var(--logo-pink)]'
                    }`}>
                      {event.type === 'popup' ? 'Pop-Up Shop' : event.type === 'market' ? 'Market' : 'Event'}
                    </span>
                    {event.is_featured && !isFirst && (
                      <span className="px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded-full">
                        Featured
                      </span>
                    )}
                  </div>
                  <h3 className={`font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-[color:var(--logo-pink)] transition-colors ${
                    isFirst ? 'text-xl' : 'text-lg'
                  }`}>
                    {event.title}
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 flex-shrink-0 text-[color:var(--logo-pink)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="font-medium">
                        {startDate.toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          year: startDate.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
                        })}
                        {endDate && startDate.toDateString() !== endDate.toDateString() && (
                          <> - {endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</>
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 flex-shrink-0 text-[color:var(--logo-pink)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="line-clamp-1">{event.location}</span>
                    </div>
                  </div>
                  <div className="flex items-center text-[color:var(--logo-pink)] font-medium text-sm group-hover:gap-2 transition-all">
                    <span>View Details</span>
                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 bg-[color:var(--logo-pink)] text-white px-8 py-4 rounded-full font-medium hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <span>View All Events</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}





