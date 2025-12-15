import { createServerClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createServerClient();

  const { data: event, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !event) {
    notFound();
  }

  const startDate = new Date(event.start_date);
  const endDate = event.end_date ? new Date(event.end_date) : null;
  const isUpcoming = startDate > new Date();

  return (
    <div className="min-h-screen bg-[#faf8f5] py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Back Button */}
        <Link
          href="/events"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-[color:var(--logo-pink)] mb-8 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Back to Events</span>
        </Link>

        {/* Main Content - Image Left, Details Right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Image Section - Left */}
          <div className="order-2 lg:order-1">
            {event.image_url ? (
              <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-gray-100 shadow-xl">
                <Image
                  src={event.image_url}
                  alt={event.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </div>
            ) : (
              <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-gradient-to-br from-[color:var(--logo-pink)]/20 to-pink-100 flex items-center justify-center shadow-xl">
                <svg className="w-24 h-24 text-[color:var(--logo-pink)]/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>

          {/* Details Section - Right */}
          <div className="order-1 lg:order-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 lg:p-10">
              {/* Event Type & Featured Badge */}
              <div className="flex items-center gap-3 mb-6">
                <span className={`px-4 py-2 text-sm font-semibold rounded-full capitalize ${
                  event.type === 'popup' 
                    ? 'bg-blue-100 text-blue-700' 
                    : event.type === 'market'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-[color:var(--logo-pink)]/10 text-[color:var(--logo-pink)]'
                }`}>
                  {event.type === 'popup' ? 'Pop-Up Shop' : event.type === 'market' ? 'Market / Fair' : 'Event'}
                </span>
                {event.is_featured && (
                  <span className="px-4 py-2 text-sm font-semibold bg-yellow-100 text-yellow-800 rounded-full">
                    Featured
                  </span>
                )}
                {isUpcoming && (
                  <span className="px-4 py-2 text-sm font-semibold bg-green-100 text-green-800 rounded-full">
                    Upcoming
                  </span>
                )}
              </div>

              {/* Event Title */}
              <h1 className="font-serif text-4xl lg:text-5xl font-light text-gray-900 mb-6">
                {event.title}
              </h1>

              {/* Date & Time */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-[color:var(--logo-pink)]/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-[color:var(--logo-pink)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Date & Time</h3>
                    <p className="text-gray-700 text-lg">
                      {startDate.toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                      {startDate.getHours() !== 0 || startDate.getMinutes() !== 0 ? (
                        <> at {startDate.toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                        })}</>
                      ) : null}
                    </p>
                    {endDate && startDate.toDateString() !== endDate.toDateString() && (
                      <p className="text-gray-600 mt-2">
                        Through {endDate.toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                        {endDate.getHours() !== 23 || endDate.getMinutes() !== 59 ? (
                          <> at {endDate.toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                          })}</>
                        ) : null}
                      </p>
                    )}
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[color:var(--logo-pink)]/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-[color:var(--logo-pink)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Location</h3>
                    <p className="text-gray-700 text-lg">{event.location}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="font-serif text-2xl font-light text-gray-900 mb-4">About This Event</h2>
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {event.description}
                  </p>
                </div>
              </div>

              {/* External Link */}
              {event.link && (
                <div className="pt-6 border-t border-gray-200">
                  <a
                    href={event.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[color:var(--logo-pink)] text-white px-8 py-4 rounded-full font-medium hover:opacity-90 transition-opacity shadow-lg hover:shadow-xl"
                  >
                    <span>Learn More</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

