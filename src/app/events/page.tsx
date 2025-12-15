import { createServerClient } from '@/lib/supabase/server';
import Link from 'next/link';
import Image from 'next/image';

export default async function EventsPage() {
  const supabase = createServerClient();
  const now = new Date().toISOString();

  // Get upcoming events
  const { data: upcomingEvents } = await supabase
    .from('events')
    .select('*')
    .gte('start_date', now)
    .order('start_date', { ascending: true });

  // Get past events (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  
  const { data: pastEvents } = await supabase
    .from('events')
    .select('*')
    .lt('start_date', now)
    .gte('start_date', sixMonthsAgo.toISOString())
    .order('start_date', { ascending: false })
    .limit(10);

  return (
    <div className="min-h-screen bg-[#faf8f5] py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="font-serif text-5xl font-light text-gray-900 mb-4">Events & Pop-Ups</h1>
          <p className="text-gray-600 text-lg">Join us at our upcoming events, pop-up shops, and markets</p>
        </div>

        {/* Upcoming Events */}
        {upcomingEvents && upcomingEvents.length > 0 ? (
          <section className="mb-16">
            <h2 className="font-serif text-3xl font-light text-gray-900 mb-8">Upcoming Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event: any) => {
                const startDate = new Date(event.start_date);
                const endDate = event.end_date ? new Date(event.end_date) : null;

                return (
                  <Link
                    key={event.id}
                    href={`/events/${event.id}`}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow block"
                  >
                    {event.image_url && (
                      <div className="relative aspect-video w-full bg-gray-100">
                        <Image
                          src={event.image_url}
                          alt={event.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 text-xs font-semibold bg-[color:var(--logo-pink)]/10 text-[color:var(--logo-pink)] rounded-full capitalize">
                          {event.type}
                        </span>
                        {event.is_featured && (
                          <span className="px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded-full">
                            Featured
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{event.title}</h3>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                      <div className="space-y-2 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>
                            {startDate.toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                            {endDate && startDate.toDateString() !== endDate.toDateString() && (
                              <> - {endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</>
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>{event.location}</span>
                        </div>
                      </div>
                      <div className="inline-flex items-center text-[color:var(--logo-pink)] hover:opacity-80 font-medium text-sm">
                        <span>View Details</span>
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        ) : (
          <section className="mb-16">
            <h2 className="font-serif text-3xl font-light text-gray-900 mb-8">Upcoming Events</h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <p className="text-gray-500 text-lg">No upcoming events at this time. Check back soon!</p>
            </div>
          </section>
        )}

        {/* Past Events */}
        {pastEvents && pastEvents.length > 0 && (
          <section>
            <h2 className="font-serif text-3xl font-light text-gray-900 mb-8">Recent Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastEvents.map((event: any) => {
                const startDate = new Date(event.start_date);

                return (
                  <div
                    key={event.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden opacity-75"
                  >
                    {event.image_url && (
                      <div className="relative aspect-video w-full bg-gray-100">
                        <Image
                          src={event.image_url}
                          alt={event.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-700 rounded-full capitalize">
                          {event.type}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{event.title}</h3>
                      <p className="text-sm text-gray-500 mb-2">
                        {startDate.toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                      <p className="text-sm text-gray-600">{event.location}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}





